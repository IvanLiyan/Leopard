import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { H6Markdown } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Relative Imports */
import { getAppStatusDisplayText } from "./ABSBApplicationStatusDisplay";
import { renderABSBApplicationDetailModal } from "./ABSBApplicationDetailModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ABSBBrandApplication,
  ABSBApplication,
} from "@toolkit/brand/branded-products/abs";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type BrandAccordianHeaderProps = BaseProps & {
  readonly brandApp: ABSBBrandApplication;
};

const BrandAccordianHeader = ({
  brandApp,
  style,
}: BrandAccordianHeaderProps) => {
  const styles = useStylesheet();

  const viewDetailsLink = `[${i`View details`}]()`;
  const getDescription = (app: ABSBApplication) => {
    const date = formatDatetimeLocalized(
      moment.unix(Number(app.date_submitted)),
      "MM/DD/YYYY"
    );
    const status = getAppStatusDisplayText(app.status);
    if (status === "expired") {
      return (
        i`Your previous application submitted on ${date} is ` +
        i`**${status}**. ${viewDetailsLink}`
      );
    }

    return (
      i`Your latest application submitted on ${date} is ` +
      i`**${status}**. ${viewDetailsLink}`
    );
  };
  const showAbsb = brandApp.applications[0].status === "APPROVED";

  return (
    <div className={css(style, styles.accordionHeaderContainer)}>
      <div className={css(styles.accordionHeaderBrandNameAndBadge)}>
        {showAbsb && (
          <Icon
            name="authenticBrandSellerBadge"
            style={css(styles.accordionHeaderBadge)}
          />
        )}
        <H6Markdown
          text={brandApp.brand_name}
          className={css(styles.accordionHeaderBrandName)}
        />
      </div>
      <Markdown
        text={getDescription(brandApp.applications[0])}
        onLinkClicked={() => renderABSBApplicationDetailModal(brandApp)}
      />
    </div>
  );
};

export default observer(BrandAccordianHeader);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        accordionHeaderContainer: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "flex-start",
        },
        accordionHeaderBadge: {
          marginRight: "10px",
          alignSelf: "center",
        },
        accordionHeaderBrandNameAndBadge: {
          width: "25%",
          display: "flex",
          flexDirection: "row",
        },
        accordionHeaderBrandName: {
          fontWeight: fonts.weightBold,
        },
      }),
    []
  );
};
