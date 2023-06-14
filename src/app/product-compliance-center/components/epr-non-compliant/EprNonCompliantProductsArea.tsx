import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useIntQueryParam, useStringQueryParam } from "@core/toolkit/url";
import { wishURL } from "@core/toolkit/url";
import { ci18n } from "@core/toolkit/i18n";
import { Table, CellInfo, FormSelect, PageIndicator } from "@ContextLogic/lego";
import {
  Stack,
  Heading,
  Text,
  Button,
  TextField,
} from "@ContextLogic/atlas-ui";
import InputAdornment from "@mui/material/InputAdornment";
import NextLink from "next/link";
import Skeleton from "@core/components/Skeleton";
import Icon from "@core/components/Icon";
import Link from "@core/components/Link";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { useQuery } from "@apollo/client";
import {
  EPR_NON_COMPLIANT_PRODUCTS_QUERY,
  EprNonCompliantProductsQueryResponse,
  EprNonCompliantProductsQueryVariables,
} from "@product-compliance-center/api/eprNonCompliantQuery";
import { EprProductRecordSchema } from "@schema";
import { merchFeUrl } from "@core/toolkit/router";
import {
  SupportedCountryCode,
  SupportedCountryCodes,
  COUNTRY_TO_EPR_CATEGORY_OPTIONS,
  PAGE_SIZE_OPTIONS,
  PRODUCTS_COUNTRY_OPTIONS,
  ALL_EPR_CATEGORIES_VALUE,
} from "@product-compliance-center/toolkit/EprNonCompliantCommon";
import MultilineCell from "./MultilineCell";

const DEFAULT_PAGE_SIZE = 10;

const EprNonCompliantProductsArea: React.FC = () => {
  const [searchTerm, setSearchTerm] = useStringQueryParam("search_term");
  const debouncedQuery = useDebouncer(searchTerm, 800);
  const [rawProductsCountry, setProductsCountry] =
    useStringQueryParam("products_country");
  const [rawProductsCategory, setProductsCategory] =
    useIntQueryParam("products_category");
  const [rawProductsOffset, setProductsOffset] =
    useIntQueryParam("products_offset");
  const [rawProductsLimit, setProductsLimit] =
    useIntQueryParam("products_limit");

  const productsCountry = (
    SupportedCountryCodes as ReadonlyArray<string>
  ).includes(rawProductsCountry)
    ? (rawProductsCountry as SupportedCountryCode)
    : "FR";
  const categoryOptions = COUNTRY_TO_EPR_CATEGORY_OPTIONS[productsCountry];
  const productsCategory = rawProductsCategory || ALL_EPR_CATEGORIES_VALUE;

  const productsOffset = rawProductsOffset || 0;
  const productsLimit = rawProductsLimit || DEFAULT_PAGE_SIZE;

  const searchQuery =
    searchTerm && debouncedQuery.trim().length > 0 ? debouncedQuery : undefined;

  const { data, loading: isLoadingData } = useQuery<
    EprNonCompliantProductsQueryResponse,
    EprNonCompliantProductsQueryVariables
  >(EPR_NON_COMPLIANT_PRODUCTS_QUERY, {
    variables: {
      countryCode: productsCountry,
      eprCategories:
        productsCategory === ALL_EPR_CATEGORIES_VALUE
          ? null
          : [productsCategory],
      productId: searchQuery,
      offset: productsOffset,
      limit: productsLimit,
    },
  });
  const summary =
    data?.policy?.productCompliance?.extendedProducerResponsibility
      .eprNonCompliantSummary;
  const totalProductCount: number = summary?.productRecordTotal ?? 0;

  // Paging via query string parameters
  useEffect(() => {
    if (!rawProductsOffset) {
      return;
    }
    void setProductsOffset(0);
    // prevent clearing offset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const styles = {
    filterPart: {
      marginRight: "16px",
    },
  };

  return (
    <Stack direction="column">
      <Heading
        variant="h3"
        sx={{
          marginTop: "24px",
        }}
      >
        Products
      </Heading>
      <Stack
        direction="row"
        sx={{
          margin: "12px 0px",
          gap: 8,
        }}
        justifyContent="space-between"
      >
        <Stack direction="row">
          <FormSelect
            style={styles.filterPart}
            options={PRODUCTS_COUNTRY_OPTIONS}
            onSelected={async (newCountry: string) => {
              await setProductsCountry(newCountry);
              await setProductsCategory(ALL_EPR_CATEGORIES_VALUE);
            }}
            selectedValue={productsCountry}
          />
          <FormSelect
            style={styles.filterPart}
            options={categoryOptions || []}
            onSelected={async (newCategory: string) => {
              await setProductsCategory(parseInt(newCategory));
            }}
            selectedValue={productsCategory.toString()}
          />
          <TextField
            placeholder={i`Search by product ID`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon size={16} name="search" />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => {
              void setSearchTerm(e.target.value);
            }}
            data-cy="input-table-search-value"
          />
        </Stack>
        <Stack direction="row">
          <PageIndicator
            style={{
              marginRight: "16px",
            }}
            totalItems={totalProductCount}
            rangeStart={productsOffset + 1}
            rangeEnd={Math.min(
              totalProductCount,
              productsOffset + productsLimit,
            )}
            hasNext={productsOffset + productsLimit < totalProductCount}
            hasPrev={productsOffset > 0}
            currentPage={Math.ceil(productsOffset / productsLimit)}
            onPageChange={async (newPage: number) => {
              const newOffset = Math.max(0, newPage) * productsLimit;
              await setProductsOffset(newOffset);
            }}
          />
          <FormSelect
            options={PAGE_SIZE_OPTIONS}
            onSelected={async (newLimit: string) => {
              await setProductsLimit(parseInt(newLimit));
            }}
            selectedValue={productsLimit.toString()}
          />
        </Stack>
      </Stack>
      {
        // Products table
        isLoadingData ? (
          <Skeleton height={48} sx={{ margin: "24px 0px" }} />
        ) : (
          <Table data={summary?.productRecords}>
            <Table.Column
              title={ci18n("Column title for product ID", "Product ID")}
              _key="productId"
              columnKey="productId"
            >
              {({ row }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                <Link href={wishURL(`/c/${row.productId}`)} openInNewTab>
                  {row.productId}
                </Link>
              )}
            </Table.Column>
            <Table.Column title={i`Country`} _key="country" columnKey="country">
              {({ row }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                <Text>{row.country.name}</Text>
              )}
            </Table.Column>
            <Table.Column
              title={ci18n("Column title for EPR categories", "EPR Categories")}
              _key="eprCategoryNames"
              columnKey="eprCategoryNames"
            >
              {({ row }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                <MultilineCell lines={row.eprCategoryNames} />
              )}
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title for taxonomy categories in scope",
                "Taxonomy Categories in Scope",
              )}
              _key="taxonomyCategoryNames"
              columnKey="taxonomyCategoryNames"
            >
              {({ row }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                <MultilineCell lines={row.taxonomyCategoryNames} />
              )}
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title for the disputing category action",
                "Dispute Category",
              )}
              _key="disputeCategory"
              columnKey="productId"
            >
              {({ row }: CellInfo<React.ReactNode, EprProductRecordSchema>) => {
                const disputeUrl = merchFeUrl(
                  `/product-taxonomy-category-dispute/create/${row.productId}`,
                );
                return (
                  <NextLink href={disputeUrl} passHref>
                    <Button href={disputeUrl} data-cy="dispute-button">
                      Dispute Product Category
                    </Button>
                  </NextLink>
                );
              }}
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title for the adding EPR number action",
                "Add EPR Number",
              )}
              _key="addEprNumber"
              columnKey="productId"
            >
              {() => {
                const addEprNumberUrl = merchFeUrl(
                  `/md/product-compliance-center`,
                );
                return (
                  <NextLink href={addEprNumberUrl} passHref>
                    <Button
                      href={addEprNumberUrl}
                      data-cy="add-epr-number-button"
                    >
                      Add EPR Number
                    </Button>
                  </NextLink>
                );
              }}
            </Table.Column>
          </Table>
        )
      }
    </Stack>
  );
};

export default observer(EprNonCompliantProductsArea);
