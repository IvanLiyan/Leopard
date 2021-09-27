import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

const ThirdPartyBrandedGoodsDeclarationContainer: React.FC<{}> = () => {
  const styles = useStylesheet();

  const renderHeaderTitle = () => {
    return (
      <Text weight="bold" className={css(styles.headerTitle)}>
        Branded Products Declaration
      </Text>
    );
  };
  const texts = [
    i`ContextLogic Inc. dba Wish ("Wish") has a strict policy against` +
      i` the listing or sale of products that violate a third-party's` +
      i` copyright, trademark, or other rights. The listing or sale of items` +
      i` or materials that include or incorporate, without permission of the` +
      i` rights holder, copyrights, trademarks, logos, images, or other` +
      i` intellectual property rights or proprietary rights (collectively,` +
      i` "Intellectual Property Rights") may, among other things, result in` +
      i` the deletion or modification of your listings, the suspension of` +
      i` your Merchant account, and/or the discontinuation of your selling` +
      i` privileges.`,
    i`You agree to be bound by the Merchant Terms of Service and Agreement` +
      i` (available at [https://${window.location.host}/terms-of-service]` +
      i` (/terms-of-service)) and any Wish policies referenced` +
      i` therein or as otherwise communicated to you by Wish.` +
      i` You further represent and warrant that:`,
    i`(a) you have obtained all necessary rights, permissions, and licenses` +
      i` from all owners of Intellectual Property Rights in or related to` +
      i` the products that you list on the Wish platform (the "Products")` +
      i` such that you and/or Wish may redistribute, offer for sale, sell,` +
      i` resell, market, advertise or otherwise transfer the Products to any` +
      i` person or entity worldwide through any means;`,
    i`(b) the Products and their use do not and will not infringe or` +
      i` otherwise violate any Intellectual Property Right of any third party;`,
    i`(c) the Products and their sale, resale, advertising, or marketing` +
      i` thereof do not and will not violate any other applicable law or` +
      i` regulation in the country or countries in which the Products are` +
      i` offered, sold, advertised, or marketed; and`,
    i`(d) you are in compliance with all applicable laws and regulations` +
      i` related to the sale, resale, advertising, and marketing of all` +
      i` Products.`,
    i`Upon accepting and agreeing to be bound by the terms of this` +
      i` Branded Goods Declaration, you may be permitted,` +
      i` in Wish's sole discretion, to offer for sale, sell, resell, market,` +
      i` advertise or otherwise transfer the Products. Furthermore, Wish,` +
      i` in its sole discretion, reserves all of its rights and remedies to` +
      i` remove or modify any Product listing or content provided by you if` +
      i` Wish deems such Product listing or content to be prohibited for` +
      i` sale, in violation of any law or regulation, in violation of` +
      i` Wish’s merchant Terms of Service and Agreement or any Wish` +
      i` policies, or if Wish otherwise deems such Product listing or` +
      i` content to be inappropriate.`,
  ];

  return (
    <>
      <WelcomeHeader
        className={css(styles.header)}
        title={renderHeaderTitle}
        paddingX="20%"
        illustration="thirdPartyBrandedGoodsDeclaration"
      />
      {texts.map((t, i) => (
        <Markdown
          key={Math.random()}
          className={css(styles.p)}
          openLinksInNewTab
          text={t}
        />
      ))}
    </>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          marginBottom: 40,
        },
        headerTitle: {
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          fontSize: 32,
          lineHeight: "40px",
          color: palettes.textColors.Ink,
        },
        p: {
          padding: "0 20%",
          fontSize: 16,
          color: palettes.textColors.Ink,
          marginBottom: 20,
        },
      }),
    []
  );
};

export default observer(ThirdPartyBrandedGoodsDeclarationContainer);
