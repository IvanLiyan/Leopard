/*
 * EuBoundDetails.tsx
 *
 * Created by Jonah Dlin on Wed Jun 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { Banner, Card, Layout, Link, Markdown, Text } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import {
  OrderDetailInitialData,
  PickedAddressType,
  PickedMerchantAddressType,
} from "@toolkit/orders/detail";
import { UserEntityType } from "@schema/types";

export type EuBoundDetailsProps = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

type ParsedEuData = {
  readonly customerName?: string | null;
  readonly customerAddress?: Omit<PickedAddressType, "name"> | null;
  readonly merchantName?: string | null;
  readonly merchantAddress?: PickedMerchantAddressType | null;
  readonly sellerEntityType?: UserEntityType | null;
  readonly vatPayerName?: string | null;
  readonly vatPayerAddress?: PickedMerchantAddressType | null;
  readonly ioss?: string | null;
  readonly merchantVatRegistrationNumber?: string | null;
  readonly isPlatformOwner?: boolean | null;
  readonly productHsCode?: string | null;
  readonly productDescription: string;
  readonly customerProductPrice?: string | null;
  readonly transportCosts?: string | null;
  readonly quantity: number;
  readonly weight?: string | null | undefined;
  readonly isUsed?: boolean | null;
  readonly imageLink?: string | null;
};

const UserEntityDisplay: {
  readonly [entityType in UserEntityType]: string;
} = {
  INDIVIDUAL: i`Individual Merchant`,
  COMPANY: i`Business Merchant`,
};

const NoData = "--";
const VatNoData = i`N/A`;
const NoWeightPrompt = i`Please weigh your item & enter with carrier`;

const EuBoundDetails: React.FC<EuBoundDetailsProps> = ({
  className,
  style,
  initialData,
}) => {
  const [legalExpanded, setLegalExpanded] = useState(false);
  const styles = useStylesheet({ legalExpanded });

  const isPcVat = initialData.fulfillment.order.requiresDeliveredDutyPaid;

  const noHsCodePrompt =
    i`Provide this product's ${isPcVat ? 10 : 6}-digit Customs HS Code ` +
    i`directly to shipping carrier offline to avoid customs delay or other issues.`;

  const {
    customerName,
    customerAddress,
    merchantName,
    merchantAddress,
    sellerEntityType,
    vatPayerName,
    vatPayerAddress,
    ioss,
    merchantVatRegistrationNumber,
    isPlatformOwner,
    productHsCode,
    productDescription,
    customerProductPrice,
    transportCosts,
    quantity,
    weight,
    isUsed,
    imageLink,
  } = useMemo((): ParsedEuData => {
    const authorityInvoiceAmount =
      initialData.fulfillment.order.tax?.euVat?.authorityInvoiceAmount?.display;
    const customerInvoiceAmount =
      initialData.fulfillment.order.tax?.euVat?.customerInvoiceAmount?.display;
    const authorityShippingPrice =
      initialData.fulfillment.order.tax?.euVat?.authorityShippingPrice?.display;
    const customerShippingPrice =
      initialData.fulfillment.order.tax?.euVat?.customerShippingPrice?.display;

    const shippingPrice =
      authorityShippingPrice == null && customerShippingPrice == null
        ? undefined
        : [authorityShippingPrice, customerShippingPrice]
            .filter((value) => value != null)
            .join(" / ");

    const invoiceAmount =
      authorityInvoiceAmount == null && customerInvoiceAmount == null
        ? undefined
        : [authorityInvoiceAmount, customerInvoiceAmount]
            .filter((value) => value != null)
            .join(" / ");

    const orderDestinationCountryCode =
      initialData.fulfillment.order.shippingDetails?.country?.code;
    const taxInfos = initialData.currentMerchant?.tax?.settings;

    const destinationTaxInfo =
      orderDestinationCountryCode != null && taxInfos != null
        ? taxInfos.find(
            ({ authority, status }) =>
              status == "ACTIVE" &&
              authority != null &&
              authority.country.code === orderDestinationCountryCode
          )
        : undefined;

    const merchantVatRegistrationNumber =
      destinationTaxInfo == null ? undefined : destinationTaxInfo.taxNumber;

    return {
      customerName: initialData.fulfillment.order.shippingDetails?.name,
      customerAddress:
        initialData.fulfillment.order.shippingDetails == null
          ? null
          : {
              streetAddress1:
                initialData.fulfillment.order.shippingDetails.streetAddress1,
              streetAddress2:
                initialData.fulfillment.order.shippingDetails.streetAddress2,
              city: initialData.fulfillment.order.shippingDetails.city,
              zipcode: initialData.fulfillment.order.shippingDetails.zipcode,
              state: initialData.fulfillment.order.shippingDetails.state,
              country:
                initialData.fulfillment.order.shippingDetails.country == null
                  ? null
                  : {
                      name:
                        initialData.fulfillment.order.shippingDetails.country
                          .name,
                      code:
                        initialData.fulfillment.order.shippingDetails.country
                          .code,
                    },
            },
      merchantName: initialData.currentUser.name,
      merchantAddress: initialData.currentUser.businessAddress,
      sellerEntityType: initialData.currentUser.entityType,
      vatPayerName: isPcVat
        ? initialData.currentUser.name
        : initialData.platformConstants?.wishEuVatPayerInfo?.address.name,
      vatPayerAddress: isPcVat
        ? initialData.currentUser.businessAddress
        : initialData.platformConstants?.wishEuVatPayerInfo?.address,
      ioss: initialData.platformConstants?.wishEuVatPayerInfo?.iossNumber,
      merchantVatRegistrationNumber,
      isPlatformOwner: initialData.fulfillment.order.tax?.isWishReseller,
      quantity: initialData.fulfillment.order.quantity,
      imageLink: initialData.fulfillment.order.product?.mainImage.wishUrl,
      productDescription: initialData.fulfillment.order.productName,
      transportCosts: shippingPrice,
      customerProductPrice: invoiceAmount,
      productHsCode: initialData.fulfillment.order.variation.customsHsCode,
      weight:
        initialData.fulfillment.order.variation.weight?.value == null
          ? null
          : `${initialData.fulfillment.order.variation.weight?.value} kg`,
      isUsed:
        initialData.fulfillment.order.product?.condition == null
          ? null
          : initialData.fulfillment.order.product?.condition !== "NEW",
    };
  }, [initialData, isPcVat]);

  const renderAddress = (
    name: string | null | undefined,
    address:
      | Omit<PickedAddressType, "name">
      | PickedMerchantAddressType
      | null
      | undefined
  ) => {
    if (address == null) {
      return NoData;
    }

    const {
      streetAddress1,
      streetAddress2,
      city,
      zipcode,
      state,
      country,
    } = address;

    const lastLine = [city, state, country?.code, zipcode]
      .filter((component) => component != null)
      .join(", ");

    return (
      <Layout.FlexColumn>
        <Text className={css(styles.text)}>{name}</Text>
        <Text className={css(styles.text)}>{streetAddress1}</Text>
        {streetAddress2 && (
          <Text className={css(styles.text)}>{streetAddress2}</Text>
        )}
        {lastLine !== "" && (
          <Text className={css(styles.text)}>{lastLine}</Text>
        )}
      </Layout.FlexColumn>
    );
  };

  const formatAddressForCopy = (
    name: string | null | undefined,
    address:
      | Omit<PickedAddressType, "name">
      | PickedMerchantAddressType
      | null
      | undefined
  ) => {
    if (address == null) {
      return NoData;
    }

    const {
      streetAddress1,
      streetAddress2,
      city,
      zipcode,
      state,
      country,
    } = address;

    const lastLine = [city, state, country?.code, zipcode]
      .filter((component) => component != null)
      .join(", ");

    return [name, streetAddress1, streetAddress2, lastLine]
      .filter((component) => component != null && component !== "")
      .join(", ");
  };

  const renderEntityType = (entity: ParsedEuData["sellerEntityType"]) =>
    entity == null ? NoData : UserEntityDisplay[entity];

  const renderOptionalBool = (bool: boolean | null | undefined) => {
    if (bool == null) {
      return NoData;
    }
    return bool ? i`Yes` : i`No`;
  };

  const costDescription =
    i`Prices presented are totals paid by customer (excluding tax) and are ` +
    i`inclusive of promotions and other adjustments. Amount paid to merchant by ` +
    i`Wish is not affected by price adjustments and may differ from order total` +
    i`presented here.`;

  return (
    <Layout.FlexColumn>
      {!isPcVat && (
        <Banner
          sentiment="warning"
          iconVerticalAlignment="top"
          contentAlignment="stretch"
          showTopBorder
          text={
            <Layout.FlexColumn className={css(styles.content)}>
              <Layout.FlexRow
                className={css(styles.legalUpper)}
                justifyContent="space-between"
              >
                <Text weight="semibold" className={css(styles.legalHeader)}>
                  Wish will suspend accounts if this information is found to be
                  used incorrectly.
                </Text>
                <Link
                  className={css(styles.legalExpandLink)}
                  onClick={() => setLegalExpanded(!legalExpanded)}
                >
                  {legalExpanded ? i`View Less` : i`View Details`}
                </Link>
              </Layout.FlexRow>
              {legalExpanded && (
                <>
                  <Markdown
                    className={css(styles.legalText)}
                    text={
                      i`In order to support timely delivery of items to European Union ` +
                      i`(EU) customers and general tax (VAT) compliance Wish has secured ` +
                      i`an Import One Stop Shop Number (the “Wish IOSS Number”). ` +
                      i`Wish may permit you to make limited use of the Wish IOSS Number ` +
                      i`subject to the following requirements:`
                    }
                  />
                  <Layout.FlexColumn className={css(styles.legalBullets)}>
                    <Markdown
                      className={css(styles.legalBullet)}
                      text={
                        i`- You must not use the Wish IOSS Number for any purpose except ` +
                        i`calculation and remittance of VAT (including customs declarations ` +
                        i`regarding VAT) for EU-bound consignments (from outside the EU) ` +
                        i`related to orders placed on Wish`
                      }
                    />
                    <Markdown
                      className={css(styles.legalBullet)}
                      text={
                        i`- You must not share the Wish IOSS Number except as necessary to ` +
                        i`use it for the limited purpose described above.`
                      }
                    />
                    <Markdown
                      className={css(styles.legalBullet)}
                      text={
                        i`- You must keep the Wish IOSS Number confidential, protect it from ` +
                        i`unauthorized access or use and, when sharing as permitted ` +
                        i`herein, share in a secure manner.`
                      }
                    />
                  </Layout.FlexColumn>
                  <Text className={css(styles.legalFooter)} weight="semibold">
                    If you do not comply with these requirements or otherwise
                    misuse the Wish IOSS Number, Wish may issue monetary
                    penalties or infractions or suspend your use of the Wish
                    IOSS Number of sales on Wish. Additionally, Wish reserves
                    the right to request and review records of your imports to
                    EU for relevant Wish orders.
                  </Text>
                </>
              )}
            </Layout.FlexColumn>
          }
        />
      )}
      <Card
        title={
          isPcVat
            ? i`EU-bound order information for customs declaration`
            : i`EU Bound H7 Order Information`
        }
        className={css(className, style)}
      >
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Customer Information`}
        >
          {renderAddress(customerName, customerAddress)}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Merchant Information`}
        >
          {renderAddress(merchantName, merchantAddress)}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Individual or Business (Merchant)`}
        >
          {renderEntityType(sellerEntityType)}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`VAT Payer Information`}
          copy={
            vatPayerAddress == null
              ? undefined
              : formatAddressForCopy(vatPayerName, vatPayerAddress)
          }
        >
          {renderAddress(vatPayerName, vatPayerAddress)}
        </SheetItem>
        {isPcVat ? (
          <SheetItem
            className={css(styles.sheetItem)}
            title={i`Merchant VAT Tax Number`}
            copy={merchantVatRegistrationNumber || undefined}
            popoverContent={
              i`If provided by merchant in Tax Settings, either merchant's VAT Tax Number for ` +
              i`this particular EU destination country or merchant's One Stop Shop (OSS) ` +
              i`number will be displayed here.`
            }
          >
            {merchantVatRegistrationNumber || VatNoData}
          </SheetItem>
        ) : (
          <SheetItem
            className={css(styles.sheetItem)}
            title={i`Wish IOSS Number`}
            copy={ioss || undefined}
          >
            {ioss || NoData}
          </SheetItem>
        )}
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Is Wish the owner or reseller of the goods?`}
        >
          {renderOptionalBool(isPlatformOwner)}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Product Customs HS Code`}
          copy={productHsCode || undefined}
          freezeTitleWidth
          popoverContent={() => (
            <Layout.FlexColumn className={css(styles.tooltipContent)}>
              <Markdown
                className={css(styles.hsCodeTooltipMarkdown, styles.text)}
                openLinksInNewTab
                text={
                  i`You may provide each product's Customs HS Code when uploading the product via ` +
                  i`Merchant Dashboard or API. If you did not provide a Customs HS Code when ` +
                  i`uploading this product, no information will be shown here. As such, please ` +
                  i`provide your Customs HS Code directly to the shipping carrier offline to avoid ` +
                  i`customs delay or other issues. [Learn more](${"http://www.wcoomd.org/en/topics/nomenclature/overview.aspx"})`
                }
              />
              <Markdown
                className={css(styles.hsCodeTooltipMarkdown, styles.text)}
                openLinksInNewTab
                text={
                  i`Note that merchants shipping orders from Mainland China may use the HS Code ` +
                  i`search tool in WishPost to search for relevant Customs HS Codes by entering ` +
                  i`the product name. [Learn more](${"https://www.wishpost.cn/home/#/hscode/hs-category-tree"})`
                }
              />
            </Layout.FlexColumn>
          )}
        >
          {productHsCode || noHsCodePrompt}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Item Description`}
          copy={productDescription || undefined}
        >
          {productDescription || NoData}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Total Product Price`}
          popoverContent={costDescription}
        >
          {customerProductPrice || NoData}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Total Shipping Price`}
          popoverContent={costDescription}
        >
          {transportCosts || NoData}
        </SheetItem>
        <SheetItem className={css(styles.sheetItem)} title={i`Quantity`}>
          {numeral(quantity).format("0,0").toString()}
        </SheetItem>
        <SheetItem className={css(styles.sheetItem)} title={i`Weight`}>
          {weight || NoWeightPrompt}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Used/Refurbished Goods?`}
        >
          {renderOptionalBool(isUsed)}
        </SheetItem>
        <SheetItem
          className={css(styles.sheetItem)}
          title={i`Link to Product Image`}
          copy={imageLink || undefined}
        >
          {imageLink || NoData}
        </SheetItem>
      </Card>
    </Layout.FlexColumn>
  );
};

export default observer(EuBoundDetails);

const useStylesheet = ({
  legalExpanded,
}: {
  readonly legalExpanded: boolean;
}) => {
  const { borderPrimary, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
        },
        legalUpper: {
          marginBottom: legalExpanded ? 16 : 0,
          marginTop: legalExpanded ? 5 : 4,
        },
        legalExpandLink: {
          marginLeft: 8,
          fontSize: 14,
          lineHeight: "20px",
        },
        legalIcon: {
          width: 16,
          height: 16,
          marginRight: 8,
        },
        legalHeader: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        legalText: {
          fontSize: 10,
          lineHeight: "12px",
          color: textDark,
          marginBottom: 8,
        },
        legalBullets: {
          marginLeft: 8,
        },
        legalBullet: {
          fontSize: 10,
          lineHeight: "12px",
          color: textDark,
          // scss manipulates this li element lineHeight, needs to be overriden
          ":nth-child(1n) > ul > li": {
            lineHeight: "12px",
          },
        },
        legalFooter: {
          fontSize: 10,
          lineHeight: "12px",
          color: textDark,
        },
        sheetItem: {
          padding: "13px 20px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        hsCodeTooltipMarkdown: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        tooltipContent: {
          maxWidth: 250,
          padding: 13,
        },
      }),
    [borderPrimary, textBlack, textDark, legalExpanded]
  );
};
