/*
 * AddEditProductContainer.tsx
 *
 * Created by Jonah Dlin on Fri Oct 08 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";

import AddEditProductState from "@add-edit-product/AddEditProductState";

import { useNavigationStore } from "@core/stores/NavigationStore";
import { AddEditProductInitialData } from "@add-edit-product/queries/initial-queries";
import AddEditProduct from "@add-edit-product/components/AddEditProduct";
import { ci18n } from "@core/toolkit/i18n";
import AddEditProductV2 from "@add-edit-product/components/AddEditProductV2";
import { ComplianceDocumentsProvider } from "@add-edit-product/compliance-documents/ComplianceDocumentsContext";
import {
  useUpdateComplianceDocuments,
  useVerifyComplianceDocuments,
} from "@add-edit-product/compliance-documents/toolkit";
import { useToastStore } from "@core/stores/ToastStore";
import SuccessModal from "@add-edit-product/components/cards/SuccessModal";
import { merchFeUrl } from "@core/toolkit/router";

type Props = {
  readonly initialData: AddEditProductInitialData;
};

const AddEditProductContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>();
  const {
    productCatalog: { product },
    currentMerchant: {
      standardWarehouseId,
      primaryCurrency,
      shippingSettings: storeCountries,
      isStoreMerchant,
      canManageShipping,
      isCnForFulfillment,
      isCnMerchant,
      isConsignmentMode,
    },
    currentUser: {
      gating: { useCalculatedShipping, showVariationGroupingMUG },
    },
    platformConstants: {
      product: { prop65Chemicals },
      deciderKey,
    },
    policy,
    su,
  } = initialData;

  const disputes = policy?.productCategoryDispute?.disputes;
  const disputeId =
    disputes != null && disputes.length > 0 ? disputes[0].id : null;
  const showRevampedAddEditProductUI = deciderKey?.showRevampedAddEditProductUI;

  const [state] = useState(
    new AddEditProductState({
      standardWarehouseId,
      primaryCurrency,
      storeCountries,
      initialState: product,
      isStoreMerchant,
      canManageShipping,
      disputeId,
      isCnForFulfillment,
      useCalculatedShipping,
      caProp65AllChemicalsList: prop65Chemicals,
      showVariationGroupingUI:
        showVariationGroupingMUG || deciderKey?.showVariationGroupingDkey,
      showRevampedAddEditProductUI,
      showInventoryOnHand: deciderKey?.showInventoryOnHand,
      showConsignmentOverwrite: deciderKey?.showConsignmentOverwrite,
      isCnMerchant,
      isConsignmentMode,
      isBd: su ? su.isBd : false,
    }),
  );

  const { bypassExitConfirmation } = navigationStore.useExitConfirmation({
    enable: state.hasChanged,
    message: i`You have unsaved changes. Are you sure you want to leave?`,
  });

  const [
    updateComplianceDocuments,
    { loading: complianceDocumentsMutationLoading },
  ] = useUpdateComplianceDocuments();
  const verifyComplianceDocuments = useVerifyComplianceDocuments();
  const toastStore = useToastStore();

  const backLink = "/products";

  const onSave = async () => {
    // the compliance documents upload flow is separate from the product upsert flow
    // first verify the compliance documents before upserting the product, then add
    // the compliance documents based on the product id
    const ok = verifyComplianceDocuments();

    if (!ok) {
      toastStore.negative(
        i`Please provide a document label for each compliance document.`,
      );
      return;
    }

    const productId = await state.submit();

    if (productId) {
      // if there is no product ID, an error ocurred and state.saved will be false
      await updateComplianceDocuments({ productId });
    }

    if (state.saved) {
      bypassExitConfirmation(true);
      if (showRevampedAddEditProductUI) {
        setIsSuccessModalOpen(true);
      } else {
        void navigationStore.navigate("/products");
      }
    }
  };

  const actions = (
    <>
      <Button
        style={styles.actionButton}
        href={backLink}
        data-cy="button-cancel"
      >
        {ci18n(
          "Text on a button to cancel adding/editing a product and go back to the products list",
          "Cancel",
        )}
      </Button>
      <PrimaryButton
        style={styles.actionButton}
        onClick={onSave}
        minWidth
        popoverContent={state.saveButtonInactiveMessage}
        popoverPosition="top center"
        data-cy="button-save"
        isDisabled={complianceDocumentsMutationLoading}
      >
        {ci18n(
          "Text on a button to save changes on the adding/editing a product form",
          "Save",
        )}
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <SuccessModal
        open={isSuccessModalOpen ?? false}
        state={state}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <PageHeader
        title={
          state.name
            ? state.name
            : showRevampedAddEditProductUI
            ? i`New product listing`
            : i`Unsaved product listing`
        }
        actions={actions}
        className={css(styles.header)}
        relaxed={!showRevampedAddEditProductUI}
        breadcrumbs={
          showRevampedAddEditProductUI
            ? [
                {
                  name: ci18n(
                    "Breadcrumb item name, all products page",
                    "Products",
                  ),
                  href: merchFeUrl("/md/products"),
                },
                {
                  name: product?.id
                    ? ci18n(
                        "Breadcrumb item name, edit product page",
                        "Edit existing product",
                      )
                    : ci18n(
                        "Breadcrumb item name, add product page",
                        "Add new product",
                      ),
                  href: window.location.href,
                },
              ]
            : undefined
        }
      />
      <PageGuide relaxed={!showRevampedAddEditProductUI}>
        {showRevampedAddEditProductUI ? (
          <AddEditProductV2 style={styles.content} state={state} />
        ) : (
          <AddEditProduct style={styles.content} state={state} />
        )}
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
        actionButton: {
          marginRight: 8,
        },
        content: {
          // Extra bottom margin added for compliance card, this can be removed
          // if compliance card is not the bottommost card
          marginBottom: 96,
        },
      }),
    [],
  );

const WrappedAddEditProductContainer: React.FC<Props> = (props) => {
  return (
    <ComplianceDocumentsProvider>
      <AddEditProductContainer {...props} />
    </ComplianceDocumentsProvider>
  );
};

export default observer(WrappedAddEditProductContainer);
