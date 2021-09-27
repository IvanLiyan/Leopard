import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

/* Lego Components */
import { EmailInput } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { merchantInvitationHeader } from "@assets/illustrations";

/* Merchant API */
import * as inviteFriendsApi from "@merchant/api/invite-friends";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { OnTextChangeEvent } from "@ContextLogic/lego";

const InviteFriends = () => {
  const [userInputEmail, setUserInputEmail] = useState("");
  const [userEmailValid, setUserEmailValid] = useState(false);

  const [fetchReferralLinkResp] = useRequest(
    inviteFriendsApi.fetchReferralLink({}),
  );
  const referralLink = fetchReferralLinkResp?.data?.referralLink;

  const appStore = AppStore.instance();
  const { toastStore } = appStore;

  const style = useStyleSheet();

  const handleInvite = async () => {
    if (!userInputEmail || !userEmailValid) {
      return;
    }

    try {
      await inviteFriendsApi.invite({ email: userInputEmail }).call();
      toastStore.positive(
        i`Invitation sent to ${userInputEmail} successfully!`,
      );
    } catch (e) {
      toastStore.negative(e.msg);
    }
  };

  const line1 = i`Refer friends to sell on Wish and earn ${formatCurrency(
    100,
  )} free credits`;
  const line2 =
    i`You will receive **${formatCurrency(
      100,
    )} free ProductBoost credits** to use towards advertising` +
    i` campaigns when your friend opens a Wish store and uploads **10+ products** by` +
    i` the end of March 2020!`;

  if (referralLink == null) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <h3>Refer Friends</h3>
      <div className={css(style.page)}>
        <div className={css(style.content)}>
          <div className={css(style.row, style.imageRow)}>
            <img src={merchantInvitationHeader} />
          </div>
          <h3 className={css(style.row, style.headerRow)}>{line1}</h3>
          <div className={css(style.row, style.subheaderRow)}>
            <Markdown text={line2} />
          </div>
          <div className={css(style.row, style.field, style.textInputRow)}>
            <EmailInput
              placeholder={i`Friend's email`}
              onChange={({ text }: OnTextChangeEvent) =>
                setUserInputEmail(text)
              }
              onValidityChanged={(isValid: boolean) =>
                setUserEmailValid(isValid)
              }
              hideCheckmarkWhenValid
              showErrorMessages={false}
            />
          </div>
          <div className={css(style.row, style.field, style.buttonRow)}>
            <PrimaryButton
              onClick={handleInvite}
              isDisabled={!userInputEmail || !userEmailValid}
            >
              Invite
            </PrimaryButton>
          </div>
          <div className={css(style.row, style.orRow)}>
            <div className={css(style.rowFlex)}>
              <div className={css(style.dotLine)} />
              <div>OR</div>
              <div className={css(style.dotLine)} />
            </div>
          </div>
          <div className={css(style.row, style.textRow)}>
            Copy and share your referral link
          </div>
          <div className={css(style.row, style.referralRow)}>
            <CopyButton hideButtonUntilHover={false} copyOnBodyClick>
              {referralLink}
            </CopyButton>
          </div>
        </div>
        <div className={css(style.footer)}>
          <div>How do I use ProductBoost free credits?</div>
          <Link
            className={css(style.smallSpace)}
            href={zendeskURL("360000493313")}
            openInNewTab
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
};

export default InviteFriends;

const useStyleSheet = () => {
  const appStore = AppStore.instance();
  const { dimenStore } = appStore;
  return useMemo(
    () =>
      StyleSheet.create({
        page: {
          marginTop: 20,
          borderRadius: 4,
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingLeft: dimenStore.pageGuideX,
          paddingRight: dimenStore.pageGuideX,
        },
        row: {
          marginLeft: 20,
          marginRight: 20,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          ":nth-child(1n) > *": {
            flex: 1,
          },
        },
        imageRow: {
          marginTop: 40,
        },
        headerRow: {
          marginTop: 32,
          marginBottom: 0,
          fontSize: 24,
          lineHeight: 1.33,
          color: palettes.coreColors.DarkestWishBlue,
        },
        subheaderRow: {
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.5,
          color: palettes.coreColors.DarkerWishBlue,
        },
        field: {
          maxWidth: 280,
          height: 40,
          width: "100%",
        },
        textInputRow: {
          marginTop: 40,
        },
        buttonRow: {
          marginTop: 16,
        },
        orRow: {
          marginTop: 32,
          color: palettes.greyScaleColors.DarkerGrey,
        },
        rowFlex: {
          display: "flex",
          alignItems: "center",
        },
        dotLine: {
          height: 0,
          width: 40,
          margin: "0 10px",
          borderTop: `2px ${palettes.greyScaleColors.DarkerGrey} dotted`,
        },
        textRow: {
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.5,
          color: palettes.coreColors.DarkerWishBlue,
        },
        referralRow: {
          marginTop: 8,
          fontSize: 14,
          lineHeight: "20px",
          padding: 10,
          border: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
          borderRadius: 4,
        },
        footer: {
          fontSize: 14,
          marginTop: 40,
          height: 56,
          width: "100%",
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: palettes.textColors.LightInk,
        },
        smallSpace: {
          marginLeft: 5,
        },
      }),
    [dimenStore],
  );
};
