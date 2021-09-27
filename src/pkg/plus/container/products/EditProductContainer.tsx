/*
 *
 * EditProductContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { ci18n } from "@legacy/core/i18n";
import {
  ViewButton,
  OptionsButton,
  OptionsButtonProps,
  LoadingIndicator,
} from "@ContextLogic/lego";
import { ConfirmationModal } from "@merchant/component/core/modal";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import { wishURL } from "@toolkit/url";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import * as icons from "@assets/icons";

import EditProduct from "@plus/component/products/edit-product/EditProduct";
import ProductEditState from "@plus/model/ProductEditState";

import { useNavigationStore } from "@merchant/stores/NavigationStore";
import { ProductEditInitialData } from "@toolkit/product-edit";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";

type Props = {
  readonly initialData: ProductEditInitialData;
};

const EditProductContainer: React.FC<Props> = ({ initialData }: Props) => {
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
    },
    platformConstants: { wishExpressCountries, countriesWeShipTo },
    policy,
  } = initialData;

  const { decision: showV2, isLoading: isLoadingShowV2 } = useDeciderKey(
    "manual_product_add_v2"
  );

  const disputes = policy?.productCategoryDispute?.disputes;
  const disputeId =
    disputes != null && disputes.length > 0 ? disputes[0].id : null;

  const [editState] = useState<ProductEditState>(
    new ProductEditState({
      standardWarehouseId,
      primaryCurrency,
      storeCountries,
      wishExpressCountries,
      initialState: { ...product },
      isStoreMerchant,
      canManageShipping,
      countriesWeShipTo,
      disputeId,
    })
  );

  useEffect(() => {
    if (editState.hasChanges) {
      navigationStore.placeNavigationLock(
        i`You have unsaved changed. Are you sure want to leave?`
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [navigationStore, editState.hasChanges]);

  if (product == null) {
    return null;
  }

  const hiddenOptions: OptionsButtonProps["options"] = [
    {
      title: ci18n("VERB", "Duplicate"),
      onClick: () =>
        navigationStore.navigate(
          `/plus/products/create?source=${editState.id}`
        ),
      icon: icons.copyImage,
    },
    {
      title: ci18n("DELETE", "Delete"),
      onClick: async () => {
        new ConfirmationModal(
          i`Are you sure you would like to delete this product? ` +
            i`This action cannot be reversed.`
        )
          .setHeader({ title: i`Confirmation` })
          .setCancel(i`Cancel`)
          .setAction(i`Yes, delete`, async () => {
            await editState.delete();
          })
          .render();
      },
      icon: icons.deleted,
    },
  ];

  const actions = (
    <>
      {editState.isViewableOnWish && (
        <ViewButton
          style={styles.actionButton}
          href={wishURL(`/c/${editState.id}`)}
          openInNewTab
        />
      )}
      {hiddenOptions && (
        <OptionsButton
          style={styles.actionButton}
          options={hiddenOptions}
          popoverPosition="bottom center"
          type="RECTANGULAR"
        />
      )}
      <Button style={styles.actionButton} href="/plus/products/list">
        Discard
      </Button>
      <PrimaryButton
        style={styles.actionButton}
        onClick={async () => await editState.submit()}
        minWidth
        popoverContent={editState.saveButtonInactiveMessage}
        popoverPosition="top center"
      >
        Save
      </PrimaryButton>
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={editState.name || ""}
        breadcrumbs={[
          { name: i`Products`, href: "/plus/products/list" },
          { name: i`Edit product`, href: window.location.href },
        ]}
        actions={actions}
        className={css(styles.header)}
        relaxed={showV2 || false}
      />
      <PageGuide relaxed={showV2 || false}>
        {isLoadingShowV2 ? (
          <LoadingIndicator />
        ) : (
          <EditProduct editState={editState} />
        )}
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          paddingTop: 25,
        },
        section: {
          margin: "12px 0px",
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
        actionButton: {
          marginRight: 8,
        },
      }),
    []
  );

export default observer(EditProductContainer);
