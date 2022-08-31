import {
  parseSetCookieString,
  parseSetCookieHeader,
} from "../../../src/pages/api/dev-login";

describe("parseSetCookieString", () => {
  test("Return the proper set cookie string and cookie string when set cookie options are included", () => {
    const setCookieString = `cookie="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure `;
    const expectedResponse = {
      setCookieString: `cookie="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure`,
      cookieString: `cookie="asdfghjkk|asdfghjkl"`,
    };

    const response = parseSetCookieString(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });

  test("Return the proper set cookie string and cookie string when set cookie options are not included", () => {
    const setCookieString = `cookie="asdfghjkk|asdfghjkl" `;
    const expectedResponse = {
      setCookieString: `cookie="asdfghjkk|asdfghjkl"`,
      cookieString: `cookie="asdfghjkk|asdfghjkl"`,
    };

    const response = parseSetCookieString(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });

  test("Return the proper set cookie string and cookie string when the cookie value is empty", () => {
    const setCookieString = `cookie= `;
    const expectedResponse = {
      setCookieString: `cookie=`,
      cookieString: `cookie=`,
    };

    const response = parseSetCookieString(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });
});

describe("parseSetCookieHeader", () => {
  test("Returns the proper set cookie and cookie strings for each cookie when the first cookie includes a date", () => {
    const setCookieString = `a=; expires=Wed, 20 Jan 2021 01:09:56 GMT; Path=/, b=qwertyuiop; Path=/, c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure, _d=a|bcdefg`;
    const expectedResponse = {
      setCookieStrings: [
        `a=; expires=Wed, 20 Jan 2021 01:09:56 GMT; Path=/`,
        `b=qwertyuiop; Path=/`,
        `c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure`,
        `_d=a|bcdefg`,
      ],
      cookieStrings: [
        `a=`,
        `b=qwertyuiop`,
        `c="asdfghjkk|asdfghjkl"`,
        `_d=a|bcdefg`,
      ],
      cookies: {
        a: "",
        b: "qwertyuiop",
        c: '"asdfghjkk|asdfghjkl"',
        _d: "a|bcdefg",
      },
    };

    const response = parseSetCookieHeader(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });

  test("Returns the proper set cookie and cookie strings for each cookie when cookies in the middle include dates", () => {
    const setCookieString = `a=, b=qwertyuiop; Path=/, c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure, _d=a|bcdefg`;
    const expectedResponse = {
      setCookieStrings: [
        `a=`,
        `b=qwertyuiop; Path=/`,
        `c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure`,
        `_d=a|bcdefg`,
      ],
      cookieStrings: [
        `a=`,
        `b=qwertyuiop`,
        `c="asdfghjkk|asdfghjkl"`,
        `_d=a|bcdefg`,
      ],
      cookies: {
        a: "",
        b: "qwertyuiop",
        c: '"asdfghjkk|asdfghjkl"',
        _d: "a|bcdefg",
      },
    };

    const response = parseSetCookieHeader(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });

  test("Returns the proper set cookie and cookie strings for each cookie when the last cookie includes a date", () => {
    const setCookieString = `a=, b=qwertyuiop; Path=/, c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure, _d=a|bcdefg, e=; expires=Wed, 20 Jan 2021 01:09:56 GMT; Path=/`;
    const expectedResponse = {
      setCookieStrings: [
        `a=`,
        `b=qwertyuiop; Path=/`,
        `c="asdfghjkk|asdfghjkl"; expires=Tue, 19 Jul 2022 01:09:56 GMT; httponly; Path=/; secure`,
        `_d=a|bcdefg`,
        `e=; expires=Wed, 20 Jan 2021 01:09:56 GMT; Path=/`,
      ],
      cookieStrings: [
        `a=`,
        `b=qwertyuiop`,
        `c="asdfghjkk|asdfghjkl"`,
        `_d=a|bcdefg`,
        `e=`,
      ],
      cookies: {
        a: "",
        b: "qwertyuiop",
        c: '"asdfghjkk|asdfghjkl"',
        _d: "a|bcdefg",
        e: "",
      },
    };

    const response = parseSetCookieHeader(setCookieString);
    expect(response).toStrictEqual(expectedResponse);
  });
});

// https://github.com/vercel/next.js/issues/7959
export default undefined;
