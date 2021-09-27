import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type BrandedProductsContractProps = BaseProps;

const BrandedProductsContract = ({ style }: BrandedProductsContractProps) => {
  const styles = useStylesheet();

  const termsOfServiceLink = `[http://merchant.wish.com/terms-of-service](http://merchant.wish.com/terms-of-service)`;
  const contractPart1 =
    i`ContextLogic Inc. dba Wish (“Wish”) has a strict policy against ` +
    i`the listing or sale of products that violate a third-party’s copyright, ` +
    i`trademark, logos, images, or other Intellectual Property or proprietary ` +
    i`rights (collectively, “Intellectual Property Rights”). The listing or ` +
    i`sale of items or materials that include or incorporate, without ` +
    i`permission, such Intellectual Property rights may, among other things, ` +
    i`result in the deletion or modification of your listings, the suspension ` +
    i`of your Merchant account, and/or the discontinuation of your selling ` +
    i`privileges.`;

  const contractPart2 =
    i`You agree to be bound by the Merchant Terms of ` +
    i`Service and Agreement (available at ${termsOfServiceLink} and any Wish ` +
    i`policies referenced therein or as otherwise communicated to you by Wish. ` +
    i`You further represent and warrant that:`;

  const contractPart3 =
    i`(a) you have ` +
    i`obtained all necessary rights, permissions, and licenses from all ` +
    i`owners of Intellectual Property Rights in or related to the products or ` +
    i`branding assets that you list on the Wish platform (the “Products”) ` +
    i`such that you and/or Wish may redistribute, offer for sale, sell, ` +
    i`resell, market, advertise or otherwise transfer the Products to any ` +
    i`person or entity worldwide through any means;`;

  const contractPart4 =
    i`(b) the ` +
    i`Products and their use do not and will not infringe or otherwise violate ` +
    i`any Intellectual Property Right of any third party;`;

  const contractPart5 =
    i`(c) the ` +
    i`Products and their sale, resale, advertising, or marketing thereof do ` +
    i`not and will not violate any other applicable law or regulation in the ` +
    i`country or countries in which the Products are offered, sold, resold, ` +
    i`advertised, or marketed; and`;

  const contractPart6 =
    i`(d) you are in compliance with ` +
    i`all applicable laws and regulations related to the sale, resale, ` +
    i`advertising, and marketing of all Products.`;

  const contractPart7 =
    i`Upon accepting ` +
    i`and agreeing to be bound by the terms of this Branded Product ` +
    i`Declaration, you may be permitted, in Wish’s sole discretion, to offer ` +
    i`for sale, sell, resell, market, advertise or otherwise transfer the ` +
    i`Products.  Furthermore, Wish, in its sole discretion, reserves all of ` +
    i`its rights and remedies to remove or modify any Product listing or ` +
    i`content provided by you if Wish deems such Product listing or content ` +
    i`to be prohibited for sale, in violation of any law or regulation, in ` +
    i`violation of Wish’s merchant Terms of Service and Agreement or any Wish ` +
    i`policies, or if Wish otherwise deems such Product listing or content to ` +
    i`be inappropriate. Wish may also share your information, including but ` +
    i`not limited to this declaration, with rights owners who may believe ` +
    i`their rights are being violated.`;

  return (
    <Card className={css(styles.card, style)}>
      <div className={css(styles.markdown)}>
        <Markdown openLinksInNewTab text={contractPart1} />
        <br />
        <Markdown openLinksInNewTab text={contractPart2} />
        <br />
        <Markdown openLinksInNewTab text={contractPart3} />
        <br />
        <Markdown openLinksInNewTab text={contractPart4} />
        <br />
        <Markdown openLinksInNewTab text={contractPart5} />
        <br />
        <Markdown openLinksInNewTab text={contractPart6} />
        <br />
        <Markdown openLinksInNewTab text={contractPart7} />
      </div>
    </Card>
  );
};
export default observer(BrandedProductsContract);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: 16,
          backgroundColor: pageBackground,
          overflow: "scroll",
        },
        markdown: {
          backgroundColor: pageBackground,
        },
      }),
    [pageBackground]
  );
};
