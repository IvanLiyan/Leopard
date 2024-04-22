import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@core/components/modal/Modal";
import { IconButton, Layout, Text } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { gql } from "@gql";
import ProductImage from "./ProductImage";
import {
  ImageSchema,
  ProductCatalogSchemaProductArgs,
  ProductSchema,
} from "@schema";
import { useQuery } from "@apollo/client";
import { wishURL } from "@core/toolkit/url";
import { css } from "@core/toolkit/styling";
import { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import { Skeleton } from "@mui/material";
import { ci18n } from "@core/toolkit/i18n";

type ProductDetailModalContentProps = BaseProps &
  Pick<ModalProps, "open" | "onClose"> & {
    readonly productId: string;
  };

const GET_PRODUCT_QUERY = gql(`
  query ProductDetailModal_GetProduct($id: String, $sku: String) {
    productCatalog {
      product(id: $id, sku: $sku) {
        id
        name
        mainImage {
          wishUrl
        }
        description
        isRemoved
        listingState{
          state
        }
      }
    }
  }
`);

type GetProductRequestType = ProductCatalogSchemaProductArgs;
type GetProductResponseType = {
  readonly productCatalog?: {
    readonly product?:
      | (Pick<
          ProductSchema,
          "id" | "name" | "description" | "isRemoved" | "listingState"
        > & {
          readonly mainImage: Pick<ImageSchema, "wishUrl">;
        })
      | null;
  } | null;
};

const ProductDetailModal: React.FC<ProductDetailModalContentProps> = ({
  productId,
  open,
  onClose,
}: ProductDetailModalContentProps) => {
  const styles = useStyleSheet();
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  useEffect(() => {
    if (open && !hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  }, [open, hasOpenedOnce]);

  const { data, loading } = useQuery<
    GetProductResponseType,
    GetProductRequestType
  >(GET_PRODUCT_QUERY, {
    variables: {
      id: productId,
    },
    skip: !hasOpenedOnce && !open,
  });

  const product = data?.productCatalog?.product;
  const productState = product?.listingState?.state;

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={ci18n("details of product", "Product Details")}
        onClose={
          onClose === undefined
            ? undefined
            : (e) => {
                onClose(e, "backdropClick");
              }
        }
      />
      <div className={css(styles.root)}>
        {product == null && !loading ? (
          <Text>No product found</Text>
        ) : (
          <>
            <div className={css(styles.flexRow)}>
              {product == null ? (
                <Skeleton variant="rounded" height={146} width={146} />
              ) : (
                <Layout.FlexRow
                  style={{ height: 146, minWidth: 146 }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <ProductImage
                    height={146}
                    width="unset"
                    imageUrl={product.mainImage.wishUrl}
                  />
                </Layout.FlexRow>
              )}
              <div className={css(styles.productNameIdContainer)}>
                <Layout.FlexRow className={css(styles.marginBottom)}>
                  <Text
                    style={styles.fieldTitle}
                    weight="semibold"
                    renderAsSpan
                  >
                    {ci18n("product name", "Name:")}
                  </Text>
                  {product == null ? (
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: 15, width: 200 }}
                    />
                  ) : (
                    <Text style={styles.fieldText} renderAsSpan>
                      {product.name}
                    </Text>
                  )}
                </Layout.FlexRow>
                <Layout.FlexRow
                  className={css(styles.productId, styles.marginBottom)}
                >
                  <Text
                    style={styles.fieldTitle}
                    weight="semibold"
                    renderAsSpan
                  >
                    {ci18n("product id", "ID:")}
                  </Text>
                  {product == null ? (
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: 15, width: 200 }}
                    />
                  ) : (
                    <ObjectId
                      style={styles.objectId}
                      id={product.id}
                      showFull
                    />
                  )}
                </Layout.FlexRow>
                <Layout.FlexRow className={css(styles.marginBottom)}>
                  <Text
                    style={styles.fieldTitle}
                    weight="semibold"
                    renderAsSpan
                  >
                    Available For Sale:
                  </Text>
                  {product == null ? (
                    <Skeleton variant="text" sx={{ fontSize: 15, width: 30 }} />
                  ) : (
                    <Text style={styles.fieldText} renderAsSpan>
                      {productState === "ACTIVE"
                        ? ci18n("Is the product available for sale?", "Yes")
                        : ci18n("Is the product available for sale?", "No")}
                    </Text>
                  )}
                </Layout.FlexRow>
                {product == null ? (
                  <Skeleton variant="rounded" height={33} width={150} />
                ) : (
                  <IconButton
                    href={wishURL(`/c/${product.id}`)}
                    icon="externalLink"
                    openInNewTab
                  >
                    View on Wish
                  </IconButton>
                )}
              </div>
            </div>
            <div className={css(styles.description)}>
              <Text
                style={[styles.fieldTitle, styles.marginBottom]}
                weight="semibold"
              >
                {ci18n("product description", "Description")}
              </Text>
              {product == null ? (
                <Skeleton variant="text" sx={{ fontSize: 15 }} height={60} />
              ) : (
                <Text style={styles.fieldText} renderAsSpan>
                  {product.description}
                </Text>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default observer(ProductDetailModal);

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: 20,
        },
        fieldTitle: {
          marginRight: 8,
        },
        fieldText: {
          lineHeight: "20px",
          fontSize: 15,
        },
        flexRow: {
          display: "flex",
        },
        productNameIdContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 2,
          marginLeft: 20,
        },
        productId: {
          display: "flex",
          alignItems: "center",
        },
        objectId: {
          fontSize: 16,
        },
        description: {
          marginTop: 20,
          alignSelf: "stretch",
          whiteSpace: "pre-wrap",
        },
        marginBottom: {
          marginBottom: 10,
        },
      }),
    [],
  );
