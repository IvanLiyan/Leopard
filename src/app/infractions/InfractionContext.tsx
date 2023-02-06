import { createContext } from "react";
import EditYourProductListing from "@infractions/components/cards/actionCards/EditYourProductListing";
import ProvideProofOfAuthenticity from "@infractions/components/cards/actionCards/ProvideProofOfAuthenticity";
import Dispute from "@infractions/components/cards/actionCards/Dispute";
import GetProductAuthorization from "@infractions/components/cards/actionCards/GetProductAuthorization";
import ReviewInfractionDetails from "@infractions/components/cards/actionCards/ReviewInfractionDetails";
import AddressUnderlyingInfractions from "@infractions/components/cards/actionCards/AddressUnderlyingInfractions";
import UpdateMaxDeliveryDays from "@infractions/components/cards/actionCards/UpdateMaxDeliveryDays";
import PayWishPostBalance from "@infractions/components/cards/actionCards/PayWishPostBalance";

export const InfractionContext = createContext({
  infraction: {
    id: "63aba1de59904d0b04dd9538",
    title: "Unfulfilled Order",
    body: "You did not fulfill the order within 5 calendar days",
    policy: "[Fulfillment Policy](#TODO)",
    faq: "[Unfulfilled Order FAQ](#TODO)",
    state: "Action Required",
    issuedDate: "9/6/2022 5:20 AM PDT",
    disputeDeadline: "12/5/2022 4:30 AM PST",
    disputeStatus: "Not Disputed",
    infractionImpacts: [
      "Wish removed this product listing on Jan 02, 2023.",
      "Wish will withhold payment for orders associated with this product starting Jan 02, 2023.",
    ],
    wssImpact: true,
    orderCancellationReason: "Store failed to fulfill order",
    orderId: "[63aba1de59904d0b04dd9538](#TODO)",
    orderStatus: "Refunded",
    orderTotal: "$48.00",
    wishLogisticsProgram: "Wish Express",
    availableForFulfillmentDate: "9/1/2022 3:04 AM PDT",
    confirmedFulfillmentDate: "9/6/2022 3.04 AM PDT",
    confirmedDeliveryDate: "N/A",
    autoRefundedDate: "9/6/2022 5:21 AM PDT",
    trackingStatus: "Delivered",
    trackingId: "63aba1de59904d0b04dd9538",
    carrier: "USPS",
    productImageUrl:
      "https://canary.contestimg.wish.com/api/webimage/5fe6e0d4cc961712a94fa711-small.jpg?cache_buster=-5000453595428830813",
    productName:
      "Skip Hop 200604 GREENWICH Simply Chic Diaper Backpack, Small, Medium, Large, X-Large",
    productId: "[63aba1de59904d0b04dd9538](#TODO)",
    sku: "WSH816523024078N",
    productDescription:
      "Enjoy laidback luxury with our vegan leather diaper backpack. Offering laidback lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec metus convallis hendrerit dapibus vel metus",
    brandName: "Skip Hop, Inc._Copyright",
    brandContactName: "Bharat Kapoor",
    brandPhoneNumber: "6562242717",
    brandEmail: "skiphopcops@sipi.in",
    infractionEvidence: [
      {
        type: "Store",
        id: "[63aba1de59904d0b04dd9538](#TODO)",
        note: "Your account has been inactive",
      },
      {
        type: "Store",
        id: "[63aba1de59904d0b04dd9538](#TODO)",
        note: "Your account has been inactive",
      },
    ],
    actions: (
      <>
        <EditYourProductListing />
        <ProvideProofOfAuthenticity />
        <Dispute />
        <GetProductAuthorization />
        <ReviewInfractionDetails />
        <AddressUnderlyingInfractions />
        <UpdateMaxDeliveryDays />
        <PayWishPostBalance />
      </>
    ),
  },
});
