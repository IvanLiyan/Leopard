//@flow
import React from "react";
import { computed } from "mobx";
import { useLocalStore } from "mobx-react-lite";

/* Merchant API */
import { getApiList } from "@merchant/api/release-notes";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export default class ReleaseNotesStore {
  baseUrl = "/documentation/api/v3/release-notes";

  @computed
  get apiList() {
    return getApiList({}).response?.data?.api_list;
  }

  @computed
  get loading() {
    return this.apiList == null;
  }
}

const storeContext = React.createContext<ReleaseNotesStore | null>(null);

export const ReleaseNotesStoreProvider = ({ children }: BaseProps) => {
  const store = useLocalStore(() => new ReleaseNotesStore());
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useReleaseNotesStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error(
      "useReleaseNotesStore must be used within a ReleaseNotesStoreProvider."
    );
  }
  return store;
};
