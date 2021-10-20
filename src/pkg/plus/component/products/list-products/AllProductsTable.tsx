/*
 *
 * AllProductsMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* External Libraries */
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Switch, Markdown, LoadingIndicator } from "@ContextLogic/lego";
import { SortOrder } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

import { wishURL, zendeskURL } from "@toolkit/url";
import ProductImage from "@merchant/component/products/ProductImage";
import { Popover } from "@merchant/component/core";
import { useToastStore } from "@stores/ToastStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import {
  ProductSortField,
  ProductSchema,
  UpsertProduct,
  ProductUpsertInput,
  CountryShippingSchema,
  Country,
  TrueTagSchema,
} from "@schema/types";
import { useDeciderKey } from "@stores/ExperimentStore";

export type PickedCountryShippingSchema = Pick<
  CountryShippingSchema,
  "enabled"
> & {
  readonly country: Pick<Country, "name" | "code">;
};

type PickedWarehouseCountryShippingSchema = {
  readonly countryShipping:
    | ReadonlyArray<PickedCountryShippingSchema>
    | undefined
    | null;
};

export type ProductType = Pick<
  ProductSchema,
  | "id"
  | "name"
  | "sales"
  | "enabled"
  | "totalInventory"
  | "variationCount"
  | "reviewStatus"
  | "condition"
> & {
  readonly shipping: {
    readonly wishExpressCountryShipping:
      | null
      | undefined
      | ReadonlyArray<PickedWarehouseCountryShippingSchema>;
  };
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">> | null;
};

const TOGGLE_ENABLED_MUTATION = gql`
  mutation AllProductsTable_ToggleProductEnabled(
    $productId: ObjectIdType!
    $enabled: Boolean!
  ) {
    productCatalog {
      upsertProduct(input: { id: $productId, enabled: $enabled }) {
        ok
      }
    }
  }
`;

type ToggleEnabledResponse = {
  readonly productCatalog: {
    readonly upsertProduct: Pick<UpsertProduct, "ok" | "message">;
  };
};

type ToggleEnabledArgs = {
  readonly productId: ProductUpsertInput["id"];
  readonly enabled: ProductUpsertInput["enabled"];
};

const PopoverWidth = 200;

const ForSaleSwitch = ({ enabled, id: productId }: ProductType) => {
  const styles = useStylesheet();
  const [isOn, setIsOn] = useState(enabled);
  const toastStore = useToastStore();

  const [updateInventory, { loading: isSaving }] = useMutation<
    ToggleEnabledResponse,
    ToggleEnabledArgs
  >(TOGGLE_ENABLED_MUTATION, {
    variables: {
      productId,
      enabled: !isOn,
    },
  });

  const onToggle = async (to: boolean) => {
    setIsOn(to);
    const { data } = await updateInventory();
    const ok = data?.productCatalog?.upsertProduct?.ok;
    const message = data?.productCatalog?.upsertProduct?.message;
    if (!ok) {
      setIsOn(!to);
      if (message) {
        toastStore.error(message);
      }
    }
  };

  return (
    <Switch
      style={css(styles.switch)}
      isOn={isOn}
      onToggle={onToggle}
      showText={false}
      disabled={isSaving}
    />
  );
};

const ProductCell = ({
  className,
  style,
  id: productId,
  name,
  reviewStatus,
}: Pick<BaseProps, "className" | "style"> & ProductType) => {
  const styles = useStylesheet();

  const productUrl = wishURL(`/c/${productId}`);
  const url = `[wish.com](${productUrl})`;
  const canViewOnWish = reviewStatus == "APPROVED";
  return (
    <div
      className={css(
        styles.productsCell,
        canViewOnWish && styles.showEyeballOnHover,
        className,
        style,
      )}
    >
      <Link
        className={css(styles.content)}
        href={`/plus/products/edit/${productId}`}
      >
        <ProductImage productId={productId} className={css(styles.image)} />
        <div className={css(styles.name)}>{name}</div>
      </Link>
      {canViewOnWish && (
        <Popover
          className={css(styles.popover)}
          popoverContent={() => (
            <Markdown
              style={css(styles.markdown)}
              text={i`View on ${url}`}
              openLinksInNewTab
            />
          )}
        >
          <Icon name="eyePalaceBlue" />
        </Popover>
      )}
    </div>
  );
};

const WishExpressBadge: React.FC<ProductType> = ({
  id: productId,
  shipping: { wishExpressCountryShipping },
}: ProductType) => {
  const expressCountries = useMemo(() => {
    return (
      (wishExpressCountryShipping &&
        wishExpressCountryShipping[0].countryShipping) ||
      []
    )
      .filter((countryShipping) => countryShipping.enabled)
      .map(({ country: { name: countryName } }) => countryName);
  }, [wishExpressCountryShipping]);

  const text = useMemo(() => {
    const countryName1 = expressCountries[0];
    if (expressCountries.length === 1) {
      return (
        i`Wish Express is enabled for ${countryName1}. ` +
        i`View your [product details](${`/plus/products/edit/${productId}`}) to see the full list.`
      );
    }

    const countryName2 = expressCountries[1];
    if (expressCountries.length === 2) {
      return (
        i`Wish Express is enabled for ${countryName1} and ${countryName2}. ` +
        i`View your [product details](${`/plus/products/edit/${productId}`}) to see the full list.`
      );
    }

    const countryName3 = expressCountries[2];
    if (expressCountries.length === 3) {
      return (
        i`Wish Express is enabled for ${countryName1}, ${countryName2}, and ${countryName3}. ` +
        i`View your [product details](${`/plus/products/edit/${productId}`}) to see the full list.`
      );
    }

    const remainingNumberOfCountries = expressCountries.length - 3;
    return (
      i`Wish Express is enabled for ${countryName1}, ${countryName2}, ${countryName3}, ` +
      i`and ${remainingNumberOfCountries} more. ` +
      i`View your [product details](${`/plus/products/edit/${productId}`}) to see the full list.`
    );
  }, [expressCountries, productId]);

  if (expressCountries.length === 0) {
    return (
      <Popover
        popoverContent={i`Product is not enrolled in Wish Express.`}
        position="top center"
        popoverMaxWidth={PopoverWidth}
      >
        --
      </Popover>
    );
  }

  return (
    <Popover
      popoverContent={text}
      position="top center"
      popoverMaxWidth={PopoverWidth}
    >
      <Icon name="wishExpressTruck" alt={i`wish express truck`} />
    </Popover>
  );
};

type Props = BaseProps & {
  readonly products: ReadonlyArray<ProductType>;
  readonly sortField: ProductSortField | undefined;
  readonly sortOrder: SortOrder | undefined;
  readonly onSortToggled: (
    field: ProductSortField,
    order: SortOrder,
  ) => unknown;
  readonly canManageShipping: boolean;
};

const AllProductsTable: React.FC<Props> = ({
  products,
  sortOrder,
  sortField,
  canManageShipping,
  onSortToggled,
  style,
  className,
}: Props) => {
  const salesSortOrder = sortField == "SALES" ? sortOrder : "not-applied";

  const { decision: showRevShare, isLoading: isLoadingShowRevShare } =
    useDeciderKey("rev_share_mplus");

  const categoriesLearnMoreLink = zendeskURL("4403535077403");

  if (isLoadingShowRevShare) {
    return <LoadingIndicator />;
  }

  return (
    <Table data={products} className={css(className)} style={style}>
      <Table.Column title={i`Product`} columnKey="id" width={450}>
        {({ row }: CellInfo<ProductType["id"], ProductType>) => (
          // TODO [lliepert]: maxWidth is temp fix for ProductCell not respecting table width
          // will be fixed more generally in future <Table /> update
          <ProductCell {...row} className={css({ maxWidth: 450 })} />
        )}
      </Table.Column>
      {showRevShare && (
        <Table.Column
          title={ci18n("category of products", "Category")}
          columnKey="categories"
          description={
            i`This is the category of this product as determined by Wish, used to calculate ` +
            i`corresponding orders' revenue share percentage. If multiple product categories ` +
            i`are shown here, the category that receives the lowest revenue share is used ` +
            i`for calculation. [Learn more](${categoriesLearnMoreLink})`
          }
        >
          {({
            row: { categories },
          }: CellInfo<ProductType["id"], ProductType>) =>
            categories == null || categories.length == 0 ? (
              <Popover
                position="bottom center"
                popoverContent={i`Your product will be categorized after its next sale.`}
              >
                --
              </Popover>
            ) : (
              categories.map(({ name }) => name).join(", ")
            )
          }
        </Table.Column>
      )}
      <Table.NumeralColumn
        title={i`Quantity`}
        columnKey="totalInventory"
        align="left"
      />
      <Table.NumeralColumn
        title={i`Variations`}
        columnKey="variationCount"
        align="left"
      />
      <Table.NumeralColumn
        title={i`Sales`}
        columnKey="sales"
        align="left"
        sortOrder={salesSortOrder}
        onSortToggled={(newOrder) => onSortToggled("SALES", newOrder)}
      />

      {canManageShipping && (
        <Table.Column title={i`Badges`} columnKey="shipping" align="left">
          {({
            row: product,
          }: CellInfo<ProductType["shipping"], ProductType>) => (
            <WishExpressBadge {...product} />
          )}
        </Table.Column>
      )}

      <Table.Column
        title={i`Available for sale`}
        columnKey="enabled"
        align="center"
      >
        {({ row: product }: CellInfo<ProductType["enabled"], ProductType>) => (
          <ForSaleSwitch {...product} key={product.id} />
        )}
      </Table.Column>
    </Table>
  );
};

export default AllProductsTable;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        productsCell: {
          display: "flex",
          alignItems: "center",
          margin: "12px 0px",
        },
        showEyeballOnHover: {
          ":last-child > :last-child": {
            opacity: 0,
          },
          ":hover": {
            opacity: 1,
            transition: "opacity 0.3s linear",
          },
        },
        image: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        popover: {
          margin: 24,
        },
        markdown: {
          margin: 12,
        },
        switch: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        },
        name: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    [],
  );
