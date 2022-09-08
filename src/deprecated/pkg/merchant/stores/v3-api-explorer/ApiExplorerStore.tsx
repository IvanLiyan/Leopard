/* External Libraries */
import { observable, computed, action } from "mobx";
import { OpenAPIOperation, OpenAPISpec } from "redoc/typings/types";

/* Merchant API */
import { getOpenApiSpec } from "@merchant/api/reference";

export type ApiMethod = OpenAPIOperation & {
  readonly pathName: string;
  readonly httpVerb: string;
  readonly "x-code-samples": ReadonlyArray<{
    lang: string;
    source: string;
  }>;
};

export type MenuSubItem = {
  readonly title: string;
  readonly httpVerb: string;
  readonly operationId: string;
};

export type MenuItem = {
  readonly tag: string;
  readonly title: string;
  readonly subItems: ReadonlyArray<MenuSubItem>;
};

export default class ApiExplorerStore {
  @observable
  spec: OpenAPISpec | undefined;

  baseUrl = "/documentation/api/v3/explorer";

  @action
  async fetchApiSpec() {
    const response = await getOpenApiSpec({ parsed: true }).call();
    if (response.data) {
      this.spec = response.data.results;
    }
  }

  @computed
  get loading(): boolean {
    return !this.spec;
  }

  @computed
  get tagToApiMethods(): {
    [key: string]: {
      name: string;
      methods: [ApiMethod];
    };
  } {
    if (!this.spec) {
      return {};
    }
    const tags = {};
    for (const tag of this.spec.tags || []) {
      // if you find this please fix the any types (legacy)
      (tags as any)[tag.name] = { ...tag, methods: [] };
    }
    for (const pathName of Object.keys(this.spec.paths)) {
      const pathInfo = this.spec.paths[pathName];
      for (const httpVerb of Object.keys(pathInfo)) {
        // if you find this please fix the any types (legacy)
        const methodInfo = (pathInfo as any)[httpVerb];
        for (const tagName of methodInfo.tags || []) {
          // if you find this please fix the any types (legacy)
          let tag = (tags as any)[tagName];
          if (tag === undefined) {
            tag = {
              name: tagName,
              methods: [],
            };
            // if you find this please fix the any types (legacy)
            (tags as any)[tagName] = tag;
          }
          tag.methods.push({
            ...methodInfo,
            pathName,
            httpVerb,
          });
        }
      }
    }
    return tags;
  }

  @computed
  get operationIdToApiMethods(): {
    [key: string]: ApiMethod;
  } {
    if (!this.spec) {
      return {};
    }

    const methods = {};
    for (const pathName of Object.keys(this.spec.paths)) {
      const pathInfo = this.spec.paths[pathName];
      for (const httpVerb of Object.keys(pathInfo)) {
        // if you find this please fix the any types (legacy)
        const info = (pathInfo as any)[httpVerb];
        const { operationId } = info;
        if (operationId) {
          // if you find this please fix the any types (legacy)
          (methods as any)[operationId] = {
            ...info,
            pathName,
            httpVerb,
          };
        }
      }
    }
    return methods;
  }

  @action.bound
  isOperationValid(operationId: string): boolean {
    return operationId in this.operationIdToApiMethods;
  }

  @computed
  get menuItems(): ReadonlyArray<MenuItem> {
    if (!this.spec) {
      return [];
    }
    return (this.spec.tags || []).map<MenuItem>(({ name }) => {
      const title = this.tagToApiMethods[name].name || "";
      const methods = this.tagToApiMethods[name].methods || [];
      const subItems = methods.map(({ summary, httpVerb, operationId }) => {
        return {
          title: summary || "",
          httpVerb,
          operationId: operationId || "",
        };
      });

      return {
        tag: name,
        title,
        subItems,
      };
    });
  }
}
