import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import { default as Row } from "@merchant/component/merchant-review/InfoRow";
import { Link } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type DetectedDuplicateNameData = {
  readonly firstName: string;
  readonly lastName: string;
  readonly duplicateDetails: {
    readonly standardizedMatchingName: string;
    readonly standardizedRootName: string;
    readonly plaintextNameToMerchantIds: {
      readonly [key: string]: ReadonlyArray<string>;
    };
  };
  readonly merchantIdToReauthenticationTicketId: {
    readonly [key: string]: ReadonlyArray<string>;
  };
  readonly merchantIdToReauthenticationState: {
    readonly [key: string]: ReadonlyArray<string>;
  };
};

export type DetectedDuplicateNameProps = BaseProps & DetectedDuplicateNameData;

const DetectedDuplicateName = (props: DetectedDuplicateNameProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const styles = useStylesheet();

  const {
    firstName,
    lastName,
    duplicateDetails: { plaintextNameToMerchantIds },
    merchantIdToReauthenticationTicketId,
    merchantIdToReauthenticationState,
    style,
  } = props;

  const getRootNameDuplicationCount = () => {
    let rootNameDuplicationCount = 0;
    const plaintextNames = Object.keys(plaintextNameToMerchantIds);
    for (const name of plaintextNames) {
      rootNameDuplicationCount += plaintextNameToMerchantIds[name].length;
    }

    return rootNameDuplicationCount;
  };

  const renderDuplicatedPlaintextNames = () => {
    return Object.keys(plaintextNameToMerchantIds).map((name, index) => {
      const [firstName, lastName] = name
        .substring(1, name.length - 1)
        .split("),(");
      return (
        <div key={name}>
          <Row title={i`First name`} titleWidth={160} style={styles.row}>
            {firstName}
          </Row>
          <Row title={i`Last name`} titleWidth={160} style={styles.row}>
            {lastName}
          </Row>
          <Row title={i`Merchant ID(s)`} titleWidth={160} style={styles.row}>
            <div style={styles.merchantIdList}>
              {plaintextNameToMerchantIds[name].map((merchantId, index) => {
                const reauthenticationTicketId =
                  merchantIdToReauthenticationTicketId[merchantId];
                const reauthenticationState =
                  merchantIdToReauthenticationState[merchantId];
                return (
                  <div key={merchantId}>
                    <Markdown text={`${reauthenticationState}`} />
                    <Link
                      href={`/reauthentication-detail/${reauthenticationTicketId}`}
                      openInNewTab
                    >
                      {merchantId}
                    </Link>
                  </div>
                );
              })}
            </div>
          </Row>
          <div className={css(styles.line)} />
        </div>
      );
    });
  };

  return (
    <Card style={[styles.root, style]}>
      <Accordion
        header={i`Detected Duplicate Names`}
        isOpen={isOpen}
        onOpenToggled={(isOpen) => setIsOpen(isOpen)}
      >
        <div className={css(styles.content)}>
          <div className={css(styles.header)}>
            {getRootNameDuplicationCount()} names matching {firstName},{" "}
            {lastName} have been detected.
          </div>
          <div className={css(styles.line)} />
          {renderDuplicatedPlaintextNames()}
        </div>
      </Accordion>
    </Card>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        content: {
          padding: "20px 0px 4px 48px",
        },
        header: {
          marginBottom: 20,
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          lineHeight: "24px",
        },
        row: {
          marginBottom: 16,
        },
        line: {
          height: 0,
          width: "100%",
          borderBottom: `1px ${borderPrimary} solid`,
          marginBottom: 20,
        },
        objectId: {
          padding: 0,
        },
        merchantIdList: {
          display: "block",
        },
      }),
    [borderPrimary, textBlack]
  );
};

export default DetectedDuplicateName;
