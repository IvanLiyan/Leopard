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
      cardMarginSmall: {
        ":not(:first-child)": {
          marginTop: 8,
        },
      },
      cardMargin: {
        ":not(:first-child)": {
          marginTop: 12,
        },
      },
      cardMarginLarge: {
        ":not(:first-child)": {
          marginTop: 16,
        },
      },
    });
  }, [surfaceLight]);
};
