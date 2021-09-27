/* External Libraries */
import { computed, observable } from "mobx";

type PartnerDeveloperGlobalStateProps = {};

export default class PartnerDeveloperGlobalState {
  @observable
  introEmail: string | typeof undefined;

  @observable
  isIntroEmailValid: boolean;

  @observable
  getStartedEmail: string | typeof undefined;

  @observable
  isGetStartedEmailValid: boolean;

  constructor(props?: PartnerDeveloperGlobalStateProps) {
    this.isIntroEmailValid = false;
    this.isGetStartedEmailValid = false;
  }

  @computed
  get canSubmitIntroEmail(): boolean {
    return this.isIntroEmailValid;
  }

  @computed
  get canSubmitGetStartedEmail(): boolean {
    return this.isGetStartedEmailValid;
  }
}
