import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import PaymentSettings from "@plus/component/settings/payment-settings/PaymentSettings";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";

type Props = {
  readonly initialData: PaymentSettingsInitialData;
};

const PlusPaymentSettingsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Payment`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Payment`, href: "/plus/settings/payment" },
        ]}
      />
      <PageGuide>
        <PaymentSettings
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
    [],
  );

export default observer(PlusPaymentSettingsContainer);
