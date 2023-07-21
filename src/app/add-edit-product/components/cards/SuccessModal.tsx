import React from "react";
import { Card, Heading, Stack, Text } from "@ContextLogic/atlas-ui";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import Illustration from "@core/components/Illustration";
import Markdown from "@core/components/Markdown";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { merchFeUrl, useRouter } from "@core/toolkit/router";

type Props = Pick<ModalProps, "open"> & {
  readonly state: AddEditProductState;
  readonly onClose: () => unknown;
};

const SuccessModal: React.FC<Props> = ({ open, state, onClose }) => {
  const router = useRouter();
  const { savedProductId } = state;

  const fpDescription =
    i`...for changes to the following fields:${"\n\n"}` +
    i`- Title${"\n\n"}` +
    i`- Description${"\n\n"}` +
    i`- Image${"\n\n"}` +
    i`- Category${"\n\n"}` +
    i`- GTIN${"\n\n"}` +
    i`- Variation option${"\n\n"}` +
    i`- Video`;

  const onDismiss = () => {
    void router.push(merchFeUrl(`/products/listing-status/${savedProductId}`));
    onClose();
  };

  return (
    <Modal open={open} onClose={onDismiss} maxWidth="lg">
      <Stack direction="column" alignItems="center" sx={{ padding: "36px" }}>
        <Illustration
          name="productsParcel"
          alt={i`image of products parcel`}
          style={{ height: "160px" }}
        />
        <Heading variant="h3" sx={{ marginTop: "16px" }}>
          Your changes have been submitted. When will they go live?
        </Heading>
        <Stack direction="row" sx={{ gap: "24px", marginTop: "36px" }}>
          <Card sx={{ flex: 1, padding: "16px" }}>
            <Stack direction="column" sx={{ gap: "8px" }}>
              <Heading variant="h3">
                {ci18n("Time product update will go live", "2-3 days")}
              </Heading>
              <Markdown>{fpDescription}</Markdown>
            </Stack>
          </Card>
          <Card sx={{ flex: 1, padding: "16px" }}>
            <Stack direction="column" sx={{ gap: "8px" }}>
              <Heading variant="h3">
                {ci18n("Time product update will go live", "Within a day")}
              </Heading>
              <Text>
                {ci18n(
                  "Description of what kind of field edits will go live within a day: edits to fields other than the given list",
                  "...for edits to other fields of an existing listing.",
                )}
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Stack>
      <ModalFooter
        action={{
          text: ci18n("CTA button", "Got it"),
          onClick: onDismiss,
        }}
      />
    </Modal>
  );
};

export default SuccessModal;
