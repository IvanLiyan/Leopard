/* External Libraries */
import { createContext, useContext } from "react";
import { computed } from "mobx";

type MerchantEnv =
  | "stage"
  | "testing"
  | "fe_qa_staging"
  | "fe_prod"
  | "sandbox";

const DEFAULT_ENV: MerchantEnv = "stage";

type EnvironmentStoreArgs = {
  readonly env: MerchantEnv;
};

export default class EnvironmentStore {
  env: MerchantEnv;

  constructor(initialData: EnvironmentStoreArgs) {
    this.env = initialData.env;
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
    throw "EnvironmentStore Not Implemented";
  }
}

export const useEnvironmentStore = (): EnvironmentStore => {
  return useContext(EnvironmentStoreContext);
};

export const defaultEnvironmentStoreArgs = {
  env: DEFAULT_ENV,
};

export const EnvironmentStoreContext = createContext(
  new EnvironmentStore(defaultEnvironmentStoreArgs),
);
