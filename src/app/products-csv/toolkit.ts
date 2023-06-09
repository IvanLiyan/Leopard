import { useQuery } from "@apollo/client";
import { CategoryId } from "@core/taxonomy/toolkit";
import { ci18n } from "@core/toolkit/i18n";
import { ProductCsvJobType, ProductsCsvTemplateType } from "@schema";
import {
  DOWNLOAD_ALL_HEADERS_QUERY,
  DOWNLOAD_EDIT_VARIATION_HEADERS_QUERY,
  DOWNLOAD_ENABLE_DISABLE_HEADERS_QUERY,
  DOWNLOAD_PRICE_INVENTORY_HEADERS_QUERY,
  DOWNLOAD_SHIPPING_HEADERS_QUERY,
  DOWNLOAD_TITLE_IMAGE_DESC_HEADERS_QUERY,
  DownloadAllHeadersRequestType,
  DownloadAllHeadersResponseType,
  DownloadEditVariationHeadersRequestType,
  DownloadEditVariationHeadersResponseType,
  DownloadEnableDisableHeadersResponseType,
  DownloadPriceInventoryHeadersResponseType,
  DownloadShippingHeadersResponseType,
  DownloadTitleImageDescHeadersResponseType,
} from "./queries";

export type UploadTemplateType = Extract<
  ProductCsvJobType,
  "NEW_ADD_PRODUCTS" | "NEW_UPDATE_PRODUCTS" | "NEW_ADD_VARIATION"
>;

export const UPLOAD_TEMPLATE_NAMES: Record<UploadTemplateType, string> = {
  NEW_ADD_PRODUCTS: i`CSV file for adding new products`,
  NEW_UPDATE_PRODUCTS: i`CSV file for editing existing products`,
  NEW_ADD_VARIATION: i`CSV file for adding new variations`,
};

export type UpdateActionType = "ADD" | "EDIT";

export const UPDATE_ACTION_NAMES: Record<UpdateActionType, string> = {
  ADD: i`Add new products`,
  EDIT: i`Edit existing products`,
};

export type DownloadTemplateType =
  | "ADD_PRODUCT"
  | "EDIT_PRICE_INVENTORY"
  | "EDIT_BASIC_INFO"
  | "EDIT_SHIPPING"
  | "EDIT_BY_CATEGORY"
  | "EDIT_ALL"
  | "ADD_VARIATIONS"
  | "ENABLED_DISABLE_PRODUCT";

export type EditDownloadTemplateType = Exclude<
  DownloadTemplateType,
  "ADD_PRODUCT"
>;

export const EDIT_DOWNLOAD_TEMPLATE_NAMES: Record<
  EditDownloadTemplateType,
  string
> = {
  EDIT_PRICE_INVENTORY: ci18n("Product edit type", "Edit price and inventory"),
  EDIT_BASIC_INFO: ci18n(
    "Product edit type",
    "Edit title, images and description",
  ),
  EDIT_SHIPPING: ci18n("Product edit type", "Edit shipping info and TTDs"),
  EDIT_BY_CATEGORY: ci18n("Product edit type", "Edit by category"),
  EDIT_ALL: ci18n("Product edit type", "Edit all fields"),
  ADD_VARIATIONS: ci18n(
    "Product edit type",
    "Add variations to existing products",
  ),
  ENABLED_DISABLE_PRODUCT: ci18n(
    "Product edit type",
    "Enable or disable products",
  ),
};

export const EDIT_DOWNLOAD_TEMPLATE_INFOS: Record<
  EditDownloadTemplateType,
  {
    readonly title: string;
    readonly description: string;
    readonly fieldNames: ReadonlyArray<string>;
  }
> = {
  EDIT_PRICE_INVENTORY: {
    title: i`Edit price and inventory `,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Inventory"),
      ci18n("Product field", "Price"),
      ci18n("Product field", "Shipping Price"),
    ],
  },
  EDIT_BASIC_INFO: {
    title: i`Edit title, images, and description`,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Name"),
      ci18n("Product field", "Description"),
      ci18n("Product field", "Images"),
      ci18n("Product field", "Videos"),
    ],
  },
  EDIT_SHIPPING: {
    title: i`Edit shipping info and TTDs`,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Shipping price"),
      ci18n("Product field", "Warehouse"),
      ci18n("Product field", "Handling time"),
      ci18n("Product field", "TTD (time to door)"),
    ],
  },
  EDIT_BY_CATEGORY: {
    title: i`Edit by category`,
    description:
      i`Download a template by category. ` +
      i`We recommend this option to edit or add category ` +
      i`specific attributes to your listings.`,
    fieldNames: [],
  },
  EDIT_ALL: {
    title: i`Edit all fields`,
    description:
      i`Download your entire catalog. This is a great option to ` +
      i`edit multiple fields of existing listings. `,
    fieldNames: [],
  },
  ADD_VARIATIONS: {
    title: i`Add variations to existing products`,
    description:
      i`Download a template by category. This is the only option ` +
      i`that will allow you to add variations to existing listings. `,
    fieldNames: [],
  },
  ENABLED_DISABLE_PRODUCT: {
    title: i`Enable or disable products`,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Product SKU"),
      ci18n("Product field", "SKU"),
      ci18n("Product field", "Enabled"),
    ],
  },
};

export const DOWNLOAD_TEMPLATE_FILENAME: Record<DownloadTemplateType, string> =
  {
    ADD_PRODUCT: ci18n(
      "CSV filename for add products template, please do not include any space in translation",
      "add_products",
    ),
    EDIT_PRICE_INVENTORY: ci18n(
      "CSV filename for edit product template, please do not include any space in translation",
      "price_and_inventory",
    ),
    EDIT_BASIC_INFO: ci18n(
      "CSV filename for edit product template, please do not include any space in translation",
      "title_images_and_description",
    ),
    EDIT_SHIPPING: ci18n(
      "CSV filename for edit product template, please do not include any space in translation",
      "shipping_info_and_TTDs",
    ),
    EDIT_BY_CATEGORY: ci18n(
      "CSV filename for edit product template, please do not include any space in translation",
      "category",
    ),
    EDIT_ALL: ci18n(
      "CSV filename for edit all product fields template, please do not include any space in translation",
      "all_fields",
    ),
    ADD_VARIATIONS: ci18n(
      "CSV filename for add variations template, please do not include any space in translation",
      "add_variations",
    ),
    ENABLED_DISABLE_PRODUCT: ci18n(
      "CSV filename for enable/disable product template, please do not include any space in translation",
      "enable_disable_products",
    ),
  };

export const DOWNLOAD_CATALOG_TEMPLATE_INPUT_TYPES: Partial<
  Record<DownloadTemplateType, ProductsCsvTemplateType>
> = {
  EDIT_ALL: "ALL_COLUMNS",
  EDIT_BASIC_INFO: "CONTENT",
  EDIT_PRICE_INVENTORY: "PRICE_AND_INVENTORY",
  EDIT_SHIPPING: "SHIPPING",
  ENABLED_DISABLE_PRODUCT: "ENABLED",
};

export const useDownloadTemplateQuery = ({
  templateType,
  subcategories,
}: {
  templateType: DownloadTemplateType | undefined;
  subcategories: ReadonlyArray<CategoryId>;
}): {
  templateHeaders: ReadonlyArray<string> | undefined;
  loading: boolean;
} => {
  const { loading: loadingAllHeaders, data: allHeadersData } = useQuery<
    DownloadAllHeadersResponseType,
    DownloadAllHeadersRequestType
  >(DOWNLOAD_ALL_HEADERS_QUERY, {
    variables: {
      subcategoryIds: subcategories,
    },
    skip:
      templateType !== "ADD_PRODUCT" &&
      templateType !== "EDIT_BY_CATEGORY" &&
      templateType !== "EDIT_ALL",
  });

  const {
    loading: loadingEditVariationHeaders,
    data: editVariationHeadersData,
  } = useQuery<
    DownloadEditVariationHeadersResponseType,
    DownloadEditVariationHeadersRequestType
  >(DOWNLOAD_EDIT_VARIATION_HEADERS_QUERY, {
    variables: {
      subcategoryIds: subcategories,
    },
    skip: templateType !== "ADD_VARIATIONS" || subcategories.length === 0,
  });

  const { loading: loadingShippingHeaders, data: shippingHeadersData } =
    useQuery<DownloadShippingHeadersResponseType>(
      DOWNLOAD_SHIPPING_HEADERS_QUERY,
      {
        skip: templateType !== "EDIT_SHIPPING",
      },
    );

  const {
    loading: loadingPriceInventoryHeaders,
    data: priceInventoryHeadersData,
  } = useQuery<DownloadPriceInventoryHeadersResponseType>(
    DOWNLOAD_PRICE_INVENTORY_HEADERS_QUERY,
    {
      skip: templateType !== "EDIT_PRICE_INVENTORY",
    },
  );

  const {
    loading: loadingTitleImageDescHeaders,
    data: titleImageDescHeadersData,
  } = useQuery<DownloadTitleImageDescHeadersResponseType>(
    DOWNLOAD_TITLE_IMAGE_DESC_HEADERS_QUERY,
    {
      skip: templateType !== "EDIT_BASIC_INFO",
    },
  );

  const {
    loading: loadingEnableDisableHeaders,
    data: enableDisableHeadersData,
  } = useQuery<DownloadEnableDisableHeadersResponseType>(
    DOWNLOAD_ENABLE_DISABLE_HEADERS_QUERY,
    { skip: templateType !== "ENABLED_DISABLE_PRODUCT" },
  );

  switch (templateType) {
    case "ADD_PRODUCT": {
      return {
        templateHeaders: allHeadersData?.productCatalog?.csvAllHeaderNames,
        loading: loadingAllHeaders,
      };
    }
    case "ADD_VARIATIONS": {
      return {
        templateHeaders:
          editVariationHeadersData?.productCatalog
            ?.csvEditVariationsHeaderNames,
        loading: loadingEditVariationHeaders,
      };
    }
    case "EDIT_ALL": {
      return {
        templateHeaders: allHeadersData?.productCatalog?.csvAllHeaderNames,
        loading: loadingAllHeaders,
      };
    }
    case "EDIT_BASIC_INFO": {
      return {
        templateHeaders:
          titleImageDescHeadersData?.productCatalog
            ?.csvTitleImagesDescriptionHeaderNames,
        loading: loadingTitleImageDescHeaders,
      };
    }
    case "EDIT_BY_CATEGORY": {
      return {
        templateHeaders: allHeadersData?.productCatalog?.csvAllHeaderNames,
        loading: loadingAllHeaders,
      };
    }
    case "EDIT_PRICE_INVENTORY": {
      return {
        templateHeaders:
          priceInventoryHeadersData?.productCatalog
            ?.csvPriceInventoryHeaderNames,
        loading: loadingPriceInventoryHeaders,
      };
    }
    case "EDIT_SHIPPING": {
      return {
        templateHeaders:
          shippingHeadersData?.productCatalog?.csvShippingHeaderNames,
        loading: loadingShippingHeaders,
      };
    }
    case "ENABLED_DISABLE_PRODUCT": {
      return {
        templateHeaders:
          enableDisableHeadersData?.productCatalog?.csvEnableDisableHeaderNames,
        loading: loadingEnableDisableHeaders,
      };
    }
    default:
      return {
        templateHeaders: [],
        loading: false,
      };
  }
};
