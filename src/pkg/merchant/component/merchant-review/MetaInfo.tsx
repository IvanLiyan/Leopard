import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import { default as Row } from "@merchant/component/merchant-review/InfoRow";
import StateLabel from "@merchant/component/merchant-review/StateLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TicketState } from "@merchant/component/merchant-review/StateLabel";

export type MetaInfoData = {
  readonly ticketId: string;
  readonly reason: string;
  readonly creator: string;
  readonly createdTime: string;
  readonly updatedTime: string;
  readonly state: TicketState;
};

export type MetaInfoProps = BaseProps & MetaInfoData;

@observer
export default class MetaInfo extends Component<MetaInfoProps> {
  @observable
  isOpen = false;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        color: palettes.textColors.Ink,
      },
      content: {
        padding: "20px 48px",
      },
      objectId: {
        padding: 0,
      },
      row: {
        marginBottom: 16,
      },
    });
  }

  render() {
    const {
      createdTime,
      creator,
      reason,
      state,
      style,
      ticketId,
      updatedTime,
    } = this.props;
    const styles = this.styles;
    return (
      <Card style={[styles.root, style]}>
        <Accordion
          header={i`Re-authentification Information`}
          isOpen={this.isOpen}
          onOpenToggled={(isOpen) => (this.isOpen = isOpen)}
        >
          <div className={css(styles.content)}>
            <Row title={`Ticket ID`} titleWidth={120} style={styles.row}>
              <ObjectId style={styles.objectId} id={ticketId} showFull />
            </Row>
            <Row title={i`Reason`} titleWidth={120} style={styles.row}>
              {reason}
            </Row>
            <Row title={i`Review State`} titleWidth={120} style={styles.row}>
              <StateLabel state={state} />
            </Row>
            <Row title={i`Creator`} titleWidth={120} style={styles.row}>
              {creator}
            </Row>
            <Row title={i`Created Time`} titleWidth={120} style={styles.row}>
              {createdTime}
            </Row>
            <Row title={i`Updated Time`} titleWidth={120}>
              {updatedTime}
            </Row>
          </div>
        </Accordion>
      </Card>
    );
  }
}
