/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const WarehouseFulfillmentPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="warehouse_fulfillment"
      title={i`Warehouse Fulfillment Policy`}
      sectionNumber={sectionNumber}
      dateUpdated={i`January 25, 2021`}
    >
      <PolicySubSection
        title={
          i`Orders of products with merchant-set Max Delivery Days ` +
          i`must be confirmed delivered on time`
        }
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>
          Merchants may set the maximum number of days it will take to deliver
          an item, per destination country or region, after an order is released
          (the “Max Delivery Days”). An order must be confirmed delivered within
          the merchant-set Max Delivery Days.
        </p>
        <p>
          Merchant-set Max Delivery Days also may impact a merchant’s Warehouse
          Late Delivery Rate, as set out in policy 12.2 below. Specifically, if
          an order is not confirmed delivered and the merchant-set Max Delivery
          Days for the order have already passed, or if the order is confirmed
          delivered after the merchant-set Max Delivery Days have already
          passed, it will be considered a Warehouse Late Delivery.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("1260801406130")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Payments for orders that are confirmed delivered later than ` +
          i`the merchant-set Max Delivery Days may be withheld`
        }
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <p>
          If an order is confirmed delivered late (i.e., later than the
          merchant-set Max Delivery Days), and the weekly Warehouse Late
          Delivery Rate (see definition in the link below this policy) of the
          warehouse from which this order is shipped represents more than a
          nominal percentage of total orders, payment for the late-arriving
          order may be withheld.
        </p>
        <p>
          The weekly Warehouse Late Delivery Rate is defined as the Warehouse
          Late Delivery rate percentage of orders that should have been
          delivered in a given Monday - Sunday week based on the merchant-set
          Max Delivery Days, but which instead meet the definition of a
          Warehouse Late Delivery under policy 12.1. To calculate the Warehouse
          Late Delivery Rate, Wish may use, at its discretion, information on
          the merchants’ deliveries in either the most recent calendar week or
          the prior one-to-two calendar weeks.
        </p>
        <p>
          For orders where the merchant-set Max Delivery Days is greater than or
          equal to {5}
          business days, if the order is confirmed delivered in {5} or more
          business days after the merchant-set Max Delivery Days, payment for
          the order may be withheld regardless of the weekly Warehouse Late
          Delivery Rate.
        </p>
        <p>
          For orders where the merchant-set Max Delivery Days is less than
          {5} business days, if the order is confirmed delivered in a number of
          days greater than or equal to twice the Max Delivery Days, payment for
          the order may be withheld regardless of the weekly Warehouse Late
          Delivery Rate.
        </p>
        <p>
          Payments withheld for such late-arriving orders may be released to
          merchants when the following two conditions have been met:
        </p>
        <ul>
          <li>
            A minimum of {12} consecutive Monday - Sunday weeks have passed
            since the order’s payment is first withheld; and
          </li>
          <li>
            Merchants are able to consistently maintain an acceptable Warehouse
            Late Delivery Rate over the last {4} consecutive Monday - Sunday
            weeks for the warehouse the late-arriving order was fulfilled from.
          </li>
        </ul>
        <p>
          Merchants are allowed to dispute the above-defined late-arriving
          orders within {30} calendar days from the date the order’s payment is
          withheld. If the order is determined to have arrived on time, the
          order may become eligible for payment and will not be counted towards
          merchants’ Warehouse Late Delivery Rate.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("1260801406130")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchants are responsible for any refunds on orders that are confirmed ` +
          i`delivered later than the merchant-set Max Delivery Days`
        }
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        <p>
          If an order is delivered later than the merchant-set Max Delivery Days
          for the corresponding product and destination country/region, the
          merchant is responsible for {100}% of the cost of any refund on that
          order.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("1260801406130")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`If merchants are unable to achieve an acceptable Warehouse Late Delivery Rate ` +
          i`${24} weeks after the payment of an order is withheld, the order will no longer ` +
          i`be eligible for payment`
        }
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        <p>
          If {24} consecutive Monday - Sunday weeks have passed since the
          payment of an order is first withheld and the merchant has still not
          met the criteria for payment release (i.e., the payment of the order
          is still withheld {24} weeks after it was first withheld), the order
          will no longer be eligible for payment.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("1260801406130")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>
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
      }),
    []
  );

export default observer(WarehouseFulfillmentPolicy);
