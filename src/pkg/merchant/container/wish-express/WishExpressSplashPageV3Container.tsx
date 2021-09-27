import React, { Component } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import Color from "color";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { StaggeredScaleIn } from "@ContextLogic/lego";
import { Carousel } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import SiteFooter from "@merchant/component/nav/SiteFooter";
import WishExpressApplicationModal from "@merchant/component/wish-express/application/WishExpressApplicationModal";

/* SVGs */
import mainIllustrationLargeSreen from "@assets/img/we-splash-illustration-large-screen.svg";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const ContentMaxWidth = 800;
const GreyBackground = palettes.greyScaleColors.LighterGrey;
const BlueBackground = palettes.coreColors.WishBlue;

const orangeText = palettes.oranges.Orange;
const whiteText = palettes.textColors.White;

@observer
export default class WishExpressSplashPageV3Container extends Component<{
  initialData: {};
}> {
  onJoinClicked = () => {};

  @computed
  get firstPageHeight(): number {
    const { dimenStore } = AppStore.instance();
    return dimenStore.screenInnerHeight * 0.5;
  }

  @computed
  get headerBackgroundColor(): string {
    const { dimenStore } = AppStore.instance();
    if (dimenStore.pageYOffset < this.firstPageHeight) {
      return GreyBackground;
    }

    return BlueBackground;
  }

  @computed
  get headerTextColor(): string {
    const { dimenStore } = AppStore.instance();
    if (dimenStore.pageYOffset < this.firstPageHeight) {
      return orangeText;
    }

    return whiteText;
  }

  @computed
  get headerBorderColor(): string {
    const { dimenStore } = AppStore.instance();
    if (dimenStore.pageYOffset <= 200) {
      return "transparent";
    }

    return new Color(this.headerBackgroundColor).darken(0.05).toString();
  }

  @computed
  get splashImageUrl(): string {
    return mainIllustrationLargeSreen;
  }

  @computed
  get splashImageStyle(): any {
    const { dimenStore } = AppStore.instance();
    if (dimenStore.isVerySmallScreen) {
      return {};
    }

    if (dimenStore.isSmallScreen) {
      return {};
    }

    return {};
  }

  @computed
  get styles() {
    const { dimenStore } = AppStore.instance();

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        backgroundColor: palettes.textColors.White,
      },
      firstPage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: GreyBackground,
        height: this.firstPageHeight,
        padding: `160px ${dimenStore.pageGuideX} 0px ${dimenStore.pageGuideX}`,
        backgroundImage: `url(${this.splashImageUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
      },
      firstPageInner: {
        maxWidth: ContentMaxWidth,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        zIndex: 999,
        justifyContent: "space-between",
        marginBottom: 80,
        padding: `15px ${dimenStore.pageGuideX}`,
        backgroundColor: this.headerBackgroundColor,
        transition: "all 0.3s linear",
        position: "fixed",
        left: 0,
        right: 0,
        borderBottom: `1px solid ${this.headerBorderColor}`,
      },
      headerText: {
        color: this.headerTextColor,
        fontSize: 22,
        fontWeight: fonts.weightSemibold,
        paddingLeft: 8,
        paddingTop: 5,
      },
      headerLogo: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 40,
      },
      title: {
        fontSize: dimenStore.screenMatch<CSSProperties["fontSize"]>({
          verySmallScreen: 25,
          smallScreen: 33,
          largeScreen: 40,
          default: 40,
        }),
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.2,
        color: palettes.textColors.Ink,
        textAlign: "center",
        cursor: "default",
      },
      subtitle: {
        fontSize: dimenStore.isVerySmallScreen ? 18 : 24,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.4,
        color: palettes.textColors.DarkInk,
        marginTop: 35,
        cursor: "default",
        textAlign: "center",
      },
      mainAction: {
        marginTop: 40,
        fontSize: 20,
        borderRadius: 6,
        padding: "15px 80px",
      },
      sellingPointsPage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `0px ${dimenStore.pageGuideX} 0px ${dimenStore.pageGuideX}`,
        margin: "40px 0px",
      },
      sellingPoints: {
        display: "flex",
        flexDirection: dimenStore.isLargeScreen ? "row" : "column",
        flexWrap: "wrap",
      },
      sellingPoint: {
        display: "flex",
        flexDirection: dimenStore.screenMatch({
          smallScreen: "row",
          verySmallScreen: "column",
          largeScreen: "column",
          default: "column",
        }),
        alignItems: "flex-start",
        marginBottom: 40,
        width: dimenStore.isLargeScreen ? "30%" : undefined,
        padding: dimenStore.isLargeScreen ? "0px 7px" : undefined,
      },
      sellingPointImg: {
        width: 60,
        marginRight: 40,
        marginBottom: 20,
      },
      sellingPointContent: {
        display: "flex",
        flexDirection: "column",
      },
      sellingPointTitle: {
        fontSize: dimenStore.isVerySmallScreen ? 20 : 22,
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
        marginBottom: 12,
        cursor: "default",
      },
      sellingPointSubtitle: {
        fontSize: dimenStore.isVerySmallScreen ? 16 : 18,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        color: palettes.textColors.DarkInk,
        cursor: "default",
      },
      lastPitchContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(47, 183, 236, 0.16)",
        padding: `40px ${dimenStore.pageGuideX} 0px ${dimenStore.pageGuideX}`,
      },
      secondaryTitle: {
        fontWeight: fonts.weightMedium,
        fontSize: dimenStore.isVerySmallScreen ? 29 : 30,
        lineHeight: 1.25,
        color: palettes.textColors.Ink,
        marginBottom: 25,
        textAlign: "center",
      },
      lastPitchAction: {
        marginBottom: 22,
        fontSize: 20,
        borderRadius: 6,
        padding: "15px 80px",
      },
      lastPitchJoinLater: {
        fontSize: dimenStore.isVerySmallScreen ? 17 : 20,
        fontWeight: fonts.weightMedium,
        color: palettes.coreColors.WishBlue,
        cursor: "pointer",
        transition: "opacity 0.3s linear",
        opacity: 0.6,
        ":hover": {
          opacity: 1,
        },
      },
      lastPitchIllustration: {
        marginTop: 30,
        minWidth: 200,
      },
      mainIllustrationContainer: {
        position: "absolute",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        left: 0,
        right: 0,
        bottom: 0,
      },
      mainIllustration: {
        width: "100%",
      },
      testimonialsContainer: {
        display: "flex",
        backgroundColor: "#f8fafb",
        flexDirection: "column",
        alignItems: "center",
        padding: `0px ${dimenStore.pageGuideX}`,
      },
      carousel: {
        display: "flex",
        alignSelf: "stretch",
        flexDirection: "column",
        justifyContent: "center",
        height: "280px",
      },
      carouselContainer: {
        display: "flex",
        alignSelf: "stretch",
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: 40,
        boxShadow: "0 4px 6px 0 rgba(175, 199, 209, 0.4)",
        border: "solid 1px rgba(175, 199, 209, 0.5)",
      },
      carouselItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        height: "280px",
        paddingLeft: "60px",
      },
      testimonialSecondaryTitle: {
        fontWeight: fonts.weightMedium,
        fontSize: dimenStore.isVerySmallScreen ? 29 : 30,
        lineHeight: 1.25,
        color: palettes.textColors.Ink,
        marginBottom: 45,
        textAlign: "center",
        paddingTop: "60px",
      },
      carouselItemHeader: {
        fontSize: "24px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.17,
        letterSpacing: "normal",
        color: "#192a32",
        marginBottom: 10,
      },
      carouselItemTestimonialParagraph: {
        height: "72px",
        fontSize: "16px",
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: "#4a5f6e",
      },
      carouselItemOwnerTitle: {
        height: "24px",
        fontSize: "16px",
        fontWeight: fonts.weightBold,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: "#192a32",
      },
      carouselItemBusinessTitle: {
        height: "24px",
        fontSize: "16px",
        fontStyle: "normal",
        fontStretch: "normal",
        letterSpacing: "normal",
        color: "#4a5f6e",
        paddingBottom: 10,
      },
      carouselItemImage: {
        width: "112px",
        marginTop: 5,
      },
      carouselItemContentsWithoutImage: {
        flex: "1 1 auto",
        paddingLeft: "35px",
        paddingRight: "40px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: 135,
      },
    });
  }

  renderHeader() {
    const { dimenStore } = AppStore.instance();

    return (
      <div className={css(this.styles.header)}>
        <div
          style={{
            display: "flex",
          }}
        >
          <Illustration
            className={css(this.styles.headerLogo)}
            name="wishExpressWithoutText"
            alt="wish-express-truck"
          />
          <div className={css(this.styles.headerText)}>Wish Express</div>
        </div>
        <SecondaryButton
          onClick={() => {
            new WishExpressApplicationModal().render();
          }}
          padding="10px 20px"
          type="default"
          style={{
            fontSize: dimenStore.isVerySmallScreen ? 15 : 17,
            ":hover": {
              color: palettes.coreColors.WishBlue,
              backgroundColor: palettes.textColors.White,
            },
          }}
        >
          Join Wish Express
        </SecondaryButton>
      </div>
    );
  }

  renderSellingPoints() {
    return (
      <div className={css(this.styles.sellingPointsPage)}>
        <StaggeredFadeIn
          className={css(this.styles.sellingPoints)}
          animationDurationMs={1000}
          animationDelayMs={800}
          deltaY={-10}
        >
          <article className={css(this.styles.sellingPoint)}>
            <Illustration
              className={css(this.styles.sellingPointImg)}
              name="illustration1"
              alt="get more exposure"
            />
            <div className={css(this.styles.sellingPointContent)}>
              <section className={css(this.styles.sellingPointTitle)}>
                Up to 10X More Exposure
              </section>
              <section className={css(this.styles.sellingPointSubtitle)}>
                Wish Express helps you reach more customers, through exclusive
                Wish Express promotions and preferred product placement
                throughout our app and website.
              </section>
            </div>
          </article>
          <article className={css(this.styles.sellingPoint)}>
            <Illustration
              className={css(this.styles.sellingPointImg)}
              name="illustration2"
              alt="wish express tab in the app"
            />
            <div className={css(this.styles.sellingPointContent)}>
              <section className={css(this.styles.sellingPointTitle)}>
                Wish Express Tab
              </section>
              <section className={css(this.styles.sellingPointSubtitle)}>
                Wish Express products are placed additionally in the exclusive
                Wish Express tab on our app and website.
              </section>
            </div>
          </article>
          <article className={css(this.styles.sellingPoint)}>
            <Illustration
              className={css(this.styles.sellingPointImg)}
              name="illustration3"
              alt="wish express badge"
            />
            <div className={css(this.styles.sellingPointContent)}>
              <section className={css(this.styles.sellingPointTitle)}>
                Wish Express Badge
              </section>
              <section className={css(this.styles.sellingPointSubtitle)}>
                Your products will be awarded a Wish Express badge for faster
                delivery, increasing customer trust and boosting sales.
              </section>
            </div>
          </article>
          <article className={css(this.styles.sellingPoint)}>
            <Illustration
              className={css(this.styles.sellingPointImg)}
              name="illustration4"
              alt="faster payment"
            />
            <div className={css(this.styles.sellingPointContent)}>
              <section className={css(this.styles.sellingPointTitle)}>
                Faster Payment
              </section>
              <section className={css(this.styles.sellingPointSubtitle)}>
                Using eligible carriers, you get paid as soon as carrier
                confirms delivery.
              </section>
            </div>
          </article>
          <article className={css(this.styles.sellingPoint)}>
            <Illustration
              className={css(this.styles.sellingPointImg)}
              name="illustration5"
              alt="5% Cashback for new merchants"
            />
            <div className={css(this.styles.sellingPointContent)}>
              <section className={css(this.styles.sellingPointTitle)}>
                Exclusive Merchant Promotions
              </section>
              <section className={css(this.styles.sellingPointSubtitle)}>
                You will have access to our various cashback programs exclusive
                to Wish Express.
              </section>
            </div>
          </article>
        </StaggeredFadeIn>
      </div>
    );
  }

  renderFirstPitch() {
    return (
      <div className={css(this.styles.firstPage)}>
        <StaggeredFadeIn
          className={css(this.styles.firstPageInner)}
          animationDurationMs={500}
        >
          <section className={css(this.styles.title)}>
            Join Wish Express and boost sales today
          </section>
          <section className={css(this.styles.subtitle)}>
            Get access to exclusive promotions and badging by joining Wish
            Express today!
          </section>

          <StaggeredScaleIn
            animationDurationMs={200}
            animationDelayMs={400}
            startScale={0.99}
          >
            <PrimaryButton
              onClick={() => {
                new WishExpressApplicationModal().render();
              }}
              className={css(this.styles.mainAction)}
            >
              Join Wish Express
            </PrimaryButton>
          </StaggeredScaleIn>
        </StaggeredFadeIn>
      </div>
    );
  }

  renderLastPitch() {
    return (
      <section className={css(this.styles.lastPitchContainer)}>
        <section className={css(this.styles.secondaryTitle)}>
          Interested in joining Wish Express?
        </section>
        <PrimaryButton
          className={css(this.styles.lastPitchAction)}
          onClick={() => {
            new WishExpressApplicationModal().render();
          }}
        >
          Join Wish Express
        </PrimaryButton>

        <div className={css(this.styles.lastPitchJoinLater)}>
          <Link href="/">I will join later</Link>
        </div>

        <Illustration
          className={css(this.styles.lastPitchIllustration)}
          name="illustration6"
          alt="join wish express"
        />
      </section>
    );
  }

  renderTestimonials() {
    return (
      <section className={css(this.styles.testimonialsContainer)}>
        <section className={css(this.styles.testimonialSecondaryTitle)}>
          What did merchants say
        </section>
        <section className={css(this.styles.carouselContainer)}>
          <Carousel className={css(this.styles.carousel)} contentHeight={280}>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="merchant1" alt="Mitch & Caitlin" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    Wish Express very quickly became a vital sales opportunity
                    for Apericots!
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    Through Wish Express, not only can we present and promote
                    our fast delivery, but also reach a broader customer base
                    who counts on the reliability and guarantee of Wish Express.
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Mitch & Caitlin
                  </div>
                  <div className={css(this.styles.carouselItemBusinessTitle)}>
                    Apericots
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="merchant2" alt="Ondrej Hradec" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    Wish allows us to differentiate ourselves from other
                    sellers.
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    Through Wish Express, not only can we present and promote
                    our fast delivery, but also reaches a wider customer base
                    who counts on the reliability and guarantee of Wish Express.
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Ondrej Hradec
                  </div>
                  <div className={css(this.styles.carouselItemBusinessTitle)}>
                    Head of eCommerce, Mascot Online B.V
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="cnmerchant2" alt="Lihang Yao" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    The Wish Express tab and banner provide great exposure for
                    our products.
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    The sales volume of our Wish Express-enabled products has
                    significantly increased, with some products doubling their
                    sales!
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Lihang Yao
                  </div>
                  <p className={css(this.styles.carouselItemBusinessTitle)}>
                    Ningbo Lai Jun De Rui Co., Ltd.
                  </p>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="cnmerchant1" alt="Derek Zhang" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    Our annual sales on Wish more than doubled after we started
                    using Wish Express.
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    Wish Express offers a better buying experience for Wish
                    consumers. As a result of the fast delivery time, we receive
                    customer feedback sooner, which helps us improve our
                    business operation.
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Derek Zhang
                  </div>
                  <div className={css(this.styles.carouselItemBusinessTitle)}>
                    The tadpoles (Hong Kong) Internet Technology Co., Ltd.
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="merchant3" alt="Marcela Jady" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    Wish Express has been the best catalyst for our growth.
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    We enrolled in the program in March and in 2 weeks we saw
                    tremendous growth. It exceeded our expectations and brought
                    more sales due to major impression boost and conversions.
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Marcela Jady
                  </div>
                  <div className={css(this.styles.carouselItemBusinessTitle)}>
                    Manager, Marketplace Growth
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={css(this.styles.carouselItem)}>
                <div className={css(this.styles.carouselItemImage)}>
                  <Illustration name="merchant4" alt="Rupesh Sanghavi" />
                </div>
                <div
                  className={css(this.styles.carouselItemContentsWithoutImage)}
                >
                  <div className={css(this.styles.carouselItemHeader)}>
                    Wish Express is a win-win situation for customers and
                    sellers.
                  </div>
                  <div
                    className={css(
                      this.styles.carouselItemTestimonialParagraph,
                    )}
                  >
                    Wish Express, along with our experience, expertise and
                    logistic tie-ups enabled us to quickly fulfill all orders
                    received by us under the Wish Express Program.
                  </div>
                  <div className={css(this.styles.carouselItemOwnerTitle)}>
                    Rupesh Sanghavi
                  </div>
                  <div className={css(this.styles.carouselItemBusinessTitle)}>
                    CEO, ErgodE Inc
                  </div>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </section>
      </section>
    );
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        {this.renderHeader()}
        {this.renderFirstPitch()}
        {this.renderSellingPoints()}
        {this.renderTestimonials()}
        {this.renderLastPitch()}
        <SiteFooter />
      </div>
    );
  }
}
