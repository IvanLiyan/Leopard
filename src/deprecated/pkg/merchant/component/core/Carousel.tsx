//
//  src/nav/Carousel.tsx
//  Project-Lego
//
//  Created by Demetrius on 06/11/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//

/*eslint-disable local-rules/no-dom-manipulation */
import { Component } from "react";
import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import AutoSizer from "react-virtualized-auto-sizer";
import makeCarousel from "react-reveal/makeCarousel";
import Slide from "react-reveal/Slide";

/* Lego Components */
import { SquaredChevronButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type CarouselProps = BaseProps & {
  readonly contentHeight: number;
};

@observer
class Carousel extends Component<CarouselProps> {
  static Item = (props: BaseProps) => <div>{props.children}</div>;

  @computed
  get styles() {
    const { contentHeight } = this.props;
    return StyleSheet.create({
      root: {
        /*
         * One word of caution about using AutoSizer with flexbox containers.
         * Flex containers don't prevent their children from growing and
         * AutoSizer greedily grows to fill as much space as possible.
         * Combining the two can cause a loop. The simple way to fix this is to
         * nest AutoSizer inside of a block element (like a <div>) rather than
         * putting it as a direct child of the flex container. Read more about
         * common AutoSizer questions here.
         */
        display: "inline-block",
        // eslint-disable-next-line local-rules/no-frozen-width
        width: "100%",
        height: contentHeight,
        flex: "1 1 auto",
      },
      cardSubtileDots: {
        textAlign: "center",
        width: "1%",
        zIndex: 100,
      },
      leftArrowContainer: {
        textShadow: "1px 1px 1px #fff",
        zIndex: 100,
        position: "absolute",
        display: "flex",
        top: 0,
        alignItems: "center",
        marginTop: 120,
        marginLeft: 5,
        justifyContent: "center",
      },
      rightArrowContainer: {
        textShadow: "1px 1px 1px #fff",
        top: 0,
        marginTop: 120,
        zIndex: 100,
        right: 0,
        paddingRight: 5,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      dotsContainer: {
        textAlign: "center",
        position: "absolute",
        zIndex: 100,
        bottom: 0,
        width: "100%",
        display: "flex",
        placeContent: "center",
      },
      dotInDotsContainer: {
        textAlign: "center",
        textShadow: "1px 1px 1px #fff",
        paddingTop: 10,
      },
      primaryDot: {
        color: "rgb(105,105,105)",
      },
      secondaryDot: {
        color: "rgba(175, 199, 209, 0.6)",
      },
    });
  }

  static demoWithVerticalLayout = true;

  static demoRender = `
  <Carousel
    contentHeight={280}
  >
    <Carousel.Item>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          paddingLeft: "60px"
        }}
      >
        <div>
          <Illustration
            name="merchant1"
            alt="Mitch & Caitlyn"
            style={{ width: "112px", marginTop: 5 }}
          />
        </div>
        <div
          style={{
            flex: "1 1 auto",
            paddingLeft: "35px",
            paddingRight: "40px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: 125
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: fonts.weightMedium,
              fontStyle: "normal",
              fontStretch: "normal",
              lineHeight: 1.17,
              letterSpacing: "normal",
              color: "#192a32"
            }}
          >
            Wish Express very quickly became a vital sales opportunity for
            Apericots!
          </div>
          <div
            style={{
              height: "72px",
              fontSize: "16px",
              fontStyle: "normal",
              fontStretch: "normal",
              lineHeight: 1.5,
              letterSpacing: "normal",
              color: "#4a5f6e",
              marginRight: 10
            }}
          >
            Through Wish Express, not only can we present and promote our fast
            delivery, but also reach a broader customer base who counts on the
            reliability and guarantee of Wish Express.
          </div>
          <div
            style={{
              height: "24px",
              fontSize: "16px",
              fontWeight: fonts.weightBold,
              fontStyle: "normal",
              fontStretch: "normal",
              lineHeight: 1.5,
              letterSpacing: "normal",
              color: "#192a32"
            }}
          >
            Mitch & Caitlin
          </div>
          <div
            style={{
              height: "24px",
              fontSize: "16px",
              fontStyle: "normal",
              fontStretch: "normal",
              letterSpacing: "normal",
              color: "#4a5f6e"
            }}
          >
            Apericots
          </div>
        </div>
      </div>
    </Carousel.Item>
  </Carousel>
`;

  render() {
    const { className, style, children: childrenProp } = this.props;
    const children = React.Children.toArray(childrenProp).filter(
      (e) =>
        React.isValidElement(e) && (e.type as any).name == Carousel.Item.name
    );

    const showPageIndicators = children.length > 1;

    type StyleType = NonNullable<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >["style"]
    >;

    return (
      <div className={css(className, this.styles.root, style)}>
        <AutoSizer>
          {({
            width,
            height,
          }: {
            width: StyleType["width"];
            height: StyleType["height"];
          }) => {
            const carouselStyle: StyleType = {
              position: "relative",
              overflow: "hidden",
              width,
              height,
            };

            const CarouselUI = ({
              position,
              total,
              handleClick,
              children,
            }: {
              position: number;
              total: number;
              handleClick: () => unknown | null | undefined;
              children: any;
            }) => (
              <div style={carouselStyle}>
                {children}
                {showPageIndicators && (
                  <>
                    <SquaredChevronButton
                      direction="left"
                      size={15}
                      onClick={handleClick}
                      data-position={position - 1}
                      className={css(this.styles.leftArrowContainer)}
                    />
                    <SquaredChevronButton
                      direction="right"
                      size={15}
                      onClick={handleClick}
                      className={css(this.styles.rightArrowContainer)}
                      data-position={position + 1}
                    />
                    <span className={css(this.styles.dotsContainer)}>
                      {Array(...Array(total)).map((val, index) => (
                        <span
                          className={css(this.styles.dotInDotsContainer)}
                          onClick={handleClick}
                          data-position={index}
                        >
                          {index === position ? (
                            <div
                              className={css(this.styles.primaryDot)}
                            >{`●`}</div>
                          ) : (
                            <div className={css(this.styles.secondaryDot)}>
                              {`●`}
                            </div>
                          )}
                        </span>
                      ))}
                    </span>
                  </>
                )}
              </div>
            );
            const CarouselSlider = makeCarousel(CarouselUI);
            return (
              <CarouselSlider>
                {children.map((child) => {
                  if (!React.isValidElement(child)) {
                    return null;
                  }
                  return (
                    <Slide delay={3} right key={child.key}>
                      {child.props.children}
                    </Slide>
                  );
                })}
              </CarouselSlider>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}

export default Carousel;
