import { observable, computed, action } from "mobx";
import csvtojson from "csvtojson";
import _, { sortBy } from "lodash";

import { AttachmentInfo } from "@ContextLogic/lego";
import { SimpleSelectOption as Option } from "@ContextLogic/lego";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ToastStore from "@merchant/stores/ToastStore";
import { ProductCsvImportColumnId } from "@schema/types";
import {
  ActionType,
  BulkAddEditHideableCard,
  BulkAddEditInitialData,
  PickedProductCsvImportColumnSchema,
  PlusActionType,
  UpsertProductCsvInputType,
  UpsertProductCsvResponseType,
  UPSERT_PRODUCT_CSV,
  CsvExampleMap,
  CsvTemplateMap,
  CsvExampleMapCostBased,
  CsvTemplateMapCostBased,
} from "@toolkit/products/bulk-add-edit-v2";
import UserStore from "@merchant/stores/UserStore";

export default class BulkAddEditProductV2State {
  @observable
  selectedAction?: ActionType | PlusActionType;

  @observable
  attachments: ReadonlyArray<AttachmentInfo> = [];

  // maps columnId to uploaded CSV column index, include if match was exact
  @observable
  columnMapping: Map<
    ProductCsvImportColumnId,
    {
      readonly index: number;
      readonly isExactMatch: boolean;
    }
  > = new Map();

  @observable
  userColumns: ReadonlyArray<string> = [];

  readonly initialData: BulkAddEditInitialData;

  constructor({
    initialData,
  }: {
    readonly initialData: BulkAddEditInitialData;
  }) {
    this.initialData = initialData;

    const { isMerchantPlus } = this.initialData.currentMerchant;

    if (isMerchantPlus) {
      this.selectedAction = "UPSERT_PRODUCTS";
    }
  }

  @computed
  get hasProducts(): boolean {
    const { productCatalog } = this.initialData;
    return productCatalog != null && productCatalog.products.length > 0;
  }

  @computed
  get optionalColumns(): ReadonlyArray<PickedProductCsvImportColumnSchema> {
    const {
      selectedAction,
      initialData: {
        platformConstants: {
          productCsvImportColumns: { columns },
        },
        currentMerchant: { isStoreMerchant },
      },
    } = this;
    if (selectedAction == null || columns == null) {
      return [];
    }

    return columns.filter(
      ({
        addProductRequired,
        addSizeColorRequired,
        editShippingRequired,
        updateProductsRequired,
        upsertProductsRequired,
        shopifyCreateProductsRequired,
        category,
      }) => {
        // prevent store merchants from seeing country shipping
        if (isStoreMerchant && category?.id === "COUNTRY_SHIPPING") {
          return false;
        }
        if (selectedAction === "ADD_PRODUCTS") {
          return addProductRequired === "OPTIONAL";
        }
        if (selectedAction === "ADD_SIZE_COLOR") {
          return addSizeColorRequired === "OPTIONAL";
        }
        if (selectedAction === "EDIT_SHIPPING") {
          return editShippingRequired === "OPTIONAL";
        }
        if (selectedAction === "UPDATE_PRODUCTS") {
          return updateProductsRequired === "OPTIONAL";
        }
        if (selectedAction === "UPSERT_PRODUCTS") {
          return upsertProductsRequired === "OPTIONAL";
        }
        if (selectedAction === "SHOPIFY_CREATE_PRODUCTS") {
          return shopifyCreateProductsRequired === "OPTIONAL";
        }
        return false;
      }
    );
  }

  @computed
  get requiredColumns(): ReadonlyArray<PickedProductCsvImportColumnSchema> {
    const {
      selectedAction,
      initialData: {
        platformConstants: {
          productCsvImportColumns: { columns },
        },
      },
    } = this;
    if (selectedAction == null || columns == null) {
      return [];
    }
    return columns.filter(
      ({
        addProductRequired,
        addSizeColorRequired,
        editShippingRequired,
        updateProductsRequired,
        upsertProductsRequired,
        shopifyCreateProductsRequired,
      }) => {
        if (selectedAction === "ADD_PRODUCTS") {
          return addProductRequired === "REQUIRED";
        }
        if (selectedAction === "ADD_SIZE_COLOR") {
          return addSizeColorRequired === "REQUIRED";
        }
        if (selectedAction === "EDIT_SHIPPING") {
          return editShippingRequired === "REQUIRED";
        }
        if (selectedAction === "UPDATE_PRODUCTS") {
          return updateProductsRequired === "REQUIRED";
        }
        if (selectedAction === "UPSERT_PRODUCTS") {
          return upsertProductsRequired === "REQUIRED";
        }
        if (selectedAction === "SHOPIFY_CREATE_PRODUCTS") {
          return shopifyCreateProductsRequired === "REQUIRED";
        }
        return false;
      }
    );
  }

  @computed
  get openCards(): Set<BulkAddEditHideableCard> {
    const cards: Set<BulkAddEditHideableCard> = new Set();
    const { selectedAction, isFileUploaded } = this;
    if (selectedAction != null) {
      cards.add("UPLOAD_CSV");
    }
    if (isFileUploaded) {
      cards.add("COLUMN_MAPPING");
    }
    return cards;
  }

  @computed
  get csvTemplateUrl(): string {
    const {
      selectedAction,
      initialData: {
        currentMerchant: { isMerchantPlus },
      },
    } = this;
    const { isCostBased } = UserStore.instance();

    if (isCostBased) {
      return selectedAction == null
        ? CsvTemplateMapCostBased.ADD_PRODUCTS
        : CsvTemplateMapCostBased[selectedAction];
    }

    if (selectedAction == null) {
      return isMerchantPlus
        ? CsvTemplateMap.UPSERT_PRODUCTS
        : CsvTemplateMap.ADD_PRODUCTS;
    }

    return CsvTemplateMap[selectedAction];
  }

  @computed
  get csvExampleUrl(): string {
    const {
      selectedAction,
      initialData: {
        currentMerchant: { canManageShipping, isMerchantPlus },
      },
    } = this;
    const { isCostBased } = UserStore.instance();

    if (isCostBased) {
      return selectedAction == null
        ? CsvExampleMapCostBased.ADD_PRODUCTS
        : CsvExampleMapCostBased[selectedAction];
    }

    if (selectedAction == null) {
      if (!canManageShipping) {
        return CsvExampleMap.UPSERT_PRODUCTS_NO_SHIP;
      }
      return isMerchantPlus
        ? CsvExampleMap.UPSERT_PRODUCTS
        : CsvExampleMap.ADD_PRODUCTS;
    }

    return CsvExampleMap[selectedAction];
  }

  @computed
  get hasErrors(): boolean {
    if (this.attachments.length == 0) {
      return true;
    }

    const { requiredColumns, optionalColumns } = this;

    const isRequiredError = requiredColumns.some(
      ({ columnId }) => this.errorMessage({ columnId }) != null
    );
    if (isRequiredError) {
      return true;
    }

    const isOptionalError = optionalColumns.some(
      ({ columnId }) =>
        this.errorMessage({ columnId, allowMissing: true }) != null
    );
    if (isOptionalError) {
      return true;
    }

    return false;
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
    columnId,
    allowMissing,
  }: {
    columnId: ProductCsvImportColumnId;
    allowMissing?: boolean;
  }): string | undefined => {
    const { columnMapping, getSelectedUserColumnIndex } = this;
    const userColumnIndex = getSelectedUserColumnIndex(columnId);
    if (userColumnIndex == null && !allowMissing) {
      return i`This is a required column header.`;
    }

    if (userColumnIndex == null) {
      return;
    }

    const isDuplicatedIndex = [...columnMapping.keys()].some(
      (id) => id != columnId && columnMapping.get(id)?.index == userColumnIndex
    );
    if (isDuplicatedIndex) {
      return i`A header can only be selected once.`;
    }
  };

  getSelectedUserColumnIndex = (
    columnId: ProductCsvImportColumnId
  ): number | undefined => {
    return this.columnMapping.get(columnId)?.index;
  };

  getSelectedUserColumnName = (
    columnId: ProductCsvImportColumnId
  ): string | undefined => {
    const index = this.getSelectedUserColumnIndex(columnId);
    if (index !== undefined) {
      return this.userColumns[index];
    }
  };

  getIdFromName = (targetName: string): ProductCsvImportColumnId => {
    const { requiredColumns, optionalColumns } = this;
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
  handleSelectAction = (value: ActionType | PlusActionType | undefined) => {
    const { selectedAction } = this;
    if (selectedAction == value) {
      return;
    }
    this.attachments = [];
    this.columnMapping = new Map();
    this.selectedAction = value;
  };

  @action
  updateColumnMapping = ({
    columnId,
    index,
  }: {
    columnId: ProductCsvImportColumnId;
    index?: number;
  }) => {
    if (index == null) {
      this.columnMapping.delete(columnId);
      return;
    }
    this.columnMapping.set(columnId, { index, isExactMatch: false });
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

    const { requiredColumns, optionalColumns } = this;

    const allColumns = [...requiredColumns, ...optionalColumns];

    const columnMapping: Map<
      ProductCsvImportColumnId,
      {
        readonly index: number;
        readonly isExactMatch: boolean;
      }
    > = new Map();

    const mappedIndeces: Set<number> = new Set();

    headerRow.forEach((header: string, index: number) => {
      const exactMatchingColumn = allColumns.find(({ name }) => {
        return header == name;
      });

      if (exactMatchingColumn != null && !mappedIndeces.has(index)) {
        mappedIndeces.add(index);
        columnMapping.set(exactMatchingColumn.columnId, {
          index,
          isExactMatch: true,
        });
        return;
      }
    });

    allColumns.forEach(({ columnId, name }) => {
      if (columnMapping.has(columnId)) {
        return;
      }

      const looseMatchingColumnIndex = headerRow.findIndex(
        (header: string) =>
          // exclude names <= 2 characters if header is > 2 characters to avoid
          // accidental matches of country code, e.g. CY in Currency
          !(name.length <= 2 && header.length > 2) &&
          header.toLowerCase().includes(name.toLowerCase())
      );

      if (
        looseMatchingColumnIndex != -1 &&
        !mappedIndeces.has(looseMatchingColumnIndex)
      ) {
        columnMapping.set(columnId, {
          index: looseMatchingColumnIndex,
          isExactMatch: false,
        });
        return;
      }
    });

    this.columnMapping = columnMapping;
  };

  @action
  submit = async () => {
    const { columnMapping, hasErrors, selectedAction, userColumns } = this;

    // Also prevents duplicate column indeces
    if (hasErrors || selectedAction == null) {
      return;
    }

    // column ID BE expects for missing columns
    const missingString: ProductCsvImportColumnId = "SKIP_HEADER";

    // Generate array of missingString as long as number of headers in user CSV
    // Cannot be readonly since we need to inject column mapping
    const columnIdList: ProductCsvImportColumnId[] = _.times(
      userColumns.length,
      _.constant(missingString)
    );
    [...columnMapping.keys()].forEach((columnId) => {
      const userColumnIndex = columnMapping.get(columnId)?.index;
      if (userColumnIndex != null) {
        columnIdList[userColumnIndex] = columnId;
      }
    });

    const mutationInput: UpsertProductCsvInputType = {
      input: {
        fileUrl: this.attachments[0].url,
        columnIdList,
        feedType: selectedAction,
      },
    };

    const { client } = ApolloStore.instance();
    const navigationStore = NavigationStore.instance();
    const toastStore = ToastStore.instance();
    const { data } = await client.mutate<
      UpsertProductCsvResponseType,
      UpsertProductCsvInputType
    >({
      mutation: UPSERT_PRODUCT_CSV,
      variables: { ...mutationInput },
    });

    const jobId = data?.productCatalog?.upsertProductCsvFile?.jobId;
    const message = data?.productCatalog?.upsertProductCsvFile?.message;
    if (jobId == null || message != null) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }
    navigationStore.releaseNavigationLock();

    const fileStatusPageLink = "/plus/products/bulk-csv-add-edit-history";
    toastStore.positive(
      i`Success! You will receive an email when your update is ready for review. ` +
        i`[Return to Product CSV File Status](${fileStatusPageLink})`,
      { deferred: true }
    );

    const jobUrl = `/uploads/job/${jobId}`;
    await navigationStore.navigate(jobUrl);
  };
}
