import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { css } from "@toolkit/styling";
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout, H6, Text } from "@ContextLogic/lego";

import Icon from "@merchant/component/core/Icon";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";
import { useNavigationStore } from "@stores/NavigationStore";

import Link from "@next-toolkit/Link";

type ContentProps = Props & {
  readonly onClose: () => unknown;
};

type Props = {
  readonly fromEuCompliance?: boolean;
};

const ProductCategoryDisputeModalContent = (props: ContentProps) => {
  const { fromEuCompliance, onClose } = props;
  const { isSmallScreen } = useDeviceStore();
  const navigationStore = useNavigationStore();

  const styles = useStylesheet();

  const continueButtonProps = {
    style: { flex: 1 },
    text: i`Done`,
    href: fromEuCompliance ? "/product/responsible-person" : "/product",
  };

  return (
    <Layout.FlexColumn>
      <Layout.FlexColumn alignItems="center" className={css(styles.content)}>
        <Icon name="checkCircle" size={20} className={css(styles.icon)} />
        <H6>Dispute successfully submitted!</H6>
        <Text>
          You can track the status of your dispute by clicking on "View Product
          Category Disputes" below.
        </Text>
      </Layout.FlexColumn>
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={continueButtonProps}
        extraFooterContent={
          <Link
            className={css(styles.viewAllButton)}
            onClick={() => {
              onClose();
              navigationStore.navigate("/product-category-disputes");
            }}
          >
            View Product Category Disputes
          </Link>
        }
      />
    </Layout.FlexColumn>
  );
};

export default class ProductCategoryDisputeModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`Dispute Product Category`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
  }

  renderContent() {
    const { fromEuCompliance } = this.parentProps;

    return (
      <ProductCategoryDisputeModalContent
        fromEuCompliance={fromEuCompliance}
        onClose={() => this.close()}
      />
    );
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "42px 24px",
        },
        viewAllButton: {
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
        icon: {
          marginBottom: 26,
        },
      }),
    []
  );
};
