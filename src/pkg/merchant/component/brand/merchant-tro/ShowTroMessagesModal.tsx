import React from "react";

/* Util */

/* Core Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ShowTroMessagesModalContent from "./ShowTroMessagesModalContent";

import { InjunctionAdminReply } from "@merchant/api/brand/merchant-tro";

export default class ShowTroMessagesModal extends Modal {
  replies: ReadonlyArray<InjunctionAdminReply>;
  constructor(
    plaintiffName: string,
    replies: ReadonlyArray<InjunctionAdminReply>
  ) {
    super(() => null);
    this.setHeader({ title: i`Messages about ${plaintiffName} injunction` });
    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.5);
    this.replies = replies;
  }

  renderContent() {
    return (
      <ShowTroMessagesModalContent
        replies={this.replies}
        onClose={() => this.close()}
      />
    );
  }
}
