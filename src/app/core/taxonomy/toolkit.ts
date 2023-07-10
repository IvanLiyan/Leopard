import { ci18n } from "@core/toolkit/i18n";
import {
  AttributeDataType,
  AttributeLevel,
  AttributeMode,
  AttributeUsage,
  ProductCatalogSchema,
  ProductCatalogSchemaCsvProductTemplateWithTaxonomyColumnNamesArgs,
  TaxonomyAttributeSchema,
  TaxonomyAttributeValueSchema,
  TaxonomyCategorySchema,
  TaxonomySchemaAttributesArgs,
  TaxonomySchemaCategoryArgs,
  TaxonomySchemaCategoryAttributesCsvArgs,
  TaxonomySchemaLeafCategoriesArgs,
  TaxonomySchemaVariationOptionsArgs,
} from "@schema";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Constants } from "./constants";
import { TaxonomySchema } from "@schema";

export type CategoryId = number;

export type CategoryTreeNode = {
  readonly childrenIds: ReadonlyArray<CategoryId>;
  readonly parentId?: CategoryId;
  readonly id: CategoryId;
  readonly name: string;
  readonly path: string;
  readonly highlighted: boolean;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly isLeaf: boolean;
};

// BE type for category tree, BE will return the tree in json string
export type Tree = {
  id: number;
  name: string;
  children: ReadonlyArray<Tree>;
};

export const parseJsonTree = (treeJson: string) => {
  const tree: Tree = JSON.parse(treeJson); // csv TODO: investigate library for FE type parsing
  return tree;
};

export const buildMapFromTree = ({
  parentId,
  currentNode,
  currentPath,
  currentMap,
}: {
  parentId: CategoryId | undefined;
  currentNode: Tree;
  currentPath: string;
  currentMap: Map<CategoryId, CategoryTreeNode>;
}): Map<CategoryId, CategoryTreeNode> => {
  if (currentNode.children.length === 0) {
    return currentMap.set(currentNode.id, {
      name: currentNode.name,
      id: currentNode.id,
      path: currentPath,
      parentId: parentId,
      childrenIds: [],
      highlighted: false,
      checked: false,
      disabled: false,
      isLeaf: true,
    });
  }

  const newMap = currentMap.set(currentNode.id, {
    name: currentNode.name,
    id: currentNode.id,
    path: currentPath,
    parentId: parentId,
    childrenIds: currentNode.children.map((child) => child.id),
    highlighted: false,
    checked: false,
    disabled: false,
    isLeaf: false,
  });

  for (let i = 0; i < currentNode.children.length; i++) {
    const currentChild = currentNode.children[i];

    buildMapFromTree({
      parentId: currentNode.id,
      currentNode: currentChild,
      currentPath:
        currentNode.id === Constants.TAXONOMY.rootCategoryId
          ? currentPath
          : currentPath.trim().length > 0
          ? `${currentPath} > ${currentNode.name}`
          : currentNode.name,
      currentMap: currentMap,
    });
  }

  return newMap;
};

export const getL1Node = (
  node: CategoryTreeNode,
  map: ReadonlyMap<CategoryId, CategoryTreeNode>,
) => {
  let curNode: CategoryTreeNode | undefined = node;
  while (
    curNode?.parentId != null &&
    curNode.parentId != Constants.TAXONOMY.rootCategoryId
  ) {
    curNode = map.get(curNode.parentId);
  }
  return curNode;
};

/**
 * Return all the leaf children for the current node
 */
export const getLeafChildren = ({
  node,
  map,
  curLeaves,
}: {
  node: CategoryTreeNode;
  map: ReadonlyMap<CategoryId, CategoryTreeNode>;
  curLeaves: ReadonlyArray<CategoryId>;
}): ReadonlyArray<CategoryId> => {
  if (node.isLeaf) {
    return [...curLeaves, node.id];
  }

  let leaves = [...curLeaves];
  node.childrenIds.forEach((childId) => {
    const childNode = map.get(childId);
    const childLeaves = childNode
      ? getLeafChildren({
          node: childNode,
          map,
          curLeaves: [],
        })
      : [];

    leaves = [...leaves, ...childLeaves];
  });

  return leaves;
};

export const AttributeLevelLabel: { readonly [f in AttributeLevel]: string } = {
  ATTRIBUTE_LEVEL_PRODUCT: ci18n(
    "attribute level label, means attribute is on product-level",
    "Product",
  ),
  ATTRIBUTE_LEVEL_UNSPECIFIED: ci18n(
    "attribute level label, means level is unspecified",
    "Unspecified",
  ),
  ATTRIBUTE_LEVEL_VARIANT: ci18n(
    "attribute level label, means attribute is on variant-level or product-level",
    "Variant/Product",
  ),
};

export const AttributeUsageLabel: { readonly [f in AttributeUsage]: string } = {
  ATTRIBUTE_USAGE_OPTIONAL: ci18n(
    "attribute usage label, means the attribute is not required",
    "Optional",
  ),
  ATTRIBUTE_USAGE_RECOMMENDED: ci18n(
    "attribute usage label, means the attribute is not required but recommended",
    "Recommended",
  ),
  ATTRIBUTE_USAGE_REQUIRED: ci18n(
    "attribute usage label, means the attribute is required",
    "Required",
  ),
  ATTRIBUTE_USAGE_UNSPECIFIED: ci18n(
    "attribute usage label, means the usage is unspecified",
    "Unspecified",
  ),
};

export const AttributeDataTypeLabel: {
  readonly [f in AttributeDataType]: string;
} = {
  ATTRIBUTE_DATA_TYPE_DATE: ci18n(
    "attribute data type label, means the attribute is a Date",
    "Date",
  ),
  ATTRIBUTE_DATA_TYPE_NUMBER: ci18n(
    "attribute data type label, means the attribute is a number",
    "Number",
  ),
  ATTRIBUTE_DATA_TYPE_STRING: ci18n(
    "attribute data type label, means the attribute is a string",
    "String",
  ),
  ATTRIBUTE_DATA_TYPE_STRING_ARRAY: ci18n(
    "attribute data type label, means the attribute is a list of strings",
    "String Array",
  ),
  ATTRIBUTE_DATA_TYPE_UNSPECIFIED: ci18n(
    "attribute data type label, means the attribute data type is unspecified",
    "Unspecified",
  ),
};

export const AttributeSelectionTypeLabel: {
  readonly [f in AttributeMode]: string;
} = {
  ATTRIBUTE_MODE_UNSPECIFIED: ci18n(
    "Product attribute input type label, means type is unspecified",
    "Unspecified",
  ),
  ATTRIBUTE_MODE_FREE_TEXT: ci18n(
    "Product attribute input type label, means free text input",
    "Free Text",
  ),
  ATTRIBUTE_MODE_SINGLE_SELECTION_ONLY: ci18n(
    "Product attribute input type label, means single selection input",
    "Single Select",
  ),
  ATTRIBUTE_MODE_MULTI_SELECTION_ONLY: ci18n(
    "Product attribute input type label, means multi selection input",
    "Multi Select",
  ),
};

export const LEAF_CATEGORIES_QUERY = gql`
  query Fashion_GetLeafCategories($l1CategoryId: Int!, $treeVersion: String!) {
    taxonomy {
      leafCategories(l1CategoryId: $l1CategoryId, treeVersion: $treeVersion) {
        id
        name
        categoriesAlongPath {
          id
          name
        }
        categoryChildren {
          id
          name
        }
      }
    }
  }
`;

export type PickedCategory = Pick<TaxonomyCategorySchema, "id" | "name">;
export type PickedCategoryWithDetails = PickedCategory & {
  readonly categoriesAlongPath: ReadonlyArray<PickedCategory>;
  readonly categoryChildren?: ReadonlyArray<PickedCategory> | null;
};

export type LeafCategoryRequestData = TaxonomySchemaLeafCategoriesArgs;
export type LeafCategoryResponseData = {
  readonly taxonomy?: {
    readonly leafCategories?: ReadonlyArray<
      PickedCategory & {
        readonly categoriesAlongPath: ReadonlyArray<PickedCategory>;
        readonly categoryChildren: ReadonlyArray<PickedCategory>;
      }
    >;
  };
};

export const CATEGORY_ATTRIBUTES_QUERY = gql`
  query Fashion_GetCategoryAttributes(
    $categoryId: Int!
    $treeVersion: String!
  ) {
    taxonomy {
      attributes(categoryId: $categoryId, treeVersion: $treeVersion) {
        id
        name
        values {
          id
          value
        }
        description
        dataType
        dataTypeFormat
        level
        usage
        isVariationAttribute
        mode
        maxMultiSelect
        enabledForVariations
      }
    }
  }
`;

export type PickedTaxonomyAttribute = Pick<
  TaxonomyAttributeSchema,
  | "id"
  | "name"
  | "values"
  | "description"
  | "dataType"
  | "dataTypeFormat"
  | "level"
  | "usage"
  | "isVariationAttribute"
  | "mode"
  | "maxMultiSelect"
  | "enabledForVariations"
>;

export type CategoryAttributesRequestData = TaxonomySchemaAttributesArgs;
export type CategoryAttributesResponseData = {
  readonly taxonomy?: {
    readonly attributes?: ReadonlyArray<PickedTaxonomyAttribute>;
  };
};

export const TAXONOMY_CATEGORY_QUERY = gql`
  query Fashion_TaxonomyCategoriesQuery(
    $categoryId: Int!
    $treeVersion: String!
  ) {
    taxonomy {
      category(categoryId: $categoryId, treeVersion: $treeVersion) {
        id
        name
        categoriesAlongPath {
          id
          name
        }
        categoryChildren {
          id
          name
          categoriesAlongPath {
            id
            name
          }
          categoryChildren {
            id
            name
          }
        }
      }
    }
  }
`;

export type TaxonomyCategoryRequestData = TaxonomySchemaCategoryArgs;
export type TaxonomyCategoryResponseData = {
  readonly taxonomy?: {
    readonly category?: PickedCategory & {
      readonly categoriesAlongPath: ReadonlyArray<PickedCategory>;
      readonly categoryChildren: ReadonlyArray<
        PickedCategory & {
          readonly categoriesAlongPath: ReadonlyArray<PickedCategory>;
          readonly categoryChildren: ReadonlyArray<PickedCategory>;
        }
      >;
    };
  };
};

export const CATEGORY_CSV_HEADERS_QUERY = gql`
  query CategoryCSVHeadersQuery($categoryId: Int!, $treeVersion: String!) {
    productCatalog {
      csvProductTemplateWithTaxonomyColumnNames(
        categoryId: $categoryId
        treeVersion: $treeVersion
      )
    }
  }
`;

export type CategoryCSVHeadersRequestData =
  ProductCatalogSchemaCsvProductTemplateWithTaxonomyColumnNamesArgs;
export type CategoryCSVHeadersResponseData = {
  readonly productCatalog: Pick<
    ProductCatalogSchema,
    "csvProductTemplateWithTaxonomyColumnNames"
  >;
};

export const CATEGORY_ATTRIBUTES_CSV_QUERY = gql`
  query CategoryAttributesCsvQuery($categoryId: Int!) {
    taxonomy {
      categoryAttributesCsv(categoryId: $categoryId)
    }
  }
`;

export type CategoryAttributesCsvResponseType = {
  readonly taxonomy?: Pick<TaxonomySchema, "categoryAttributesCsv"> | null;
};

export type CategoryAttributesCsvRequestType =
  TaxonomySchemaCategoryAttributesCsvArgs;

export const CATEGORY_TREE_JSON_QUERY = gql`
  query CategoryTreeJsonQuery {
    productCatalog {
      productCategoryTaxonomyTreeJson
    }
  }
`;

export type CategoryTreeJsonResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "productCategoryTaxonomyTreeJson"
  > | null;
};

// =============================
// Variation Grouping
// =============================

export type PickedTaxonomyVariationOptionValue = Pick<
  TaxonomyAttributeValueSchema,
  "id" | "value"
>;

export type PickedTaxonomyVariationOption = Pick<
  TaxonomyAttributeSchema,
  "id" | "name"
> & {
  readonly values?: ReadonlyArray<PickedTaxonomyVariationOptionValue> | null;
};

export type GetTaxonomyVariationOptionsRequestType =
  TaxonomySchemaVariationOptionsArgs;

export type GetTaxonomyVariationOptionsResponseType = {
  readonly taxonomy?: {
    readonly variationOptions?: ReadonlyArray<PickedTaxonomyVariationOption> | null;
  } | null;
};

export const GET_TAXONOMY_VARIATION_OPTIONS_QUERY = gql`
  query VariationGrouping_GetTaxonomyVariationOptionsQuery(
    $categoryId: Int!
    $treeVersion: String
  ) {
    taxonomy {
      variationOptions(categoryId: $categoryId, treeVersion: $treeVersion) {
        id
        name
        values {
          id
          value
        }
      }
    }
  }
`;

export const useCategoryTreeMap = () => {
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(false);
  const [categoryMap, setCategoryMap] = useState<
    ReadonlyMap<CategoryId, CategoryTreeNode>
  >(new Map());

  const { data, loading: isLoadingTree } =
    useQuery<CategoryTreeJsonResponseType>(CATEGORY_TREE_JSON_QUERY);
  const jsonTree = data?.productCatalog?.productCategoryTaxonomyTreeJson;

  useEffect(() => {
    if (jsonTree != null) {
      setIsLoadingMap(true);
      const tree = parseJsonTree(jsonTree);
      const currentMap = new Map(categoryMap);
      const newMap = buildMapFromTree({
        parentId: undefined,
        currentNode: tree,
        currentPath: "",
        currentMap: currentMap,
      });
      setIsLoadingMap(false);
      setCategoryMap(newMap);
    }
    // map only depends on tree data, categoryMap is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonTree]);

  return { categoryMap, loading: isLoadingTree || isLoadingMap };
};
