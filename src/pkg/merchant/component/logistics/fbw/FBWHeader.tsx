import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Link, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { zendeskCategoryURL } from "@toolkit/url";

import { WelcomeHeaderProps } from "@merchant/component/core";

type FBWHeaderProps = WelcomeHeaderProps & {};

@observer
class FBWHeader extends Component<FBWHeaderProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      learnMore: {
        marginTop: 16,
        fontSize: 20,
      },
    });
  }

  @computed
  get faqLink() {
    const url = zendeskCategoryURL("360000737454-Fulfillment-by-Wish-FBW-");
    return (
      <Link href={url} className={css(this.styles.learnMore)} openInNewTab>
        <Text weight="bold">Learn more</Text>
      </Link>
    );
  }

  render() {
    return <WelcomeHeader {...this.props}>{this.faqLink}</WelcomeHeader>;
  }
}

export default FBWHeader;
