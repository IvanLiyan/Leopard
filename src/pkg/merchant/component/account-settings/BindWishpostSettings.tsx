import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* Deprecated */
import Fetcher from "@merchant/component/__deprecated__/Fetcher";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";
import { SearchBox } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import ThemeStore from "@stores/ThemeStore";
import NavigationStore from "@stores/NavigationStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

type BindWishpostProps = BaseProps & {
  readonly bindWishpostUrl: string;
};

type WishpostAccount = {
  readonly wishpost_username: string;
  readonly wishpost_id: string;
};

@observer
class BindWishpostSettings extends Component<BindWishpostProps> {
  @observable
  hasError = false;

  @observable
  isLoading = true;

  @observable
  wishpostData: ReadonlyArray<WishpostAccount> = [];

  @observable
  searchQuery = "";

  @action
  onResponse = (response: any) => {
    if (response.code === 0) {
      this.hasError = false;
      this.wishpostData = response.data.bind_info;
    } else {
      this.hasError = true;
      this.wishpostData = [];
    }
    this.isLoading = false;
  };

  @computed
  get styles() {
    const appTheme = ThemeStore.instance().currentAppTheme();

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      },
      alert: {
        maxWidth: "1024px",
        boxSizing: "border-box",
      },
      lineSpace: {
        marginBottom: "24px",
      },
      title: {
        fontSize: "24px",
        lineHeight: "32px",
      },
      container: {
        maxWidth: "1024px",
        borderRadius: 4,
        boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.2)",
        boxSizing: "border-box",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      },
      subtitle: {
        fontSize: "16px",
        lineHeight: "24px",
      },
      searchContainer: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
      },
      searchBox: {
        minWidth: "300px",
        marginRight: "24px",
      },
      table: {
        borderRadius: 4,
        border: `1px ${appTheme.borderPrimary} solid`,
        overflowX: "auto",
      },
    });
  }

  @action
  handleSearch = ({ text }: OnTextChangeEvent) => {
    this.searchQuery = text.trim();
  };

  searchFilter = (data: WishpostAccount) => {
    return (
      data.wishpost_id.includes(this.searchQuery) ||
      data.wishpost_username.includes(this.searchQuery)
    );
  };

  @computed
  get displayData() {
    if (!this.wishpostData) {
      return [];
    }

    return this.wishpostData.filter(this.searchFilter);
  }

  handleBindNew = async () => {
    const navigationStore = NavigationStore.instance();
    const { bindWishpostUrl } = this.props;
    if (bindWishpostUrl) {
      navigationStore.navigate(bindWishpostUrl), { openInNewTab: true };
    }
  };

  render() {
    let alert: ReactNode = null;
    let noDataMessage = i`No data`;
    const buttonText = i`Bind New Account`;
    const placeholder = i`WishPost username or WishPost ID`;

    if (!this.isLoading && !this.hasError && this.wishpostData.length == 0) {
      const infoText =
        i`WishPost is the official logistic platform of Wish.` +
        " " +
        i`You haven't bound any WishPost account yet.` +
        " " +
        i`Please click the \"${buttonText}\" button to bind`;
      alert = (
        <Alert
          text={infoText}
          sentiment="info"
          className={css(this.styles.alert, this.styles.lineSpace)}
        />
      );
      noDataMessage = i`You haven't bound any WishPost account yet`;
    }

    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.title, this.styles.lineSpace)}>
          Wishpost
        </div>
        {alert}
        <div className={css(this.styles.container)}>
          <div className={css(this.styles.subtitle, this.styles.lineSpace)}>
            Bound WishPost Accounts
          </div>
          <div
            className={css(this.styles.searchContainer, this.styles.lineSpace)}
          >
            <SearchBox
              className={css(this.styles.searchBox)}
              placeholder={placeholder}
              onChange={this.handleSearch}
            />
            <PrimaryButton onClick={this.handleBindNew}>
              {buttonText}
            </PrimaryButton>
          </div>
          <Fetcher
            request_DEP={{
              apiPath: "settings/get-bound-wishpost",
            }}
            onResponse_DEP={this.onResponse}
            hideSpinner={!this.isLoading}
            passResponseAsProps={false}
          >
            <Table
              style={this.styles.table}
              hideBorder
              noDataMessage={noDataMessage}
              data={this.displayData}
            >
              <Table.Column
                _key={undefined}
                title={i`WishPost Username`}
                columnKey="wishpost_username"
              />
              <Table.ObjectIdColumn
                _key={undefined}
                title={i`WishPost ID`}
                columnKey="wishpost_id"
                showFull
                width="60%"
              />
            </Table>
          </Fetcher>
        </div>
      </div>
    );
  }
}

export default BindWishpostSettings;
