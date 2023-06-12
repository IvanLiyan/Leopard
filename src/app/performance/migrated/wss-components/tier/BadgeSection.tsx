import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Illustration from "@core/components/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import {
  PickedMerchantWssDetails,
  useTierThemes,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const BadgeSection: React.FC<Props> = ({ className, style, wssDetails }) => {
  const level = wssDetails?.level;
  const tierThemes = useTierThemes();
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]} alignItems="center">
      <Illustration
        name={level ? tierThemes(level).icon : "wssUnratedBadge"}
        alt={level ? tierThemes(level).icon : "wssUnratedBadge"}
        style={styles.badgeBig}
      />
      <Text style={styles.levelTitle} weight="bold">
        {level ? tierThemes(level).title : ci18n("Name of WSS tier", "Unrated")}
      </Text>
    </Layout.FlexColumn>
  );
};

export default observer(BadgeSection);
const useStylesheet = () => {
  const { surfaceDarkest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        levelTitle: {
          fontSize: 20,
          lineHeight: "24px",
          color: surfaceDarkest,
          textAlign: "center",
        },
        badgeBig: {
          height: 72,
          width: 72,
          marginBottom: 8,
        },
      }),
    [surfaceDarkest],
  );
};
