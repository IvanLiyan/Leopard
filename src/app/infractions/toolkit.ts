import { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { MessageGroup } from "@core/components/conversation/Conversation";
import { DisputeMessageSchema } from "@schema";

/*
    Testing IDs:
    - Order Level: 63aba1de59904d0b04dd9538
*/

export const useInfraction = (id: string) => {
  void id;
  return {
    data: {
      title: "Unfulfilled Order",
      body: "You did not fulfill the order within 5 calendar days",
      policy: "[Fulfillment Policy](#TODO)",
      faq: "[Unfulfilled Order FAQ](#TODO)",
      state: "Action Required",
      issuedDate: "9/6/2022 5:20 AM PDT",
      disputeByDate: "12/5/2022 4:30 AM PST",
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
    },
  };
};

export const useMessages = (id: string): ReadonlyArray<MessageGroup> => {
  void id;
  const data: ReadonlyArray<
    Omit<DisputeMessageSchema, "date" | "type"> & {
      readonly date: Pick<DisputeMessageSchema["date"], "datetime">;
    }
  > = [
    {
      senderType: "ADMIN",
      senderName: "Wish Merchant Service",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message:
        "We have reviewed your appeal and approved your request for payment release.",
      files: [],
    },
    {
      senderType: "MERCHANT",
      senderName: "John Doe",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message:
        "Here is the proof the item in question is a legitimate branded product.",
      files: [],
    },
    {
      senderType: "ADMIN",
      senderName: "Wish Merchant Service",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message: "We have reviewed.",
      files: [],
    },
    {
      senderType: "MERCHANT",
      senderName: "John Doe",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message: "Here is the.",
      files: [],
    },
    {
      senderType: "ADMIN",
      senderName: "Wish Merchant Service",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message:
        "We have reviewed your appeal and approved your request for payment release.",
      files: [],
    },
    {
      senderType: "MERCHANT",
      senderName: "John Doe",
      date: {
        datetime: "2018-01-19 02:03",
      },
      message:
        "Here is the proof the item in question is a legitimate branded product.",
      files: [],
    },
  ];

  return [
    {
      messages: data.map(
        ({
          senderType,
          senderName: author,
          date: { datetime: dateSent },
          message,
          files,
        }) => ({
          type: senderType == "ADMIN" ? "RECEIVED" : "SENT",
          author,
          dateSent,
          message: message ?? "", // TODO: fix handling when adding in file support
          files,
        }),
      ),
    },
    {
      title: "Day 1",
      messages: data.map(
        ({
          senderType,
          senderName: author,
          date: { datetime: dateSent },
          message,
          files,
        }) => ({
          type: senderType == "ADMIN" ? "RECEIVED" : "SENT",
          author,
          dateSent,
          message: message ?? "", // TODO: fix handling when adding in file support
          files,
        }),
      ),
    },
    {
      title: "Day 2",
      messages: data.map(
        ({
          senderType,
          senderName: author,
          date: { datetime: dateSent },
          message,
          files,
        }) => ({
          type: senderType == "ADMIN" ? "RECEIVED" : "SENT",
          author,
          dateSent,
          message: message ?? "", // TODO: fix handling when adding in file support
          files,
        }),
      ),
    },
  ];
};

export const useInfractionDetailsStylesheet = () => {
  const { surfaceLight } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      content: {
        display: "grid",
        gridGap: 24,
        [`@media ${IS_SMALL_SCREEN}`]: {
          gridTemplateColumns: "1fr",
        },
        [`@media ${IS_LARGE_SCREEN}`]: {
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
        },
        marginTop: 24,
      },
      column: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: 16,
      },
      cardRoot: {
        padding: 16,
      },
      divider: {
        margin: "10px 0px",
      },
      bodyText: {
        padding: 16,
        backgroundColor: surfaceLight,
      },
      cardItem: {
        ":not(:first-child)": {
          marginTop: 12,
        },
      },
    });
  }, [surfaceLight]);
};
