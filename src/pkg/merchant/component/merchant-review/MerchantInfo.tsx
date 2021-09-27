import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import { default as Row } from "@merchant/component/merchant-review/InfoRow";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type MerchantInfoData = {
  // account
  readonly merchantId: string;
  readonly humanName: string;
  readonly username: string;
  readonly accountEntityType: string;
  readonly dateJoined: string;
  readonly storeName: string;
  readonly merchantURL: string;
  readonly storeURL?: string;
  readonly revShare: string;
  readonly gracePeriod: number;
  readonly gmvThreshold: number;
  readonly lastYearGMV: number;
  readonly warehouseLocations: string;

  // contact
  readonly email: string;
  readonly phone: string;
  readonly qq?: string;
  readonly wechat?: string;

  // business address
  readonly en_country: string;
  readonly en_state: string;
  readonly en_city: string;
  readonly en_street1: string;
  readonly en_street2?: string;
  readonly zh_country: string;
  readonly zh_state: string;
  readonly zh_city: string;
  readonly zh_street1: string;
  readonly zh_street2?: string;

  // payment state
  readonly paymentWithheld?: boolean;
};

export type MerchantInfoProps = BaseProps & MerchantInfoData;

@observer
class MerchantInfo extends Component<MerchantInfoProps> {
  @observable
  isOpen = false;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        color: palettes.textColors.Ink,
      },
      content: {
        padding: "20px 0px 4px 48px",
      },
      header: {
        marginBottom: 20,
        fontSize: 16,
        fontWeight: fonts.weightSemibold,
        lineHeight: "24px",
      },
      row: {
        marginBottom: 16,
      },
      line: {
        height: 0,
        width: "100%",
        borderBottom: `1px ${palettes.greyScaleColors.DarkGrey} solid`,
        marginBottom: 20,
      },
      address: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alighItems: "flex-start",
      },
      objectId: {
        padding: 0,
      },
    });
  }

  renderStoreURL() {
    let { storeURL } = this.props;
    if (!storeURL) {
      return null;
    }

    if (storeURL && !storeURL.startsWith("http")) {
      storeURL = `http://${storeURL}`;
    }

    return (
      <Row title={i`Store URL`} titleWidth={160} style={this.styles.row}>
        <Link href={storeURL} openInNewTab>
          {storeURL}
        </Link>
      </Row>
    );
  }

  renderQQ() {
    const { qq } = this.props;
    if (!qq) {
      return null;
    }

    return (
      <Row title={i`QQ`} titleWidth={160} style={this.styles.row}>
        {qq}
      </Row>
    );
  }

  renderWechat() {
    const { wechat } = this.props;
    if (!wechat) {
      return null;
    }

    return (
      <Row title={i`WeChat`} titleWidth={160} style={this.styles.row}>
        {wechat}
      </Row>
    );
  }

  renderPaymentState() {
    const { paymentWithheld } = this.props;
    if (paymentWithheld != undefined) {
      return (
        <>
          <div className={css(this.styles.line)} key={1} />
          <div className={css(this.styles.header)} key={2}>
            Payment State
          </div>
          <Row
            title={i`Payment State`}
            titleWidth={160}
            style={this.styles.row}
            key={3}
          >
            {paymentWithheld ? i`Withheld` : i`Not Withheld`}
          </Row>
        </>
      );
    }
    return null;
  }

  render() {
    const {
      dateJoined,
      email,
      en_country: enCountry,
      en_state: enState,
      en_street1: enStreet1,
      en_street2: enStreet2,
      humanName,
      accountEntityType,
      lastYearGMV,
      merchantId,
      merchantURL,
      phone,
      revShare,
      gracePeriod,
      gmvThreshold,
      storeName,
      style,
      username,
      warehouseLocations,
      zh_country: zhCountry,
      zh_state: zhState,
      zh_street1: zhStreet1,
      zh_street2: zhStreet2,
    } = this.props;
    const styles = this.styles;

    return (
      <Card style={[this.styles.root, style]}>
        <Accordion
          header={i`Merchant Information`}
          isOpen={this.isOpen}
          onOpenToggled={(isOpen) => (this.isOpen = isOpen)}
        >
          <div className={css(this.styles.content)}>
            <div className={css(styles.header)}>Account Information</div>

            <Row title={i`Merchant ID`} titleWidth={160} style={styles.row}>
              <ObjectId style={styles.objectId} id={merchantId} showFull />
            </Row>
            <Row title={i`Merchant Name`} titleWidth={160} style={styles.row}>
              {humanName}
            </Row>
            <Row title={i`Username`} titleWidth={160} style={styles.row}>
              {username}
            </Row>
            <Row title={i`Date Joined`} titleWidth={160} style={styles.row}>
              {dateJoined}
            </Row>
            <Row title={i`Entity Type`} titleWidth={160} style={styles.row}>
              {accountEntityType}
            </Row>
            <Row title={i`Store Name`} titleWidth={160} style={styles.row}>
              <Link href={merchantURL} openInNewTab>
                {storeName}
              </Link>
            </Row>
            {this.renderStoreURL()}
            <Row title={i`Rev Share`} titleWidth={160} style={styles.row}>
              {revShare}
            </Row>
            {gracePeriod && (
              <Row title={i`Grace Period`} titleWidth={160} style={styles.row}>
                {gracePeriod}
              </Row>
            )}
            {gmvThreshold && (
              <Row title={i`GMV Threshold`} titleWidth={160} style={styles.row}>
                {formatCurrency(gmvThreshold)}
              </Row>
            )}
            <Row title={i`Last Year GMV`} titleWidth={160} style={styles.row}>
              {formatCurrency(lastYearGMV)}
            </Row>
            <Row
              title={i`Warehouse Locations`}
              titleWidth={160}
              style={styles.row}
            >
              {warehouseLocations}
            </Row>

            <div className={css(styles.line)} />

            <div className={css(styles.header)}>Contact Information</div>

            <Row title={i`Email`} titleWidth={160} style={styles.row}>
              {email}
            </Row>
            <Row title={i`Phone Number`} titleWidth={160} style={styles.row}>
              {phone}
            </Row>
            {this.renderQQ()}
            {this.renderWechat()}

            <div className={css(styles.line)} />

            <div className={css(styles.header)}>Business Address</div>

            <Row title={i`Chinese`} titleWidth={160} style={styles.row}>
              <div className={css(styles.address)}>
                <div>{zhCountry}</div>
                <div>{zhState}</div>
                <div>{zhStreet1}</div>
                <div>{zhStreet2}</div>
              </div>
            </Row>
            <Row title={i`English`} titleWidth={160} style={styles.row}>
              <div className={css(styles.address)}>
                <div>{enStreet1}</div>
                <div>{enStreet2}</div>
                <div>{enState}</div>
                <div>{enCountry}</div>
              </div>
            </Row>

            {this.renderPaymentState()}
          </div>
        </Accordion>
      </Card>
    );
  }
}
export default MerchantInfo;
