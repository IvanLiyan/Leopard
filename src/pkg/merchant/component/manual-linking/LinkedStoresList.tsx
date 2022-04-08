import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { Button, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { css, IS_VERY_SMALL_SCREEN } from "@toolkit/styling";
import { LinkedStoreListData } from "@toolkit/manual-linking/list-links";

/* Component */
import DeleteLinkModal from "@merchant/component/manual-linking/DeleteLinkModal";

import NextImage from "next/image";

type InitialProps = BaseProps & {
  readonly linkedStoreList: ReadonlyArray<LinkedStoreListData>;
  readonly refetchLinkedStores: () => Promise<void>;
};

/**
 * Manual linking stores list - display all manually linked stores in a list
 */
const LinkedStoresList: React.FC<InitialProps> = ({
  style,
  className,
  linkedStoreList,
  refetchLinkedStores,
}) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]}>
      {linkedStoreList.map((store) => (
        <Layout.FlexRow
          key={store.id}
          style={[styles.storeItem, styles.itemRow]}
          justifyContent="space-between"
          alignItems="center"
        >
          <Layout.FlexRow style={styles.itemRow}>
            <div>
              <NextImage
                className={css(styles.displayPicture)}
                src={store.displayPictureUrl}
                alt={i`Merchant's display picture`}
                draggable={false}
              />
            </div>
            <Layout.FlexColumn>
              <Text style={styles.title} weight="semibold">
                {store.displayName}
              </Text>
              <Text style={styles.subTitle}>{store.email}</Text>
            </Layout.FlexColumn>
          </Layout.FlexRow>
          <Button
            style={styles.button}
            onClick={() => {
              new DeleteLinkModal({
                merchant: store.email,
                displayName: store.displayName,
                refetchLinkedStores,
              }).render();
            }}
          >
            <Text weight="semibold">Remove</Text>
          </Button>
        </Layout.FlexRow>
      ))}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, secondaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        storeItem: {
          marginTop: 20,
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        title: {
          fontSize: 16,
          color: textBlack,
        },
        subTitle: {
          fontSize: 16,
          color: textDark,
        },
        displayPicture: {
          width: 40,
          height: 40,
          borderRadius: "50%",
        },
        button: {
          borderRadius: 100,
          color: secondaryDark,
          height: 40,
        },
        itemRow: {
          [`@media ${IS_VERY_SMALL_SCREEN}`]: {
            flexWrap: "wrap",
          },
          gap: 8,
        },
      }),
    [textBlack, textDark, secondaryDark]
  );
};

export default observer(LinkedStoresList);
