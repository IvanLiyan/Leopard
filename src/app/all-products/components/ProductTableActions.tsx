import {
  getProductState,
  PickedProduct,
  productHasVariations,
  ProductsContainerInitialData,
} from "@all-products/toolkit";
import { MultiSecondaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { ci18n } from "@core/toolkit/i18n";
import { wishURL } from "@core/toolkit/url";
import { merchFeUrl } from "@core/toolkit/router";
import { observer } from "mobx-react";
import { useState } from "react";
import DeleteProductConfirmModal from "./DeleteProductConfirmModal";

type Props = BaseProps & {
  readonly product: PickedProduct;
  readonly merchant: ProductsContainerInitialData["currentMerchant"];
  readonly onRefetchProducts: () => unknown;
  readonly showCategoryUpdates?: boolean | null | undefined;
};

const ProductTableActions: React.FC<Props> = ({
  product,
  merchant,
  onRefetchProducts,
  showCategoryUpdates,
}) => {
  const navigationStore = useNavigationStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { state: productState } = getProductState(product);
  const productRemoved =
    productState == "REMOVED_BY_MERCHANT" || productState == "REMOVED_BY_WISH";
  return (
    <>
      <DeleteProductConfirmModal
        open={deleteModalOpen}
        onClose={({ removed }) => {
          if (removed) {
            onRefetchProducts();
          }
          setDeleteModalOpen(false);
        }}
        productId={product.id}
        productName={product.name}
        hasVariations={productHasVariations(product)}
      />

      <MultiSecondaryButton
        visibleButtonCount={0}
        dropDownPosition="bottom right"
        dropDownContentWidth={300}
        dropdownButtonBorders={false}
        data-cy="action"
        actions={[
          ...(!productRemoved
            ? [
                {
                  text: ci18n(
                    "An action merchants can take on a product listing, leads to the page where they can edit the listing.",
                    "Edit Listing",
                  ),
                  onClick: () =>
                    void navigationStore.navigate(
                      merchFeUrl(`/md/products/edit?pid=${product.id}`),
                    ),
                },
              ]
            : []),
          ...(!product.isLtl && !product.isReturnsEnabled
            ? [
                {
                  text: ci18n(
                    "An action merchants can take on a product listing, leads to the page where they can enroll the product in returns.",
                    "Enroll in Returns",
                  ),
                  onClick: () =>
                    void navigationStore.navigate(
                      merchFeUrl(
                        `/product/return-setting/${product.id}#tab=product`,
                      ),
                      { openInNewTab: true },
                    ),
                },
              ]
            : []),
          ...(!product.isLtl && product.isReturnsEnabled
            ? [
                {
                  text: ci18n(
                    "An action merchants can take on a product listing, leads to the page where they can view the product's return settings.",
                    "View Returns Setting",
                  ),
                  onClick: () =>
                    void navigationStore.navigate(
                      merchFeUrl(
                        `/product/return-setting/${product.id}#tab=product`,
                      ),
                      { openInNewTab: true },
                    ),
                },
              ]
            : []),
          ...(merchant != null &&
          merchant.canAccessPaidPlacement &&
          merchant.state != "VACATION" &&
          getProductState(product).state != "MERCHANT_INACTIVE"
            ? [
                {
                  text: ci18n(
                    "An action merchants can take on a product listing, leads to the page where they can create a ProductBoost campaign with this product.",
                    "Create ProductBoost Campaign",
                  ),
                  onClick: () =>
                    void navigationStore.navigate(
                      merchFeUrl(
                        `/product-boost/v2/create?product_id=${product.id}`,
                      ),
                      { openInNewTab: true },
                    ),
                },
              ]
            : []),
          {
            text: ci18n(
              "An action merchants can take on a product listing",
              "Disable And Permanently Remove Product",
            ),
            onClick: () => {
              setDeleteModalOpen(true);
            },
          },
          {
            text: ci18n(
              "An action merchants can take on a product listing, leads to the page where they can create a product category dispute",
              "Dispute Product Category",
            ),
            onClick: () =>
              void navigationStore.navigate(
                showCategoryUpdates
                  ? merchFeUrl(
                      `/product-taxonomy-category-dispute/create/${product.id}`,
                    )
                  : merchFeUrl(
                      `/product/create-category-dispute/${product.id}`,
                    ),
              ),
          },
          {
            text: ci18n(
              "An action merchants can take on a product listing, leads to the product listing on the Wish consumer website",
              "View Product Listing",
            ),
            onClick: () =>
              void navigationStore.navigate(wishURL(`/c/${product.id}`), {
                openInNewTab: true,
              }),
          },
          {
            text: ci18n(
              "An action merchants can take on a product listing, leads to the page where they can view the product's performance",
              "View Product Listing Performance",
            ),
            onClick: () =>
              void navigationStore.navigate(
                merchFeUrl(`/product/profile/${product.id}`),
              ),
          },
          {
            text: ci18n(
              "An action merchants can take on a product listing, leads to the page where they can view the product's status",
              "View Product Listing Status",
            ),
            onClick: () =>
              void navigationStore.navigate(
                merchFeUrl(`/products/listing-status/${product.id}`),
                {
                  openInNewTab: true,
                },
              ),
          },
        ]}
      />
    </>
  );
};

export default observer(ProductTableActions);
