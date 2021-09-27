import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import moment, { Moment } from "moment/moment";

/* Lego Components */
import { Tip, Card, HorizontalField, DayPickerInput } from "@ContextLogic/lego";

import { Accordion } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { CheckboxGrid } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import PageGuide from "@plus/component/nav/PageGuide";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { getCountryName, CountryCode } from "@toolkit/countries";

import { Flags4x3 } from "@toolkit/countries";

/* Merchant API */
import * as taxApi from "@merchant/api/tax";

/* Merchant Model */
import { TaxCountries, TaxEUCountries } from "@toolkit/tax/enrollment";

import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import { OptionType } from "@ContextLogic/lego";

@observer
export default class TaxReportsContainer extends Component<{
  initialData: {};
}> {
  @observable
  dateSectionOpen = false;

  @observable
  countrySectionOpen = false;

  @observable
  startDate: Date | undefined;

  @observable
  endDate: Date | undefined;

  @observable
  selectedCountries: Set<CountryCode> = new Set([]);

  @computed
  get datesSelected(): boolean {
    return this.startDate != null && this.endDate != null;
  }

  @computed
  get countryOptions(): ReadonlyArray<OptionType> {
    return TaxCountries.map((countryCode) => ({
      title: getCountryName(countryCode),
      value: countryCode,
      icon: Flags4x3[countryCode.toLowerCase()],
    }));
  }

  @computed
  get countriesSelected(): boolean {
    return this.selectedCountries.size > 0;
  }

  @computed
  get canExport(): boolean {
    return this.datesSelected && this.countriesSelected;
  }

  @computed
  get endDateCutoff(): Moment | null | undefined {
    const { startDate } = this;
    if (!startDate) {
      return null;
    }

    return moment(startDate).add(60, "days");
  }

  @action
  onAllEUCountriesToggled = () => {
    const euCountrySelectedCurrently = Array.from(
      this.selectedCountries
    ).some((countryCode) => TaxEUCountries.includes(countryCode));

    TaxEUCountries.forEach((countryCode) => {
      if (euCountrySelectedCurrently) {
        this.selectedCountries.delete(countryCode);
      } else {
        this.selectedCountries.add(countryCode);
      }
    });
  };

  @action
  onAllCountriesToggled = () => {
    const countrySelectedCurrently = this.selectedCountries.size > 0;

    TaxCountries.forEach((countryCode) => {
      if (countrySelectedCurrently) {
        this.selectedCountries.delete(countryCode);
      } else {
        this.selectedCountries.add(countryCode);
      }
    });
  };

  onCheckedChanged = (countryCode: CountryCode, checked: boolean) => {
    if (checked) {
      this.selectedCountries.add(countryCode);
    } else {
      this.selectedCountries.delete(countryCode);
    }
  };

  onExportReports = async () => {
    const { startDate, endDate, selectedCountries } = this;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    if (startDate == null) {
      toastStore.error(i`Please provide a start date`);
      return;
    }

    if (endDate == null) {
      toastStore.error(i`Please provide an end date`);
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      toastStore.error(i`Start date must be before end date`);
      return;
    }

    await taxApi
      .exportReport({
        start_date: startDate.getTime() / 1000,
        // end date inclusive
        end_date: endDate.getTime() / 1000 + 60 * 60 * 24,
        country_codes: Array.from(selectedCountries).join(","),
      })
      .call();

    toastStore.positive(
      i`Your tax report should be ready within ${24} hours. ` +
        i`You will receive an email with the download link.`,
      {
        deferred: true,
        timeoutMs: 30000,
      }
    );
    navigationStore.navigate("/tax/settings");
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        marginTop: 20,
      },
      content: {
        display: "flex",
        alignSelf: "stretch",
        flexDirection: "column",
      },
      topContent: {
        display: "flex",
        flexDirection: "column",
        padding: "24px 24px",
      },
      titleSection: {
        display: "flex",
        flexDirection: "column",
        "@media (min-width: 900px)": {
          maxWidth: "60%",
        },
      },
      title: {
        fontSize: 20,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
        marginBottom: 15,
        cursor: "default",
      },
      description: {
        fontSize: 16,
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
        cursor: "default",
      },
      sectionContent: {
        display: "flex",
        "@media (max-width: 640px)": {
          alignItems: "stretch",
        },
        "@media (min-width: 640px)": {
          alignItems: "flex-start",
        },
        flexDirection: "column",
        padding: "20px 24px",
      },
      countriesSectionContent: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        maxWidth: 700,
      },
      startDate: {
        marginBottom: 16,
      },
      bottomSection: {
        borderTop: `1px solid ${palettes.greyScaleColors.Grey}`,
        padding: "25px 25px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      },
      tip: {
        marginTop: 16,
      },
      tipContent: {
        alignItems: "flex-start",
        color: palettes.textColors.Ink,
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        maxWidth: "80%",
      },
      quickSelect: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "15px 25px",
      },
      quickSelectTitle: {
        marginRight: 20,
        fontSize: 16,
        cursor: "default",
        userSelect: "none",
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
      },
      allCountriesButton: {
        marginRight: 16,
      },
      optionsGrid: {
        margin: "0px 15px 15px 15px",
        alignSelf: "stretch",
      },
      filterCountriesSection: {
        backgroundColor: palettes.textColors.White,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      },
    });
  }

  renderDateFilters() {
    const { startDate, endDateCutoff } = this;
    const { locale } = LocalizationStore.instance();
    return (
      <Accordion
        header={i`Filter dates`}
        onOpenToggled={(isOpen) => (this.dateSectionOpen = isOpen)}
        isOpen={this.dateSectionOpen}
      >
        <div className={css(this.styles.sectionContent)}>
          <HorizontalField
            title={i`Start date`}
            titleWidth={150}
            centerTitleVertically
          >
            <DayPickerInput
              noEdit
              height={40}
              onDayChange={(day: Date | undefined) => {
                this.startDate = day;
              }}
              dayPickerProps={{
                showOutsideDays: true,
              }}
              inputProps={{
                height: 40,
                style: {
                  minWidth: 250,
                },
              }}
              value={this.startDate}
              className={css(this.styles.startDate)}
              locale={locale}
              cannotSelectFuture
            />
          </HorizontalField>

          <HorizontalField
            title={i`End date`}
            titleWidth={150}
            centerTitleVertically
          >
            <DayPickerInput
              noEdit
              height={40}
              disabled={startDate == null}
              onDayChange={(day: Date | undefined) => {
                const isInitialWrite = this.endDate == null;
                this.endDate = day;
                if (isInitialWrite) {
                  this.countrySectionOpen = true;
                }
              }}
              dayPickerProps={{
                disabledDays: (date: Date) =>
                  endDateCutoff != null && moment(date).isAfter(endDateCutoff),
                showOutsideDays: true,
              }}
              inputProps={{
                height: 40,
                style: {
                  minWidth: 250,
                },
              }}
              value={this.endDate}
              locale={locale}
              cannotSelectFuture
            />
          </HorizontalField>
        </div>
      </Accordion>
    );
  }

  renderCountries() {
    const { datesSelected, selectedCountries } = this;

    if (!datesSelected) {
      return null;
    }

    return (
      <Accordion
        header={i`Filter countries`}
        onOpenToggled={(isOpen) => (this.countrySectionOpen = isOpen)}
        isOpen={this.countrySectionOpen}
      >
        <div className={css(this.styles.filterCountriesSection)}>
          <div className={css(this.styles.quickSelect)}>
            <Text weight="medium" className={css(this.styles.quickSelectTitle)}>
              Quick select
            </Text>
            <SecondaryButton
              className={css(this.styles.allCountriesButton)}
              onClick={this.onAllCountriesToggled}
            >
              All countries
            </SecondaryButton>
            <SecondaryButton onClick={this.onAllEUCountriesToggled}>
              European countries
            </SecondaryButton>
          </div>
          <CheckboxGrid
            className={css(this.styles.optionsGrid)}
            options={this.countryOptions}
            onCheckedChanged={this.onCheckedChanged}
            selected={Array.from(selectedCountries)}
          />
        </div>
      </Accordion>
    );
  }

  render() {
    return (
      <PageGuide className={css(this.styles.root)}>
        <Card showOverflow>
          <div className={css(this.styles.content)}>
            <div className={css(this.styles.topContent)}>
              <div className={css(this.styles.titleSection)}>
                <Text weight="bold" className={css(this.styles.title)}>
                  Export tax reports
                </Text>
                <Text weight="regular" className={css(this.styles.description)}>
                  You can request to download tax reports for your transactions
                  created within a certain date range, up to {60} days at a
                  time. After submitting your request, you will receive an email
                  with the download link when the report is ready.
                </Text>
              </div>
              <Tip
                color={palettes.coreColors.WishBlue}
                icon="tip"
                className={css(this.styles.tip)}
              >
                <Text weight="regular" className={css(this.styles.tipContent)}>
                  Tax reports will include all order/refunds data that occurred
                  up to the report request date/time. For the most updated data,
                  generate a tax report close to when you plan to use it.
                </Text>
              </Tip>
            </div>
            {this.renderDateFilters()}
            {this.renderCountries()}
            <div className={css(this.styles.bottomSection)}>
              <PrimaryButton
                onClick={this.onExportReports}
                isDisabled={!this.canExport}
              >
                Export reports
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </PageGuide>
    );
  }
}
