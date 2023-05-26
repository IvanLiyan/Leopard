import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Text } from "@ContextLogic/atlas-ui";
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
import ConfirmationModal from "@core/components/ConfirmationModal";
import Markdown from "@core/components/Markdown";

const SubmitRequestSection: React.FC = () => {
  const state = usePageState();
  const [jobId, setJobId] = useState<Maybe<string>>();
  const [modalOpen, setModalOpen] = useState(false);
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
        setJobId(resp.data.mfp.createProductsDownloadJob.jobId);
        setModalOpen(true);
      }
    } catch {
      toastStore.negative(ci18n("error message", "Something went wrong"));
    }
  };

  return (
    <>
      <ConfirmationModal
        title={i`Request submitted`}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        modalProps={{
          maxWidth: "lg",
        }}
      >
        <style jsx>{`
          div {
            padding: 16px 0px;
          }
        `}</style>
        <div>
          <Text variant="bodyL" sx={{ marginBottom: "4px" }}>
            You will receive your list of products eligible for this
            event/promotion by email within 24 hours.
          </Text>
          {jobId && (
            <Markdown
              pProps={{ variant: "bodyL" }}
              strongProps={{ variant: "bodyLStrong" }}
            >{i`Request Id: **${jobId}**`}</Markdown>
          )}
        </div>
      </ConfirmationModal>
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
    </>
  );
};

export default observer(SubmitRequestSection);
