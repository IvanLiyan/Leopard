import type { NextApiRequest, NextApiResponse } from "next";

const MD_URL = process.env.NEXT_PUBLIC_MD_URL || "";
const XSRFTOKEN = process.env.XSRFTOKEN || "";
const SECURE_SESSION = process.env.SECURE_SESSION || "";
const SESSION = process.env.SESSION || "";

const handler = async (
  { url, method, body, headers }: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { host, origin, referer, ...cleanedHeaders } = headers;

  const resp = await fetch(`${MD_URL}${url}`, {
    // @ts-ignore: fetch and next.js header types don't match
    headers: {
      ...cleanedHeaders,
      "x-xsrftoken": XSRFTOKEN,
      cookie: `_xsrf=${XSRFTOKEN}; session="${SESSION}"; secure_session="${SECURE_SESSION}"`,
    },
    body: JSON.stringify(body),
    method,
  });

  const json = await resp.json();
  res.json(json);
  res.status(resp.status).end();
};

export default handler;
