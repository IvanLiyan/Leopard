/* External Libraries */
import { computed } from "mobx";

type MerchantEnv =
  | "stage"
  | "testing"
  | "fe_qa_staging"
  | "fe_prod"
  | "sandbox";

export default class EnvironmentStore {
  @computed
  get env(): MerchantEnv {
    return (window as any).pageParams.env;
  }

  @computed
  get isDev(): boolean {
    return ["stage"].includes(this.env);
  }

  @computed
  get isTesting(): boolean {
    return ["testing"].includes(this.env);
  }

  @computed
  get isSandbox(): boolean {
    return ["sandbox"].includes(this.env);
  }

  @computed
  get isStaging(): boolean {
    return ["fe_qa_staging", "stage"].includes(this.env);
  }

  @computed
  get isProd(): boolean {
    return ["testing", "fe_prod"].includes(this.env);
  }

  static instance(): EnvironmentStore {
    let { environmentStore } = window as any;
    if (environmentStore == null) {
      environmentStore = new EnvironmentStore();
      (window as any).environmentStore = environmentStore;
    }
    return environmentStore;
  }
}

export const useEnvironmentStore = (): EnvironmentStore => {
  return EnvironmentStore.instance();
};
