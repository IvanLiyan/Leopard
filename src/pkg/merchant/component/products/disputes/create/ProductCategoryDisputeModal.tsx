import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { css } from "@toolkit/styling";
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout, Link, H6, Text } from "@ContextLogic/lego";

/* Merchant Components */
import { Icon } from "@merchant/component/core";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import NavigationStore from "@merchant/stores/NavigationStore";

type Props = {
  readonly fromEuCompliance?: boolean;
};

const ProductCategoryDisputeModalContent = (props: Props) => {
  const { fromEuCompliance } = props;
  const { isSmallScreen } = useDimenStore();

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
            href="/product-category-disputes"
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

    const navigationStore = NavigationStore.instance();

    this.setHeader({
      title: i`Dispute Product Category`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
    this.setOnDismiss(() => {
      this.close();
      navigationStore.navigate("/product");
    });
  }

  renderContent() {
    const { fromEuCompliance } = this.parentProps;

    return (
      <ProductCategoryDisputeModalContent fromEuCompliance={fromEuCompliance} />
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
