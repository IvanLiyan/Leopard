import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { Layout } from "@ContextLogic/lego";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import { Button } from "@ContextLogic/atlas-ui";

const RequestPaymentCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();

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
          onClick={() => {
            alert("payment request clicked"); // TODO
          }}
        >
          Start a Request
        </Button>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(RequestPaymentCard);
