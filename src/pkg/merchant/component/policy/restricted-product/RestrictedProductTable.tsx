import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { H5, Markdown } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Merchant Components */
import { RestrictedProductCategoryProps } from "@merchant/component/policy/restricted-product/RestrictedProduct";
import ProductCategoryColumn from "@merchant/component/policy/restricted-product/ProductCategoryColumn";
import ProductStateColumn from "@merchant/component/policy/restricted-product/ProductStateColumn";
import ProductRegionColumn from "@merchant/component/policy/restricted-product/ProductRegionColumn";
import { CountryCodeToTermsOfServicesDoc } from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RestrictedProductCountryCode } from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { download } from "@assets/icons";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type RestrictedProductTableProps = BaseProps & {
  readonly restrictedProductCategories: RestrictedProductCategoryProps[];
  readonly suspectedCountry: RestrictedProductCountryCode;
};

const RestrictedProductTable = ({
  style,
  restrictedProductCategories,
  suspectedCountry,
}: RestrictedProductTableProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const handleDownload = () => {
    navigationStore.download(CountryCodeToTermsOfServicesDoc[suspectedCountry]);
  };

  return (
    <div className={css(style)}>
      <div className={css(styles.header)}>
        <H5>Restricted Product Categories</H5>
        <div className={css(styles.buttonSection)}>
          <Button onClick={handleDownload}>
            <div className={css(styles.button)}>
              <img src={download} className={css(styles.icon)} />
              <Markdown text={i`Download selling guidelines`} />
            </div>
          </Button>
        </div>
      </div>

      <Table
        data={restrictedProductCategories}
        rowHeight={65}
        highlightRowOnHover
      >
        <Table.Column
          title={i`Category`}
          columnKey={"category"}
          width={"30%"}
          multiline
        >
          {({ row }) => (
            <ProductCategoryColumn
              circleImage={row.circleImage}
              title={row.title}
            />
          )}
        </Table.Column>
        <Table.Column
          title={i`Authorization Status`}
          columnKey={"title"}
          width="300px"
          multiline
        >
          {({ row }) => (
            <ProductStateColumn
              state={row.state}
              rejectedReason={row.rejectedReason}
            />
          )}
        </Table.Column>
        <Table.Column
          title={i`Country/Region Approved for Sale`}
          columnKey={"countryAndRegion"}
          width="300px"
        >
          {({ row }) => (
            <ProductRegionColumn
              countryAndRegion={row.countryAndRegion}
              state={row.state}
            />
          )}
        </Table.Column>
      </Table>
    </div>
  );
};

export default observer(RestrictedProductTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          display: "flex",
          justifyContent: "space-between",
          alignContent: "stretch",
          alignSelf: "stretch",
          paddingBottom: 6,
        },
        buttonSection: {
          paddingBottom: 6,
        },
        button: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        icon: {
          margin: "0px 6px 0px 0px",
        },
      }),
    []
  );
};
