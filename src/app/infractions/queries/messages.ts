// will be un-mocked in MAL-258
import { MessageGroup } from "@core/components/conversation/Conversation";
import { DisputeMessageSchema } from "@schema";

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
          message: message ?? "",
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
          message: message ?? "",
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
          message: message ?? "",
          files,
        }),
      ),
    },
  ];
};
