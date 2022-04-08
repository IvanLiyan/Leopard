import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

import Icon from "@merchant/component/core/Icon";
import { IllustrationName } from "@merchant/component/core/Illustration";
import Illustration from "@merchant/component/core/Illustration";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TierCardProps = BaseProps & {
  readonly headerImg: IllustrationName;
  readonly headerColor: string;
  readonly header: string;
  readonly listItems: ReadonlyArray<string>;
};

const TierCard: React.FC<TierCardProps> = (props: TierCardProps) => {
  const { greenSurface } = useTheme();
  const { headerImg, headerColor, header, listItems, style, className } = props;
  const styles = useStylesheet({ headerColor });

  return (
    <Layout.FlexColumn style={[styles.root, style, className]}>
      <Layout.FlexColumn style={styles.header} alignItems="center">
        <Illustration name={headerImg} alt="" />
        <Text style={styles.headerText} weight="bold">
          {header}
        </Text>
      </Layout.FlexColumn>
      <Layout.FlexColumn style={styles.items} alignItems="flex-start">
        {listItems.map((item) => (
          <Layout.FlexRow
            style={styles.item}
            alignItems="flex-start"
            key={item}
          >
            <Icon
              style={styles.itemIcon}
              name="checkCircle"
              color={greenSurface}
              size={20}
            />
            <Text style={styles.itemText}>{item}</Text>
          </Layout.FlexRow>
        ))}
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = ({ headerColor }: { readonly headerColor: string }) => {
  const { isSmallScreen } = useDeviceStore();
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        },
        header: {
          paddingTop: isSmallScreen ? 10 : 24,
          paddingBottom: isSmallScreen ? 10 : 32,
          backgroundColor: headerColor,
        },
        headerText: {
          fontSize: isSmallScreen ? 24 : 34,
          marginTop: 6,
        },
        items: {
          padding: 32,
          backgroundColor: surfaceLightest,
          flex: 1,
        },
        item: {
          ":not(:first-child)": {
            marginTop: 16,
          },
        },
        itemIcon: {
          minWidth: 20,
          marginTop: 2,
        },
        itemText: {
          fontSize: 16,
          marginLeft: 16,
        },
      }),
    [surfaceLightest, headerColor, isSmallScreen]
  );
};

export default observer(TierCard);
