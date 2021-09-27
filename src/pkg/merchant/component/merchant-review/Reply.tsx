import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed, action } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { RadioGroup } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { HorizontalField as Row } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { RequiredValidator } from "@toolkit/validators";

/* Toolkit */
import { callAsync } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import {
  MaterialProps,
  EntityProps,
} from "@toolkit/merchant-review/material-types";
import { TicketState } from "@merchant/component/merchant-review/StateLabel";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import DimenStore from "@merchant/stores/DimenStore";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";

type ActionType = "requestInfo" | "approve" | "reject";

type OptionType = { readonly value: string; readonly text: string };
class CheckedMaterial {
  @observable
  entityId: string;

  @observable
  entityName: string;

  @observable
  materialId: string;

  @observable
  materialName: string;

  @observable
  comment: string | null | undefined;

  constructor(param: {
    entityId: string;
    entityName: string;
    materialId: string;
    materialName: string;
    comment?: string | null | undefined;
  }) {
    this.entityId = param.entityId;
    this.entityName = param.entityName;
    this.materialId = param.materialId;
    this.materialName = param.materialName;
    this.comment = param.comment;
  }
}

// Reviewer can request a change of one or multiple materials in an entity
export type ReplyData = {
  readonly ticketId: string;
  readonly replyEntities: ReadonlyArray<EntityProps>;
  readonly state: TicketState;
};

export type ReplyProps = BaseProps & ReplyData;

@observer
export default class Reply extends Component<ReplyProps> {
  @observable
  entityOpenMap: Map<string, boolean> = new Map();

  @observable
  actionType: ActionType | null | undefined;

  @observable
  checkedMaterials: Map<string, CheckedMaterial> = new Map();

  @computed
  get styles() {
    const { pageGuideX } = DimenStore.instance();

    return StyleSheet.create({
      root: {
        color: palettes.textColors.Ink,
      },
      cardTitle: {
        color: palettes.textColors.Ink,
        fontSize: 20,
        fontWeight: fonts.weightSemibold,
        lineHeight: "28px",
        margin: "24px 0 28px 26px",
      },
      entity: {
        marginLeft: 26,
      },
      entityTitle: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        lineHeight: "24px",
      },
      line: {
        marginTop: 8,
        marginBottom: 8,
        borderBottom: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        height: 0,
        width: "100%",
      },
      row: {
        marginTop: 16,
        display: "flex",
        ":last-child": {
          marginBottom: 16,
        },
      },
      columnInputs: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "90%",
        marginRight: 24,
        marginBottom: 8,
        ":last-child": {
          marginBottom: 0,
        },
      },
      option: {
        fontSize: 16,
        lineHeight: "24px",
        ":nth-child(1n+2)": {
          marginTop: 8,
        },
      },
      textArea: {
        width: "100%",
        marginTop: 8,
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: "16px 24px 24px 24px",
      },
      confirmationBody: {
        marginLeft: pageGuideX,
        marginRight: pageGuideX,
      },
      confirmationTitle: {
        fontSize: 20,
        lineHeight: "28px",
        fontWeight: fonts.weightMedium,
        margin: 28,
        textAlign: "center",
      },
      confirmationApprove: {
        fontSize: 20,
        lineHeight: "28px",
        fontWeight: fonts.weightMedium,
        margin: 50,
        textAlign: "center",
      },
      reasonRow: {
        display: "flex",
        marginBottom: 16,
      },
      reasonIndex: {
        fontSize: 16,
        minWidth: 50,
        lineHeight: "24px",
        color: palettes.textColors.DarkInk,
      },
      reasonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      },
      reasonEntity: {
        fontSize: 16,
        lineHeight: "24px",
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightMedium,
      },
      reasonComment: {
        fontSize: 14,
        color: palettes.textColors.Ink,
      },
    });
  }

  @action
  toggleCheckMaterial(param: {
    entity: EntityProps;
    material: MaterialProps;
    checked: boolean;
  }) {
    const { entity, material, checked } = param;
    const globalId = this.globalId(entity.id, material.id);
    if (this.checkedMaterials.has(globalId) && !checked) {
      this.checkedMaterials.delete(globalId);
    } else if (!this.checkedMaterials.has(globalId) && checked) {
      this.checkedMaterials.set(
        globalId,
        new CheckedMaterial({
          entityId: entity.id,
          entityName: entity.name,
          materialId: material.id,
          materialName: material.name || "",
        }),
      );
    }
  }

  @action
  toggleEntityOpen(entityId: string, isOpen: boolean) {
    this.entityOpenMap.set(entityId, isOpen);
  }

  handleCommentChange(param: {
    entityId: string;
    materialId: string;
    event: OnTextChangeEvent;
  }) {
    const { entityId, materialId, event } = param;
    const globalId = this.globalId(entityId, materialId);
    const material = this.checkedMaterials.get(globalId);
    if (material) {
      material.comment = event.text.trim();
    }
  }

  isMaterialChecked(entityId: string, materialId: string) {
    const globalId = this.globalId(entityId, materialId);
    return this.checkedMaterials.has(globalId);
  }

  isEntityOpen(entityId: string) {
    const isOpen = this.entityOpenMap.get(entityId);
    if (isOpen == undefined) {
      return true;
    }
    return isOpen;
  }

  getComment(entityId: string, materialId: string) {
    const globalId = this.globalId(entityId, materialId);
    const material = this.checkedMaterials.get(globalId);
    if (material) {
      return material.comment || "";
    }
    return "";
  }

  globalId(entityId: string, materialId: string) {
    return `${entityId}_${materialId}`;
  }

  checkReplyValid() {
    const toastStore = ToastStore.instance();

    if (this.actionType == null) {
      toastStore.error(i`Please choose an action.`, { timeoutMs: 3000 });
      return false;
    }

    if (this.actionType == "approve") {
      return true;
    }

    let hasMaterialChecked = false;
    for (const material of this.checkedMaterials.values()) {
      hasMaterialChecked = true;
      if (!material.comment) {
        toastStore.error(
          i`Please fill in the detail reason for all selected materials.`,
          { timeoutMs: 3000 },
        );
        return false;
      }
    }

    if (!hasMaterialChecked) {
      toastStore.error(i`Please select at least one material.`, {
        timeoutMs: 3000,
      });
      return false;
    }

    return true;
  }

  confirmReply = () => {
    if (!this.checkReplyValid()) {
      return;
    }

    let header = i`Approve re-authentication request`;
    if (this.actionType == "requestInfo") {
      header = i`Request material change`;
    } else if (this.actionType == "reject") {
      header = i`Reject re-authentication request`;
    }

    let body: ReactNode | null = null;
    if (this.actionType == "approve") {
      body = (
        <div className={css(this.styles.confirmationApprove)}>
          Confirm to approve this re-authentication request?
        </div>
      );
    } else if (this.actionType == "requestInfo") {
      body = (
        <div className={css(this.styles.confirmationBody)}>
          <div className={css(this.styles.confirmationTitle)}>
            Confirm to request changes of these materials?
          </div>
          {this.renderConfirmationReason()}
        </div>
      );
    } else {
      body = (
        <div className={css(this.styles.confirmationBody)}>
          <div className={css(this.styles.confirmationTitle)}>
            Confirm to reject the request for these reasons?
          </div>
          {this.renderConfirmationReason()}
        </div>
      );
    }

    const modal = new ConfirmationModal(() => body);
    modal
      .setHeader({ title: header })
      .setAction(i`Confirm`, this.submitReply)
      .setCancel(i`Cancel`)
      .render();
  };

  submitReply = async () => {
    const { actionType, checkedMaterials } = this;
    const navigationStore = NavigationStore.instance();
    const param = {
      ticketId: this.props.ticketId || "",
      actionType,
      checkedMaterials: "",
    };
    if (actionType == "requestInfo" || actionType == "reject") {
      const mats: { [key: string]: any } = {};
      const globalIds = checkedMaterials.keys();
      for (const globalId of globalIds) {
        const mat = checkedMaterials.get(globalId);
        if (mat) {
          mats[globalId] = mat.comment;
        }
      }
      param.checkedMaterials = JSON.stringify(mats);
    }

    // TODO: migrate this call https://phab.wish.com/w/webpack/api-calls/
    // eslint-disable-next-line local-rules/no-untyped-api-calls
    await callAsync("reauthentication-admin-reply", param);
    navigationStore.reload();
  };

  renderConfirmationReason() {
    let index = 1;
    const reasons: ReactNode[] = [];
    for (const material of this.checkedMaterials.values()) {
      const { entityName, materialName, comment } = material;
      const reason = (
        <div className={css(this.styles.reasonRow)} key={index}>
          <div className={css(this.styles.reasonIndex)}>{index}</div>
          <div className={css(this.styles.reasonContainer)}>
            <div className={css(this.styles.reasonEntity)}>
              {entityName} &gt; {materialName}
            </div>
            <div className={css(this.styles.reasonComment)}>{comment}</div>
          </div>
        </div>
      );
      reasons.push(reason);
      index++;
    }
    return reasons;
  }

  renderOneOption(entity: EntityProps, material: MaterialProps) {
    let commentArea: ReactNode | null = null;
    if (this.isMaterialChecked(entity.id, material.id)) {
      commentArea = (
        <TextInput
          style={this.styles.textArea}
          isTextArea
          validators={[new RequiredValidator()]}
          rows={3}
          placeholder={i`Explain the reason`}
          padding={12}
          verticalPadding
          onChange={(e) =>
            this.handleCommentChange({
              entityId: entity.id,
              materialId: material.id,
              event: e,
            })
          }
        />
      );
    }
    return (
      <div className={css(this.styles.columnInputs)} key={material.id}>
        <CheckboxField
          title={material.name || ""}
          checked={this.isMaterialChecked(entity.id, material.id)}
          onChange={(checked) => {
            this.toggleCheckMaterial({
              entity,
              material,
              checked,
            });
          }}
          style={this.styles.option}
        />
        {commentArea}
      </div>
    );
  }

  renderOneEntity = (entity: EntityProps) => {
    const { materials, extraKey, extraValue } = entity;
    const styles = this.styles;
    let extraInfo: ReactNode | [] = null;
    if (extraKey) {
      extraInfo = (
        <Row title={extraKey} titleWidth={300} style={styles.row}>
          <div className={css(styles.option)}>{extraValue}</div>
        </Row>
      );
    }
    const entityTitle = (
      <div className={css(styles.entityTitle)}>{entity.name}</div>
    );
    return (
      <div key={entity.id}>
        <div className={css(styles.line)} />
        <div className={css(styles.entity)}>
          <Accordion
            header={() => entityTitle}
            isOpen={this.isEntityOpen(entity.id)}
            onOpenToggled={(isOpen) => this.toggleEntityOpen(entity.id, isOpen)}
            backgroundColor={palettes.textColors.White}
            headerPadding="0"
            hideLines
          >
            {extraInfo}
            <Row title={i`Material name`} titleWidth={300} style={styles.row}>
              {materials.map((material) =>
                this.renderOneOption(entity, material),
              )}
            </Row>
          </Accordion>
        </div>
      </div>
    );
  };

  renderEntities(): ReadonlyArray<ReactNode> | null | undefined {
    if (this.actionType == "approve") {
      return null;
    }
    const { replyEntities } = this.props;
    if (!replyEntities) {
      return null;
    }
    return replyEntities.map(this.renderOneEntity);
  }

  render() {
    const { state, style } = this.props;
    if (state == "approved" || state == "rejected" || state == "new") {
      return null;
    }

    const { locale } = LocalizationStore.instance();
    const isZh = locale == "zh";

    const optionApprove = {
      value: "approve",
      text: isZh ? "批准" : i`Approve`,
    };
    const optionRequestInfo = {
      value: "requestInfo",
      text: isZh ? "修改" : i`Request Info`,
    };
    const optionReject = {
      value: "reject",
      text: isZh ? "拒绝" : i`Reject`,
    };

    let options: OptionType[] = [];
    if (state != "awaitingAdmin") {
      options = [optionApprove, optionReject];
    } else {
      options = [optionRequestInfo, optionApprove, optionReject];
    }

    const styles = this.styles;
    return (
      <Card style={[styles.root, style]}>
        <div className={css(styles.cardTitle)}>Reply to Merchant</div>
        <div className={css(styles.entity)}>
          <div className={css(styles.entityTitle)}>Action type</div>
          <Row
            title={i`Choose action type`}
            titleWidth={300}
            style={styles.row}
          >
            <RadioGroup
              style={this.styles.columnInputs}
              onSelected={(value) => {
                this.actionType = value;
              }}
              selectedValue={this.actionType}
            >
              {options.map((option) => (
                <RadioGroup.Item
                  key={option.text}
                  value={option.value}
                  text={option.text}
                />
              ))}
            </RadioGroup>
          </Row>
        </div>
        {this.renderEntities()}
        <div className={css(styles.line)} />
        <div className={css(styles.buttonContainer)}>
          <PrimaryButton onClick={this.confirmReply}>Submit</PrimaryButton>
        </div>
      </Card>
    );
  }
}
