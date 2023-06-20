import React from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { Heading, Stack, Text } from "@ContextLogic/atlas-ui";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import Illustration from "@core/components/Illustration";
import Link from "@core/components/Link";

type FrsOptedInModalProps = Pick<ModalProps, "open"> & {
  readonly onClose: () => unknown;
};

const FrsOptedInModal: React.FC<FrsOptedInModalProps> = ({ open, onClose }) => {
  const { textDark } = useTheme();

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="sm">
      <Stack alignItems="center" sx={{ padding: "28px" }}>
        <Icon
          name="x"
          size={24}
          color={textDark}
          onClick={onClose}
          style={{ alignSelf: "flex-end" }}
        />
        <Illustration
          name="homeFrsOptInModal"
          alt={i`Flat Rate Shipping Is Now Live`}
          style={{ marginTop: "28px", height: "116px" }}
        />
        <Heading variant="h2" sx={{ marginTop: "28px", marginBottom: "12px" }}>
          Flat Rate Shipping Is Now Live
        </Heading>
        <Text component="div" sx={{ textAlign: "center" }}>
          If you enrolled in flat rate shipping before June 12, then you have no
          changes.
        </Text>
        <Text component="div" sx={{ marginTop: "12px", textAlign: "center" }}>
          If you did not enroll in flat rate shipping before June 12, then your
          store has been automatically enrolled in flat rate shipping, which is
          live to customers. Please see the{" "}
          <Link
            // hardcoded link since this format isn't compatible with zendeskUrl, please don't repeat
            href={
              "https://merchanthelp.wish.com/s/article/Flat-Rate-Shipping-Enhancements-for-Advanced-Logistics-Program-Orders"
            }
            openInNewTab
          >
            Flat Rate Shipping FAQ
          </Link>{" "}
          to learn more.
        </Text>
      </Stack>
      <ModalFooter
        action={{
          text: ci18n("Call to action on a modal", "Got it"),
          onClick: () => {
            void onClose();
          },
        }}
      />
    </Modal>
  );
};

export default observer(FrsOptedInModal);
