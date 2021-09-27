import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import IdentityPageEntityBox from "./IdentityPageEntityBox";
import CardHeader from "./CardHeader";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { EntityTypeName } from "@merchant/api/seller-profile-verification";

type IdentityPageChooseEntityTypeProps = BaseProps & {
  readonly entityType: EntityTypeName | null | undefined;
  readonly onEntityTypeChange: (entityType: EntityTypeName) => void;
  readonly onBack?: () => void;
  readonly hidePageDisplay?: boolean;
};

const IdentityPageChooseEntityType = (
  props: IdentityPageChooseEntityTypeProps
) => {
  const {
    className,
    style,
    entityType,
    onEntityTypeChange,
    onBack,
    hidePageDisplay,
  } = props;

  const styles = useStylesheet();
  return (
    <div className={css(styles.root, style, className)}>
      {hidePageDisplay ? (
        <CardHeader
          className={css(styles.header)}
          displayType={"back"}
          onClickBack={onBack}
        />
      ) : (
        <CardHeader
          className={css(styles.header)}
          displayType={"pages"}
          pageNumberDisplay={"1 / 2"}
        />
      )}
      <Text weight="bold" className={css(styles.title)}>
        Choose your account type
      </Text>
      <div className={css(styles.content)}>
        Choose an account type that best describes your store.
      </div>
      <IdentityPageEntityBox
        onClick={() => onEntityTypeChange("individual")}
        style={[styles.entityBox, styles.entityBox1]}
        title={i`I am an individual merchant`}
        text={i`My store is owned and operated by an unincorporated individual.`}
        img="manHoldingBox"
        selected={entityType == "individual"}
      />
      <IdentityPageEntityBox
        onClick={() => onEntityTypeChange("company")}
        style={[styles.entityBox, styles.entityBox2]}
        title={i`I am a business merchant`}
        text={i`My store is owned and operated by a registered company.`}
        img="blueHouse"
        selected={entityType == "company"}
      />
    </div>
  );
};

export default IdentityPageChooseEntityType;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        header: {
          marginTop: 24,
          color: palettes.greyScaleColors.DarkerGrey,
        },
        title: {
          fontSize: 24,
          lineHeight: "32px",
          color: palettes.textColors.Ink,
          textAlign: "center",
        },
        content: {
          marginTop: 16,
          color: palettes.textColors.DarkInk,
          textAlign: "center",
        },
        entityBox: {
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 524,
        },
        entityBox1: {
          marginTop: 40,
        },
        entityBox2: {
          marginTop: 20,
        },
      }),
    []
  );
};
