// dev page, not exposed to merchants
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";
const USERNAME = process.env.USERNAME || "";
const PASSWORD = process.env.PASSWORD || "";

export const parseSetCookieString = (
  dirtySetCookieString: string,
): {
  readonly setCookieString: string;
  readonly cookieString: string;
} => {
  const cookieString = dirtySetCookieString.split(";")[0].trim();

  return {
    setCookieString: dirtySetCookieString.trim(),
    // the cookie name=value is always the first element per
    // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2
    cookieString,
  };
};

const getCookieObject = (cookieString: string): Record<string, string> => {
  const splitCookieString = cookieString.split("=");
  return { [splitCookieString[0]]: splitCookieString[1] };
};

export const parseSetCookieHeader = (
  header: string,
): {
  readonly setCookieStrings: ReadonlyArray<string>;
  readonly cookieStrings: ReadonlyArray<string>;
  readonly cookies: Record<string, string>;
} => {
  if (header === "" || header == null) {
    return { setCookieStrings: [], cookieStrings: [], cookies: {} };
  }

  const [cur, rest] = header.split(/,(.+)/);

  // if there are no more cookies left, cur must be a complete cookie string
  // and we are done
  if (rest == null) {
    const { setCookieString, cookieString } = parseSetCookieString(cur);
    return {
      setCookieStrings: [setCookieString],
      cookieStrings: [cookieString],
      cookies: getCookieObject(cookieString),
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
      cookies: restCookies,
    } = parseSetCookieHeader(rest2);
    return {
      setCookieStrings: [setCookieString, ...restSetCookieStrings],
      cookieStrings: [cookieString, ...restCookieStrings],
      cookies: { ...getCookieObject(cookieString), ...restCookies },
    };
  }

  // else cur is a full set-cookie string
  const { setCookieString, cookieString } = parseSetCookieString(cur);
  const {
    setCookieStrings: restSetCookieStrings,
    cookieStrings: restCookieStrings,
    cookies: restCookies,
  } = parseSetCookieHeader(rest);
  return {
    setCookieStrings: [setCookieString, ...restSetCookieStrings],
    cookieStrings: [cookieString, ...restCookieStrings],
    cookies: { ...getCookieObject(cookieString), ...restCookies },
  };
};

const devLogin = async (
  _: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  // set xsrf token for staging
  let respXSRF;
  try {
    respXSRF = await fetch(`${MD_URL}/`);
  } catch (e) {
    console.log(`error fetching${MD_URL}/`, "resp", respXSRF, "e", e);
    return;
  }

  const {
    cookieStrings: cookieStringsXSRF,
    setCookieStrings: setCookieStringsXSRF,
    cookies: cookiesXSRF,
  } = parseSetCookieHeader(respXSRF.headers.get("set-cookie") || "");

  // perform login call
  const resp = await fetch(`${MD_URL}/api/graphql/batch`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-xsrftoken": cookiesXSRF["_xsrf"],
      cookie: cookieStringsXSRF?.join("; "),
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
    console.log(
      "\n\nparsing dev-login gql call failed. see `yarn dev` console for more details\n",
      resp,
      "\n\n",
    );
    throw e;
  }

  if (!isOk) {
    console.log(
      `\n\ndev-login gql call failed with status ${gqlStatus}, isOk: ${isOk}, error:${error}. see \`yarn dev\` console for more details\n`,
      resp,
      "\n\n",
    );
    res.status(403).end();
    return;
  }

  const { setCookieStrings: setCookieStrings_ } = parseSetCookieHeader(
    resp.headers.get("set-cookie") || "",
  );
  const setCookieStrings = [...setCookieStringsXSRF, ...setCookieStrings_];
  res.setHeader("Set-Cookie", setCookieStrings);
  res.status(200).end();
};

export default devLogin;
