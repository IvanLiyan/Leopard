/* React, Mobx and Aphrodite */
import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

type BaseProps = any;

type TabButtonProps = BaseProps & {
  readonly name: string;
  readonly selected?: boolean;
};

@observer
class TabButton extends Component<TabButtonProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        userSelect: "none",
        transform: "translateZ(0)",
        transition: "opacity 0.4s linear",
        ":hover": {
          opacity: 1,
        },
      },
      text: {
        fontSize: 14,
        fontWeight: fonts.weightMedium,
        color: palettes.textColors.Ink,
        padding: "10px 0px",
        textAlign: "center",
      },
    });
  }

  render() {
    const { name, selected, className } = this.props;

    return (
      <div
        className={css(this.styles.root, className)}
        style={{ opacity: selected ? 1 : 0.5 }}
      >
        <section className={css(this.styles.text)}>{name}</section>
      </div>
    );
  }
}

export type PagerProps = BaseProps & {
  readonly selectedIndex?: number;
  readonly equalSizeTabs?: boolean;
  readonly tabsPadding?: string;
  readonly fullWidth?: boolean;
  readonly tabAlignment?: string;
  readonly contentAlignment?: string;
  readonly onTabChange?: (idx: number) => unknown;
};

export type ContentProps = BaseProps & {
  readonly titleValue: string;
};

@observer
export default class OldPager extends Component<PagerProps> {
  static Content = class Content extends Component<ContentProps> {
    render() {
      const { children, className } = this.props;
      return <div className={className}>{children}</div>;
    }
  };

  static defaultProps: Partial<PagerProps> = {
    equalSizeTabs: false,
  };

  static demoRender = `
<Pager>
  <Pager.Content titleValue="milk">I'm the milk tab!</Pager.Content>
  <Pager.Content titleValue="eggs">I'm the eggs tab!</Pager.Content>
  <Pager.Content titleValue="cheese">I'm the cheese tab!</Pager.Content>
  <Pager.Content titleValue="bread">I'm the bread tab!</Pager.Content>
</Pager>
`;

  @observable
  currentIndexInternal = 0;

  @computed
  get styles() {
    const {
      equalSizeTabs,
      tabsPadding,
      fullWidth,
      contentAlignment,
      tabAlignment,
    } = this.props;
    const underlineKeyframes = {
      from: {
        transform: "scale3d(0, 1, 1)",
      },

      to: {
        transform: "scale3d(1, 1, 1)",
      },
    };

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      tabItem: {
        marginRight: equalSizeTabs ? 0 : 10,
        flexGrow: fullWidth ? 1 : 0,
        flexBasis: equalSizeTabs ? 0 : "auto",
        minWidth: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      },
      tabsRow: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        padding: tabsPadding,
        justifyContent: tabAlignment ? tabAlignment : "left",
        borderBottom: this.hasTitles ? "solid 1px #dfe3e8" : undefined,
      },
      content: {
        display: "flex",
        alignItems: contentAlignment ? contentAlignment : "stretch",
        flexDirection: "column",
      },
      underline: {
        height: 4,
        backgroundColor: palettes.coreColors.WishBlue,
        borderRadius: equalSizeTabs ? 0 : 5,
        animationName: [underlineKeyframes],
        animationDuration: "150ms",
      },
      underlinePlaceholder: {
        height: 4,
      },
    });
  }

  @computed
  get currentIndex(): number {
    const {
      props: { selectedIndex },
      currentIndexInternal,
    } = this;

    if (selectedIndex !== undefined) {
      return selectedIndex;
    }

    if (currentIndexInternal !== null) {
      return currentIndexInternal;
    }

    return 0;
  }

  renderUnderline(idx: number): ReactNode {
    if (idx != this.currentIndex) {
      return <div className={css(this.styles.underlinePlaceholder)} />;
    }

    return <div className={css(this.styles.underline)} />;
  }

  @computed
  get children(): ReadonlyArray<React.ReactElement<ContentProps>> {
    const { children } = this.props;
    return React.Children.toArray(children).filter((_) =>
      React.isValidElement(_)
    ) as ReadonlyArray<React.ReactElement<ContentProps>>;
  }

  @computed
  get titles(): ReadonlyArray<string> {
    return this.children
      .map((child) => child.props.titleValue)
      .filter((_) => !!_);
  }

  @computed
  get currentContent() {
    return this.children[this.currentIndex];
  }

  @computed
  get hasTitles(): boolean {
    const { titles } = this;
    return titles.length > 0;
  }

  renderTabs() {
    const { equalSizeTabs, onTabChange } = this.props;
    if (!this.hasTitles) {
      return null;
    }

    return (
      <div className={css(this.styles.tabsRow)}>
        {this.titles.map((title, idx) => (
          <div
            key={title}
            className={css(this.styles.tabItem)}
            onClick={() => {
              this.currentIndexInternal = idx;
              if (onTabChange) {
                onTabChange(idx);
              }
            }}
          >
            <TabButton
              name={title}
              selected={this.currentIndex === idx}
              equalSizeTabs={equalSizeTabs}
            />
            {this.renderUnderline(idx)}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {this.renderTabs()}
        <div className={css(this.styles.content)}>{this.currentContent}</div>
      </div>
    );
  }
}
