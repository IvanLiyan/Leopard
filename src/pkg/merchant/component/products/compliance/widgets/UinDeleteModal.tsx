import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { useQuery } from "@apollo/client";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout, Banner, Markdown, Text, H6, LoadingIndicator } from "@ContextLogic/lego";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Model */
import FranceEprState from "@merchant/model/products/FranceEprState";
import {
  ProductCategoryLabel,
  LINK_COUNT_QUERY,
  LinkCountRequestData,
  LinkCountResponseData,
} from "@toolkit/products/france-epr";

import Link from "@next-toolkit/Link";

export type Props = {
  readonly state: FranceEprState;
};

export type ContentProps = {
  readonly onClose: () => unknown;
  readonly state: FranceEprState;
};

const UinDeleteModalContent = (props: ContentProps) => {
  const { isSmallScreen } = useDeviceStore();
  const { onClose, state } = props;

  const styles = useStylesheet();

  const sendButtonProps = {
    style: { flex: 1 },
    text: i`Submit`,
    isLoading: false,
    onClick: async () => {
      await state.delete();
      onClose();
    },
  };

  const { data, loading } = useQuery<
    LinkCountResponseData,
    LinkCountRequestData
  >(LINK_COUNT_QUERY, {
    variables: {
      ...(state.category ? { franceUinCategories: [state.category] } : {}),
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (data == null) {
    return null;
  }

  const productCount = data.policy?.productCompliance?.linkCount || 0;

  return (
    <Layout.FlexColumn>
      <Layout.FlexColumn style={styles.content}>
        <Banner
          sentiment="warning"
          contentAlignment="left"
          text={
            <Markdown
              text={
                i`This will impact **${productCount}** product(s). All of the products associated ` +
                i`will have their compliant status updated to be "UIN not linked"`
              }
            />
          }
        />
        <Text weight="semibold" style={[styles.row, styles.title, styles.top]}>
          Unique Identification Number (UIN)
        </Text>
        <H6 style={styles.row}>{state.uniqueIdentificationNumber}</H6>
        <Text weight="semibold" style={[styles.row, styles.title]}>
          Producer Responsibility Organizations (PRO)
        </Text>
        <H6 style={styles.row}>{state.productResponsibilityOrganization}</H6>
        <Text weight="semibold" style={[styles.row, styles.title]}>
          Category
        </Text>
        {state.category && (
          <H6 style={styles.row}>{ProductCategoryLabel[state.category]}</H6>
        )}
      </Layout.FlexColumn>
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
        extraFooterContent={
          <Link style={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Link>
        }
      />
    </Layout.FlexColumn>
  );
};

export default class UinDeleteModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`Remove EPR registration number`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
  }

  renderContent() {
    return (
      <UinDeleteModalContent
        onClose={() => this.close()}
        state={this.parentProps.state}
      />
    );
  }
}

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        cancelButton: {
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
        row: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        title: {
          color: textDark,
        },
        top: {
          marginTop: 16,
        },
      }),
    [textDark]
  );
};
