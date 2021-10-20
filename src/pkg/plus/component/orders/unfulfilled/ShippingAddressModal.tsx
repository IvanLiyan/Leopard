import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  Link,
  Text,
  Layout,
  PrimaryButton,
  HorizontalField,
} from "@ContextLogic/lego";
import { ShippingAddress, Modal } from "@merchant/component/core";
import {
  PickedShippingDetails,
  AddressVerificationLabels,
} from "@toolkit/orders/unfulfilled-orders";
import { requestAddressVerification } from "@merchant/api/transactions";

import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";

import { css } from "@toolkit/styling";

const TitleWidth = 200;

export type ShippingAddressModalProps = {
  readonly orderId: string;
  readonly onClose: () => unknown;
  readonly shippingDetails: PickedShippingDetails;
  readonly canEditShippingAddress?: boolean;
  readonly canRequestAddressVerification?: boolean;
  readonly showAplusShippingAddressTooltip: boolean;
};

const ShippingAddressModalContent: React.FC<ShippingAddressModalProps> =
  observer(
    ({
      orderId,
      onClose,
      shippingDetails,
      canEditShippingAddress,
      canRequestAddressVerification,
      showAplusShippingAddressTooltip,
    }: ShippingAddressModalProps) => {
      const styles = useStylesheet();
      const toastStore = useToastStore();
      const navigationStore = useNavigationStore();
      const {
        name,
        city,
        state,
        zipcode,
        country,
        phoneNumber,
        neighborhood,
        streetAddress1,
        streetAddress2,
        verificationState,
      } = shippingDetails;
      const shippingAddressTooltip = showAplusShippingAddressTooltip
        ? i`You can find the full warehouse address in WishPost.`
        : null;
      return (
        <Layout.FlexColumn alignItems="stretch">
          <Layout.FlexColumn
            className={css(styles.content)}
            alignItems="stretch"
          >
            <Layout.FlexColumn
              className={css(styles.form)}
              alignItems="stretch"
            >
              <Layout.FlexRow className={css(styles.row)}>
                <HorizontalField
                  title={i`Name`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                >
                  <Text>{name}</Text>
                </HorizontalField>
              </Layout.FlexRow>
              <Layout.FlexRow className={css(styles.row)}>
                <HorizontalField
                  title={i`Street Address 1`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={
                    !streetAddress1 ? shippingAddressTooltip : null
                  }
                >
                  <Text>{streetAddress1}</Text>
                </HorizontalField>
              </Layout.FlexRow>
              {streetAddress2 && (
                <Layout.FlexRow className={css(styles.row)}>
                  <HorizontalField
                    title={i`Street Address 2`}
                    titleWidth={TitleWidth}
                    titleAlign="start"
                    className={css(styles.item)}
                  >
                    <Text>{streetAddress2}</Text>
                  </HorizontalField>
                </Layout.FlexRow>
              )}
              <Layout.GridRow
                className={css(styles.row)}
                templateColumns="1fr 1fr"
              >
                <HorizontalField
                  title={i`City`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={!city ? shippingAddressTooltip : null}
                >
                  <Text>{city}</Text>
                </HorizontalField>
                <HorizontalField
                  title={i`State`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={!state ? shippingAddressTooltip : null}
                >
                  <Text>{state}</Text>
                </HorizontalField>
              </Layout.GridRow>
              <Layout.GridRow
                className={css(styles.row)}
                templateColumns="1fr 1fr"
              >
                <HorizontalField
                  title={i`Zip`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={!zipcode ? shippingAddressTooltip : null}
                >
                  <Text>{zipcode}</Text>
                </HorizontalField>
                <HorizontalField
                  title={i`Country`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                >
                  <Text>{country.name}</Text>
                </HorizontalField>
              </Layout.GridRow>
              <Layout.FlexRow className={css(styles.row)}>
                <HorizontalField
                  title={i`Phone number`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={!phoneNumber ? shippingAddressTooltip : null}
                >
                  <Text>{phoneNumber}</Text>
                </HorizontalField>
              </Layout.FlexRow>
              {neighborhood != null && (
                <Layout.FlexRow className={css(styles.row)}>
                  <HorizontalField
                    title={i`Neighborhood`}
                    titleWidth={TitleWidth}
                    titleAlign="start"
                    className={css(styles.item)}
                  >
                    <Text>{neighborhood}</Text>
                  </HorizontalField>
                </Layout.FlexRow>
              )}
              <Layout.FlexRow className={css(styles.row)}>
                <HorizontalField
                  title={i`Copy address`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                  popoverContent={shippingAddressTooltip}
                >
                  <ShippingAddress
                    shippingDetails={{
                      city,
                      state,
                      zipcode,
                      neighborhood,
                      country: country.name,
                      country_code: country.code,
                      street_address1: streetAddress1,
                      street_address2: streetAddress2,
                    }}
                  />
                </HorizontalField>
              </Layout.FlexRow>
              <Layout.FlexRow justifyContent="space-between">
                <HorizontalField
                  title={i`Address status`}
                  titleWidth={TitleWidth}
                  titleAlign="start"
                  className={css(styles.item)}
                >
                  <Text>{AddressVerificationLabels[verificationState]}</Text>
                </HorizontalField>

                {canRequestAddressVerification && (
                  <Link
                    onClick={async () => {
                      await requestAddressVerification({
                        mtid: orderId,
                      }).call();
                      onClose();
                      toastStore.info(
                        i`Address verification has been requested`,
                        { deferred: true },
                      );
                      navigationStore.reload();
                    }}
                    className={css(styles.item)}
                  >
                    Request Verification
                  </Link>
                )}
              </Layout.FlexRow>
            </Layout.FlexColumn>
          </Layout.FlexColumn>
          <Layout.FlexRow
            className={css(styles.footer)}
            justifyContent="flex-end"
          >
            {canEditShippingAddress && (
              <Link
                onClick={async () => onClose()}
                href={`/plus/orders/edit-address/${orderId}`}
              >
                Edit shipping address
              </Link>
            )}
            <PrimaryButton
              onClick={async () => onClose()}
              className={css(styles.closeButton)}
            >
              Close
            </PrimaryButton>
          </Layout.FlexRow>
        </Layout.FlexColumn>
      );
    },
  );

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 25,
        },
        form: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        row: {
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
          ":nth-child(1n) > div": {
            ":not(:last-child)": {
              borderRight: `1px solid ${borderPrimary}`,
            },
          },
        },
        item: {
          padding: "13px 10px",
          maxWidth: "100%",
        },
        closeButton: {
          marginLeft: 20,
        },
        footer: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
      }),
    [borderPrimary],
  );
};

export default class ShippingAddressModal extends Modal {
  constructor(props: Omit<ShippingAddressModalProps, "onClose">) {
    super((onClose) => (
      <ShippingAddressModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Ship to`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.55);
  }
}
