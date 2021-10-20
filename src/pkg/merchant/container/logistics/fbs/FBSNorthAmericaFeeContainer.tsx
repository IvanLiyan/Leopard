import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { NavSideMenu } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

/* SVGs */
import bannerImage from "@assets/img/fbs/banner_illustration.svg";
import tagImage from "@assets/img/fbs/pricetag.svg";

const SectionFBWInbound = "fbw-inbound";
const SectionFBWStorage = "fbw-storage";
const SectionFBSService = "fbs-service";
const SectionMiscellaneous = "miscellaneous";

interface IPriceRow {
  weight: number;
  weightConverted: number;
  originalPrice: number;
  discountedPercent?: number;
}

const roundTwoDigits = (originalPrice: number, discountPercent: number) => {
  return ((originalPrice * (100 - discountPercent)) / 100).toFixed(2);
};

const poundToGramPrice = [
  [1, 454, 6.98],
  [2, 907, 9.08],
  [3, 1361, 11.78],
  [4, 1814, 13.65],
  [5, 2268, 15.51],
  [6, 2722, 17.24],
  [7, 3175, 19.69],
  [8, 3629, 21.52],
  [9, 4082, 24.35],
  [10, 4536, 27.39],
  [11, 4990, 28.68],
  [12, 5443, 29.96],
  [13, 5897, 31.25],
  [14, 6350, 32.53],
  [15, 6804, 33.82],
  [16, 7258, 35.1],
  [17, 7711, 36.39],
  [18, 8165, 37.67],
  [19, 8618, 38.96],
  [20, 9072, 40.24],
  [21, 9526, 41.53],
  [22, 9979, 42.81],
  [23, 10433, 44.1],
  [24, 10886, 45.38],
  [25, 11340, 46.67],
  [26, 11794, 47.95],
  [27, 12247, 49.24],
  [28, 12701, 50.52],
  [29, 13154, 51.81],
  [30, 13608, 53.09],
  [31, 14062, 54.38],
  [32, 14515, 55.66],
  [33, 14969, 56.95],
  [34, 15422, 58.23],
  [35, 15876, 59.51],
  [36, 16330, 60.79],
  [37, 16783, 62.07],
  [38, 17237, 63.35],
  [39, 17690, 64.63],
  [40, 18144, 65.91],
  [41, 18598, 67.19],
  [42, 19051, 68.47],
  [43, 19505, 69.75],
  [44, 19958, 71.03],
  [45, 20412, 72.31],
  [46, 20865, 73.59],
  [47, 21319, 74.87],
  [48, 21772, 76.15],
  [49, 22226, 77.43],
  [50, 22680, 78.71],
  [51, 23133, 79.99],
  [52, 23587, 81.27],
  [53, 24040, 82.55],
  [54, 24494, 83.83],
  [55, 24948, 85.11],
  [56, 25401, 86.39],
  [57, 25855, 87.67],
  [58, 26308, 88.95],
  [59, 26762, 90.23],
  [60, 27216, 91.51],
  [61, 27669, 92.79],
  [62, 28123, 94.07],
  [63, 28576, 95.35],
  [64, 29030, 96.63],
  [65, 29483, 97.91],
  [66, 29937, 99.19],
  [67, 30391, 100.47],
  [68, 30844, 101.75],
  [69, 31298, 103.03],
  [70, 31751, 104.31],
];

const ounceToGramPrice = [
  [1, 28, 3.35],
  [2, 56, 3.35],
  [3, 84, 3.35],
  [4, 112, 3.35],
  [5, 140, 3.47],
  [6, 168, 3.47],
  [7, 196, 3.47],
  [8, 224, 3.47],
  [9, 252, 4.29],
  [10, 280, 4.35],
  [11, 308, 4.41],
  [12, 336, 4.46],
  [13, 364, 4.52],
  [14, 392, 4.6],
  [15, 420, 4.64],
  [16, 453, 6.46],
];

const FBSNorthAmericaFeeContainer = () => {
  const styles = useStyleSheet();
  const [ozToGram, setOzToGram] = useState<number>(10);
  const [lbToGram, setLbToGram] = useState<number>(10);

  const currentSelection = (window.location.hash || "").substring(1);

  const renderFeeDiscountBanner = () => (
    <div className={css(styles.bannerRoot)}>
      <div className={css(styles.bannerImage)}>
        <img
          src={bannerImage}
          className={css(styles.arrowImg)}
          alt="discount"
          draggable={false}
        />
      </div>
      <div className={css(styles.bannerText)}>
        We are offering a 20% discount for all FBS Service Fee!
      </div>
    </div>
  );

  const renderServiceFee = ({
    weight,
    weightConverted,
    originalPrice,
    discountedPercent = 20,
  }: IPriceRow) => {
    return (
      <tr className={css(styles.tr)}>
        <td className={css(styles.td)}>
          <div className={css(styles.text)}>{weight}</div>
        </td>
        <td className={css(styles.td)}>
          <div className={css(styles.text)}>{weightConverted}</div>
        </td>
        <td className={css(styles.td)}>
          <div className={css(styles.horizontal)}>
            <div className={css(styles.striked)}>{`$${originalPrice}`}</div>
            <div className={css(styles.text)}>{`$${roundTwoDigits(
              originalPrice,
              discountedPercent,
            )}`}</div>
          </div>
        </td>
      </tr>
    );
  };

  const renderOrderRepackagingTable = () => (
    <table className={css(styles.table)}>
      <thead>
        <th className={css(styles.th)}>Fee Type</th>
        <th className={css(styles.th)}>Price</th>
      </thead>
      <tbody>
        <tr className={css(styles.tr)}>
          <td className={css(styles.td)}>
            <div className={css(styles.text)}>Order Repackaging Fee</div>
          </td>
          <td className={css(styles.td)}>
            <div className={css(styles.text)}>
              $1.00 per order will be charged if the package needs to be
              repacked.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  const renderOunzeToGramFee = () => {
    const arr = ounceToGramPrice.slice(0, ozToGram);
    return arr.map((item) =>
      renderServiceFee({
        weight: item[0],
        weightConverted: item[1],
        originalPrice: item[2],
      }),
    );
  };

  const renderPoundToGramFee = () => {
    const arr = poundToGramPrice.slice(0, lbToGram);
    return arr.map((item) =>
      renderServiceFee({
        weight: item[0],
        weightConverted: item[1],
        originalPrice: item[2],
      }),
    );
  };

  const onOzShowMoreClicked = () => {
    setOzToGram(Math.min(ozToGram + 10, ounceToGramPrice.length));
  };

  const onLbShowMoreClicked = () => {
    setLbToGram(Math.min(lbToGram + 10, poundToGramPrice.length));
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.sideContainer)}>
        <div className={css(styles.feeTypes)}>Fee Types</div>
        <NavSideMenu>
          <NavSideMenu.Item
            title={i`FBW Inbound Fee`}
            href={`#${SectionFBWInbound}`}
            selected={currentSelection === SectionFBWInbound}
          />
          <NavSideMenu.Item
            title={i`FBW Storage Fee`}
            href={`#${SectionFBWStorage}`}
            selected={currentSelection === SectionFBWStorage}
          />
          <NavSideMenu.Item
            title={i`FBS Service Fee`}
            href={`#${SectionFBSService}`}
            selected={currentSelection === SectionFBSService}
          />
          <NavSideMenu.Item
            title={i`Miscellaneous Fee`}
            href={`#${SectionMiscellaneous}`}
            selected={currentSelection === SectionMiscellaneous}
          />
        </NavSideMenu>
      </div>
      <div className={css(styles.content)}>
        <div className={css(styles.pageHeader)}>
          FBS Fee Structure - North America
        </div>
        {renderFeeDiscountBanner()}
        <div className={css(styles.pageDescription)}>
          To participate in FBS, merchants need to ship their inventory to one
          of the Fulfillment By Wish (FBW) warehouses. See below for applicable
          FBW warehousing fees and FBS service fee.
        </div>
        <ScrollableAnchor id={SectionFBWInbound}>
          <Card className={css(styles.card)}>
            <div className={css(styles.header)}>FBW Inbound Fee</div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Fee Type</th>
                <th className={css(styles.th)}>Price</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        One-time Shipping Plan Fee
                      </div>
                      <div className={css(styles.text)}>
                        Fixed fee to cover initial processing fees and pick up
                        (if available)
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>Free</div>
                      <div className={css(styles.text)}>
                        Free if delivered by carrier to warehouse.
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        SKU Fee
                      </div>
                      <div className={css(styles.text)}>
                        Fixed fee per SKU for initial inventory processing.
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        $0.12 Per Unit
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>

        <ScrollableAnchor id={SectionFBWStorage}>
          <Card className={css(styles.card)}>
            <div className={css(styles.header)}>FBW Storage Fee</div>
            <div className={css(styles.text)}>
              A storage charge for each item you have in the warehouse. Charged
              twice a month.
            </div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Days</th>
                <th className={css(styles.th)}>Price per CBM per day</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>0-90</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>Free</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>91-180</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$1.20</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>181-270</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$2.00</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>271-365</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$2.80</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>366+</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$3.60</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>

        <ScrollableAnchor id={SectionFBSService}>
          <Card className={css(styles.card)}>
            <div className={css(styles.horizontal)}>
              <div className={css(styles.header)}>FBS Service Fee</div>
              <div className={css(styles.horizontal, styles.discountOffer)}>
                <img
                  src={tagImage}
                  className={css(styles.arrowImg)}
                  alt="discount"
                  draggable={false}
                />
                <div className={css(styles.discount)}>20% discount offered</div>
              </div>
            </div>
            <div className={css(styles.text)}>
              Fee per order to deliver inventory from FBW warehouses to stores
              for customers to pickup.
            </div>
            <div className={css(styles.header)}>United States & Mexico</div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Weight (oz)</th>
                <th className={css(styles.th)}>Weight (g)</th>
                <th className={css(styles.th)}>Price per package (USD)</th>
              </thead>
              <tbody>
                {renderOunzeToGramFee()}
                {ozToGram < ounceToGramPrice.length && (
                  <tr>
                    <td colSpan={3}>
                      <div
                        className={css(styles.showMore)}
                        onClick={onOzShowMoreClicked}
                      >
                        Show More
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Weight (lb)</th>
                <th className={css(styles.th)}>Weight (g)</th>
                <th className={css(styles.th)}>Price per package (USD)</th>
              </thead>
              <tbody>
                {renderPoundToGramFee()}

                {lbToGram < poundToGramPrice.length && (
                  <tr>
                    <td colSpan={3}>
                      <div
                        className={css(styles.showMore)}
                        onClick={onLbShowMoreClicked}
                      >
                        Show More
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={css(styles.noteSection)}>
              <p>Notes</p>
              <p>
                1. FBS Service Fee is charged per customer order, based on
                chargeable weight range.
              </p>
              <p>
                2. Calculation of Chargeable Weight: If Gross Weight is less or
                equal to Dimensional Weight, Chargeable Weight will be
                Dimensional Weight; Otherwise, Chargeable Weight will be Gross
                weight.
              </p>
              <p>
                3. Discrepancies may occur due to chargeable weight range
                roundup and unit conversion.
              </p>
              <p>
                4. For weights above 34 lb: if the weight is 34 lb + X, the fee
                is $58.23 + 1.28 * X, until 70 lb
              </p>
            </div>
            {renderOrderRepackagingTable()}

            <div className={css(styles.header)}>Canada</div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Rate per order (USD)</th>
                <th className={css(styles.th)}>Rate per pound (USD)</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$2.47</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.horizontal)}>
                      <div className={css(styles.striked)}>$3.41</div>
                      <div className={css(styles.text)}>{`$${roundTwoDigits(
                        3.41,
                        20,
                      )}`}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={css(styles.noteSection)}>
              <p>Notes</p>
              <p>
                1. Shipping Fee consists of 2 parts: fixed fee per order plus
                the rate per pound calculated by order weight.
              </p>
              <p>
                2. Shipment is charged by actual weight. The weight is rounded
                up to two decimal places.
              </p>
              <p>
                3. Weight and Size Limitation: 3.1 Actual weight less than 4.4
                lbs; 3.2 measures less than 24 inches along its longest side;
                3.3 Total of length, height, and width cannot exceed 36 inches.
              </p>
              <p>4. The order value must be less than $400.</p>
            </div>
            {renderOrderRepackagingTable()}
          </Card>
        </ScrollableAnchor>
        <ScrollableAnchor id={SectionMiscellaneous}>
          <Card className={css(styles.card)}>
            <div className={css(styles.header)}>Miscellaneous Fee</div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Fee Type</th>
                <th className={css(styles.th)}>Price</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        FBW Disposal Fee
                      </div>
                      <div className={css(styles.text)}>
                        Fee if merchant requests inventory disposal.
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        $0.10 Per Unit
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text, styles.bold)}>
                        FBW Retrieval Fee
                      </div>
                      <div className={css(styles.text)}>
                        If you decide you want to retrieve an item from the
                        warehouse, you may be charged a fee to do this.
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text)}>
                        Please contact Wish merchant support for retrieve
                        inventory fee quotation based on the product and
                        quantity that need to be retrieved.
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const {
    pageBackground,
    primary,
    primaryLight,
    primaryDark,
    borderPrimary,
    textBlack,
    surfaceLight,
    textDark,
    textWhite,
    textLight,
    orangeSurface,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          backgroundColor: pageBackground,
        },
        header: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          color: textBlack,
          marginTop: 10,
          marginBottom: 10,
        },
        sideContainer: {
          borderRight: `solid 1px ${surfaceLight}`,
          backgroundColor: textWhite,
          display: "flex",
          flexDirection: "column",
        },
        card: {
          marginBottom: 24,
          padding: 24,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: 42,
        },
        table: {
          width: "100%",
          fontSize: 16,
          border: `1px solid ${borderPrimary}`,
          marginTop: 20,
        },
        noteSection: {
          backgroundColor: surfaceLight,
          border: `1px solid ${borderPrimary}`,
          color: textDark,
          padding: "16px 20px",
        },
        bold: {
          fontWeight: fonts.weightBold,
          color: textBlack,
          marginBottom: 10,
        },
        discountOffer: {
          marginLeft: 20,
        },
        arrowImg: {},
        td: {
          padding: "10px 24px",
        },
        discount: {
          color: orangeSurface,
          fontSize: 16,
          fontWeight: fonts.weightBold,
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 5,
        },
        th: {
          backgroundColor: primaryLight,
          fontWeight: fonts.weightBold,
          color: textBlack,
          textAlign: "left",
          fontSize: 16,
          padding: "10px 24px",
        },
        text: {
          color: textDark,
        },
        striked: {
          color: textLight,
          textDecoration: "line-through",
          marginRight: 15,
        },
        feeTypes: {
          fontWeight: fonts.weightBold,
          fontSize: 24,
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
        },
        horizontal: {
          display: "flex",
        },
        vertical: {
          display: "flex",
          flexDirection: "column",
        },
        tr: {
          border: `1px solid ${borderPrimary}`,
        },
        bannerRoot: {
          display: "flex",
          backgroundColor: primaryDark,
          borderRadius: 10,
          paddingLeft: 20,
        },
        bannerImage: {
          marginRight: 24,
        },
        bannerText: {
          color: textWhite,
          fontWeight: fonts.weightBold,
          marginTop: 24,
          fontSize: 16,
        },
        showMore: {
          display: "flex",
          justifyContent: "center",
          margin: 12,
          color: primary,
          cursor: "pointer",
        },
        pageHeader: {
          fontSize: 32,
          color: textBlack,
          marginBottom: 20,
          fontWeight: fonts.weightBold,
        },
        pageDescription: {
          marginTop: 20,
          marginBottom: 20,
          fontSize: 16,
          color: textDark,
        },
      }),
    [
      pageBackground,
      primary,
      primaryLight,
      primaryDark,
      borderPrimary,
      textBlack,
      surfaceLight,
      textDark,
      textWhite,
      textLight,
      orangeSurface,
    ],
  );
};

export default observer(FBSNorthAmericaFeeContainer);
