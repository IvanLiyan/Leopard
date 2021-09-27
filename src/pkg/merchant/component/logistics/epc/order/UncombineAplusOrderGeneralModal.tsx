import { StyleSheet } from "aphrodite";
import React, { useMemo, useState } from "react";

/* Lego Components */
import {
  Markdown,
  CheckboxField,
  Select,
  TextInput,
  Info,
} from "@ContextLogic/lego";
import { Option } from "@ContextLogic/lego";
import { Modal } from "@merchant/component/core/modal";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant API */
import { uncombineAplusOrder, UncombineReason } from "@merchant/api/epc";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useExperimentStore } from "@merchant/stores/ExperimentStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* SVGs */
import { useTheme } from "@merchant/stores/ThemeStore";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { useToastStore } from "@merchant/stores/ToastStore";

type UncombineAplusOrderGeneralModalProps = BaseProps & {
  readonly uncombineSuccess?: (
    msg: string,
    success: boolean
  ) => unknown | null | undefined;
  readonly orderId: string;
  readonly isValueOrder: boolean;
  readonly productId?: string;
  readonly onClose: () => unknown;
  readonly isUnityOrder: boolean;
  readonly estimatedWishPostShipping?: number;
  readonly shipping?: number;
  readonly currency: string;
};

const uncombineReasonList: Array<Option<UncombineReason>> = [
  {
    value: "OVERSEAS_INVENTORY",
    text: i`Shipping from outside of Mainland China`,
  },
  {
    value: "UNSUPPORTED",
    text: i`Unsupported product (COVID, sensitive, etc.)`,
  },
  {
    value: "OVERWEIGHT",
    text: i`Overweight`,
  },
  {
    value: "OVERSIZE",
    text: i`Oversized`,
  },
  {
    value: "OTHER_INELIGIBLE",
    text: i`Other (Please elaborate below)`,
  },
];

const UncombineAplusOrderGeneralModalContent: React.FC<UncombineAplusOrderGeneralModalProps> = (
  props: UncombineAplusOrderGeneralModalProps
) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState<
    UncombineReason | undefined
  >(undefined);
  const [comment, setComment] = useState<string | undefined>(undefined);
  const [checkRemoveProduct, setCheckRemoveProduct] = useState(false);
  const [checkConfirmedDelivery, setCheckConfirmedDelivery] = useState(false);
  const [showReasonErr, setShowReasonErr] = useState(false);
  const [showCommentErr, setShowCommentErr] = useState(false);
  const [showValueOrderErr, setShowValueOrderErr] = useState(false);
  const {
    uncombineSuccess,
    orderId,
    isValueOrder,
    productId,
    onClose,
    isUnityOrder,
    estimatedWishPostShipping,
    shipping,
    currency,
  } = props;

  let subProductId = "";
  if (productId?.length == 24) {
    subProductId = `...${productId.substring(19)}`;
  }

  const learnMore = `[${i`Learn more`}](${zendeskURL("360050224014")})`;

  let confirmedDeliveryText = null;
  if (isValueOrder) {
    confirmedDeliveryText =
      i`I will ship this order with a WishPost logistics channel that ` +
      i`provides delivery confirmation, as this order is subject to the ` +
      i`[Confirmed Delivery Policy](${"/policy/fulfillment#5.8"}).`;
  }
  if (selectedReason == "OVERSEAS_INVENTORY") {
    confirmedDeliveryText =
      i`I will ship this order with a [Confirmed Delivery Carrier](${"/documentation/confirmeddeliveryshippingcarriers"}). ` +
      i`Learn more about the [Confirmed Delivery Policy](${"/policy/fulfillment#5.8"}).`;
  }

  const onSubmit = async () => {
    let success = true;
    if (!selectedReason) {
      setShowReasonErr(true);
      success = false;
    }
    if (
      selectedReason == "OTHER_INELIGIBLE" &&
      (comment == undefined || comment?.length == 0)
    ) {
      setShowCommentErr(true);
      success = false;
    }
    if (
      (isValueOrder || selectedReason == "OVERSEAS_INVENTORY") &&
      !checkConfirmedDelivery
    ) {
      setShowValueOrderErr(true);
      success = false;
    }
    if (!success) {
      return;
    }

    let msg = i`You have successfully removed Order (${orderId}) from the Advanced Logistics Program.`;
    if (checkRemoveProduct) {
      msg = i`You have successfully removed Order (${orderId}) and Product (${productId}) from the Advanced Logistics Program.`;
    }

    try {
      setIsLoading(true);
      await uncombineAplusOrder({
        merchant_transaction_id: orderId,
        reason: selectedReason,
        message: comment,
        remove_product: checkRemoveProduct,
      }).call();
      setIsLoading(false);
    } catch (err) {
      msg = err.msg;
      setIsLoading(false);
      success = false;
    }

    if (uncombineSuccess) {
      uncombineSuccess(msg, success);
    } else {
      if (success) {
        toastStore.positive(msg);
      } else {
        toastStore.negative(msg);
      }
    }
    onClose();
  };

  const experimentStore = useExperimentStore();
  const allowRemovalOfPIDFromAPlus =
    experimentStore.bucketForUser("allow_remove_pid_aplus") == "show";

  const unityLearnMore = `[${i`Learn more`}](${zendeskURL("360054912394")})`;

  return (
    <>
      <div className={css(styles.root)}>
        {isUnityOrder ? (
          <div className={css(styles.text)}>
            <Markdown
              text={
                i`Upon removal of this order from the Advanced Logistics Program, you must ` +
                i`drop ship it directly to the customer. Note that the customer's shipping ` +
                i`address will be displayed after this order has been removed. Since this ` +
                i`order is bound for a destination country included in Wish’s unification ` +
                i`initiative, you will receive payments for First-Mile Shipping Cost, and be ` +
                i`reimbursed for an estimated WishPost Shipping after the order is fulfilled. ` +
                i`${unityLearnMore}.`
              }
              openLinksInNewTab
            />
          </div>
        ) : (
          <div className={css(styles.text)}>
            If you remove this order from the Advanced Logistics Program, you
            must drop ship it directly to the customer. The customer's shipping
            address will be displayed after this order has been removed.
          </div>
        )}
        <div className={css(styles.text)}>
          <div className={css(styles.textRow)}>
            <div className={css(styles.rowTitle)}>Order ID</div>
            <div>{orderId}</div>
            <Info
              className={css(styles.info)}
              text={() => (
                <div className={css(styles.infoText)}>
                  <Markdown
                    text={
                      i`Only orders that cannot be shipped via the Advanced Logistics Program for ` +
                      i`one of the qualified reasons can be removed. Order removal found to be based ` +
                      i`on non-qualified reasons may be penalized, and your merchant account may be ` +
                      i`suspended. ${learnMore}`
                    }
                    openLinksInNewTab
                  />
                </div>
              )}
              position="bottom center"
              sentiment="info"
            />
          </div>
          {isUnityOrder && (
            <>
              <div className={css(styles.textRow)}>
                <div className={css(styles.rowTitle)}>
                  First-Mile Shipping Price
                </div>
                <div>{formatCurrency(shipping || 0, currency)}</div>
              </div>
              <div className={css(styles.textRow)}>
                <div className={css(styles.rowTitle)}>
                  Est. WishPost Shipping
                </div>
                <div>
                  {formatCurrency(estimatedWishPostShipping || 0, currency)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={css(styles.rootGrey)}>
        <div className={css(styles.textTitle)}>
          Please complete the following:
        </div>
        <div className={css(styles.text)}>
          <p>Select the reason for removing this order</p>
          <div className={css(styles.inputText)}>
            <Select
              options={uncombineReasonList}
              placeholder={i`Please select a reason`}
              position="bottom center"
              minWidth={350}
              selectedValue={selectedReason || null}
              onSelected={(value: UncombineReason) => {
                setSelectedReason(value);
                setCheckConfirmedDelivery(false);
                setShowReasonErr(false);
              }}
            />
          </div>
          {showReasonErr && (
            <div className={css(styles.textWarning)}>
              Please select a reason.
            </div>
          )}
        </div>
        {confirmedDeliveryText != null && (
          <div className={css(styles.text)}>
            <CheckboxField
              checked={checkConfirmedDelivery}
              onChange={(checked) => {
                setCheckConfirmedDelivery(checked);
                setShowValueOrderErr(false);
              }}
            >
              <Markdown text={confirmedDeliveryText} openLinksInNewTab />
            </CheckboxField>
            {showValueOrderErr && (
              <div className={css(styles.checkboxWarning)}>
                Please check the checkbox to continue.
              </div>
            )}
          </div>
        )}
        <div className={css(styles.text)}>
          <p>Comment</p>
          <div className={css(styles.inputText)}>
            <TextInput
              placeholder={
                i`If you selected "Other" above or have additional comments about this removal, ` +
                i`please elaborate here.`
              }
              height={100}
              isTextArea
              onChange={(res) => {
                const text = res.text.trim();
                setComment(text);
                if (text.length > 0) {
                  setShowCommentErr(false);
                } else {
                }
              }}
            />
          </div>
          {showCommentErr && (
            <div className={css(styles.textWarning)}>
              This is a required field.
            </div>
          )}
        </div>
        {allowRemovalOfPIDFromAPlus && (
          <div className={css(styles.text)}>
            <CheckboxField
              checked={checkRemoveProduct}
              onChange={(checked) => {
                setCheckRemoveProduct(checked);
              }}
            >
              <Markdown
                text={i`I would also like to remove Product ID (${subProductId}) from the Advanced Logistics Program.`}
                openLinksInNewTab
              />
            </CheckboxField>
            {checkRemoveProduct && (
              <div className={css(styles.textCheckbox)}>
                <Markdown
                  text={
                    i`If you select this option, future orders for this product will not be included ` +
                    i`in the Advanced Logistics Program. Please note that Wish will audit your ` +
                    i`selection and add this product back into the Advanced Logistics Program ` +
                    i`if it was removed for non-qualified reasons. ${learnMore}`
                  }
                  openLinksInNewTab
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={css(styles.footer)}>
        <Button onClick={onClose}>Cancel</Button>
        <PrimaryButton onClick={onSubmit} isLoading={isLoading}>
          Remove order
        </PrimaryButton>
      </div>
    </>
  );
};

const useStylesheet = () => {
  const { borderPrimary, pageBackground, negativeDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px",
          alignItems: "stretch",
        },
        rootGrey: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px",
          backgroundColor: pageBackground,
        },
        text: {
          fontSize: 16,
          paddingLeft: 50,
          paddingRight: 50,
          paddingTop: 10,
          paddingBottom: 10,
        },
        textRow: {
          display: "flex",
          flexDirection: "row",
          marginBottom: "8px",
        },
        rowTitle: {
          width: "50%",
        },
        textId: {
          paddingLeft: 50,
        },
        textTitle: {
          fontSize: 18,
          paddingLeft: 50,
          paddingRight: 50,
          paddingBottom: 15,
          fontWeight: fonts.weightBold,
        },
        textCheckbox: {
          fontSize: 14,
          paddingLeft: 24,
        },
        textWarning: {
          fontSize: 14,
          color: negativeDark,
        },
        checkboxWarning: {
          fontSize: 14,
          color: negativeDark,
          paddingLeft: 25,
        },
        info: {
          marginLeft: 5,
          marginRight: 5,
          marginTop: 2,
        },
        inputText: {
          maxWidth: 400,
        },
        infoText: {
          fontSize: 12,
          padding: 8,
          maxWidth: 250,
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
      }),
    [borderPrimary, pageBackground, negativeDark]
  );
};

export default class UncombineAplusOrderGeneralModal extends Modal {
  constructor(props: Omit<UncombineAplusOrderGeneralModalProps, "onClose">) {
    super((onClose) => (
      <UncombineAplusOrderGeneralModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Remove the Order from Advanced Logistics Program`,
    });
    this.setWidthPercentage(50);
    this.setNoMaxHeight(true);
    this.setRenderFooter(() => null);
  }
}
