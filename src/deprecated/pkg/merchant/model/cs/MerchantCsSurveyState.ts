/* External Libraries */
import { observable, action } from "mobx";

export default class MerchantCsSurveyState {
  @observable sellOnOthers: string | undefined = undefined;
  @observable hasCsTeam: string | undefined = undefined;
  @observable valuableFeatures: ReadonlyArray<string> = [];
  @observable otherValuableFeature: string | undefined = undefined;
  @observable hoursToRespond: string | undefined = undefined;
  @observable reasonForMoreTime: string | undefined = undefined;
  @observable topReason: string | undefined = undefined;
  @observable otherTopReason: string | undefined = undefined;

  @action
  setNewValuableFeatures = (value: string) => {
    const optionSet = new Set(this.valuableFeatures);
    if (optionSet.has(value)) {
      optionSet.delete(value);
    } else {
      optionSet.add(value);
    }
    this.valuableFeatures = Array.from(optionSet);
  };
}
