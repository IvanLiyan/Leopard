import React from "react";
import { observer } from "mobx-react";
import { Card as LegoCard, H6, H6Props, Layout } from "@ContextLogic/lego";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

type Props = Pick<BaseProps, "children" | "className" | "style"> & {
  readonly title: H6Props["children"];
  readonly ctaButtons?: React.ReactFragment;
};

const ActionCard: React.FC<Props> = ({
  children,
  className,
  style,
  title,
  ctaButtons,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const { textWhite } = useTheme();

  return (
    <LegoCard
      style={[styles.cardRoot, { boxShadow: "none" }, className, style]}
    >
      <H6 style={{ marginBottom: 16 }}>{title}</H6>
      {children}
      {ctaButtons && (
        <Layout.FlexColumn
          alignItems="flex-end"
          style={{
            ":nth-child(1n) > *": {
              marginTop: 16,
              ":visited": {
                color: textWhite,
              },
            },
          }}
        >
          {ctaButtons}
        </Layout.FlexColumn>
      )}
    </LegoCard>
  );
};

export default observer(ActionCard);
