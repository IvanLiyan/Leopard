/*
 * CreateShippingLabelContainer.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Button, PrimaryButton } from "@ContextLogic/lego";

/* Merchant Components */
import CreateShippingLabel from "@merchant/component/wps/create-shipping-label/CreateShippingLabel";
import ConfirmationModal from "@merchant/component/wps/create-shipping-label/confirmation-modals/ConfirmationModal";

/* Merchant Plus Components */
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Toolkit */
import { CreateShippingLabelInitialData } from "@toolkit/wps/create-shipping-label";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useNavigationStore } from "@merchant/stores/NavigationStore";

type Props = {
  readonly initialData: CreateShippingLabelInitialData;
};

const CreateShippingLabelContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state] = useState<CreateShippingLabelState>(
    new CreateShippingLabelState({ initialData })
  );

  const {
    canBuyShippingLabel,
    initialData: {
      fulfillment: {
        order: { id, canModifyTrackingInfo },
      },
    },
    isEdit,
  } = state;

  const title = isEdit
    ? i`Edit shipping label`
    : i`Create Wish Parcel shipping label`;

  const handleClickBuy = async () => {
    if (!isEdit) {
      new ConfirmationModal(state).render();
      return;
    }

    setIsSubmitting(true);
    const success = await state.onBuyShippingLabel();
    if (!success) {
      setIsSubmitting(false);
      return;
    }
  };

  const handleUseOtherProvider = () => {
    navigationStore.navigate(`/plus/orders/fulfill/${id}`);
  };

  return (
    <div className={css(styles.root)}>
      <PlusWelcomeHeader
        title={title}
        breadcrumbs={[
          { name: i`Unfulfilled Orders`, href: "/transactions/action" },
          { name: i`Fulfill order(s)`, href: `/plus/orders/fulfill/${id}` },
          { name: title, href: window.location.href },
        ]}
        actions={
          <div className={css(styles.actions)}>
            {isEdit && (
              <Button
                className={css(styles.button)}
                onClick={() => navigationStore.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            {(!isEdit || canModifyTrackingInfo) && (
              <Button
                className={css(styles.button)}
                onClick={handleUseOtherProvider}
              >
                Use shipping provider
              </Button>
            )}
            <PrimaryButton
              className={css(styles.button)}
              onClick={handleClickBuy}
              isDisabled={!canBuyShippingLabel}
              isLoading={isSubmitting}
            >
              {isEdit ? i`Save` : i`Buy shipping label`}
            </PrimaryButton>
          </div>
        }
      />
      <PageGuide>
        <CreateShippingLabel className={css(styles.content)} state={state} />
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        actions: {
          display: "flex",
        },
        button: {
          height: 40,
          boxSizing: "border-box",
          ":not(:last-child)": {
            marginRight: 20,
          },
        },
        content: {
          margin: "20px 0",
        },
      }),
    []
  );
};

export default observer(CreateShippingLabelContainer);
