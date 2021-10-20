import React from "react";
import { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { observable } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { CheckboxGrid } from "@ContextLogic/lego";

/* Lego Toolkit */
import { closeIcon } from "@assets/icons";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import { Flags4x3 } from "@toolkit/countries";

/* Merchant API */
import * as wishExpressApi from "@merchant/api/wish-express";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OptionType } from "@ContextLogic/lego";

/* Merchant Stores */
import WishExpressStore from "@merchant/stores/WishExpressStore";
import { ThemeContext } from "@stores/ThemeStore";

export type WishApplicationProps = BaseProps & {
  readonly closeModal: () => unknown;
  readonly onComplete: (str: ApplicationStep) => unknown;
};

type ApplicationStep = "WishExpressReApplyCompleted";

@observer
class WishExpressReApplyCountries extends Component<WishApplicationProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable
  countries: ObservableSet = new ObservableSet();

  @computed
  get styles() {
    const { textBlack, primary } = this.context;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: 52,
        paddingRight: 52,
        paddingBottom: 64,
      },
      modalHeader: {
        display: "flex",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: fonts.weightSemibold,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.17,
        textAlign: "center",
        marginBottom: 20,
        color: textBlack,
        paddingTop: 20,
      },
      subHeader: {
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        textAlign: "left",
      },
      wishLogo: {
        // eslint-disable-next-line local-rules/no-frozen-width
        width: 192,
        objectFit: "contain",
        paddingTop: 50,
      },
      exitButton: {
        position: "absolute",
        right: 0,
        top: 0,
        paddingTop: 16,
        paddingRight: 24,
        width: 24,
        backgroundColor: "ffffff",
        cursor: "pointer",
      },
      subHeaderContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      },
      subHeaderBlueText: {
        color: primary,
        textAlign: "right",
        fontWeight: fonts.weightSemibold,
        cursor: "pointer",
      },
      actionButton: {
        marginBottom: 24,
        paddingTop: 24,
      },
      footer: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        placeContent: "center",
        borderRadius: "4px",
        boxShadow: "inset 0 1px 0 0 #c4cdd5",
        backgroundBlendMode: "darken",
        backgroundImage: "linear-gradient(to bottom, #ffffff, #ffffff)",
      },
      contentContainer: {
        borderRadius: "4px",
        boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        border: "solid 1px rgba(175, 199, 209, 0.5)",
        backgroundColor: "#ffffff",
      },
      optionsGrid: {
        alignSelf: "stretch",
      },
    });
  }

  @computed
  get options(): ReadonlyArray<OptionType> {
    const { eligibleApplicationCountries } = WishExpressStore.instance();
    let countryOptions: ReadonlyArray<OptionType> = [];
    if (eligibleApplicationCountries != null) {
      countryOptions = eligibleApplicationCountries
        .filter((countryCode) => getCountryName(countryCode).trim().length > 0)
        .map((countryCode) => ({
          title: getCountryName(countryCode),
          value: countryCode,
          icon: Flags4x3[countryCode.toLowerCase()],
        }));

      countryOptions = _.sortBy(countryOptions, (option) => option.title);
    }

    return [...countryOptions];
  }

  @computed
  get isDisabled(): boolean {
    return this.countries.toArray().length === 0;
  }

  onCheckChanged = (countryCode: string, checked: boolean) => {
    if (checked) {
      this.countries.add(countryCode);
    } else {
      this.countries.remove(countryCode);
    }
  };

  addAll = () => {
    const countries = this.options;
    if (countries != null) {
      if (this.countries.length != countries.length) {
        for (const country of countries) {
          if (!this.countries.has(country.value)) {
            this.countries.add(country.value);
          }
        }
      } else {
        this.countries.clear();
      }
    }
  };

  render() {
    const { closeModal } = this.props;
    const { onComplete } = this.props;
    return (
      <div className={css(this.styles.contentContainer)}>
        <div className={css(this.styles.root)}>
          <div className={css(this.styles.exitButton)} onClick={closeModal}>
            <img src={closeIcon} alt="close" />
          </div>
          <Illustration
            name="wishExpressWithText"
            alt="wish-express-logo"
            animate={false}
            className={css(this.styles.wishLogo)}
          />
          <div className={css(this.styles.modalHeader)}>
            Which countries would you like to apply for?
          </div>
          <div className={css(this.styles.subHeaderContainer)}>
            <div className={css(this.styles.subHeader)}>
              Please select the countries you can deliver to in 5 days or less.
            </div>
            <div
              className={css(this.styles.subHeaderBlueText)}
              onClick={() => {
                this.addAll();
              }}
            >
              Select All
            </div>
          </div>
          <CheckboxGrid
            className={css(this.styles.optionsGrid)}
            options={this.options}
            onCheckedChanged={this.onCheckChanged}
            selected={this.countries.toArray()}
          />
        </div>
        <div className={css(this.styles.footer)}>
          <PrimaryButton
            isDisabled={this.isDisabled}
            className={css(this.styles.actionButton)}
            onClick={async () => {
              await wishExpressApi
                .submitReApply({ countries: this.countries.toArray().join() })
                .call();
              onComplete("WishExpressReApplyCompleted");
            }}
          >
            Apply Now
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default WishExpressReApplyCountries;
