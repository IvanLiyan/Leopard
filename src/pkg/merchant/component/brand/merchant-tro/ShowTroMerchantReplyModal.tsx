//
import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ShowTroMerchantReplyContent from "./ShowTroMerchantReplyContent";

import { InjunctionMerchantReply } from "@merchant/api/brand/merchant-tro";
import { ReplyType } from "@merchant/api/brand/merchant-tro";

export type ShowMerchantReplyModalProps = {
  readonly reply: InjunctionMerchantReply;
};

export default class ShowTroMerchantReplyModal extends Modal {
  parentProps: ShowMerchantReplyModalProps;

  constructor(props: ShowMerchantReplyModalProps) {
    super(() => null);
    this.parentProps = props;

    const { reply } = props;
    const ReplyMessages: { [key in ReplyType]: string } = {
      HIRED_LAWYER: i`Provided lawyer details`,
      NORMAL_REPLY: i`Sent message`,
      RESOLVED: i`Sent case resolution details`,
    };

    this.setHeader({ title: ReplyMessages[reply.reply_type] });
    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    const { reply } = this.parentProps;

    return (
      <ShowTroMerchantReplyContent reply={reply} onClose={() => this.close()} />
    );
  }
}
