import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { Layout } from "@ContextLogic/lego";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { Button } from "@ContextLogic/atlas-ui";
import { InfractionContext } from "@infractions/InfractionContext";

const RequestPaymentCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { actions },
  } = useContext(InfractionContext);

  if (!actions.includes("REQUEST_PAYMENT_RELEASE")) {
    return null;
  }

  return (
    <Card
      title={i`Request Payment Release For Your Account`}
      style={[className, style]}
    >
      <Markdown
        style={styles.cardMargin}
        text={i`Wish has suspended payment for your account. To request a payment release and resume your normal payment schedule:`}
      />
      <Markdown
        style={styles.cardMargin}
        text={`* ${[
          i`Upload a photo ID that matches your payment information.`,
          i`Upload any agreement signed with Wish.`,
        ].join("\n\n* ")}`}
      />
      <Layout.FlexColumn alignItems="flex-end">
        <Button
          style={{
            marginTop: 16,
          }}
          onClick={() => {
            alert("payment request clicked"); // TODO: https://jira.wish.site/browse/MAL-258
          }}
        >
          Start a Request
        </Button>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(RequestPaymentCard);
