import { observable, computed, action } from "mobx";
import csvtojson from "csvtojson";
import { remove, sortBy } from "lodash";
import gql from "graphql-tag";

import { AttachmentInfo } from "@ContextLogic/lego";
import { BulkFulfillInitialData } from "@plus/container/orders/BulkFulfillContainer";
import { SimpleSelectOption as Option } from "@ContextLogic/lego";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ToastStore from "@merchant/stores/ToastStore";
import {
  FulfillmentMutationFulfillOrdersFromCsvArgs,
  FulfillmentOrdersFromCsv,
  FulfillmentOrdersFromCsvInput,
} from "@schema/types";

const CSV_FULFILLMENT_MUTATION = gql`
  mutation SubmitOrderCsvFulfillmentMutation(
    $input: FulfillmentOrdersFromCsvInput!
  ) {
    fulfillment {
      fulfillOrdersFromCsv(input: $input) {
        jobUrl
        status
        errorMessage
      }
    }
  }
`;

export default class BulkFulfillState {
  @observable
  attachments: ReadonlyArray<AttachmentInfo> = [];

  // maps user column index to known column name
  @observable
  columnMapping: Map<number, ReadonlyArray<string>> = new Map();

  @observable
  userColumns: ReadonlyArray<string> = [];

  readonly initialData: BulkFulfillInitialData;

  constructor({
    initialData,
  }: {
    readonly initialData: BulkFulfillInitialData;
  }) {
    this.initialData = initialData;
  }

  @computed
  get isFulfillButtonEnabled(): boolean {
    const {
      requiredColumns,
      optionalColumns,
    } = this.initialData.fulfillment.fulfillmentCsv;
    const usedIndices: { [index: number]: boolean } = {};
    for (const column of requiredColumns) {
      const selectionIndex = this.getSelectionIndex(column.name);
      if (selectionIndex == null || usedIndices[selectionIndex]) {
        return false;
      }
      usedIndices[selectionIndex] = true;
    }
    for (const column of optionalColumns) {
      const selectionIndex = this.getSelectionIndex(column.name);
      if (selectionIndex == null) {
        continue;
      }
      if (usedIndices[selectionIndex]) {
        return false;
      }
      usedIndices[selectionIndex] = true;
    }

    return true;
  }

  @computed
  get isFileUploaded() {
    return this.attachments.length > 0;
  }

  @computed
  get userColumnOptions(): ReadonlyArray<Option<string>> {
    const optionArray = this.userColumns.map((name, index) => ({
      value: index.toString(),
      text: name,
    }));

    return sortBy(optionArray, ["text"]);
  }

  errorMessage = ({
    columnName,
    allowMissing,
  }: {
    columnName: string;
    allowMissing?: boolean;
  }): string | undefined => {
    for (const [, names] of this.columnMapping) {
      if (names.includes(columnName)) {
        if (names.length > 1) {
          return i`A header can only be selected once.`;
        }
        return;
      }
    }
    if (!allowMissing) {
      return i`This is a required column.`;
    }
  };

  getSelectionIndex = (columnName: string): number | undefined => {
    for (const [index, names] of this.columnMapping) {
      if (names.includes(columnName)) {
        return index;
      }
    }
  };

  getSelection = (columnName: string): string | undefined => {
    const index = this.getSelectionIndex(columnName);
    if (index !== undefined) {
      return this.userColumns[index];
    }
  };

  @action
  updateColumnMapping = ({
    index,
    columnName,
  }: {
    index: number;
    columnName: string;
  }) => {
    // delete all instances of columnName
    for (const [selectionIndex, columnNames] of this.columnMapping) {
      if (columnNames.includes(columnName)) {
        if (columnNames.length === 1) {
          this.columnMapping.delete(selectionIndex);
        } else {
          const newNames = columnNames.slice();
          remove(newNames, (name) => name === columnName);
          this.columnMapping.set(selectionIndex, newNames);
        }
      }
    }

    // update index / create new if needed
    if (index == null) {
      return;
    }
    if (this.columnMapping.has(index)) {
      const names = this.columnMapping.get(index)?.slice();
      if (names == null) {
        return; // unreachable but TS can't see it
      }
      names.push(columnName);
      this.columnMapping.set(index, names);
    } else {
      this.columnMapping.set(index, [columnName]);
    }
  };

  @action
  uploadCsv = async (attachments: ReadonlyArray<AttachmentInfo>) => {
    const navigationStore = NavigationStore.instance();
    navigationStore.placeNavigationLock(
      i`You have unsaved changed. Are you sure want to leave?`
    );

    if (attachments.length == 0) {
      this.attachments = [];
      this.userColumns = [];
      this.columnMapping = new Map();
      navigationStore.releaseNavigationLock();
      return;
    }

    const { file } = attachments[0];
    const csvString: string = await new Promise((success, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result == null) {
          reject();
        } else {
          success(reader.result.toString());
        }
      };

      reader.onerror = () => {
        reject();
      };

      reader.readAsText(file);
    });

    const { [0]: headerRow = [] } = await csvtojson({
      noheader: true,
      output: "csv",
    }).fromString(csvString);

    if (headerRow == null) {
      const toastStore = ToastStore.instance();
      toastStore.negative(
        i`The attached CSV has no header row. Please try again.`
      );
      return;
    }

    this.attachments = attachments;
    this.userColumns = headerRow;

    const {
      requiredColumns,
      optionalColumns,
    } = this.initialData.fulfillment.fulfillmentCsv;

    // Need to produce initial column mapping where keys represent headers in
    // the merchant's CSV. Keys are indices in the userColumns array. Values are
    // arrays of strings, each of which is the name of a target header, i.e.
    // a required or optional column as provided by the backend.
    // Initial mapping should map merchant columns to target columns by
    // case-insensitive comparison, and leave the rest blank

    // Initialize array of column names to map. We assume these are unique.
    const columnNames = [
      ...requiredColumns.map(({ name }) => name),
      ...optionalColumns.map(({ name }) => name),
    ];

    // Initialize pairs array, number is index, readonly array is column names
    const pairs: [number, ReadonlyArray<string>][] = [];

    // Matches headers with columnNames and remove the ones matched to avoid
    // duplicates
    headerRow.forEach((header: string, index: number) => {
      // Case insensitive search of queryName in names. Returns -1 if no match
      const matchingIndex = columnNames.findIndex(
        (name) => header.toLowerCase() == name.toLowerCase()
      );
      if (matchingIndex !== -1) {
        // If match is found, push the index and column name
        pairs.push([index, [columnNames[matchingIndex]]]);
        // And remove the name from the columnNames array to avoid duplicates
        columnNames.splice(matchingIndex, 1);
      }
    });

    // Initial column mapping now created
    this.columnMapping = new Map(pairs);
  };

  @action
  submit = async () => {
    // Generate column list in format backend expects
    const columnIdListWithEmpties = Array(this.userColumns.length);
    for (const [index, [name]] of this.columnMapping) {
      columnIdListWithEmpties[index] = name;
    }
    const missingString = "-1"; // for columns that are missing
    const columnIdList = Array.from(
      columnIdListWithEmpties,
      (name) => name || missingString
    );

    const mutationInput: FulfillmentOrdersFromCsvInput = {
      fileUrl: this.attachments[0].url,
      csvDelimiter: ",",
      columnIdList,
    };

    type ResponseType = {
      readonly fulfillment: {
        readonly fulfillOrdersFromCsv: Pick<
          FulfillmentOrdersFromCsv,
          "jobUrl" | "errorMessage"
        >;
      };
    };

    const { client } = ApolloStore.instance();
    const navigationStore = NavigationStore.instance();
    const toastStore = ToastStore.instance();
    const { data } = await client.mutate<
      ResponseType,
      FulfillmentMutationFulfillOrdersFromCsvArgs
    >({
      mutation: CSV_FULFILLMENT_MUTATION,
      variables: { input: mutationInput },
    });

    const jobUrl = data?.fulfillment?.fulfillOrdersFromCsv?.jobUrl;
    const errorMessage = data?.fulfillment?.fulfillOrdersFromCsv?.errorMessage;
    if (jobUrl == null || errorMessage != null) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }
    navigationStore.releaseNavigationLock();
    await navigationStore.navigate(jobUrl);
  };
}
