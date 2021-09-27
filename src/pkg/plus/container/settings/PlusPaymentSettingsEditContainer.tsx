import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useBoolQueryParam } from "@toolkit/url";

/* Merchant Plus Components */
import { Button, PrimaryButton } from "@ContextLogic/lego";
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import PaymentSettingsForm from "@plus/component/settings/payment-settings/PaymentSettingsForm";
import PaymentSettingsState from "@plus/model/PaymentSettingsState";
import PaymentConfirmationModal from "@plus/component/settings/payment-settings/modals/PaymentConfirmationModal";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";

type Props = {
  readonly initialData: PaymentSettingsInitialData;
};

const PlusPaymentSettingsEditContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const {
    payments: {
      currentMerchant: { currentProvider },
    },
    currentMerchant: { isStoreMerchant },
  } = initialData;

  const [isOnboarding] = useBoolQueryParam("onboarding");
  const [paymentState] = useState(
    new PaymentSettingsState({ initialData, isOnboarding })
  );
  const hasExistingData = !!currentProvider;

  const onSave = async () => {
    if (paymentState.paymentProvider === "PAYONEER") {
      new PaymentConfirmationModal({
        onClick: () => paymentState.submit(),
      }).render();
    } else {
      await paymentState.submit();
    }
  };

  const actions = (
    <>
      <Button href="/plus/settings/payment" minWidth>
        Cancel
      </Button>
      <PrimaryButton
        onClick={onSave}
        isDisabled={!paymentState.formValid}
        minWidth
      >
        Confirm
      </PrimaryButton>
    </>
  );

  const getTitle = () => {
    if (isStoreMerchant) {
      return i`Receive payments on PayPal`;
    }

    return hasExistingData
      ? i`Edit payment settings`
      : i`Set up payment provider`;
  };

  const getBreadcrumbs = () => {
    if (isStoreMerchant) {
      return [
        {
          name: i`Add PayPal`,
          href: "/plus/settings/payment/edit",
        },
      ];
    }

    return [
      { name: i`Payment`, href: "/plus/settings/payment" },
      {
        name: hasExistingData ? i`Edit` : i`Set up`,
        href: "/plus/settings/payment/edit",
      },
    ];
  };

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={getTitle()}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          ...getBreadcrumbs(),
        ]}
        actions={isStoreMerchant ? null : actions}
      />
      <PageGuide>
        <PaymentSettingsForm
          editState={paymentState}
          initialData={initialData}
          className={css(styles.content)}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 20,
        },
      }),
    []
  );

export default observer(PlusPaymentSettingsEditContainer);
