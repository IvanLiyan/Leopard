import { observable, computed, action } from "mobx";
import csvtojson from "csvtojson";
import { remove, sortBy } from "lodash";
import gql from "graphql-tag";

import { AttachmentInfo } from "@ContextLogic/lego";
import { SimpleSelectOption as Option } from "@ContextLogic/lego";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ToastStore from "@merchant/stores/ToastStore";
import {
  UpsertProductsFromCsvFile,
  UpsertProductsFromCsvFileInput,
  ProductCatalogMutationsUpsertProductCsvFileArgs,
  ProductCsvImportColumnId,
  ProductCsvImportColumnSchema,
} from "@schema/types";
import { BulkAddEditInitialData } from "@plus/container/products/BulkAddEditProductContainer";
import sampleCsvUrlShip from "@toolkit/products/bulk-csv-examples-templates/example-mplus-add-edit-product.csv";
import sampleCsvUrlNoShip from "@toolkit/products/bulk-csv-examples-templates/example-mplus-add-edit-product-no-ship.csv";

const UPSERT_PRODUCT_CSV_MUTATION = gql`
  mutation AddProductFromCSVModal_ImportProductCSV(
    $input: UpsertProductsFromCSVFileInput!
  ) {
    productCatalog {
      upsertProductCsvFile(input: $input) {
        ok
        jobId
        message
      }
    }
  }
`;

export default class BulkAddEditProductState {
  @observable
  attachments: ReadonlyArray<AttachmentInfo> = [];

  // maps user column index to known column name
  @observable
  columnMapping: Map<number, ReadonlyArray<string>> = new Map();

  @observable
  userColumns: ReadonlyArray<string> = [];

  readonly initialData: BulkAddEditInitialData;
  readonly optionalColumnsOverride: ReadonlyArray<
    Pick<ProductCsvImportColumnSchema, "columnId" | "name" | "description">
  > = [];

  constructor({
    initialData,
  }: {
    readonly initialData: BulkAddEditInitialData;
  }) {
    this.initialData = initialData;

    const { isStoreMerchant } = this.initialData.currentMerchant;
    if (isStoreMerchant) {
      const optionalColumns = this.initialData.platformConstants
        .productCsvImportColumns.optionalColumns;
      this.optionalColumnsOverride = optionalColumns.filter(
        (column) => column.name.length != 2
      );
    }
  }

  @computed
  get csvTemplateUrl(): string {
    return this.initialData.currentMerchant.canManageShipping
      ? sampleCsvUrlShip
      : sampleCsvUrlNoShip;
  }

  @computed
  get isSubmitButtonEnabled(): boolean {
    if (this.attachments.length == 0) {
      return false;
    }

    const {
      requiredColumns,
      optionalColumns,
    } = this.initialData.platformConstants.productCsvImportColumns;

    const isRequiredError = requiredColumns.some(
      ({ name }) => this.errorMessage({ columnName: name }) != null
    );
    if (isRequiredError) {
      return false;
    }

    const isOptionalError = optionalColumns.some(
      ({ name }) =>
        this.errorMessage({ columnName: name, allowMissing: true }) != null
    );
    if (isOptionalError) {
      return false;
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
    const pair = [...this.columnMapping.entries()].find(([, names]) =>
      names.includes(columnName)
    );
    if (pair == null && !allowMissing) {
      return i`This is a required column.`;
    }
    if (pair != null) {
      const [, names] = pair;
      return names.length > 1
        ? i`A header can only be selected once.`
        : undefined;
    }
  };

  getSelectionIndex = (columnName: string): number | undefined => {
    const pair = [...this.columnMapping.entries()].find(([, names]) =>
      names.includes(columnName)
    );
    if (pair != null) {
      const [index] = pair;
      return index;
    }
  };

  getSelection = (columnName: string): string | undefined => {
    const index = this.getSelectionIndex(columnName);
    if (index !== undefined) {
      return this.userColumns[index];
    }
  };

  getIdFromName = (targetName: string): ProductCsvImportColumnId => {
    const {
      requiredColumns,
      optionalColumns,
    } = this.initialData.platformConstants.productCsvImportColumns;
    const requiredColumn = requiredColumns.find(
      (column) => column.name === targetName
    );
    if (requiredColumn != null) {
      return requiredColumn.columnId;
    }
    const optionalColumn = optionalColumns.find(
      (column) => column.name === targetName
    );
    if (optionalColumn != null) {
      return optionalColumn.columnId;
    }
    return "SKIP_HEADER";
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
          const newNames = [...columnNames];
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
      const names = [...(this.columnMapping.get(index) ?? [])];
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
    } = this.initialData.platformConstants.productCsvImportColumns;

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
    [...this.columnMapping.entries()].forEach(([index, [name]]) => {
      const id = this.getIdFromName(name);
      columnIdListWithEmpties[index] = id;
    });
    const missingString = "SKIP_HEADER"; // for columns that are missing
    const columnIdList = Array.from(
      columnIdListWithEmpties,
      (name) => name || missingString
    );

    const mutationInput: UpsertProductsFromCsvFileInput = {
      fileUrl: this.attachments[0].url,
      columnIdList,
      feedType: "UPSERT_PRODUCTS",
    };

    type ResponseType = {
      readonly productCatalog: {
        readonly upsertProductCsvFile: Pick<
          UpsertProductsFromCsvFile,
          "ok" | "message" | "jobId"
        >;
      };
    };

    const { client } = ApolloStore.instance();
    const navigationStore = NavigationStore.instance();
    const toastStore = ToastStore.instance();
    const { data } = await client.mutate<
      ResponseType,
      ProductCatalogMutationsUpsertProductCsvFileArgs
    >({
      mutation: UPSERT_PRODUCT_CSV_MUTATION,
      variables: { input: { ...mutationInput } },
    });

    const jobId = data?.productCatalog?.upsertProductCsvFile?.jobId;
    const message = data?.productCatalog?.upsertProductCsvFile?.message;
    if (jobId == null || message != null) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }
    navigationStore.releaseNavigationLock();
    const jobUrl = `/uploads/job/${jobId}`;
    await navigationStore.navigate(jobUrl);
  };
}
