import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { InfractionContext } from "@infractions/InfractionContext";

const FixesCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { disputeDeadline, actions },
  } = useContext(InfractionContext);

  return (
    <Card title={i`Fix This Issue`} style={[className, style]}>
      <div className={css(styles.column)}>
        <Markdown
          text={i`Please take **one of the following** actions by **${disputeDeadline}**`}
        />
        {actions}
      </div>
    </Card>
  );
};

export default observer(FixesCard);
