/*
 * ConfirmationModal.tsx
 *
 * Created by Jonah Dlin on Wed Feb 10 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Lego Components */
import { PrimaryButton, Button, Spinner, Text } from "@ContextLogic/lego";

/* Merchant Components */
import { Illustration, Modal } from "@merchant/component/core";
import Separator from "@merchant/component/wps/create-shipping-label/Separator";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
  readonly onClose: () => unknown;
  readonly setHeader: (title: string) => unknown;
};

type Screen = "SUMMARY" | "LOADING" | "ERROR";

const ScreenNames: { [screen in Screen]: string } = {
  ERROR: i`Please try again`,
  SUMMARY: i`Buy shipping label`,
  LOADING: i`Generating shipping label`,
};

const ConfirmationContent: React.FC<Props> = ({
  className,
  style,
  state,
  onClose,
  setHeader,
}: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const [errorCount, setErrorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const screen: Screen = useMemo(() => {
    if (isLoading) {
      return "LOADING";
    } else if (errorCount > 0) {
      return "ERROR";
    }
    return "SUMMARY";
  }, [isLoading, errorCount]);

  useEffect(() => {
    setHeader(ScreenNames[screen]);
  }, [screen, setHeader]);

  const { id } = state.initialData.fulfillment.order;
  const abbreviatedOrderId = `...${id.slice(-4)}`;

  const totalPrice = formatCurrency(
    state.shippingState.estimatedTotal,
    state.shippingState.selectedShippingOption?.price.currencyCode,
  );
  const price = state.shippingState.selectedShippingOption?.price.display;

  // Case should never be reached
  // This component isn't rendered unless selectedShippingOption exists
  if (price == null) {
    return null;
  }

  const handleGenerateLabel = async () => {
    setIsLoading(true);
    const success = await state.onBuyShippingLabel();
    if (!success) {
      setErrorCount(errorCount + 1);
      setIsLoading(false);
      return;
    }

    onClose();
    setIsLoading(false);
  };

  const handleUseOtherProvider = () => {
    navigationStore.navigate(`/plus/orders/fulfill/${id}`);
  };

  const screenRenders: { [screen in Screen]: React.ReactNode } = {
    LOADING: (
      <div className={css(styles.loadingRoot, styles.root, className, style)}>
        <Spinner size={54} />
        <div className={css(styles.loadingInfo, styles.info)}>
          Hold tight. This may take a few seconds...
        </div>
      </div>
    ),
    ERROR: (
      <div className={css(styles.errorRoot, styles.root, className, style)}>
        <Illustration
          className={css(styles.errorIllustration)}
          name="yellowExclamation"
          alt=""
        />
        <div className={css(styles.errorInfo, styles.info)}>
          We had an issue generating the shipping label. You will not be charged
          as this transaction did not come through. Please try again to generate
          a shipping label or use a shipping carrier to fulfill this order.
        </div>
        <PrimaryButton
          className={css(styles.errorRetry)}
          onClick={handleGenerateLabel}
        >
          Generate shipping label
        </PrimaryButton>
        <Button
          className={css(styles.errorUseAnother)}
          onClick={handleUseOtherProvider}
        >
          Use another provider
        </Button>
      </div>
    ),
    SUMMARY: (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.summaryContent)}>
          <div className={css(styles.info)}>
            You are placing an order to buy 1 shipping label for Order{" "}
            {abbreviatedOrderId}. Once your order is placed, {price} will be
            deducted from your next payment disbursement, and your order will be
            automatically marked as shipped.
          </div>
          <div className={css(styles.summaryTable)}>
            <Text
              className={css(styles.lightText, styles.summaryRow)}
              weight="semibold"
            >
              Summary
            </Text>
            <Separator className={css(styles.summaryRow)} />
            <div className={css(styles.summaryTextRow)}>
              <Text className={css(styles.lightText)}>1 shipping label</Text>
              <Text className={css(styles.lightText)}>{price}</Text>
            </div>
            {state.shippingState.selectedAdditionalServicesDetails.map(
              (service) => (
                <div className={css(styles.summaryTextRow)}>
                  <Text className={css(styles.lightText)}>{service.name}</Text>
                  <Text className={css(styles.lightText)}>
                    {service.fee?.display}
                  </Text>
                </div>
              ),
            )}
            <Separator className={css(styles.summaryRow)} />
            <div className={css(styles.summaryTextRow)}>
              <Text className={css(styles.lightText)} weight="semibold">
                Total
              </Text>
              <Text className={css(styles.lightText)} weight="semibold">
                {totalPrice}
              </Text>
            </div>
          </div>
          <Illustration
            className={css(styles.summaryIllustration)}
            name="boxes"
            alt=""
          />
        </div>
        <div className={css(styles.summaryFooter)}>
          <Button className={css(styles.summaryButton)} onClick={onClose}>
            Cancel
          </Button>
          <PrimaryButton
            className={css(styles.summaryButton)}
            onClick={handleGenerateLabel}
          >
            Confirm
          </PrimaryButton>
        </div>
      </div>
    ),
  };

  return <>{screenRenders[screen]}</>;
};

const useStylesheet = () => {
  const { borderPrimary, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        info: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
          maxWidth: 508,
          textAlign: "center",
          overflow: "hidden",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
        lightText: {
          color: textDark,
          fontSize: 16,
          lineHeight: 1.5,
        },
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        summaryContent: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "44px 24px 0px 24px",
        },
        summaryTextRow: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        summaryRow: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        summaryTable: {
          display: "flex",
          flexDirection: "column",
          margin: "32px 0px",
          maxWidth: 342,
          width: "100%",
        },
        summaryIllustration: {
          height: 88,
        },
        summaryFooter: {
          width: "100%",
          boxSizing: "border-box",
          padding: 24,
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${borderPrimary}`,
        },
        summaryButton: {
          boxSizing: "border-box",
          height: 40,
          width: 100,
        },
        loadingRoot: {
          display: "flex",
          justifyContent: "center",
          height: 408,
        },
        loadingInfo: {
          marginTop: 32,
        },
        errorRoot: {
          padding: "48px 24px 64px 24px",
        },
        errorIllustration: {
          height: 56,
          width: 56,
        },
        errorInfo: {
          marginTop: 36,
        },
        errorRetry: {
          marginTop: 36,
        },
        errorUseAnother: {
          marginTop: 16,
        },
      }),
    [borderPrimary, textBlack, textDark],
  );
};

export default class ConfirmationModal extends Modal {
  readonly state: CreateShippingLabelState;

  constructor(state: CreateShippingLabelState) {
    super(() => null);
    this.state = state;
    this.setWidthPercentage(0.5);
    this.setHeader({ title: ScreenNames.SUMMARY });
  }

  renderContent() {
    return (
      <ConfirmationContent
        state={this.state}
        onClose={() => this.close()}
        setHeader={(title: string) => this.setHeader({ title })}
      />
    );
  }
}
