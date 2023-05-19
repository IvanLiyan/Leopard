import React from "react";
import { observer } from "mobx-react";
import { Button } from "@ContextLogic/atlas-ui";
import SubmitRequestInfoCard from "./SubmitRequestInfoCard";
import { usePageState } from "@promotions/eligible-products-csv/StateContext";
import {
  CREATE_JOB_MUTATION,
  CreateJobMutationResponse,
  CreateJobMutationVariables,
} from "@promotions/eligible-products-csv/api/createJobMutation";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import { ci18n } from "@core/toolkit/i18n";

const SubmitRequestSection: React.FC = () => {
  const state = usePageState();
  const toastStore = useToastStore();

  const [createJob, { loading }] = useMutation<
    CreateJobMutationResponse,
    CreateJobMutationVariables
  >(CREATE_JOB_MUTATION);

  const onSubmit = async () => {
    if (!state.promotionType) {
      // promotionType check is for TS, will be blocked from calling this function by isValid check
      return;
    }

    try {
      const resp = await createJob({
        variables: {
          input: {
            promotionType: state.promotionType,
            eventId: state.eventId,
          },
        },
      });

      if (!resp.data?.mfp?.createProductsDownloadJob.ok) {
        toastStore.negative(
          resp.data?.mfp?.createProductsDownloadJob.message ??
            ci18n("error message", "Something went wrong"),
        );
      } else {
        toastStore.positive(
          i`Your submission has been received, please check your email in the next 24 hours`,
        );
      }
    } catch {
      toastStore.negative(ci18n("error message", "Something went wrong"));
    }
  };

  return (
    <div>
      <style jsx>{`
        div {
          display: grid;
          gap: 16px;
          justify-items: left;
        }
      `}</style>
      <SubmitRequestInfoCard sx={{ maxWidth: "400px" }} />
      <Button
        onClick={() => {
          void onSubmit();
        }}
        disabled={!state.isValid || loading}
      >
        Submit Request
      </Button>
    </div>
  );
};

export default observer(SubmitRequestSection);
