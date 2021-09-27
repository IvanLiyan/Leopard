import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section1Latest from "@merchant/component/policy/policies/latest/wish-express/Section1";
import Section1Archive from "@merchant/component/policy/policies/archive/wish-express/Section1";
import Section2Archive from "@merchant/component/policy/policies/archive/wish-express/Section2";
import Section3Archive from "@merchant/component/policy/policies/archive/wish-express/Section3";
import Section4Archive from "@merchant/component/policy/policies/archive/wish-express/Section4";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const WishExpressPolicy = ({
  className,
  sectionNumber,
  version,
  announcementsMap,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="wish_express"
      title={i`Wish Express`}
      sectionNumber={sectionNumber}
      dateUpdated={i`January 25, 2021`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      {version == "archive" ? (
        <Section1Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section1Latest
          sectionNumber={sectionNumber}
          announcementsMap={announcementsMap}
          currentSection={currentSection}
        />
      )}

      {version == "archive" && (
        <Section2Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" && (
        <Section3Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" && (
        <Section4Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={
          i`Merchants will be responsible for any refunds of Wish Express ` +
          i`orders when the orders are confirmed delivered late`
        }
        subSectionNumber={
          version == "archive" ? `${sectionNumber}.5` : `${sectionNumber}.2`
        }
        currentSection={currentSection}
      >
        <p>
          If a Wish Express order violates the Wish Express Delivery Requirement
          (set out below) and is refunded, the merchant is responsible for {100}
          % of the cost of any refund on that order.
        </p>
        <p>
          The Wish Express Delivery Requirement is {5} business days from the
          order released date for all supported destination regions, with the
          following exceptions:
        </p>
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`France: ${6} business days` +
            `  \n` +
            i`Switzerland: ${6} business days` +
            `  \n` +
            i`Denmark: ${6} business days` +
            `  \n` +
            i`Italy: ${6} business days` +
            `  \n` +
            i`Australia: ${7} business days` +
            `  \n` +
            i`Brazil: ${10} business days` +
            `  \n` +
            i`Finland: ${7} business days` +
            `  \n` +
            i`Spain: ${8} business days` +
            `  \n` +
            i`Puerto Rico: ${7} business days` +
            `  \n` +
            i`Norway: ${8} business days` +
            `  \n` +
            i`Mexico: ${7} business days` +
            `  \n` +
            i`Sweden: ${8} business days`
          }
        />
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("231264967")} openInNewTab>
            Learn more
          </Link>
        </p>
      </PolicySubSection>

      <LocalCurrencyNotice />
    </PolicySection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        subsectionEnd: {
          marginBottom: 0,
        },
        paragraph: {
          marginBottom: 10,
        },
      }),
    []
  );

export default observer(WishExpressPolicy);
