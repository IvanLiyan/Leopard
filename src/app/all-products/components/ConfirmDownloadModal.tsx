import ConfirmationModal, {
  ConfirmationModalProps,
} from "@core/components/ConfirmationModal";
import { observer } from "mobx-react";

export type ConfirmDownloadModalProps = Omit<
  ConfirmationModalProps,
  "illustration"
>;

const ConfirmDownloadModal: React.FC<ConfirmDownloadModalProps> = (props) => {
  return <ConfirmationModal {...props} illustration="clockCircleArrow" />;
};

export default observer(ConfirmDownloadModal);
