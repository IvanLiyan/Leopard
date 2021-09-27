import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { weeklyDisbBannerImage } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Markdown } from "@ContextLogic/lego";

type WeeklyPaymentNotificationProps = BaseProps & {
  readonly isWeeklyPSP: boolean;
};

const WeeklyPaymentNotification = (props: WeeklyPaymentNotificationProps) => {
  const styles = useStylesheet();
  const { isWeeklyPSP } = props;

  const weeklyTitle = i`You've been upgraded to a weekly payment cycle`;
  const title = i`Update payment provider for weekly payments`;
  const weeklyBodyText =
    i`Congratulations, you have been invited to a beta program for weekly ` +
    i`payments! You will automatically receive payments on a weekly basis ` +
    i`from now on. Please make sure your provider is either Paypal or ` +
    i`Payoneer in order to receive payments correctly.`;

  const bodyText =
    i`Congratulations, you have been invited to a beta program for weekly ` +
    i`payments! Please change your provider to either Paypal or Payoneer. ` +
    i`If you do not update your provider and do not opt out of this program by ` +
    i`contacting your account manager, your payments may not process correctly.`;

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.cardWidth)}>
        <div className={css(styles.textArea)}>
          <div className={css(styles.header)}>
            <Markdown text={`${isWeeklyPSP ? weeklyTitle : title}`} />
          </div>
          <div className={css(styles.body)}>
            <Markdown text={`${isWeeklyPSP ? weeklyBodyText : bodyText}`} />
          </div>
        </div>
        <div className={css(styles.imageArea)}>
          <img
            className={css(styles.img)}
            draggable={false}
            src={weeklyDisbBannerImage}
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyPaymentNotification;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          display: "flex",
          fontFamily: fonts.proxima,
          width: "100%",
          marginBottom: 10,
        },
        cardWidth: {
          display: "flex",
          height: "100%",
          width: "57.5%",
          background: "#FFFFFF",
          border: "1px solid rgba(196, 205, 213, 0.5)",
          boxSizing: "border-box",
          borderRadius: "4px",
        },
        helpWidth: {
          width: "40%",
        },
        header: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          marginBottom: 10,
        },
        body: {
          fontSize: 16,
          marginBottom: 30,
        },
        textArea: {
          paddingTop: 10,
          paddingLeft: 15,
          flex: 70,
        },
        imageArea: {
          position: "relative",
          flex: 30,
        },
        img: {
          position: "absolute",
          right: 0,
          bottom: 0,
          maxWidth: "80%",
        },
      }),
    []
  );
