import type { NextApiRequest, NextApiResponse } from "next";
import { isDev } from "@stores/EnvironmentStore";

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";
const USERNAME = process.env.USERNAME || "";
const PASSWORD = process.env.PASSWORD || "";

export const parseSetCookieString = (
  dirtySetCookieString: string,
): { readonly setCookieString: string; readonly cookieString: string } => {
  return {
    setCookieString: dirtySetCookieString.trim(),
    // the cookie name=value is always the first element per
    // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2
    cookieString: dirtySetCookieString.split(";")[0].trim(),
  };
};

export const parseSetCookieHeader = (
  header: string,
): {
  readonly setCookieStrings: ReadonlyArray<string>;
  readonly cookieStrings: ReadonlyArray<string>;
} => {
  if (header === "" || header == null) {
    return { setCookieStrings: [], cookieStrings: [] };
  }

  const [cur, rest] = header.split(/,(.+)/);

  // if there are no more cookies left, cur must be a complete cookie string
  // and we are done
  if (rest == null) {
    const { setCookieString, cookieString } = parseSetCookieString(cur);
    return {
      setCookieStrings: [setCookieString],
      cookieStrings: [cookieString],
    };
  }

  // check for cases where the value of an option may include a comma, in which
  // case cur only represents part of a set-cookie string
  if (cur.includes("expires")) {
    // expires is the only header that takes a date per
    // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2
    // dates are represented in a format that includes commas
    const [cur2, rest2] = rest.split(/,(.+)/);
    const fullCur = `${cur},${cur2}`;
    const { setCookieString, cookieString } = parseSetCookieString(fullCur);
    const {
      setCookieStrings: restSetCookieStrings,
      cookieStrings: restCookieStrings,
    } = parseSetCookieHeader(rest2);
    return {
      setCookieStrings: [setCookieString, ...restSetCookieStrings],
      cookieStrings: [cookieString, ...restCookieStrings],
    };
  }

  // else cur is a full set-cookie string
  const { setCookieString, cookieString } = parseSetCookieString(cur);
  const {
    setCookieStrings: restSetCookieStrings,
    cookieStrings: restCookieStrings,
  } = parseSetCookieHeader(rest);
  return {
    setCookieStrings: [setCookieString, ...restSetCookieStrings],
    cookieStrings: [cookieString, ...restCookieStrings],
  };
};

const devLogin = async (
  { query }: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (!isDev) {
    // TODO [lliepert]: do we want to log this somehow?
    // eslint-disable-next-line no-console
    console.log("attempting to call dev-login in non-dev environment");
    res.status(500).end();
    return;
  }

  const resp = await fetch(`${MD_URL}/api/graphql/batch`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    body: `[{"operationName":"Leopard_devLoginMutation","variables":{"input":{"username":"${USERNAME}","password":"${PASSWORD}"}},"query":"mutation Leopard_devLoginMutation($input: LoginMutationInput!) {\\n  authentication {\\n    login(input: $input) {\\n      loginOk\\n      error\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]`,
    method: "POST",
  });

  let gqlStatus;
  let isOk = false;
  let error;

  try {
    const json = await resp.json();
    gqlStatus = json[0].status;
    isOk = json[0].data.authentication.login.loginOk;
    error = json[0].data.authentication.login.error;
  } catch (e) {
    // this code is only executed when running in the local dev environment
    // add a hint to the error since we don't have type safety here
    // eslint-disable-next-line no-console
    console.log(
      "\n\nparsing dev-login gql call failed. see `yarn dev` console for more details\n",
      resp,
      "\n\n",
    );
    throw e;
  }

  if (!isOk) {
    // this code is only executed when running in the local dev environment
    // we want the developer to know why they are currently unable to
    // authenticate to merchant dashboard
    // eslint-disable-next-line no-console
    console.log(
      `\n\ndev-login gql call failed with status ${gqlStatus}, isOk: ${isOk}, error:${error}. see \`yarn dev\` console for more details\n`,
      resp,
      "\n\n",
    );
    res.status(403).end();
    return;
  }

  const { setCookieStrings } = parseSetCookieHeader(
    resp.headers.get("set-cookie") || "",
  );
  res.setHeader("Set-Cookie", setCookieStrings);

  const mid = query.as;
  if (mid) {
    // TODO [lliepert]: call MD_URL/go/<mid> to log in session as specified
    // merchant (https://jira.wish.site/browse/MKL-53732)
    if (typeof mid !== "string") {
      res.status(500).end("param 'as' must be of type 'string'");
      return;
    }
  }

  res.status(200).end();
};

export default devLogin;
