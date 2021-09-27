/*eslint-disable local-rules/unnecessary-list-usage*/

/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type NorwayVATExplanationProps = BaseProps;

const NorwayVATExplanation = (props: NorwayVATExplanationProps) => {
  const { className, style } = props;

  const styles = useStylesheet(props);

  return (
    <div className={css(styles.root, className, style)}>
      <strong>VOEC or Norway VAT Information Required</strong>
      <ul className={css(styles.firstListItem)}>
        <li className={css(styles.listItem)}>
          <div>
            Orders with destination country Norway must display the VOEC Number
            or the merchant's Norway VAT registration number on the shipping
            label.
          </div>
          <Link href={zendeskURL("360045609693")} openInNewTab>
            Learn More
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default observer(NorwayVATExplanation);

const useStylesheet = (props: NorwayVATExplanationProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontFamily: fonts.proxima,
          fontSize: 12,
          lineHeight: 1.33,
        },
        listItem: {
          fontFamily: fonts.proxima,
          fontSize: 12,
          lineHeight: 1.33,
        },
        firstListItem: {
          paddingTop: 10,
        },
      }),
    []
  );
};
