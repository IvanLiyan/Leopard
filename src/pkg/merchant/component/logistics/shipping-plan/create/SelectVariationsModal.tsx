import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { useQuery } from "@apollo/client";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { Modal, ModalFooter } from "@merchant/component/core/modal";
import {
  Text,
  Layout,
  Option,
  SortOrder,
  SimpleSelect,
  PageIndicator,
  LoadingIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import searchImg from "@assets/img/search.svg";
import CreateShippingPlanState from "@merchant/model/fbw/CreateShippingPlanState";
import { useTheme } from "@stores/ThemeStore";
import {
  GET_VARIATIONS,
  GetVariationsResponseType,
} from "@toolkit/fbw/create-shipping-plan";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import {
  VariationSort,
  VariationSortField,
  VariationSearchType,
  ProductCatalogSchemaVariationsArgs,
} from "@schema/types";
import SelectVariationsTable from "./SelectVariationsTable";

const InputHeight = 35;
const PageLimitOptions = [10, 50, 100, 250];

const SearchOptions: ReadonlyArray<Option<VariationSearchType>> = [
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
  {
    value: "PRODUCT_NAME",
    text: i`Product Name`,
  },
  {
    value: "SKU",
    text: i`SKU`,
  },
];

const Placeholders: { [searchType in VariationSearchType]: string } = {
  PRODUCT_ID: i`Enter a product id`,
  PRODUCT_NAME: i`Enter a product name`,
  SKU: i`Enter a SKU`,
};

type Props = {
  readonly onClose: () => unknown;
  readonly state: CreateShippingPlanState;
};

const SelectVariationsModalContent: React.FC<Props> = observer(
  ({ state, onClose }: Props) => {
    useMountEffect(() => {
      state.backupVariations();
    });

    const { selectedVariations } = state;
    const [rawOffset, setOffset] = useState(0);
    const [query, setQuery] = useState("");
    const [sortField, setSortField] = useState<VariationSortField | undefined>(
      undefined,
    );
    const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
      undefined,
    );

    const [searchType, setSearchType] =
      useState<VariationSearchType>("PRODUCT_ID");
    const [pageLimit, setPageLimit] = useState(0);

    const debouncedQuery = useDebouncer(query, 800);
    const searchQuery =
      debouncedQuery.trim().length > 0 ? debouncedQuery : null;

    const offset = rawOffset || 0;
    const limit = pageLimit || PageLimitOptions[0];

    const sort =
      sortField != null && sortOrder != null
        ? {
            field: sortField,
            order: sortOrder.toUpperCase() as VariationSort["order"],
          }
        : null;

    const { data, loading: variationsLoading } = useQuery<
      GetVariationsResponseType,
      ProductCatalogSchemaVariationsArgs
    >(GET_VARIATIONS, {
      variables: {
        offset,
        limit,
        query: searchQuery,
        searchType: searchQuery ? searchType : null,
        sort,
      },
      fetchPolicy: "no-cache",
    });

    const styles = useStylesheet({ variationsLoading });

    const onPageChange = (_nextPage: number) => {
      const nextPage = Math.max(0, _nextPage);
      setOffset(nextPage * limit);
    };

    const variations = data?.productCatalog.variations;
    const variationCount = data?.productCatalog.variationCount;

    const searchProductIdDebugValue: string | undefined =
      variations != null && variations.length > 0
        ? variations[0].productId
        : undefined;

    const searchProductNameDebugValue: string | undefined =
      variations != null && variations.length > 0
        ? variations[0].productName
        : undefined;

    const searchProductSKUDebugValue: string | undefined =
      variations != null && variations.length > 0
        ? variations[0].sku
        : undefined;

    const searchDebugValues: {
      [searchType in VariationSearchType]: string | undefined;
    } = {
      PRODUCT_ID: searchProductIdDebugValue,
      PRODUCT_NAME: searchProductNameDebugValue,
      SKU: searchProductSKUDebugValue,
    };

    return (
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn alignItems="stretch" style={styles.content}>
          <Text weight="semibold">Total SKUs: {selectedVariations.length}</Text>
          <Layout.FlexRow style={styles.controlsRow} alignItems="stretch">
            <TextInputWithSelect
              style={styles.search}
              selectProps={{
                selectedValue: searchType,
                options: SearchOptions,
                onSelected(item: VariationSearchType) {
                  setSearchType(item);
                },
              }}
              textInputProps={{
                icon: searchImg,
                placeholder: Placeholders[searchType],
                noDuplicateTokens: true,
                maxTokens: 1,
                value: query,
                height: InputHeight,
                onChange({ text }) {
                  setQuery(text);
                  setOffset(0);
                  if (text.trim().length > 0) {
                    setSearchType(searchType);
                  }
                },
                debugValue: searchDebugValues[searchType],
              }}
            />
            <Layout.FlexRow>
              <PageIndicator
                style={css(styles.pageIndicator)}
                isLoading={variationsLoading}
                totalItems={variationCount}
                rangeStart={offset + 1}
                rangeEnd={
                  variationCount ? Math.min(variationCount, offset + limit) : 0
                }
                hasNext={
                  variationCount ? offset + limit < variationCount : false
                }
                hasPrev={offset >= limit}
                currentPage={Math.ceil(offset / limit)}
                onPageChange={onPageChange}
              />
              <SimpleSelect
                style={styles.select}
                options={PageLimitOptions.map((v) => ({
                  value: v.toString(),
                  text: v.toString(),
                }))}
                onSelected={(item: string) => {
                  setPageLimit(parseInt(item));
                  setOffset(0);
                }}
                selectedValue={limit.toString()}
              />
            </Layout.FlexRow>
          </Layout.FlexRow>
          {variationsLoading ? (
            <LoadingIndicator />
          ) : (
            <SelectVariationsTable
              state={state}
              variations={variations || []}
              style={styles.table}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortToggled={(sortField, sortOrder) => {
                setSortField(sortField);
                setSortOrder(sortOrder);
                setOffset(0);
              }}
            />
          )}
        </Layout.FlexColumn>
        <ModalFooter
          layout="horizontal"
          action={{
            text: i`Confirm`,
            onClick: () => {
              onClose();
            },
            isDisabled: !state.variationsHaveChanged,
          }}
          cancel={{
            text: i`Cancel`,
            onClick: () => {
              state.restoreVariations();
              onClose();
            },
          }}
        />
      </Layout.FlexColumn>
    );
  },
);

const useStylesheet = ({
  variationsLoading,
}: {
  readonly variationsLoading: boolean;
}) => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 25,
        },
        controlsRow: {
          margin: "20px 0px",
          height: InputHeight,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },

        search: {
          flex: 1,
          "@media (min-width: 900px)": {
            maxWidth: 400,
          },
        },
        emptyState: {
          marginTop: 25,
        },
        table: {
          opacity: variationsLoading ? 0.7 : 1,
        },
        wishExpressCard: {
          marginTop: 15,
        },
        pageIndicator: {
          marginRight: 8,
        },
        select: {
          height: 35,
          width: 50,
          flex: 0,
        },
        bottomContainer: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "10px 25px",
        },
      }),
    [borderPrimary, variationsLoading],
  );
};
export default class SelectVariationsModal extends Modal {
  constructor(props: Omit<Props, "onClose">) {
    super((onClose) => (
      <SelectVariationsModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Select SKUs`,
    });

    this.setRenderFooter(() => null);
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.6);
  }
}
