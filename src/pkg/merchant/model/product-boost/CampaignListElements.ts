/* External Libraries */
import { observable } from "mobx";

export default class CampaignListElements {
  @observable
  hasNext = false;

  @observable
  currentEnd = 0;

  @observable
  totalCount: number | null | undefined = null;

  @observable
  expandedRows: Map<number, boolean> = observable.map({});
}
