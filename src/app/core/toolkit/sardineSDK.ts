/* Constants */
export const SARDINE_FLOW = {
  SIGNIN: "md_signin",
  SIGNUP: "md_signup",
  APP: "app",
} as const; // values need match definition in clroot repo: sweeper/merchant_dashboard/lib/sardine/flows.py

type SardineFlowType = typeof SARDINE_FLOW[keyof typeof SARDINE_FLOW];

declare global {
  interface Window {
    // Disabling because sardine doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _Sardine: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sardineContext: any;
    onSardineLoadedProm: Promise<void>;
  }
}

const updateSardineSdkConfigWithClientId = async (
  flow: SardineFlowType,
  sardineHost: string,
  sardineClientId: string,
  sessionKey: string,
  userId?: string | null,
) => {
  if (process.env.SSR) {
    return;
  }

  await window.onSardineLoadedProm;

  if (!sessionKey) {
    return;
  }

  const sardineEnv =
    sardineHost === "api.sardine.ai" ? "production" : "sandbox";

  const sardineContext = window.sardineContext;
  if (sardineContext) {
    // Check for new session or new flow (new page expected to track)
    if (
      sardineContext.config?.sessionKey !== sessionKey ||
      sardineContext.config?.flow !== flow ||
      sardineContext.config?.userIdHash !== userId
    ) {
      sardineContext.updateConfig({
        flow: flow,
        sessionKey: sessionKey,
        userIdHash: userId,
      });
    }
  } else {
    window.sardineContext = window._Sardine.createContext({
      clientId: `${sardineClientId}`,
      sessionKey: `${sessionKey}`,
      userIdHash: `${userId}`,
      flow: `${flow}`,
      environment: `${sardineEnv}`,
      parentElement: document.body,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onDeviceResponse: function () {},
    });
  }

  // handle cases where fraudster has disabled JS
  const innerHTML =
    "<img\n" +
    `  src="https://${sardineHost}/v1/a.png?clientId=${sardineClientId}&sessionKey=${sessionKey}&flow=${flow}&ns=1"\n` +
    '  style="display: none" />';
  const currentSardineElement = document.getElementById(sardineHost);
  if (currentSardineElement) {
    currentSardineElement.innerHTML = innerHTML;
  } else {
    const sardineNoScript = document.createElement("noscript");
    sardineNoScript.id = sardineHost;
    sardineNoScript.innerHTML = innerHTML;
    document.body.appendChild(sardineNoScript);
  }
};

export const initAndUpdatedateSardineSDK = async (
  flow: SardineFlowType,
  sardineHost?: string | null,
  sardineClientId?: string | null,
  sessionKey?: string | null,
  userId?: string | null,
) => {
  if (process.env.SSR) {
    return;
  }

  sardineClientId = sardineClientId || window.sardineContext?.config?.clientId;
  if (sardineHost && sardineClientId && sessionKey) {
    try {
      await updateSardineSdkConfigWithClientId(
        flow,
        sardineHost,
        sardineClientId,
        sessionKey,
        userId,
      );
    } catch {
      return;
    }
  }
};
