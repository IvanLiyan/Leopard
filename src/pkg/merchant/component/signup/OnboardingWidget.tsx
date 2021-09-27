import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { ProgressBar } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { ShippingAddress } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as icons from "@assets/icons";
import { weightMedium, weightBold } from "@toolkit/fonts";

/* Merchant API */
import { getReferralApp } from "@merchant/api/merchant-apps";

/* Merchant Models */
import ERPPromoProgramV2 from "@merchant/model/external/erp-promo-program/ERPPromoProgramV2";

/* SVGs */
import completionBackground from "@assets/img/onboarding-completion-bg.svg";
import referralBonusImage from "@assets/img/referral-bonus.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import UserStore from "@merchant/stores/UserStore";
import { ThemeContext } from "@merchant/stores/ThemeStore";

export type OnboardingStepInfo = {
  readonly id: number;
  readonly link: string;
  readonly title: string;
  readonly desc: string;
  readonly completed: boolean;
};

export type OnboardingStepProps = BaseProps & {
  readonly step: OnboardingStepInfo;
};

const StepIdContactInfo = 1;
const MerchantStatePending = 1;
const referralBonusOnboardingStep = 15;

@observer
class OnboardingStepTitle extends Component<OnboardingStepProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable promotionProgram: ERPPromoProgramV2 | undefined;
  @observable loading: boolean = false;

  @computed
  get styles() {
    const {
      step: { completed },
    } = this.props;
    const { textBlack, textDark } = this.context;

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      titleWrapper: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: !completed ? "wrap" : undefined,
      },
      title: {
        fontSize: 20,
        fontWeight: fonts.weightBold,
        color: textBlack,
        cursor: "default",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      checkmark: {
        width: 25,
      },
      content: {
        flex: 1,
      },
      info: {
        marginLeft: 10,
      },
      reminderWrapper: {
        backgroundColor: "rgba(230,247,255,0.7)",
        marginTop: 20,
        marginBottom: 5,
        borderRadius: 5,
        display: "flex",
        justifyContent: "space-between",
      },
      reminderTitleWrapper: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
      },
      reminderTitle: {
        fontSize: 18,
        fontWeight: weightBold,
        lineHeight: 1.33,
        color: "#202B38",
      },
      reminderSubtitle: {
        fontSize: 16,
        fontWeight: weightMedium,
        lineHeight: 1.5,
        color: textDark,
      },
      reminderFinePrint: {
        fontSize: 13,
        fontWeight: weightMedium,
        lineHeight: 1.5,
        color: textDark,
        marginTop: 10,
      },
    });
  }

  @computed
  get showBonusReminder(): boolean {
    const {
      step: { completed, id },
    } = this.props;
    const { loggedInMerchantUser } = UserStore.instance();

    return (
      id === referralBonusOnboardingStep &&
      completed &&
      loggedInMerchantUser.has_active_reduced_rev_share
    );
  }

  async componentDidMount() {
    this.loading = true;
    if (this.showBonusReminder) {
      const {
        loggedInMerchantUser: { erp_promo_info_referral_id: referralID },
      } = UserStore.instance();
      const referralAppResponse = await getReferralApp({
        referral_id: referralID,
      }).call();
      const resp = referralAppResponse?.data;
      if (resp) {
        this.promotionProgram = new ERPPromoProgramV2(resp);
      }
    }
    this.loading = false;
  }

  renderReferralBonusReminder() {
    return this.loading ? (
      <LoadingIndicator />
    ) : (
      <div className={css(this.styles.reminderWrapper)}>
        <div className={css(this.styles.reminderTitleWrapper)}>
          <div className={css(this.styles.reminderTitle)}>Bonus received</div>
          {this.promotionProgram?.reminderText && (
            <Markdown
              className={css(this.styles.reminderSubtitle)}
              text={this.promotionProgram?.reminderText}
            />
          )}
          <Markdown
            className={css(this.styles.reminderFinePrint)}
            text={
              i`This regional promotion applies to merchants ` +
              i`that are located in specific countries.`
            }
          />
        </div>
        <img src={referralBonusImage} width="120" height="120" />
      </div>
    );
  }

  render() {
    const { className, step } = this.props;
    const { title, completed, link, desc } = step;

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.titleWrapper)}>
          <div className={css(this.styles.title)}>
            {title} <Info className={css(this.styles.info)} text={desc} />
          </div>
          {completed ? (
            <img
              src={icons.greenCheckmarkSolid}
              draggable={false}
              className={css(this.styles.checkmark)}
            />
          ) : (
            <SecondaryButton href={link}>Continue</SecondaryButton>
          )}
        </div>
        {this.showBonusReminder && this.renderReferralBonusReminder()}
      </div>
    );
  }
}

export type OnboardingWidgetProps = BaseProps & {
  onboardingStepDict: {
    [stepId: number]: string;
  };
  onboardingStepUrls: ReadonlyArray<string>;
  onboardingStepDesc: {
    [stepId: number]: string;
  };
};

@observer
class OnboardingWidget extends Component<OnboardingWidgetProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @observable
  contactInfoVisible = false;

  @computed
  get progressText(): string {
    if (this.numStepsLeft > 1) {
      return i`Just ${this.numStepsLeft} steps away from completion`;
    } else if (this.numStepsLeft == 1) {
      return i`Just one step away from completion`;
    }

    return i`Completed!`;
  }

  @computed
  get steps(): ReadonlyArray<OnboardingStepInfo> {
    const {
      onboardingStepDesc,
      onboardingStepDict,
      onboardingStepUrls,
    } = this.props;

    let stepsList = this.stepsRequired.map((stepId) => {
      const title = onboardingStepDict[stepId];
      const link = onboardingStepUrls[stepId];
      const desc = onboardingStepDesc[stepId];
      const completed = this.stepsCompleted.includes(stepId);

      return {
        id: stepId,
        link,
        desc,
        title,
        completed,
      };
    });

    const { countryCodeByIp } = AppStore.instance();
    if (countryCodeByIp === "BR") {
      stepsList = [
        {
          id: 0,
          link: "https://www.youtube.com/watch?v=-XqvT16NCNA&feature=youtu.be",
          title: i`View step-by-step onboarding training video`,
          desc: "",
          completed: false,
        },
        ...stepsList,
      ];
    }

    return stepsList;
  }

  @computed
  get userStore(): UserStore {
    const { userStore } = AppStore.instance();
    return userStore;
  }

  @computed
  get merchantUser() {
    return this.userStore.loggedInMerchantUser;
  }

  @computed
  get stepsRequired(): ReadonlyArray<number> {
    const { merchantUser } = this;
    return merchantUser.new_onboarding_steps_required;
  }

  @computed
  get stepsCompleted(): ReadonlyArray<number> {
    const { stepsRequired, merchantUser } = this;
    return merchantUser.new_onboarding_steps_completed.filter((s) =>
      stepsRequired.includes(s)
    );
  }

  @computed
  get numStepsLeft(): number {
    const numStepsRequired = this.stepsRequired.length;
    const numStepsCompleted = this.stepsCompleted.length;
    return Math.max(numStepsRequired - numStepsCompleted, 0);
  }

  @computed
  get styles() {
    const { textBlack, textLight, borderPrimary } = this.context;

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.proxima,
      },
      titleRow: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        userSelect: "none",
      },
      title: {
        fontSize: 24,
        fontWeight: fonts.weightBold,
        color: textBlack,
        cursor: "default",
      },
      stepsLeft: {
        fontSize: 16,
        fontWeight: fonts.weightNormal,
        color: textLight,
        cursor: "default",
      },
      progressBar: {
        marginTop: 15,
        flex: 1,
      },
      stepsCard: {
        marginTop: 15,
      },
      stepsContainer: {
        display: "flex",
        flexDirection: "column",
      },
      sectionTitle: {
        flex: 1,
      },
      sheets: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 45px",
      },
      sheetGroup: {
        padding: "10px 0px",
        ":first-child": {
          borderBottom: `1px solid ${borderPrimary}`,
        },
      },
      sheetTitleContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      sheetTitle: {
        fontSize: 16,
        color: textBlack,
        fontWeight: fonts.weightBold,
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        marginBottom: 20,
      },
      sheetItem: {
        marginBottom: 15,
      },
      link: {
        fontSize: 16,
      },
      finishContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "30px 20px",
        backgroundImage: `url(${completionBackground})`,
        backgroundRepeat: "repeat",
        borderBottom: `1px solid ${borderPrimary}`,
      },
      finishTitle: {
        fontSize: 24,
        lineHeight: 1.33,
        color: textBlack,
        fontWeight: fonts.weightBold,
        marginBottom: 30,
        textAlign: "center",
        maxWidth: 650,
      },
      finishSubtitle: {
        fontSize: 16,
        lineHeight: 1.33,
        color: textBlack,
        fontWeight: fonts.weightNormal,
        textAlign: "center",
        maxWidth: 650,
      },
      finishButton: {
        marginTop: 30,
      },
    });
  }

  renderOnboardingCompleted() {
    return (
      <div className={css(this.styles.finishContainer)}>
        <section className={css(this.styles.finishTitle)}>
          Finish setting up your store
        </section>
        <section className={css(this.styles.finishSubtitle)}>
          You have completed the store application checklist! If everything
          looks good, click "Open my store" below. Wish will review your store
          application within 3 business days.
        </section>
        <PrimaryButton
          className={css(this.styles.finishButton)}
          href="brand-authorization/education"
        >
          Open my store
        </PrimaryButton>
      </div>
    );
  }

  renderStep(step: OnboardingStepInfo) {
    if (step.id !== StepIdContactInfo) {
      return (
        <Accordion
          key={step.title}
          header={() => (
            <OnboardingStepTitle
              className={css(this.styles.sectionTitle)}
              step={step}
            />
          )}
        />
      );
    }

    const { merchantUser } = this;

    return (
      <Accordion
        key={step.title}
        header={() => (
          <OnboardingStepTitle
            className={css(this.styles.sectionTitle)}
            step={step}
          />
        )}
        isOpen={this.contactInfoVisible}
        hideChevron
        onOpenToggled={(isOpen) => (this.contactInfoVisible = isOpen)}
      >
        <div className={css(this.styles.sheets)}>
          <div className={css(this.styles.sheetGroup)}>
            <div className={css(this.styles.sheetTitleContainer)}>
              <section className={css(this.styles.sheetTitle)}>
                Account information
              </section>
              <Link
                className={css(this.styles.link)}
                href="/settings#login-and-security"
                openInNewTab
              >
                Edit details
              </Link>
            </div>
            <SheetItem
              title={i`Store name`}
              className={css(this.styles.sheetItem)}
            >
              {merchantUser.merchant_name}
            </SheetItem>
            <SheetItem
              title={i`Email address`}
              className={css(this.styles.sheetItem)}
            >
              {merchantUser.email}
            </SheetItem>
          </div>
          <div className={css(this.styles.sheetGroup)}>
            <div className={css(this.styles.sheetTitleContainer)}>
              <section className={css(this.styles.sheetTitle)}>
                Contact Information
              </section>
            </div>
            <SheetItem
              title={i`First name`}
              className={css(this.styles.sheetItem)}
            >
              {merchantUser.first_name}
            </SheetItem>
            <SheetItem
              title={i`Last name`}
              className={css(this.styles.sheetItem)}
            >
              {merchantUser.last_name}
            </SheetItem>
            <SheetItem
              title={i`Business address`}
              className={css(this.styles.sheetItem)}
            >
              <ShippingAddress
                shippingDetails={{
                  street_address1:
                    merchantUser.business_address.street_address1,
                  street_address2:
                    merchantUser.business_address.street_address2,
                  city: merchantUser.business_address.city,
                  state: merchantUser.business_address.state,
                  zipcode: merchantUser.business_address.zipcode,
                  country: merchantUser.business_address.country,
                  country_code: merchantUser.business_address.country_code,
                }}
                disableCopy
              />
            </SheetItem>
            <SheetItem
              title={i`Phone number`}
              className={css(this.styles.sheetItem)}
            >
              {merchantUser.phone_number}
            </SheetItem>
          </div>
        </div>
      </Accordion>
    );
  }

  render() {
    const { className } = this.props;
    const { merchantUser } = this;
    const { surfaceLight, positive } = this.context;

    if (merchantUser.merchant_state != MerchantStatePending) {
      return null;
    }

    if (merchantUser.onboarding_completed) {
      return null;
    }

    const numStepsRequired = this.stepsRequired.length;
    const numStepsCompleted = this.stepsCompleted.length;

    if (numStepsRequired == 0 && numStepsRequired >= numStepsCompleted) {
      return null;
    }

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.titleRow)}>
          <section className={css(this.styles.title)}>
            Finish setting up your store
          </section>
          <section className={css(this.styles.stepsLeft)}>
            {this.progressText}
          </section>
        </div>
        <ProgressBar
          color={positive}
          progress={numStepsCompleted / numStepsRequired}
          backgroundColor={surfaceLight}
          className={css(this.styles.progressBar)}
          height={8}
        />
        <Card className={css(this.styles.stepsCard)}>
          {this.numStepsLeft === 0 && this.renderOnboardingCompleted()}
          <div className={css(this.styles.stepsContainer)}>
            {this.steps.map((step) => this.renderStep(step))}
          </div>
        </Card>
      </div>
    );
  }
}
export default OnboardingWidget;
