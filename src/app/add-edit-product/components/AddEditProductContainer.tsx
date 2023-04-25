/*
 * AddEditProductContainer.tsx
 *
 * Created by Jonah Dlin on Fri Oct 08 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
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

type Props = {
  readonly initialData: AddEditProductInitialData;
};

const AddEditProductContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const {
    productCatalog: { product },
    currentMerchant: {
      standardWarehouseId,
      primaryCurrency,
      shippingSettings: storeCountries,
      isStoreMerchant,
      canManageShipping,
      isCnForFulfillment,
    },
    currentUser: {
      gating: { useCalculatedShipping, showVariationGroupingMUG },
    },
    platformConstants: {
      product: { prop65Chemicals },
      deciderKey,
    },
    policy,
  } = initialData;

  const disputes = policy?.productCategoryDispute?.disputes;
  const disputeId =
    disputes != null && disputes.length > 0 ? disputes[0].id : null;

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
    }),
  );

  useEffect(() => {
    if (state.hasChanged) {
      navigationStore.placeNavigationLock(
        i`You have unsaved changed. Are you sure want to leave?`,
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
    // navigationStore is not a dependency, adding it in will lead to infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hasChanged]);

  const backLink = "/products";

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
        onClick={async () => await state.submit()}
        minWidth
        popoverContent={state.saveButtonInactiveMessage}
        popoverPosition="top center"
        data-cy="button-save"
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
      <PageHeader
        title={state.name || i`Unsaved product listing`}
        actions={actions}
        className={css(styles.header)}
        relaxed
      />
      <PageGuide relaxed>
        <AddEditProduct style={styles.content} state={state} />
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

export default observer(AddEditProductContainer);