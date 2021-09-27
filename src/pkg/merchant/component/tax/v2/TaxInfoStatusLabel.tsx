import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { ThemedLabelProps, ThemedLabel, Theme } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant API */
import { TaxInfoStatus } from "@merchant/api/tax";

export type TaxInfoStatusLabelProps = BaseProps & {
  readonly status: TaxInfoStatus | null | undefined;
  readonly position?: string;
};

@observer
export default class TaxInfoStatusLabel extends Component<
  TaxInfoStatusLabelProps
> {
  @computed
  get labelProps(): ThemedLabelProps | null | undefined {
    const { status, position } = this.props;

    if (status == null) {
      return null;
    }

    const statusMap: {
      [status in TaxInfoStatus]: {
        readonly title: string;
        readonly position: string;
        readonly theme: Theme;
        readonly popoverContent: string;
        readonly popoverMaxWidth: number;
      };
    } = {
      ACTIVE: {
        theme: "LightWishBlue",
        title: i`Active`,
        position: position || "top center",
        popoverContent: i`Your tax settings are now active.`,
        popoverMaxWidth: 300,
      },
      FAILED_REVIEW: {
        theme: "DarkRed",
        title: i`Verification failed`,
        position: position || "top center",
        popoverMaxWidth: 300,
        popoverContent:
          i`We can not verify the Tax ID you submitted. ` +
          i`Please edit your Tax Settings and provide a valid Tax ID.`,
      },
      PENDING_REVIEW: {
        position: position || "top center",
        theme: "DarkYellow",
        title: i`Submitted`,
        popoverMaxWidth: 300,
        popoverContent:
          i`Your Tax ID has been submitted. ` +
          i`We will provide an update once it is verified. `,
      },
      PENDING_ONESOURCE_SETUP: {
        theme: "DarkYellow",
        title: i`Submitted`,
        position: position || "top center",
        popoverMaxWidth: 300,
        popoverContent:
          i`Your tax information has been submitted. ` +
          i`We will provide an update once it is processed.`,
      },
      OLD_ACTIVE_NEW_PENDING_REVIEW: {
        theme: "DarkYellow",
        title: i`Submitted`,
        position: position || "top center",
        popoverMaxWidth: 300,
        popoverContent:
          i`Your Tax ID has been submitted. ` +
          i`We will provide an update once it is verified. `,
      },
      INACTIVE: {
        theme: "DarkRed",
        title: i`Inactive`,
        position: position || "top center",
        popoverMaxWidth: 300,
        popoverContent: i`The tax setting is no longer active.`,
      },
    };

    return statusMap[status];
  }

  render() {
    const { labelProps } = this;
    const { status, ...otherLabelProps } = this.props;
    if (!labelProps) {
      return null;
    }

    return <ThemedLabel {...otherLabelProps} {...labelProps} />;
  }
}
