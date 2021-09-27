import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { wishURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Infraction } from "@merchant/api/warnings";

export type InfractionDetailRowProps = BaseProps & {
  readonly fineItem: Infraction;
};

export type InfractionDetailField = "product_id" | "id" | "message";

const TitleWidth = 250;

const InfractionDetailRow = (props: InfractionDetailRowProps) => {
  const styles = useStylesheet(props);
  const { className, fineItem } = props;
  const fields: ReadonlyArray<InfractionDetailField> = ["product_id", "id"];

  const reasonToPolicyLink = (fineItem: Infraction) => {
    // This is terrible: please don't repeat this practice.
    // mappings taken from sweeper/merchant_dashboard/model/warning.py: get_fine_amount()
    const reason = fineItem.reason;
    if (reason === 24) {
      return "/policy/listing#2.6";
    } else if (reason === 26 || fineItem.is_misleading_listing === true) {
      return "/policy/listing#2.10";
    } else if (reason === 12 || reason === 44) {
      return "/policy-archive/promotion#3.3";
    } else if (reason === 24) {
      return "/policy/listing#2.6";
    } else if (reason === 8) {
      return "/policy/ip#4.5";
    }

    return "/policy/home";
  };

  const renderDetail = (field: InfractionDetailField) => {
    switch (field) {
      case "product_id":
        return fineItem.product_id == null ? (
          ""
        ) : (
          <SheetItem
            key={field}
            className={css(styles.item)}
            title={i`Product ID`}
            value={() => (
              <CopyButton
                className={css(styles.root, className)}
                text={fineItem.product_id}
              >
                <Link
                  className={css(styles.root)}
                  href={wishURL(`/c/${fineItem.product_id || ""}`)}
                  openInNewTab
                >
                  {fineItem.product_id}
                </Link>
              </CopyButton>
            )}
            titleWidth={TitleWidth}
          />
        );

      case "id":
        return (
          <SheetItem
            key={field}
            className={css(styles.item)}
            title={i`Infraction ID`}
            value={() => (
              <CopyButton
                className={css(styles.root, className)}
                text={fineItem.id}
              >
                <Link
                  className={css(styles.root)}
                  href={`/warning/view/${fineItem.id}`}
                  openInNewTab
                >
                  {fineItem.id}
                </Link>
              </CopyButton>
            )}
            titleWidth={TitleWidth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={css(styles.root, className)}>
      <Tip
        className={css(styles.root, className, styles.header)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <div className={css(styles.root)}>
          <p className={css(styles.row)}>
            <span>{fineItem.message}</span>
            <Link
              className={css(styles.link)}
              href={reasonToPolicyLink(fineItem)}
              openInNewTab
            >
              Learn more
            </Link>
          </p>
        </div>
      </Tip>
      <div className={css(styles.root)}>
        {fields.map((field) => renderDetail(field))}
      </div>
    </div>
  );
};

export default observer(InfractionDetailRow);

const useStylesheet = (props: InfractionDetailRowProps) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          marginBottom: 13,
        },
        tip: {
          marginBottom: 30,
        },
        row: {
          color: palettes.textColors.Ink,
          opacity: 0.99,
          fontSize: 14,
          lineHeight: 1.5,
          margin: 0,
          padding: 0,
          maxWidth: 900,
        },
        link: {
          marginLeft: 2,
        },
        item: {
          marginBottom: 4,
        },
      }),
    []
  );
