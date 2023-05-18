import React from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { CountryCode } from "@schema";
import Markdown from "@core/components/Markdown";
import { Card, Text } from "@ContextLogic/atlas-ui";
import { useMutation, useQuery } from "@apollo/client";
import {
  TosQueryResponse,
  TosQueryVariables,
  TOS_QUERY,
  ACCEPT_TOS_MUTATION,
  AcceptTosMutationResponse,
  AcceptTosMutationVariables,
} from "@product-compliance-center/api/tosGql";
import Skeleton from "@core/components/Skeleton";
import { useToastStore } from "@core/stores/ToastStore";
import css from "styled-jsx/css";

const { className, styles } = css.resolve`
  div :global(:not(:last-child)) {
    margin-bottom: 8px;
  }
`;

export type Props = Required<Pick<ModalProps, "open">> & {
  readonly country: CountryCode;
  readonly onAccept: () => unknown;
} & (
    | (Required<Pick<ModalProps, "onClose">> & {
        readonly blocking?: never;
      })
    | {
        readonly onClose?: never;
        readonly blocking: true;
      }
  );

const TosModal: React.FC<Props> = ({
  open,
  onClose,
  country,
  onAccept,
  blocking,
}) => {
  const toastStore = useToastStore();

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<TosQueryResponse, TosQueryVariables>(TOS_QUERY, {
    variables: {
      countryCode: country,
    },
  });

  const tos =
    data?.policy?.productCompliance?.extendedProducerResponsibility.country.tos;

  const [acceptTos, { loading: mutationLoading }] = useMutation<
    AcceptTosMutationResponse,
    AcceptTosMutationVariables
  >(ACCEPT_TOS_MUTATION);

  const onAgree = async () => {
    try {
      const resp = await acceptTos({ variables: { input: { country } } });

      if (
        !resp.data?.policy?.productCompliance?.extendedProducerResponsibility
          .acceptTos.ok
      ) {
        toastStore.negative(
          resp.data?.policy?.productCompliance?.extendedProducerResponsibility
            .acceptTos.message ??
            ci18n("error message", "Something went wrong"),
        );
      } else {
        toastStore.positive(i`Your change has been submitted successfully`);
        onAccept();
      }
    } catch {
      toastStore.negative(ci18n("error message", "Something went wrong"));
    }
  };

  return (
    <Modal open={open} onClose={onClose} fullWidth maxWidth={"lg"}>
      <ModalTitle
        title={i`Accept Terms of Service`}
        onClose={(e) => {
          onClose && onClose(e, "backdropClick");
        }}
        hideCloseButton={blocking}
      />
      <Text variant="bodyLStrong" sx={{ margin: "20px 25px 10px 25px" }}>
        Before continuing, please agree to the following terms of service:
      </Text>
      {queryLoading ? (
        <Skeleton
          height="50vh"
          sx={{
            margin: "10px 25px 20px 25px",
          }}
        />
      ) : queryError || tos == null ? (
        <Text variant="bodyLStrong">Something went wrong.</Text>
      ) : (
        <Card
          sx={{
            margin: "10px 25px 20px 25px",
            padding: "16px",
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
        >
          {styles}
          <Markdown className={className}>{tos}</Markdown>
        </Card>
      )}
      <ModalFooter
        cancel={
          blocking
            ? undefined
            : {
                text: ci18n("CTA button", "Cancel"),
                onClick: () => {
                  onClose({}, "backdropClick");
                },
                disabled: mutationLoading,
              }
        }
        action={{
          text: ci18n("CTA button", "Agree"),
          onClick: onAgree,
          isDisabled: queryLoading || mutationLoading,
        }}
      />
    </Modal>
  );
};

export default observer(TosModal);
