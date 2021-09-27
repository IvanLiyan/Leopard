/* External Libraries */
import { observable, computed, action } from "mobx";

/* Merchant API */
import { EPCProduct } from "@merchant/api/epc";

export type SurveyQuestion =
  | "TOO_EXPENSIVE"
  | "HIGH_REFUND_RATE"
  | "CANT_SHIP_VIA_EPC"
  | "OTHER";

export class RemoveSurvey {
  @observable
  options: Set<SurveyQuestion>;

  @observable
  otherReason: string;

  showToUser: boolean;

  constructor() {
    this.options = new Set();
    this.otherReason = "";
    this.showToUser = 5 > Math.random() * 100;
  }

  @action
  updateOptions(options: ReadonlySet<SurveyQuestion>) {
    this.options = new Set(options);
    if (!this.options.has("OTHER")) {
      this.otherReason = "";
    }
  }

  @action
  updateOtherReason(reason: string) {
    this.otherReason = reason.trim();
    if (this.otherReason.length == 0) {
      this.options.delete("OTHER");
      return;
    }

    this.options.add("OTHER");
  }

  @computed
  get toJsonString() {
    return JSON.stringify({
      options: Array.from(this.options),
      other_reason: this.otherReason,
    });
  }

  @computed
  get disableSubmit() {
    return (
      this.options.size === 0 ||
      (this.options.has("OTHER") && this.otherReason.trim().length === 0)
    );
  }
}

export default class EditableEPCProduct {
  productId: string;
  @observable
  activeDate: number | null | undefined;

  @observable
  removeDate: number | null | undefined;

  @observable
  removeSurvey: RemoveSurvey;

  isInvited: boolean | null | undefined;

  @computed
  get queuedForRemoval(): boolean {
    const now = new Date().getTime();
    return (
      this.removeDate != null &&
      this.activeDate != null &&
      this.removeDate > now &&
      this.removeDate > this.activeDate
    );
  }

  constructor({
    product_id: productId,
    active_time: activeTime,
    remove_time: removeTime,
    is_invited: isInvited,
  }: EPCProduct) {
    this.productId = productId;
    this.activeDate = activeTime ? Date.parse(activeTime + "Z") : null;
    this.removeDate = removeTime ? Date.parse(removeTime + "Z") : null;
    this.removeSurvey = new RemoveSurvey();
    this.isInvited = isInvited;
  }
}
