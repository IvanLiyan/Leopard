import React, { useState } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { Layout } from "@ContextLogic/lego";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { Button, Tooltip } from "@ContextLogic/atlas-ui";
import { useInfractionContext } from "@infractions/InfractionContext";
import RequestPaymentModal from "./RequestPaymentModal";

const RequestPaymentCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { actions, actionsTaken },
  } = useInfractionContext();
  const [modalOpen, setModalOpen] = useState(false);

  if (!actions.includes("REQUEST_PAYMENT_RELEASE")) {
    return null;
  }

  const hasAlreadyRequested = actionsTaken.includes("REQUEST_PAYMENT_RELEASE");
  const buttonStyle = {
    marginTop: 16,
  };

  return (
    <>
      <RequestPaymentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
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
          {hasAlreadyRequested ? (
            <Tooltip
              title={i`You have already requested payment.`}
              placement="bottom"
            >
              {/* excess div required since Mui disables tooltips wrapping disabled buttons */}
              <div>
                <Button style={buttonStyle} disabled>
                  Start a Request
                </Button>
              </div>
            </Tooltip>
          ) : (
            <Button
              style={buttonStyle}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Start a Request
            </Button>
          )}
        </Layout.FlexColumn>
      </Card>
    </>
  );
};

export default observer(RequestPaymentCard);
