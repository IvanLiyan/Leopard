import React from "react";
import { observer } from "mobx-react";
import { Markdown } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ActionCard from "./actionCards/ActionCard";
import { Button } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const BrandDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: { disputeByDate },
  } = useInfraction(infractionId);

  return (
    <Card title={i`Fix This Issue`} style={[className, style]}>
      <div className={css(styles.column)}>
        <Markdown
          text={i`Please take **one of the following** actions by **${disputeByDate}**`}
        />
        <ActionCard
          title="Title Goes Here"
          ctaButtons={
            <>
              <Button
                onClick={() => {
                  alert("clicked");
                }}
              >
                CTA
              </Button>
            </>
          }
        >
          {"Body here."}
        </ActionCard>
        <ActionCard
          title="Title Goes Here"
          ctaButtons={
            <>
              <Button
                onClick={() => {
                  alert("clicked");
                }}
              >
                CTA
              </Button>
            </>
          }
        >
          {"Body here."}
        </ActionCard>
        <ActionCard
          title="Title Goes Here"
          ctaButtons={
            <>
              <Button
                onClick={() => {
                  alert("clicked");
                }}
              >
                CTA
              </Button>
            </>
          }
        >
          {"Body here."}
        </ActionCard>
      </div>
    </Card>
  );
};

export default observer(BrandDetailsCard);
