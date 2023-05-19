import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { useNavigationStore } from "@core/stores/NavigationStore";
import ModalTitle from "@core/components/modal/ModalTitle";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { useTheme } from "@core/stores/ThemeStore";
import ModalFooter from "@core/components/modal/ModalFooter";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { PromoModalFields } from "@home/toolkit/product-boost";
import Image from "@core/components/Image";
import { merchFeUrl } from "@core/toolkit/router";

type PromoMessageModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
    readonly promoMessage: PromoModalFields | null | undefined;
  };

const PromoMessageModal: React.FC<PromoMessageModalProps> = ({
  open,
  onClose,
  promoMessage,
}) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const title = promoMessage?.title;
  const body = promoMessage?.body;
  const buttonText = promoMessage?.button_text;
  const buttonLink = promoMessage?.button_link;
  const image = promoMessage?.image;

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle
        title={title ?? i`Message from ProductBoost`}
        onClose={() => onClose()}
      />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          {title != null && (
            <Heading variant="h1" className={css(styles.text)}>
              {title}
            </Heading>
          )}
          {image != null && (
            <Image
              src={image}
              alt={title ?? ""}
              className={css(styles.contentBlock, styles.illustration)}
            />
          )}
          {body != null && (
            <Text className={css(styles.contentBlock, styles.text)}>
              {body}
            </Text>
          )}
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: buttonText ?? i`Continue`,
            onClick: async () => {
              if (buttonLink != null) {
                await navigationStore.navigate(
                  merchFeUrl("/product-boost/history/list?automated=0"),
                );
              }

              onClose();
            },
          }}
          cancel={
            buttonText == null
              ? undefined
              : {
                  text: i`Close`,
                  onClick: () => onClose(),
                }
          }
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default PromoMessageModal;

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        contentBlock: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        illustration: {
          maxWidth: 350,
        },
        text: {
          marginBottom: "12px",
          textAlign: "center",
        },
        productName: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        description: {
          fontSize: 16,
          lineHeight: "24px",
          maxWidth: 700,
        },
        footer: {
          flex: 1,
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
        },
        footerButton: {
          boxSizing: "border-box",
          height: 40,
        },
      }),
    [borderPrimary],
  );
};
