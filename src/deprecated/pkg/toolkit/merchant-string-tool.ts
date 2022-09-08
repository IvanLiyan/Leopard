//
//  toolkit/merchant-string-tool.tsx
//  Project-Lego
//
//  Created by Andrew Yang on 3/31/2020.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//

/* External Imports */
import { vsprintf } from "sprintf-js";
import { APIResponse } from "@toolkit/api";

/* Merchant API */
import * as stringApi from "@merchant/api/merchant-string-api";
import { MerchantStringLoadResponse } from "@merchant/api/merchant-string-api";

/* Merchant Store */
import LocalizationStore from "@stores/LocalizationStore";

export type MerchantStringLoadParams = {
  name: string;
  formatArgs?: ReadonlyArray<string> | null | undefined;
  backup?: string | null | undefined;
};

export type MerchantStringGroupLoadParams = {
  group_id: string;
  locale?: string | null | undefined;
  name?: string | null | undefined;
  backup?: string | null | undefined;
};

export class MerchantStringGroup {
  group: {
    [key: string]: string;
  };

  backup: string;
  response: APIResponse<MerchantStringLoadResponse> | null | undefined;
  constructor(args: MerchantStringGroupLoadParams) {
    const { locale } = LocalizationStore.instance();
    const passedLocale = args.locale || locale;
    const apiArgs = (args.name && {
      group_id: args.group_id,
      name: args.name,
      locale: passedLocale,
    }) || {
      group_id: args.group_id,
      locale: passedLocale,
    };
    const { response } = stringApi.loadString(apiArgs);
    this.response = response;
    this.group = this.response?.data?.strings || {};
    this.backup = args.backup || "";
  }

  load(args: MerchantStringLoadParams) {
    const formatArgs = [...(args.formatArgs || [])];
    return (
      (this.group &&
        this.group[args.name] &&
        vsprintf(this.group[args.name], formatArgs)) ||
      args.backup ||
      this.backup ||
      i`text unavailable` ||
      ""
    );
  }

  isLoading() {
    return !this.response;
  }
}
