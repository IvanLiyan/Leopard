import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import objectHash from "object-hash";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { zendeskURL, zendeskCategoryURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FineExemptionInfoProps = BaseProps & {
  readonly fineExemptionParagraphs: ReadonlyArray<string>;
  readonly fineExemptionInfoLinkDict: {
    readonly infoLink: string;
    readonly linkType: string;
  };
};

@observer
class FineExemptionInfo extends Component<FineExemptionInfoProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      exemptFinePopover: {
        padding: 15,
        maxWidth: 300,
        whiteSpace: "normal",
      },
      info: {
        marginLeft: 2,
      },
    });
  }

  renderInfoLink() {
    const {
      fineExemptionInfoLinkDict: { infoLink, linkType },
    } = this.props;
    switch (
      parseInt(linkType) // TODO: (lliepert - 5/12/20) confirm that the value is actually an int and update types as appropriate
    ) {
      case 1:
        return infoLink;
      case 2:
        return zendeskURL(infoLink);
      case 3:
        return zendeskCategoryURL(infoLink);
      default:
        return infoLink;
    }
  }

  renderFineExemptDisplayText() {
    const { fineExemptionParagraphs } = this.props;
    const infoLink = this.renderInfoLink();
    return (
      <div className={css(this.styles.exemptFinePopover)}>
        {fineExemptionParagraphs.map((paragraph) => (
          <p key={objectHash(paragraph)}>{paragraph}</p>
        ))}
        <Link href={infoLink} openInNewTab>
          Learn more
        </Link>
      </div>
    );
  }

  render() {
    return (
      <Info
        className={css(this.styles.info)}
        popoverContent={() => this.renderFineExemptDisplayText()}
        size={15}
        position="bottom center"
        sentiment="warning"
        popoverMaxWidth={300}
      />
    );
  }
}
export default FineExemptionInfo;
