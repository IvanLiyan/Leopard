import React, { useState } from "react";
import { observer } from "mobx-react";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Accordion from "@infractions/components/Accordion";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import HorizontalField, {
  Props as HorizontalFieldProps,
} from "@infractions/components/HorizontalField";
import { TextInput } from "@ContextLogic/lego";
import SecureFileInput, { Attachment } from "@core/components/SecureFileInput";
import ModalFooter from "@core/components/modal/ModalFooter";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useMutation } from "@apollo/client";
import {
  SubmitDisputeMutationResponse,
  SubmitDisputeMutationVariables,
  SUBMIT_DISPUTE_MUTATION,
} from "@infractions/api/submitDisputeMutation";
import { useToastStore } from "@core/stores/ToastStore";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { ci18n } from "@core/toolkit/i18n";

const BrandedProductGeoblockDispute: React.FC = () => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id: infractionId, actions },
  } = useInfractionContext();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const [explanation, setExplanation] = useState<string | undefined>(undefined);
  const [documentation, setDocumentation] = useState<ReadonlyArray<Attachment>>(
    [],
  );

  const [submitDispute, { loading }] = useMutation<
    SubmitDisputeMutationResponse,
    SubmitDisputeMutationVariables
  >(SUBMIT_DISPUTE_MUTATION);

  const onSubmit = async () => {
    try {
      const resp = await submitDispute({
        variables: {
          action: "LISTING_LEVEL_DISPUTE",
          infractionId,
          disputeInput: {
            explanation,
            disputeProof:
              documentation.length > 0
                ? documentation.map(({ url, fileName }) => ({
                    url,
                    fileName,
                  }))
                : undefined,
          },
        },
      });

      if (!resp.data?.policy?.merchantWarning?.upsertMerchantWarning?.ok) {
        toastStore.negative(
          resp.data?.policy?.merchantWarning?.upsertMerchantWarning?.message ??
            i`Something went wrong.`,
        );
      } else {
        toastStore.positive(i`Your dispute was successfully submitted.`, {
          deferred: true,
        });
        await navigationStore.navigate(`/warnings/warning?id=${infractionId}`);
      }
    } catch {
      toastStore.negative(i`Something went wrong.`);
    }
  };

  const hFieldProps: Partial<HorizontalFieldProps> = {
    titleWidth: 200,
  };

  const canDispute = actions.includes("DISPUTE");
  const canSubmit = !!explanation && documentation.length > 0;

  return (
    <Accordion defaultExpanded title={i`Dispute Details`}>
      <div className={css(styles.column, { padding: 16 })}>
        {canDispute ? (
          <>
            <Heading variant="h5" sx={{ padding: "6px 0px" }}>
              Provide detailed information to support your dispute.
            </Heading>
            <HorizontalField
              title={ci18n("title for field", "Explanation")}
              info={i`Explain how Wish made a mistake in issuing this infraction.`}
              {...hFieldProps}
            >
              <TextInput
                isTextArea
                height={91}
                value={explanation}
                onChange={({ text }) => {
                  setExplanation(text);
                }}
                placeholder={i`Explain how you have not committed this infraction.`}
              />
            </HorizontalField>
            <HorizontalField
              title={ci18n(
                "title for field",
                "Proof of brand authorization in select jurisdiction(s)",
              )}
              info={i`Provide evidence to support your claims above.`}
              {...hFieldProps}
            >
              <SecureFileInput
                accepts=".pdf,.jpeg,.png"
                maxSizeMB={5}
                maxAttachments={1}
                attachments={documentation}
                onAttachmentsChanged={(attachments) => {
                  setDocumentation(attachments);
                }}
                bucket="TEMP_UPLOADS_V2"
              />
            </HorizontalField>
          </>
        ) : (
          <Text>
            You cannot create a new dispute for this infraction at this time.
          </Text>
        )}
      </div>
      <ModalFooter
        action={
          canDispute
            ? {
                text: i`Submit`,
                onClick: onSubmit,
                isDisabled: loading || !canSubmit,
              }
            : undefined
        }
        cancel={{
          text: i`Cancel`,
          href: `/warnings/warning?id=${infractionId}`,
          disabled: loading,
        }}
      />
    </Accordion>
  );
};

export default observer(BrandedProductGeoblockDispute);
