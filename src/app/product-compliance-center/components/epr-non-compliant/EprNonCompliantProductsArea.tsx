import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useIntQueryParam, useStringQueryParam } from "@core/toolkit/url";
import { wishURL } from "@core/toolkit/url";
import { ci18n } from "@core/toolkit/i18n";
import {
  Table,
  CellInfo,
  FormSelect,
  PageIndicator,
  Option,
} from "@ContextLogic/lego";
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
  EPR_NON_COMPLIANT_COUNTRIES_AVAILABLE_QUERY,
  EPR_NON_COMPLIANT_PRODUCTS_QUERY,
  EprNonCompliantCountriesAvailableQueryResponse,
  EprNonCompliantProductsQueryResponse,
  EprNonCompliantProductsQueryVariables,
} from "@product-compliance-center/api/eprNonCompliantQueries";
import { CountryCode, EprProductRecordSchema } from "@schema";
import { merchFeUrl } from "@core/toolkit/router";
import {
  SupportedCountryCode,
  SupportedCountryCodes,
  COUNTRY_TO_EPR_CATEGORY_OPTIONS,
  PAGE_SIZE_OPTIONS,
  ALL_EPR_CATEGORIES_VALUE,
} from "@product-compliance-center/toolkit/EprNonCompliantCommon";
import MultilineCell from "./MultilineCell";
import countries from "@core/toolkit/countries";

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

  const { data: pageData, loading: loadingPageData } =
    useQuery<EprNonCompliantCountriesAvailableQueryResponse>(
      EPR_NON_COMPLIANT_COUNTRIES_AVAILABLE_QUERY,
    );

  const countriesAvailable =
    pageData?.policy?.productCompliance?.extendedProducerResponsibility.eprNonCompliantSummary.summaryRecords.reduce(
      (acc, cur) => acc.add(cur.country.code),
      new Set<CountryCode>(),
    );
  const countriesOptions: ReadonlyArray<Option<string>> = [
    ...(countriesAvailable ?? []),
  ].map((code: CountryCode) => ({
    value: code,
    text: countries[code],
  }));

  const productsCountry = (
    SupportedCountryCodes as ReadonlyArray<string>
  ).includes(rawProductsCountry)
    ? (rawProductsCountry as SupportedCountryCode)
    : countriesOptions.length > 0
    ? (countriesOptions[0].value as SupportedCountryCode)
    : "FR"; // FR will not be shown to the merchant, table will not display in this case
  const categoryOptions = COUNTRY_TO_EPR_CATEGORY_OPTIONS[productsCountry];
  const productsCategory = rawProductsCategory || ALL_EPR_CATEGORIES_VALUE;

  const productsOffset = rawProductsOffset || 0;
  const productsLimit = rawProductsLimit || DEFAULT_PAGE_SIZE;

  const searchQuery =
    searchTerm && debouncedQuery.trim().length > 0 ? debouncedQuery : undefined;

  const { data: tableData, loading: loadingTableData } = useQuery<
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
    tableData?.policy?.productCompliance?.extendedProducerResponsibility
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
      {loadingPageData ? (
        <Skeleton height={560} sx={{ margin: "12px 0px" }} />
      ) : countriesOptions.length === 0 ? (
        <Text variant="bodyL" sx={{ marginTop: "12px" }}>
          You do not have any non-compliant products.
        </Text>
      ) : (
        <>
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
                options={countriesOptions}
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
            loadingTableData ? (
              <Skeleton height={592} />
            ) : (
              <Table data={summary?.productRecords}>
                <Table.Column
                  title={ci18n("Column title for product ID", "Product ID")}
                  _key="productId"
                  columnKey="productId"
                >
                  {({
                    row,
                  }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                    <Link href={wishURL(`/c/${row.productId}`)} openInNewTab>
                      {row.productId}
                    </Link>
                  )}
                </Table.Column>
                <Table.Column
                  title={i`Country`}
                  _key="country"
                  columnKey="country"
                >
                  {({
                    row,
                  }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
                    <Text>{row.country.name}</Text>
                  )}
                </Table.Column>
                <Table.Column
                  title={ci18n(
                    "Column title for EPR categories",
                    "EPR Categories",
                  )}
                  _key="eprCategoryNames"
                  columnKey="eprCategoryNames"
                >
                  {({
                    row,
                  }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
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
                  {({
                    row,
                  }: CellInfo<React.ReactNode, EprProductRecordSchema>) => (
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
                  {({
                    row,
                  }: CellInfo<React.ReactNode, EprProductRecordSchema>) => {
                    const disputeUrl = merchFeUrl(
                      `/product-taxonomy-category-dispute/create/${row.productId}`,
                    );
                    return (
                      <NextLink href={disputeUrl} passHref>
                        <Button
                          secondary
                          href={disputeUrl}
                          data-cy="dispute-button"
                          sx={{ margin: "6px" }}
                        >
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
                          secondary
                          href={addEprNumberUrl}
                          data-cy="add-epr-number-button"
                          sx={{ margin: "6px" }}
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
        </>
      )}
    </Stack>
  );
};

export default observer(EprNonCompliantProductsArea);
