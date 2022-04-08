import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import {
  Accordion,
  Card,
  ChevronButton,
  Layout,
  LoadingIndicator,
  PrimaryButton,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { IS_VERY_SMALL_SCREEN } from "@toolkit/styling";

/* Model */
import ListLinksState from "@merchant/model/manual-linking/ListLinksState";

/* Component */
import CreateLinkModal from "@merchant/component/manual-linking/CreateLinkModal";
import LinkedStoresList from "@merchant/component/manual-linking/LinkedStoresList";

/**
 * Manual linking actions - create, remove and list linked stores
 * WARNING: this file is being used in legacy page account_settings.js, hence TSC will
 * be skipped. Pay extra attention to API changes etc. that may break the code and do
 * not rely on tsc for picking up errors.
 */
const ManualLinkingActionsCard: React.FC<BaseProps> = ({
  style,
  className,
}) => {
  const styles = useStylesheet();
  const [showList, setShowList] = useState<boolean>(false);

  // initialize state for rendering list
  const [listState] = useState(() => new ListLinksState());
  const { linkedStoreNum, isLoading, linkedStoreList, fetchLinkedStores } =
    listState;

  // render accordion header content
  const renderHeader = () => {
    return (
      <Layout.FlexRow
        style={styles.accordionHeader}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {linkedStoreNum > 0 && (
          <ChevronButton
            style={styles.chevronButton}
            onClick={() => {
              setShowList(!showList);
            }}
            direction={showList ? "down" : "right"}
            size={9}
          />
        )}
        <Layout.FlexColumn style={styles.textContainer}>
          <Text style={styles.title} weight="semibold">
            Linked Stores
          </Text>
          {linkedStoreNum === 0 ? (
            <Text style={styles.content}>
              If you manage multiple stores across different accounts, please
              link them all.
            </Text>
          ) : (
            <Text style={styles.content}>
              {ni18n(
                linkedStoreNum,
                "You have 1 store linked.",
                "You have {%1=Number of stores} stores linked."
              )}
              Remember: If you manage multiple stores across different accounts,
              please link them all.
            </Text>
          )}
        </Layout.FlexColumn>
        <PrimaryButton
          style={styles.button}
          onClick={() => {
            new CreateLinkModal({
              refetchLinkedStores: fetchLinkedStores,
            }).render();
          }}
        >
          Link Stores
        </PrimaryButton>
      </Layout.FlexRow>
    );
  };

  return (
    <LoadingIndicator loadingComplete={!isLoading}>
      <Card style={[styles.root, className, style]}>
        <Accordion
          header={renderHeader}
          isOpen={showList}
          backgroundColor="transparent"
          headerPadding="0px 0px"
          hideChevron
          hideLines
        >
          {linkedStoreNum > 0 && (
            <LinkedStoresList
              style={styles.storeList}
              linkedStoreList={linkedStoreList}
              refetchLinkedStores={fetchLinkedStores}
            />
          )}
        </Accordion>
      </Card>
    </LoadingIndicator>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        textContainer: {
          gap: 4,
          flexGrow: 1,
          marginRight: 20,
        },
        accordionHeader: {
          flexGrow: 1,
          [`@media ${IS_VERY_SMALL_SCREEN}`]: {
            flexWrap: "wrap",
          },
        },
        title: {
          fontSize: 16,
          color: textBlack,
        },
        content: {
          fontSize: 14,
          color: textDark,
        },
        chevronButton: {
          marginRight: 4,
        },
        button: {
          borderRadius: 100,
          height: 40,
        },
        storeList: {
          marginTop: 20,
        },
      }),
    [textBlack, textDark]
  );
};

export default observer(ManualLinkingActionsCard);
