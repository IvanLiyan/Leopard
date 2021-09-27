import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { Locale } from "@toolkit/locales";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ActionToScope, MerchantAppListing } from "@merchant/api/merchant-apps";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type MerchantAppGridItemProps = BaseProps & {
  readonly merchantApp: MerchantAppListing;
  readonly actionToScope: ActionToScope;
  readonly onClickRemoveAction: () => Promise<void>;
};

const MAX_PREVIEW_INTRO = 50;

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const capitalizeEachWord = (string: string) =>
  string
    .split(" ")
    .map(capitalizeFirstLetter)
    .reduce((current, word) => `${current} ${word}`);

const truncateString = (string: string) =>
  string.slice(0, MAX_PREVIEW_INTRO) + "...";

const ConnectedAppGridItem = ({
  style,
  className,
  merchantApp,
  actionToScope,
  onClickRemoveAction,
}: MerchantAppGridItemProps) => {
  const [showAllScope, setShowAllScope] = useState(false);
  const styles = useStylesheet();
  const { locale } = LocalizationStore.instance();

  let intro = "";

  const {
    name,
    intros,
    logo_source: logoSource,
    client_id: clientId,
    active,
    listing_state_name: listingStateName,
  } = merchantApp;

  const website = `/merchant_apps/${clientId}`;

  if (locale in intros) {
    intro = intros[locale];
  } else {
    const defaultLocales: Locale[] = ["en", "zh"];
    const validLocales = defaultLocales.filter((locale) => locale in intros);
    if (validLocales.length > 0) {
      intro = intros[validLocales[0]];
    }
  }

  const modalDeleteRenderFn = () => (
    <Markdown
      text={i`The app **${name}** will no longer have access to your account, and all user data may be lost.`}
    />
  );

  const onClickRemove = async () =>
    new ConfirmationModal(modalDeleteRenderFn)
      .setHeader({ title: i`Remove app?` })
      .setAction(i`Remove`, onClickRemoveAction)
      .setWidthPercentage(50)
      .setCancel(i`Cancel`)
      .render();

  const DynamicLink = ({
    className,
    children,
  }: {
    className: React.HTMLAttributes<HTMLDivElement>["className"];
    children: React.ReactNode;
  }) =>
    ["APPROVED", "UPDATED_PENDING"].includes(listingStateName) ? (
      <Link href={website} className={className}>
        {children}
      </Link>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.rootWrapper)}>
        <DynamicLink className={css(styles.imgContainer)}>
          {logoSource ? (
            <img
              className={css(styles.illustration)}
              src={merchantApp.logo_source}
              alt={i`Logo image of connected app`}
            />
          ) : (
            <Illustration
              name="appNoLogo"
              className={css(styles.illustration)}
              alt={i`Default image of connected app`}
            />
          )}
        </DynamicLink>
        <div className={css(styles.infoWrapper)}>
          <DynamicLink className={css(styles.title)}>{name}</DynamicLink>
          <DynamicLink className={css(styles.intro)}>
            {intro.length > MAX_PREVIEW_INTRO ? truncateString(intro) : intro}
          </DynamicLink>
          <div
            style={{ display: showAllScope ? "flex" : "none" }}
            className={css(styles.scopesWrapper)}
          >
            {Object.keys(actionToScope).map((key) => (
              <div className={css(styles.scopeWrapper)} key={key}>
                <div className={css(styles.scopeActionKey)}>
                  {capitalizeEachWord(key)}
                </div>
                {actionToScope[key as keyof typeof actionToScope]
                  .map(capitalizeEachWord)
                  .map((value: string) => (
                    <div
                      className={css(styles.scopeActionValues)}
                      key={`${key}-${value}`}
                    >
                      {value}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <Link
            style={{
              display: Object.keys(actionToScope).length > 0 ? "flex" : "none",
            }}
            className={css(styles.contentAction)}
            onClick={() => setShowAllScope(!showAllScope)}
          >
            {showAllScope ? i`Hide privileges` : i`Show privileges`}
          </Link>
          {!active && (
            <div className={css(styles.warningWrapper)}>
              <div className={css(styles.warningText)}>
                This app is inactive.
              </div>
              <Info
                text={
                  i`This app has not made any requests recently. ` +
                  i`Consider removing the app for the security of your data.`
                }
                size={14}
                popoverFontSize={14}
                position="right center"
                className={css(styles.infoIcon)}
              />
            </div>
          )}
        </div>
        <SecondaryButton onClick={onClickRemove} padding="5px 15px">
          Remove
        </SecondaryButton>
      </div>
    </div>
  );
};

export default observer(ConnectedAppGridItem);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.white,
          padding: 24,
          alignItems: "center",
          minHeight: 120,
        },
        rootWrapper: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          alignSelf: "stretch",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        },
        name: {
          fontSize: 20,
          color: palettes.textColors.Ink,
          marginBottom: 8,
          marginTop: 5,
          fontWeight: fonts.weightBold,
        },
        imgContainer: {
          display: "flex",
          backgroundColor: colors.white,
          marginRight: 24,
          height: 100,
          width: 100,
          justifyContent: "center",
          flexShrink: 0,
          "@media (max-width: 900px)": {
            alignItems: "center",
            marginRight: 0,
            marginBottom: 10,
          },
        },
        illustration: {
          alignSelf: "center",
          backgroundColor: "#ffffff",
          padding: 1,
          maxHeight: 100,
          maxWidth: 100,
        },
        infoWrapper: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          flex: 1,
          marginRight: 24,
          "@media (max-width: 900px)": {
            alignItems: "center",
            marginRight: 0,
            marginBottom: 10,
          },
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          wordBreak: "break-word",
          marginBottom: 8,
          flex: 1,
        },
        intro: {
          color: palettes.textColors.Ink,
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          lineHeight: 1.43,
          wordBreak: "break-word",
          marginBottom: 8,
        },
        scopeActionKey: {
          fontSize: 12,
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          color: palettes.textColors.Ink,
        },
        scopeActionValues: {
          fontSize: 12,
          fontWeight: fonts.weightMedium,
          lineHeight: 1.5,
          color: palettes.textColors.Ink,
        },
        scopeWrapper: {
          display: "flex",
          flexDirection: "column",
          marginRight: 16,
          ":last-child": {
            margin: 0,
          },
          alignSelf: "stretch",
        },
        scopesWrapper: {
          marginBottom: 8,
        },
        contentAction: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "stretch",
          fontSize: 12,
          color: palettes.coreColors.WishBlue,
          fontWeight: fonts.weightSemibold,
          cursor: "pointer",
          lineHeight: 1.5,
          "@media (max-width: 900px)": {
            alignItems: "center",
          },
        },
        warningWrapper: {
          display: "flex",
          flexDirection: "row",
          padding: "5px",
          alignItems: "center",
        },
        warningText: {
          color: "red",
          fontSize: 14,
        },
        infoIcon: {
          marginLeft: "3px",
        },
      }),
    []
  );
