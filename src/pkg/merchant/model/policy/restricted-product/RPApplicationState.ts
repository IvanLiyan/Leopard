/* External Libraries */
import { observable, computed, action } from "mobx";

/* Lego Components */
import { Step } from "@ContextLogic/lego";
import { AttachmentInfo } from "@ContextLogic/lego";

/* Type Imports */
import {
  RestrictedProductCategory,
  RestrictedProductRegionCode,
} from "@schema/types";
import NavigationStore from "@stores/NavigationStore";

export const INDICATOR_STEPS: ReadonlyArray<Step> = [
  {
    title: i`Select Country/Region & Categories`,
  },
  {
    title: i`Legal Information`,
  },
  {
    title: i`Terms of Service`,
  },
];

type ApplicationStep =
  | "SELECT_CATEGORIES_STEP"
  | "LEGAL_INFORMATION_STEP"
  | "TERMS_OF_SERVICE_STEP";

const NEXT_STEPS_TEXT = {
  SELECT_CATEGORIES_STEP: i`Next`,
  LEGAL_INFORMATION_STEP: i`Next`,
  TERMS_OF_SERVICE_STEP: i`Submit`,
};

const PREV_STEPS_TEXT = {
  SELECT_CATEGORIES_STEP: i`Back`,
  LEGAL_INFORMATION_STEP: i`Back`,
  TERMS_OF_SERVICE_STEP: i`Back`,
};

const INDICATOR_NUMBERS: { [step in ApplicationStep]: number } = {
  SELECT_CATEGORIES_STEP: 0,
  LEGAL_INFORMATION_STEP: 1,
  TERMS_OF_SERVICE_STEP: 2,
};

export default class RPApplicationState {
  @observable steps: Array<ApplicationStep> = ["SELECT_CATEGORIES_STEP"];
  @observable categories: Array<RestrictedProductCategory> = [];
  @observable regionCode: RestrictedProductRegionCode | null | undefined = null;
  @observable legalRepName: string | null | undefined = null;
  @observable legalRepNameValid: boolean = false;
  @observable legalRepTitle: string | null | undefined = null;
  @observable legalRepTitleValid: boolean = false;
  @observable businessEntityName: string | null | undefined = null;
  @observable submitLegalInformation: boolean = false;
  @observable document: ReadonlyArray<Partial<AttachmentInfo>> = [];
  @observable hasOTCMedication: boolean = false;
  @observable agreeTos: boolean = false;

  @computed
  get warrantySelected(): boolean {
    return this.categories.includes("UNVERIFIED_WARRANTIES");
  }

  @computed
  get documentValid(): boolean {
    if (!this.warrantySelected) {
      return true;
    }
    return this.document.length > 0;
  }

  @computed
  get currentStep(): ApplicationStep {
    return this.steps[this.steps.length - 1];
  }

  @computed
  get currentStepIndicator(): number {
    return INDICATOR_NUMBERS[this.currentStep];
  }

  @computed
  get nextStepText(): String {
    return NEXT_STEPS_TEXT[this.currentStep];
  }

  @computed
  get prevStepText(): String {
    return PREV_STEPS_TEXT[this.currentStep];
  }

  @computed
  get isValid(): boolean {
    if (this.currentStep == "SELECT_CATEGORIES_STEP") {
      return this.categories.length > 0 && this.regionCode != null;
    }
    if (this.currentStep == "LEGAL_INFORMATION_STEP") {
      return (
        this.legalRepNameValid && this.legalRepTitleValid && this.documentValid
      );
    }
    if (this.currentStep == "TERMS_OF_SERVICE_STEP") {
      return this.agreeTos;
    }
    return false;
  }

  @action
  setRegionCode = (regionCode: RestrictedProductRegionCode) => {
    this.regionCode = regionCode;
  };

  @action
  setCurrentStep = (nextStep: ApplicationStep) => {
    this.steps.push(nextStep);
  };

  @action
  goNextStep = () => {
    if (!this.isValid) {
      return;
    }
    if (this.currentStep === "SELECT_CATEGORIES_STEP") {
      this.setCurrentStep("LEGAL_INFORMATION_STEP");
    } else if (this.currentStep === "LEGAL_INFORMATION_STEP") {
      this.submitLegalInformation = true;
      this.setCurrentStep("TERMS_OF_SERVICE_STEP");
    }
  };

  @action
  exitApplication = () => {
    const navigationStore = NavigationStore.instance();
    navigationStore.navigate(`/product-authorization`);
  };

  @action
  goPreviousStep = () => {
    if (this.steps.length > 1) {
      this.steps.pop();
    } else {
      this.exitApplication();
    }
  };

  @action
  addCategory = (category: RestrictedProductCategory) => {
    if (this.categories.indexOf(category) == -1) {
      this.categories.push(category);
    }
  };

  @action
  removeCategory = (category: RestrictedProductCategory) => {
    const idx = this.categories.indexOf(category);
    if (idx != -1) {
      this.categories.splice(idx, 1);
    }
  };

  @action
  setTosCheckBox = (checked: boolean) => {
    this.agreeTos = checked;
  };
}
