import { useRouter } from "@core/toolkit/router";
import { useStringArrayQueryParam } from "@core/toolkit/url";
import { createContext, useContext } from "react";

type BulkDisputeContextType = {
  readonly onExitDispute: () => void;
};

const BulkDisputeContext = createContext<BulkDisputeContextType | null>(null);

export const useBulkDisputeContext = () => {
  const ctx = useContext(BulkDisputeContext);
  if (ctx == null) {
    throw Error("No BulkDisputeContext found");
  }
  return ctx;
};

export const useBulkDisputeInfractionIds = () =>
  useStringArrayQueryParam("ids");

export const BulkDisputeContextProvider: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  const [bulkInfractionIds] = useBulkDisputeInfractionIds();
  const router = useRouter();

  const onExit = () => {
    if (bulkInfractionIds.length == 0) {
      return;
    }
    if (bulkInfractionIds.length == 1) {
      void router.push(`/warnings/warning?id=${bulkInfractionIds[0]}`);
      return;
    }
    void router.push({
      href: "/warnings/appeal",
      query: {
        ids: bulkInfractionIds.slice(1),
      },
    });
  };

  return (
    <BulkDisputeContext.Provider
      value={{
        onExitDispute: onExit,
      }}
    >
      {children}
    </BulkDisputeContext.Provider>
  );
};
