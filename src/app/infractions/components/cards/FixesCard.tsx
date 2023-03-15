import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { useInfractionContext } from "@infractions/InfractionContext";
import ReviewInfractionDetails from "./actionCards/ReviewInfractionDetails";
import ProvideProofOfAuthenticity from "./actionCards/ProvideProofOfAuthenticity";
import EditYourProductListing from "./actionCards/EditYourProductListing";
import UpdateMaxDeliveryDays from "./actionCards/UpdateMaxDeliveryDays";
import AddressUnderlyingInfractions from "./actionCards/AddressUnderlyingInfractions";
import PayWishPostBalance from "./actionCards/PayWishPostBalance";
import Dispute from "./actionCards/Dispute";

/*
Following MerchantWarningFixAction are not fixes, instead addressed elsewhere in UI
  | "REQUEST_PAYMENT_RELEASE"
  | "MESSAGE"

Fix GET_PRODUCT_AUTHORIZATION is handled in description.
*/
const Fixes = [
  "PROVE_AUTHENTICITY",
  "EDIT_PRODUCT_LISTING",
  "UPDATE_MAX_DELIVERY_DAYS",
  "ADDRESS_UNDERLYING_INFRACTION",
  "PAY_WISHPOST_BALANCE",
  "DISPUTE",
] as const;

type Fix = typeof Fixes[number];

const FixComponent: { readonly [fix in Fix]: React.ReactFragment } = {
  PROVE_AUTHENTICITY: <ProvideProofOfAuthenticity />,
  EDIT_PRODUCT_LISTING: <EditYourProductListing />,
  UPDATE_MAX_DELIVERY_DAYS: <UpdateMaxDeliveryDays />,
  ADDRESS_UNDERLYING_INFRACTION: <AddressUnderlyingInfractions />,
  PAY_WISHPOST_BALANCE: <PayWishPostBalance />,
  DISPUTE: <Dispute />,
};

const FixesCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { disputeDeadline, actions },
  } = useInfractionContext();

  const filteredActions: ReadonlyArray<Fix> = actions.filter((action) =>
    (Fixes as ReadonlyArray<string>).includes(action),
  ) as ReadonlyArray<Fix>;

  return (
    <Card title={i`Fix This Issue`} style={[className, style]}>
      <div className={css(styles.column)}>
        {filteredActions.length < 1 ? (
          <ReviewInfractionDetails />
        ) : (
          <>
            <Markdown
              text={i`Please take **one of the following** actions by **${disputeDeadline}**`}
            />
            {filteredActions.map((action) => FixComponent[action])}
          </>
        )}
      </div>
    </Card>
  );
};

export default observer(FixesCard);
