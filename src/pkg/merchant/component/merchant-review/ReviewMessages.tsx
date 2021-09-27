// This file was grandfathered in. Disable this rule

/* eslint-disable local-rules/no-large-method-params */
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { ImageList } from "@merchant/component/core";
import ImageViewer from "@merchant/component/core/modal/ImageViewer";
import { Conversation } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { HorizontalField as Row } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Link } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant API */
import * as reauthApi from "@merchant/api/reauthentication";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";
import {
  MaterialProps,
  EntityProps,
  MessageProps,
  ReauthType,
} from "@toolkit/merchant-review/material-types";
import { TicketState } from "@merchant/component/merchant-review/StateLabel";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type PaymentProps = {
  readonly provider: string;
  readonly idField: string;
  readonly idValue: string;
};

export type ReviewMessagesData = {
  readonly ticketId: string;
  readonly reauthType: ReauthType;
  readonly isMerchant: boolean;
  readonly payment?: ReadonlyArray<PaymentProps>;
  readonly createdTime: string;
  readonly messages?: ReadonlyArray<MessageProps>;
  readonly state: TicketState;
  readonly hasOtherPaymentHold?: boolean;
};

export type ReviewMessagesProps = BaseProps & ReviewMessagesData;

// All kind of "ID"s passed in only need to be unique among siblings.
// There is a method to convert those IDs into a globally unique ID.

@observer
export default class ReviewMessages extends Component<ReviewMessagesProps> {
  @observable
  isOpen = true;

  @observable
  userToggleReauthTypeOpen: boolean | null | undefined = null;

  @observable
  messageOpenMap: Map<string, boolean> = new Map();

  @observable
  entityOpenMap: Map<string, boolean> = new Map();

  @observable
  disableConfirmChecked = false;

  componentDidMount() {
    const { isMerchant, messages, state } = this.props;
    const toastStore = ToastStore.instance();

    if (!isMerchant) {
      return;
    }

    if (state != "awaitingAdmin") {
      return;
    }

    if (!messages || messages.length == 0) {
      return;
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.isWish) {
      return;
    }

    const text = i`Your re-authentication materials are successfully submitted`;
    toastStore.positive(text, { timeoutMs: 4000 });
  }

  @computed
  get isReauthTypeOpen() {
    const { messages } = this.props;
    if (this.userToggleReauthTypeOpen != null) {
      return this.userToggleReauthTypeOpen;
    }
    return messages == null;
  }

  @computed
  get styles() {
    const contentKeyframes = {
      from: {
        transform: "translate3d(0, -10px, 0)",
        opacity: 0,
      },

      to: {
        transform: "translate3d(0, 0, 0)",
        opacity: 1,
      },
    };

    return StyleSheet.create({
      root: {
        color: palettes.textColors.Ink,
      },
      content: {
        padding: "20px 0px 4px 48px",
      },
      animated: {
        animationName: [contentKeyframes],
        animationDuration: "400ms",
      },
      space: {
        marginBottom: 16,
      },
      comment: {
        whiteSpace: "pre-line",
      },
      section: {
        width: "90%",
        marginRight: 20,
      },
      line: {
        borderBottom: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        width: "100%",
        height: 0,
      },
      username: {
        marginTop: 2,
        marginBottom: 2,
        fontSize: 16,
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightSemibold,
      },
      messageTime: {
        fontSize: 14,
        color: palettes.textColors.LightInk,
        fontWeight: fonts.weightSemibold,
        marginBottom: 16,
      },
      messageTitle: {
        fontSize: 16,
        lineHeight: "24px",
        fontWeight: fonts.weightSemibold,
        color: palettes.textColors.Ink,
        marginBottom: 16,
      },
      reauthTypeTable: {
        overflowX: "auto",
        border: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        borderRadius: 4,
      },
      entityName: {
        fontSize: 16,
        lineHeight: "24px",
        fontWeight: fonts.weightSemibold,
        color: palettes.textColors.Ink,
      },
      wishEntityName: {
        fontSize: 14,
      },
      materialContent: {
        fontSize: 16,
      },
      wishMaterialContent: {
        fontSize: 14,
        paddingRight: 24,
        fontWeight: fonts.weightMedium,
        color: palettes.textColors.DarkInk,
      },
      tip: {
        whiteSpace: "pre-wrap",
        fontSize: 12,
        lineHeight: 1.43,
        padding: 8,
        color: palettes.textColors.Ink,
      },
      rowValue: {
        lineHeight: 1.5,
      },
      learnMoreContainer: {
        fontSize: 14,
        lineHeight: "20px",
        color: palettes.coreColors.WishBlue,
        fontWeight: fonts.weightMedium,
        userSelect: "none",
        display: "flex",
      },
      learnMoreText: {
        cursor: "pointer",
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: "24px 24px 24px 48px",
      },
      requestDisableContainer: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-start",
      },
      confirmationText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontSize: 16,
        color: palettes.textColors.Ink,
      },
      checkBoxText: {
        fontSize: 16,
        color: palettes.textColors.Ink,
      },
    });
  }

  @action
  toggleMessageOpen = (messageId: string) => {
    const isOpen = this.messageOpen(messageId);
    this.messageOpenMap.set(messageId, !isOpen);
  };

  @action
  toggleEntityOpen = (param: {
    message: MessageProps;
    entityId: string;
    isOpen: boolean;
  }) => {
    const { message, entityId, isOpen } = param;

    if (message.isWish) {
      return;
    }
    const globalEntityId = this.globalId({
      messageId: message.messageId,
      entityId,
    });
    this.entityOpenMap.set(globalEntityId, isOpen);
  };

  globalId(ids: {
    messageId: string;
    entityId?: string;
    materialId?: string;
    imageId?: string;
  }) {
    const { messageId, entityId, materialId, imageId } = ids;
    let result = messageId;

    if (!entityId) {
      return result;
    }
    result += `_${entityId}`;

    if (!materialId) {
      return result;
    }
    result += `_${materialId}`;

    if (!imageId) {
      return result;
    }
    result += `_${imageId}`;

    return result;
  }

  convertToGlobalIdInImageGroup(param: {
    message: MessageProps;
    entityId: string;
    materialId: string;
    imageGroup: ImageGroupProps;
  }) {
    const { message, entityId, materialId, imageGroup } = param;
    const { images } = imageGroup;

    const result: ImageGroupProps = {
      groupId: this.globalId({
        messageId: message.messageId,
        entityId,
        materialId,
      }),
      groupTitle: message.time,
      images: [],
    };

    result.images = images.map((image) => {
      const globalId = this.globalId({
        messageId: message.messageId,
        entityId,
        materialId,
        imageId: image.imageId,
      });
      return {
        imageId: globalId,
        name: image.name,
        src: image.src,
      };
    });

    return result;
  }

  handleClickImage = (param: {
    currMessageId: string;
    currEntityId: string;
    currMaterial: MaterialProps;
    currImageGroup: ImageGroupProps;
    currImageId?: string;
  }) => {
    const {
      currMessageId,
      currEntityId,
      currMaterial,
      currImageGroup,
      currImageId,
    } = param;
    const viewImageGroups: ImageGroupProps[] = [];
    const { messages } = this.props;
    if (!messages) {
      return;
    }
    let currEntityName = "";
    for (const msg of messages) {
      if (msg.isWish) {
        continue;
      }
      const entities = msg.entities;
      for (const entity of entities) {
        if (entity.id != currEntityId) {
          continue;
        }
        currEntityName = entity.name;
        const mats = entity.materials;
        for (const mat of mats) {
          if (mat.type != "image") {
            continue;
          }
          if (mat.id === currMaterial.id) {
            if (mat.images) {
              const convertedImageGroup = this.convertToGlobalIdInImageGroup({
                message: msg,
                entityId: entity.id,
                materialId: mat.id,
                imageGroup: mat.images,
              });
              viewImageGroups.push(convertedImageGroup);
            }
          }
        }
      }
    }

    let selectedImageId = currImageId;
    if (!selectedImageId) {
      const images = currImageGroup.images;
      if (images && images.length > 0) {
        selectedImageId = images[0].imageId;
      }
    }

    const globalSelectedId = this.globalId({
      messageId: currMessageId,
      entityId: currEntityId,
      materialId: currMaterial.id,
      imageId: selectedImageId,
    });

    const currMaterialName = currMaterial.name || "";
    const imageViewer = new ImageViewer({
      imageGroups: viewImageGroups,
      selectedImageId: globalSelectedId || "",
      title: currEntityName + " > " + currMaterialName,
      showSidebar: true,
    });
    imageViewer.render();
  };

  confirmDisable = async () => {
    const { ticketId } = this.props;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    try {
      await reauthApi.requestDisable({ ticketId }).call();
    } catch (e) {
      toastStore.error(e.msg);
      return;
    }

    navigationStore.navigate("/account-balance");
  };

  showPaymentHoldConfirmation = () => {
    const text = () => {
      return (
        <div className={css(this.styles.confirmationText)}>
          <p>
            Your payment is withheld by multiple reasons. Disabling your account
            will only resolve the "invalid registration information" one.
          </p>
          <p>
            After your account is disabled, please go to Account Balance page to
            check for other hold reasons.
          </p>
          <p>Are you sure you want to continue?</p>
        </div>
      );
    };
    const modal = new ConfirmationModal(text);
    modal
      .setHeader({ title: i`Confirm to disable account` })
      .setOverflowY("hidden")
      .setAction(i`Continue`, this.showDisableConfirmation)
      .setCancel(i`Cancel`)
      .render();
  };

  showDisableConfirmation = () => {
    const { hasOtherPaymentHold } = this.props;
    let paymentText = i`Your remaining balance will be released in the next payment day.`;
    if (hasOtherPaymentHold) {
      paymentText =
        i`Your remaining balance will be released after` +
        i` you resolve all the hold reasons.`;
    }
    const checkBoxLabel = () => {
      return (
        <div className={css(this.styles.checkBoxText)}>
          I understand that the store will not be re-enabled. I confirm to
          disable my account.
        </div>
      );
    };

    /* the <ul> is exactly what I need here */

    /* eslint-disable local-rules/unnecessary-list-usage */
    const text = () => {
      return (
        <div className={css(this.styles.confirmationText)}>
          <p>Please read carefully and check the box below.</p>
          <p>Once your store is disabled:</p>
          <ul>
            <li>You won't be able to re-enable the store.</li>
            <li>Your products will not be available for sale.</li>
            <li>Your orders will be auto-refunded.</li>
            <li>Your PB credits will not be returned.</li>
            <li>{paymentText}</li>
          </ul>
          <p>
            <CheckboxField
              title={checkBoxLabel}
              wrapTitle
              checked={this.disableConfirmChecked}
              onChange={(checked) => (this.disableConfirmChecked = checked)}
            />
          </p>
        </div>
      );
    };
    const modal = new ConfirmationModal(text);
    modal
      .setHeader({ title: i`Confirm to disable account` })
      .setOverflowY("hidden")
      .setAction(i`Disable My Account`, this.confirmDisable)
      .setCancel(i`Cancel`)
      .setActionDisabled(() => !this.disableConfirmChecked)
      .render();
  };

  handleRequestDisable = async () => {
    const { hasOtherPaymentHold } = this.props;
    if (hasOtherPaymentHold) {
      this.showPaymentHoldConfirmation();
    } else {
      this.showDisableConfirmation();
    }
  };

  isLastMessage(messageId: string) {
    const { messages } = this.props;
    if (messages) {
      const lastMessageId = messages[messages.length - 1].messageId;
      return messageId == lastMessageId;
    }
    return false;
  }

  messageOpen(messageId: string) {
    const isOpen = this.messageOpenMap.get(messageId);
    if (isOpen == undefined) {
      return this.isLastMessage(messageId);
    }
    return isOpen;
  }

  entityOpen(message: MessageProps, entityId: string) {
    if (message.isWish) {
      return this.messageOpen(message.messageId);
    }

    const globalEntityId = this.globalId({
      messageId: message.messageId,
      entityId,
    });

    const isOpen = this.entityOpenMap.get(globalEntityId);
    if (isOpen == undefined) {
      return this.isLastMessage(message.messageId);
    }
    return isOpen;
  }

  renderOneMaterial = (
    material: MaterialProps,
    entityId: string,
    messageId: string,
  ) => {
    let content: ReactNode | null = null;
    const styles = this.styles;

    if (material.type == "text") {
      content = material.text;
    } else if (material.type == "choice") {
      const key = material.userChoice || "";
      const choices = material.choices || {};
      content = choices[key] || "";
    } else if (material.type == "image") {
      content = this.renderImageMaterialContent({
        material,
        entityId,
        messageId,
      });
    }

    let popoverContent: (() => ReactNode) | null = null;
    if (material.tip) {
      popoverContent = () => (
        <div className={css(styles.tip)}>{material.tip}</div>
      );
    }

    if (material.name) {
      return (
        <div key={material.id}>
          <Row
            title={material.name || ""}
            style={styles.space}
            titleWidth={220}
            popoverContent={popoverContent}
            popoverPosition="right center"
          >
            <div className={css(styles.rowValue)}>{content || "N/A"}</div>
          </Row>
          {material.comment && (
            <Row
              title={i`Merchant message`}
              style={styles.space}
              titleWidth={220}
            >
              <div className={css(styles.rowValue, styles.comment)}>
                {material.comment}
              </div>
            </Row>
          )}
        </div>
      );
    }
    return (
      <div className={css(styles.space)} key={material.id}>
        {content}
      </div>
    );
  };

  renderImageMaterialContent = (param: {
    material: MaterialProps;
    entityId: string;
    messageId: string;
  }) => {
    const { material, entityId, messageId } = param;

    if (!material.images) {
      return null;
    }
    const imageGroup = material.images;
    const { groupId, images } = imageGroup;
    const displayImageCount = 2;
    const hiddenImageCount = images.length - displayImageCount;
    const handleClickParam = {
      currMessageId: messageId,
      currEntityId: entityId,
      currMaterial: material,
      currImageGroup: imageGroup,
    };
    const { locale } = LocalizationStore.instance();
    return (
      <ImageList
        imageListId={groupId}
        moreImageCount={hiddenImageCount}
        onMoreButtonClick={() => this.handleClickImage(handleClickParam)}
        locale={locale}
      >
        {images.slice(0, displayImageCount).map((image) => (
          <ImageList.Image
            src={image.src}
            name={image.name}
            key={image.imageId}
            imageId={image.imageId}
            onClick={(imageId) =>
              this.handleClickImage({
                currImageId: imageId || "",
                ...handleClickParam,
              })
            }
          />
        ))}
      </ImageList>
    );
  };

  renderWishEntity = (param: {
    message: MessageProps;
    entity: EntityProps;
  }) => {
    const { message, entity } = param;
    const styles = this.styles;

    // Entity of Wish message only has one material.
    // Different materials in one merchant entity are
    // separated into different wish entities.
    // See reauthentication_admin_reply.py
    const material = entity.materials[0];
    if (!material) {
      return null;
    }

    const header = (
      <div className={css(styles.entityName, styles.wishEntityName)}>
        {entity.name} &gt; {material.name}
      </div>
    );

    return (
      <div
        className={css(styles.materialContent, styles.wishMaterialContent)}
        key={entity.id + "_" + material.id}
      >
        <Accordion
          header={() => header}
          headerPadding="0px 0 16px 0"
          chevronSize={11}
          isOpen={this.entityOpen(message, entity.id)}
          hideLines
          hideChevron
          backgroundColor={palettes.textColors.White}
          onOpenToggled={(isOpen: boolean) =>
            this.toggleEntityOpen({
              message,
              entityId: entity.id,
              isOpen,
            })
          }
        >
          {entity.extraValue && (
            <div className={css(styles.space)}>
              {entity.extraKey}:&nbsp;{entity.extraValue}
            </div>
          )}
          <div className={css(styles.space, styles.comment)}>
            {material.comment}
          </div>
        </Accordion>
      </div>
    );
  };

  renderMerchantEntity = (param: {
    message: MessageProps;
    entity: EntityProps;
  }) => {
    const { message, entity } = param;
    const styles = this.styles;

    const header = <div className={css(styles.entityName)}>{entity.name}</div>;
    return (
      <div className={css(styles.materialContent)} key={entity.id}>
        <div className={css(styles.line, styles.space)} />
        <Accordion
          header={() => header}
          headerPadding="0px 0 16px 0"
          chevronSize={11}
          isOpen={this.entityOpen(message, entity.id)}
          hideLines
          backgroundColor={palettes.textColors.White}
          onOpenToggled={(isOpen: boolean) =>
            this.toggleEntityOpen({
              message,
              entityId: entity.id,
              isOpen,
            })
          }
        >
          {entity.extraValue && (
            <Row
              title={entity.extraKey || i`Extra Value`}
              style={this.styles.space}
              titleWidth={220}
            >
              <div className={css(this.styles.rowValue)}>
                {entity.extraValue}
              </div>
            </Row>
          )}
          {entity.materials.map((material) =>
            this.renderOneMaterial(material, entity.id, message.messageId),
          )}
          {entity.comment && (
            <Row
              title={i`Merchant message`}
              style={this.styles.space}
              titleWidth={220}
            >
              <div className={css(this.styles.rowValue)}>{entity.comment}</div>
            </Row>
          )}
        </Accordion>
      </div>
    );
  };

  renderWishMessageContent = (message: MessageProps) => {
    return (
      <>
        {message.entities.map((entity) => {
          return this.renderWishEntity({
            message,
            entity,
          });
        })}
        <div className={css(this.styles.space, this.styles.learnMoreContainer)}>
          <div
            className={css(this.styles.learnMoreText)}
            onClick={() => this.toggleMessageOpen(message.messageId)}
          >
            {this.messageOpen(message.messageId)
              ? i`Collapse detail`
              : i`Check detail`}
          </div>
        </div>
      </>
    );
  };

  renderMerchantMessageContent = (message: MessageProps) => {
    return (
      <>
        {this.messageOpen(message.messageId) && (
          <div className={css(this.styles.animated, this.styles.section)}>
            {message.entities.map((entity) => {
              return this.renderMerchantEntity({
                message,
                entity,
              });
            })}
          </div>
        )}
        <div className={css(this.styles.space, this.styles.learnMoreContainer)}>
          <div
            className={css(this.styles.learnMoreText)}
            onClick={() => this.toggleMessageOpen(message.messageId)}
          >
            {this.messageOpen(message.messageId)
              ? i`Collapse detail`
              : i`Check detail`}
          </div>
        </div>
      </>
    );
  };

  renderOneMessage = (message: MessageProps) => {
    let content: ReactNode | null = null;
    const username = message.isWish
      ? i`Wish Merchant Support`
      : message.username;
    if (message.isWish) {
      content = this.renderWishMessageContent(message);
    } else {
      content = this.renderMerchantMessageContent(message);
    }
    const { locale } = LocalizationStore.instance();

    return (
      <Conversation.Item
        isWish={message.isWish}
        key={message.messageId}
        locale={locale}
      >
        <div className={css(this.styles.username)}>{username}</div>
        <div className={css(this.styles.messageTime)}>{message.time}</div>
        <div className={css(this.styles.messageTitle)}>
          {message.messageTitle}
        </div>
        {content}
      </Conversation.Item>
    );
  };

  renderATOType() {
    const { createdTime, payment } = this.props;
    const styles = this.styles;
    let count = 0;
    if (payment) {
      count = payment.length;
    }

    let text =
      i`The following account(s) are the one(s) that received` +
      i` payment from Wish recently. Please provide information` +
      i` of these accounts for re-authentication.`;
    if (count == 0) {
      text =
        i`You haven't received payment from Wish. Please provide letter` +
        i` of commitment for re-authentication.`;
    }
    text += " ";
    text +=
      i`During re-authentication, your payment will be temporarily` +
      i` withheld.`;

    const { locale } = LocalizationStore.instance();

    return (
      <Conversation.Item locale={locale} isWish>
        <div className={css(styles.username)}>Wish Merchant Support</div>
        <div className={css(styles.messageTime)}>{createdTime}</div>
        <div className={css(styles.messageTitle)}>
          Wish Fraud Protection: Re-authentication required.
        </div>
        {this.isReauthTypeOpen && (
          <div className={css(styles.animated, styles.section)}>
            <p className={css(styles.space)}>{text}</p>
            <p className={css(styles.space)}>Your payment account(s):</p>
            <Table
              hideBorder
              data={payment || []}
              style={[styles.space, styles.reauthTypeTable]}
            >
              <Table.Column title={i`Provider`} columnKey="provider" />
              <Table.Column title={i`ID Field`} columnKey="idField" />
              <Table.Column title={i`ID Value`} columnKey="idValue" />
            </Table>
          </div>
        )}
        <div className={css(styles.space, styles.learnMoreContainer)}>
          <div
            className={css(styles.learnMoreText)}
            onClick={() =>
              (this.userToggleReauthTypeOpen = !this.isReauthTypeOpen)
            }
          >
            {this.isReauthTypeOpen ? i`Collapse detail` : i`Check detail`}
          </div>
        </div>
      </Conversation.Item>
    );
  }

  renderReauthType = () => {
    if (this.props.reauthType === "ATO") {
      return this.renderATOType();
    }
    return null;
  };

  renderMessages = () => {
    return (
      <Conversation style={this.styles.content}>
        {this.renderReauthType()}
        {this.props.messages && this.props.messages.map(this.renderOneMessage)}
      </Conversation>
    );
  };

  renderRequestDisableButton = () => {
    if (this.props.reauthType !== "registration_info") {
      return;
    }

    return (
      <div className={css(this.styles.requestDisableContainer)}>
        <Link isRouterLink onClick={this.handleRequestDisable}>
          No longer want to continue? Disable account and release payment
        </Link>
      </div>
    );
  };

  renderAction = () => {
    const { isMerchant, state, reauthType, ticketId } = this.props;
    if (!isMerchant) {
      return null;
    }
    if (state != "new" && state != "awaitingMerchant") {
      return null;
    }

    const text =
      state == "new" ? i`Begin authentication` : i`Begin modification`;
    let href = "";
    if (state == "new") {
      if (reauthType == "ATO") {
        href = `/reauthentication-begin-payment/${ticketId}`;
      } else {
        // to do
      }
    } else {
      href = `/reauthentication-update-materials/${ticketId}`;
    }

    return (
      <div className={css(this.styles.buttonContainer)}>
        {this.renderRequestDisableButton()}
        <PrimaryButton href={href}>{text}</PrimaryButton>
      </div>
    );
  };

  render() {
    const { style } = this.props;
    return (
      <Card style={[this.styles.root, style]}>
        <Accordion
          header={i`Messages`}
          backgroundColor={palettes.textColors.White}
          isOpen={this.isOpen}
          onOpenToggled={(isOpen) => (this.isOpen = isOpen)}
        >
          {this.renderMessages()}
        </Accordion>
        {this.renderAction()}
      </Card>
    );
  }
}
