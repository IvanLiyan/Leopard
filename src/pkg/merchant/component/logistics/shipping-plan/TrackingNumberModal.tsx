import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Table } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { OnCloseFn } from "@merchant/component/core/modal/Modal";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { Tracking } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TrackingNumberModalContentProps = BaseProps & {
  readonly trackings: ReadonlyArray<Tracking>;
  readonly providers: {
    [key: string]: string;
  };
  readonly shippingPlanId: string;
  readonly onClose?: OnCloseFn;
  readonly updateTrackings?: (
    arg0: ReadonlyArray<Tracking>,
  ) => unknown | null | undefined;
  readonly refreshParent: () => void;
};

interface UpdateShippingPlanPayload {
  id: string;
  state: fbwApi.ShippingPlanStateText;
  tracking_numbers: string;
}

@observer
class TrackingNumberModalContent extends Component<TrackingNumberModalContentProps> {
  @observable
  selectedProvider = "0";

  @observable
  newTrackingNumber = "";

  @observable
  trackings: Array<Tracking>;

  constructor(props: TrackingNumberModalContentProps) {
    super(props);
    this.trackings = [...props.trackings];
  }

  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();
    return StyleSheet.create({
      modalContent: {
        display: "flex",
        flexDirection: "column",
        padding: `30px ${dimenStore.pageGuideX}`,
      },
      addTracking: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15,
        marginLeft: 0,
        alignItems: "flex-start",
      },
      footerContainer: {
        display: "flex",
        bottom: 0,
        width: "100%",
      },
    });
  }

  @computed
  get tableActions() {
    return [
      {
        key: "remove",
        name: i`Remove`,
        canBatch: false,
        canApplyToRow: () => true,
        apply: this.removeTracking,
      },
    ];
  }

  @action
  updateShippingPlan = async () => {
    const trackingNumbers = this.trackings.map((tracking) => ({
      carrier: parseInt(tracking.provider),
      tracking_number: tracking.tracking_id,
    }));

    const params: UpdateShippingPlanPayload = {
      id: this.props.shippingPlanId,
      state: "SHIPPED",
      tracking_numbers: JSON.stringify(trackingNumbers),
    };

    const response = await fbwApi.updateShippingPlan(params).call();

    if (response.code === 0) {
      return;
    }
    if (this.props.updateTrackings) {
      this.props.updateTrackings(this.trackings);
    }
  };

  @action
  removeTracking = (rows: ReadonlyArray<Tracking>) => {
    if (rows.length === 0) {
      return;
    }
    const r = rows[0];
    this.trackings = this.trackings.filter(
      (tracking) => tracking.tracking_id != r.tracking_id,
    );
  };

  renderTrackingNumber() {
    return (
      <Table
        data={this.trackings}
        noDataMessage={i`No tracking number added.`}
        actions={this.tableActions}
      >
        <Table.Column
          title={i`Carrier`}
          columnKey="provider_name"
          align="left"
          description={i`Carrier`}
        />
        <Table.Column
          title={i`Tracking Number`}
          columnKey="tracking_id"
          align="left"
          description={i`Tracking Number`}
          canCopyText
        />
      </Table>
    );
  }

  @action
  selectProvider = (selectedProvider: string) => {
    this.selectedProvider = selectedProvider;
  };

  @action
  addTracking = () => {
    if (this.newTrackingNumber.trim().length === 0) {
      return;
    }
    this.trackings.push({
      tracking_id: this.newTrackingNumber,
      provider: this.selectedProvider,
      provider_name: this.props.providers[this.selectedProvider],
    });
    this.newTrackingNumber = "";
  };

  renderAddTrackingNumber() {
    const { providers } = this.props;
    return (
      <div className={css(this.styles.addTracking)}>
        <Select
          placeholder={i`Please Select`}
          options={Object.keys(providers).map((provider) => {
            return {
              value: provider,
              text: providers[provider],
            };
          })}
          onSelected={this.selectProvider}
          position="bottom left"
          selectedValue={this.selectedProvider}
          buttonHeight={30}
        />
        <TextInput
          height={30}
          onChange={({ text }: OnTextChangeEvent) => {
            this.newTrackingNumber = text;
          }}
          validators={[new RequiredValidator()]}
          placeholder={i`Enter Tracking Number`}
        />
        <Button
          style={{ padding: "5px 60px" }}
          onClick={() => {
            this.addTracking();
          }}
        >
          Add
        </Button>
      </div>
    );
  }

  @computed
  get renderFooter() {
    const { onClose, refreshParent } = this.props;
    return (
      <div className={css(this.styles.footerContainer)}>
        <ModalFooter
          action={{
            text: i`Submit`,
            onClick: async () => {
              await this.updateShippingPlan();
              if (onClose) {
                onClose();
              }
              refreshParent();
            },
          }}
          cancel={{
            children: i`Close`,
            onClick: () => {
              if (onClose) {
                onClose();
              }
            },
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={css(this.styles.modalContent)}>
        {this.renderAddTrackingNumber()}
        {this.renderTrackingNumber()}
        {this.renderFooter}
      </div>
    );
  }
}

type TrackingNumberModalProps = BaseProps & {
  trackings: ReadonlyArray<Tracking>;
  providers: {
    [key: string]: string;
  };
  readonly shippingPlanId: string;
  updateTrackings: (
    trackings: ReadonlyArray<Tracking>,
  ) => unknown | null | undefined;
  readonly refreshParent: () => void;
};

class TrackingNumberModal extends Modal {
  props: TrackingNumberModalProps;

  constructor(props: TrackingNumberModalProps) {
    super(() => null);
    this.props = props;
    this.setHeader({ title: i`Shipping Plan Tracking Info` });
    this.setWidthPercentage(0.35);
  }

  renderContent() {
    const {
      providers,
      shippingPlanId,
      trackings,
      updateTrackings,
      refreshParent,
    } = this.props;
    return (
      <TrackingNumberModalContent
        trackings={trackings}
        providers={providers}
        shippingPlanId={shippingPlanId}
        onClose={() => this.close()}
        updateTrackings={updateTrackings}
        refreshParent={refreshParent}
      />
    );
  }
}

export default TrackingNumberModal;
