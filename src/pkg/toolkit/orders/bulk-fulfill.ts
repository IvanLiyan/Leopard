import gql from "graphql-tag";
import { useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  ActionRequiredOrdersCsvDownload,
  FulfillmentMutationActionRequiredOrdersCsvDownloadArgs,
} from "@schema/types";
import ConfirmDownloadModal from "@plus/component/orders/bulk-fulfill/ConfirmDownloadModal";
import { useToastStore } from "@merchant/stores/ToastStore";

export const REQUEST_DOWNLOAD_MUTATION = gql`
  mutation ActionRequiredOrdersCsvDownloadMutation(
    $input: ActionRequiredOrdersCsvDownloadInput!
  ) {
    fulfillment {
      actionRequiredOrdersCsvDownload(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

export type RequestDownloadMutationResponseType = {
  readonly fulfillment: {
    readonly actionRequiredOrdersCsvDownload: Pick<
      ActionRequiredOrdersCsvDownload,
      "ok" | "errorMessage"
    >;
  };
};

type RequestCSVEmailCallback = () => Promise<void>;

export const useRequestCSVEmail = (
  args: FulfillmentMutationActionRequiredOrdersCsvDownloadArgs
): RequestCSVEmailCallback => {
  const toastStore = useToastStore();
  const [requestDownload] = useMutation<
    RequestDownloadMutationResponseType,
    FulfillmentMutationActionRequiredOrdersCsvDownloadArgs
  >(REQUEST_DOWNLOAD_MUTATION, {
    variables: args,
  });

  return useCallback(async () => {
    // Uses selectedDownload along with dateRange if given to get template CSV
    const { data } = await requestDownload();
    const ok = data?.fulfillment.actionRequiredOrdersCsvDownload.ok;
    const errorMessage =
      data?.fulfillment.actionRequiredOrdersCsvDownload.errorMessage;

    if (!ok) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }

    new ConfirmDownloadModal({
      title: i`Processing Export`,
      text:
        i`Your orders are being processed into a CSV file. You will receive an ` +
        i`email with a link to download the file in 24 hours.`,
    }).render();
  }, [toastStore, requestDownload]);
};
