/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

export type ConfirmDownloadModalProps = {
  readonly title: string;
  readonly text: string;
};

export default class ConfirmDownloadModal extends ConfirmationModal {
  constructor({ title, text }: ConfirmDownloadModalProps) {
    super(text);
    this.setHeader({
      title,
    })
      .setWidthPercentage(0.45)
      .setIllustration("clockCircleArrow")
      .setAction(i`Done`, () => {
        this.close();
      });
  }
}
