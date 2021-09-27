/* External Libraries */
import { computed, observable, action } from "mobx";
import { OpenAPIParameter } from "redoc/typings/types";

/* Merchant Store */
import { ApiMethod } from "@merchant/stores/v3-api-explorer/ApiExplorerStore";

export type ParamsType = {
  [name: string]: {
    value: any;
    readonly location: string;
    readonly required: boolean;
    readonly description: string;
  };
};

export type FetchResponse = {
  readonly status: number;
  readonly statusText: string;
  readonly data: string;
  readonly contentType: null | string;
};

export default class ApiMethodPageState {
  @observable methodData: ApiMethod;
  @observable params: ParamsType;
  @observable requestBody: string;
  @observable response: FetchResponse | undefined;
  @observable hasAccessToken: boolean | undefined;

  constructor(methodData: ApiMethod) {
    this.methodData = methodData;
    const { parameters } = methodData;
    const paramList = (parameters || []).map((param) => {
      const {
        name,
        in: location,
        required,
        description,
      } = param as OpenAPIParameter;
      return {
        name,
        value: undefined,
        location,
        required: required || false,
        description,
      };
    });
    const { tags, httpVerb } = this.methodData;
    if (!(tags || []).includes("OAuth") && httpVerb === "get") {
      paramList.push({
        name: "fields",
        value: undefined,
        location: "query",
        required: false,
        description:
          i`Comma separated string containing field names from response schema. ` +
          i`To specify sub-fields of arrays or objects, use parentheses \`( )\`. ` +
          i`For example, use \`a(b,c)\` to select fields b and c which are nested in a. ` +
          i`If provided, only the specified attributes will be returned in the response. `,
      });
    }
    this.params = paramList.reduce((total, param) => {
      const { name, ...rest } = param;
      return {
        ...total,
        [name]: rest,
      };
    }, {});
    this.requestBody = this.sampleReqBody;
  }

  @computed
  get hideAccessToken(): boolean {
    const { tags, operationId } = this.methodData;
    return !!tags && tags.includes("OAuth") && operationId !== "oauthTest";
  }

  @computed
  get canSubmit(): boolean {
    if (!this.hideAccessToken && !this.hasAccessToken) return false;
    return Object.keys(this.params).every((key) => {
      const { value, required } = this.params[key];
      return !required || value;
    });
  }

  paramsFromLoc(loc: string) {
    return Object.keys(this.params)
      .filter((name) => {
        const { location, value } = this.params[name];
        return location === loc && !!value;
      })
      .reduce((total, name) => {
        const { value } = this.params[name];
        return {
          ...total,
          [name]: value,
        };
      }, {});
  }

  @computed
  get pathParams() {
    return this.paramsFromLoc("path");
  }

  @computed
  get queryParams() {
    return this.paramsFromLoc("query");
  }

  @computed
  get url() {
    let url = this.methodData.pathName;
    // fill in path params
    for (const [name, value] of Object.entries(this.pathParams)) {
      const regexp = new RegExp(`{${name}}`, "gi");
      url = url.replace(regexp, String(value));
    }
    return url;
  }

  @computed
  get needReqBody() {
    const { httpVerb } = this.methodData;
    return ["post", "put", "patch", "delete"].includes(httpVerb);
  }

  @computed
  get sampleReqBody() {
    if (!this.needReqBody) return "";
    const result = this.methodData["x-code-samples"].find(
      ({ lang }) => lang === "shell_curl",
    );
    const curlCode = result?.source || "";
    const args = curlCode.split(" ");
    const index = args.indexOf("--data");
    if (index !== -1 && index + 1 < args.length) {
      const bodyStr = args[index + 1].slice(1, -1);
      return JSON.stringify(JSON.parse(bodyStr), null, 2);
    }
    return "{}";
  }

  @action.bound
  setReqBody(body: string) {
    this.requestBody = body;
  }

  @action.bound
  setResponse(resp: FetchResponse) {
    this.response = resp;
  }
}
