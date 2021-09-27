import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, reaction } from "mobx";

/* External Libraries */
import Sticky from "react-stickynode";
import $ from "jquery";
import FontAwesome from "react-fontawesome";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { Flags1x1 } from "@toolkit/countries";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PagerButtonProps = BaseProps & {
  readonly direction: "forwards" | "backwards";
  readonly onClick: () => unknown;
};

@observer
class PagerButton extends Component<PagerButtonProps> {
  @computed
  get styles() {
    const { direction } = this.props;
    return StyleSheet.create({
      root: {
        cursor: "pointer",
        userSelect: "none",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
      },
      content: {
        width: 25,
        height: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(66, 134, 244, 1)",
        borderTopLeftRadius: direction === "forwards" ? "50%" : undefined,
        borderBottomLeftRadius: direction === "forwards" ? "50%" : undefined,
        borderTopRightRadius: direction === "forwards" ? undefined : "50%",
        borderBottomRightRadius: direction === "forwards" ? undefined : "50%",
      },
      icon: {
        color: "white",
      },
    });
  }

  render() {
    const { direction, onClick, className } = this.props;
    return (
      <div className={css(this.styles.root, className)} onClick={onClick}>
        <div className={css(this.styles.content)}>
          <FontAwesome
            name={direction === "forwards" ? "angle-right" : "angle-left"}
            className={css(this.styles.icon)}
          />
        </div>
      </div>
    );
  }
}

export type CountryType = {
  readonly cc: string;
  readonly name: string;
};

type CountryTabProps = BaseProps &
  CountryType & {
    readonly selected?: boolean;
    readonly width: number;
    readonly isEnabled?: boolean;
  };

@observer
class CountryTab extends Component<CountryTabProps> {
  static defaultProps = {
    isEnabled: true,
  };

  @computed
  get styles() {
    const { width } = this.props;
    const underlineKeyframes = {
      from: {
        transform: "scaleX(0)",
      },

      to: {
        transform: "scaleX(1)",
      },
    };

    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        userSelect: "none",
        width,
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 1,
        },
      },
      text: {
        width,
        fontSize: 12,
        fontWeight: fonts.weightNormal,
        color: "#2b3333",
        padding: "7px 0px",
        textAlign: "center",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
      image: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "1px solid #e0e0e0",
      },
      imageContainer: {
        width: 36,
        height: 36,
        maxWidth: "600%",
        display: "inline-block",
      },
      underline: {
        height: 3,
        alignSelf: "stretch",
        backgroundColor: palettes.coreColors.WishBlue,
        borderRadius: 5,
        animationName: [underlineKeyframes],
        animationDuration: "150ms",
      },
    });
  }

  renderUnderline() {
    const { selected } = this.props;
    if (!selected) {
      return null;
    }

    return <div className={css(this.styles.underline)} />;
  }

  render() {
    const { name, cc, className } = this.props;

    let flagUrl: string | null = null;
    if (cc === "WRLD") {
      flagUrl = Flags1x1.d;
    } else {
      flagUrl = Flags1x1[cc.toLowerCase()];
    }

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.imageContainer)}>
          <img src={flagUrl} alt="flag" className={css(this.styles.image)} />
        </div>

        <section className={css(this.styles.text)}>{name}</section>
        {this.renderUnderline()}
      </div>
    );
  }
}

export type CountryPagerProps = BaseProps & {
  readonly activeCountries?: ReadonlyArray<string>;
};

const CountriesPerPage = 12;

@observer
export default class CountryPager extends Component<CountryPagerProps> {
  @observable
  currentIndex = 0;

  @observable
  currentPage = 0;

  @observable
  sliderWidth = 0;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      tabsRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderBottom: "solid 1px #dfe3e8",
      },
      tableRowContent: {
        display: "flex",
        flex: 1,
        alignItems: "flex-start",
        flexDirection: "row",
        overflowX: "hidden",
      },
      tabItem: {
        paddingTop: 20,
      },
      content: {
        alignSelf: "stretch",
      },
      pagerButton: {
        margin: 0,
        animationName: [
          {
            from: {
              transform: "scale(0, 0)",
            },
            to: {
              transform: "scale(1, 1)",
            },
          },
        ],
        animationDuration: `250ms`,
        animationTimingFunction: "cubic-bezier(.17,.67,.6,1)",
      },
      pagerButtonContainer: {
        top: 0,
        bottom: 0,
        paddingBottom: 14,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 1,
      },
    });
  }

  dispose: (() => void) | null | undefined;
  sliderRef: HTMLElement | null | undefined;
  dimenTimeout: ReturnType<typeof setTimeout> | null | undefined;

  componentDidMount() {
    if (this.sliderRef) {
      this.sliderWidth = (0.86 * this.sliderRef.clientWidth) / CountriesPerPage;
      this.dimenTimeout = setTimeout(() => {
        if (this.sliderRef) {
          this.sliderWidth = this.sliderRef.clientWidth / CountriesPerPage;
        }
      }, 200);
    }

    this.dispose = reaction(
      () => [this.currentPage],
      ([currentPage]) => {
        if (this.sliderRef != null) {
          const sliderRef: HTMLElement = this.sliderRef;
          const scrollToIndex = Math.max(currentPage * CountriesPerPage - 1, 0);
          const countryNodes = sliderRef.childNodes;
          if (scrollToIndex >= countryNodes.length) {
            return;
          }
          const scrollToLeft = Math.min(
            this.sliderWidth * scrollToIndex,
            sliderRef.scrollWidth - sliderRef.clientWidth
          );

          // Temporary lift on the jquery ban
          // eslint-disable-next-line jquery/no-animate
          $(sliderRef).animate(
            {
              scrollLeft: scrollToLeft,
            },
            300
          );
        }
      }
    );
  }

  componentWillUnmount() {
    if (this.dimenTimeout) {
      clearTimeout(this.dimenTimeout);
    }

    if (this.dispose) {
      this.dispose();
    }
  }

  @computed
  get countryButtonWidth(): number | null | undefined {
    if (!this.sliderWidth) {
      return null;
    }

    return this.sliderWidth / CountriesPerPage;
  }

  @computed
  get children(): ReadonlyArray<React.ReactElement<CountryTabProps>> {
    const { children } = this.props;
    return React.Children.toArray(children).filter((e) =>
      React.isValidElement(e)
    ) as ReadonlyArray<React.ReactElement<CountryTabProps>>;
  }

  @computed
  get countries(): ReadonlyArray<CountryType> {
    return this.children
      .filter((child) => child.props.cc)
      .filter((_) => !!_) as any;
  }

  @computed
  get pageCountries(): ReadonlyArray<CountryType> {
    const start = this.currentPage * CountriesPerPage;
    return this.countries.slice(start, start + CountriesPerPage);
  }

  @computed
  get pageCount(): number {
    return Math.max(1, this.countries.length / CountriesPerPage);
  }

  @computed
  get canPageLeft(): boolean {
    return this.currentPage > 0;
  }

  @computed
  get canPageRight(): boolean {
    return this.currentPage < this.pageCount - 1;
  }

  renderLeftButton() {
    if (!this.canPageLeft) {
      return null;
    }

    return (
      <div
        className={css(this.styles.pagerButtonContainer)}
        style={{
          left: 0,
          alignItems: "flex-start",
          background: "linear-gradient(to right, white , transparent)",
        }}
      >
        <PagerButton
          direction={"backwards"}
          className={css(this.styles.pagerButton)}
          onClick={() => (this.currentPage -= 1)}
        />
      </div>
    );
  }

  renderRightButton() {
    if (!this.canPageRight) {
      return null;
    }

    return (
      <div
        className={css(this.styles.pagerButtonContainer)}
        style={{
          right: 0,
          alignItems: "flex-end",
          background: "linear-gradient(to right, transparent, white)",
        }}
      >
        <PagerButton
          direction={"forwards"}
          className={css(this.styles.pagerButton)}
          onClick={() => (this.currentPage += 1)}
        />
      </div>
    );
  }

  render() {
    const { className, activeCountries = [] } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <Sticky enabled top={94} innerZ={100}>
          <div className={css(this.styles.tabsRow)}>
            {this.renderLeftButton()}
            <div
              ref={(_) => (this.sliderRef = _)}
              className={css(this.styles.tableRowContent)}
            >
              {this.countries.map((country, idx) => (
                <div
                  key={country.cc}
                  className={css(this.styles.tabItem)}
                  onClick={() => (this.currentIndex = idx)}
                >
                  <CountryTab
                    {...country}
                    width={this.sliderWidth}
                    selected={this.currentIndex === idx}
                    isEnabled={activeCountries.includes(country.cc)}
                  />
                </div>
              ))}
            </div>
            {this.renderRightButton()}
          </div>
        </Sticky>

        <div className={css(this.styles.content)}>
          {this.children[this.currentIndex]}
        </div>
      </div>
    );
  }
}
