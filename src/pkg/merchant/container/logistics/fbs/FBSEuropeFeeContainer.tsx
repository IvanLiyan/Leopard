import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { NavSideMenu } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import ScrollableAnchor from "react-scrollable-anchor";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { UserGateSchema } from "@schema/types";

type InitialData = {
  readonly currentUser: {
    readonly gating: {
      readonly fbwFeeExperiment: UserGateSchema["isAllowed"];
    };
  };
};

type Props = {
  readonly initialData: InitialData;
};

const SectionFBWInbound = "fbw-inbound";
const SectionFBWStorage = "fbw-storage";
const SectionFBSService = "fbs-service";
const SectionOutbound = "outbound";

const SectionMiscellaneous = "miscellaneous";

const feePerCountry = [
  [i`Austria`, 6.56, 9.26],
  [i`Belgium`, 3.93, 6.79],
  [i`Bulgaria`, 20.86, 24.08],
  [i`Croatia`, 26.12, 28.96],
  [i`Czech Republic`, 7.55, 9.22],
  [i`Denmark`, 7.38, 10.31],
  [i`Estonia`, 15.16, 17.99],
  [i`Finland`, 18.47, 22.15],
  [i`France`, 5.15, 11.27],
  [i`Germany`, 4.66, 6.01],
  [i`Hungary`, 10.0, 11.35],
  [i`Ireland`, 4.61, 16.28],
  [i`Italy`, 5.05, 14.0],
  [i`Latvia`, 13.48, 16.22],
  [i`Lithuania`, 11.04, 13.62],
  [i`Luxembourg`, 4.39, 7.0],
  [i`Netherlands`, 4.39, 6.89],
  [i`Poland`, 7.52, 9.79],
  [i`Portugal`, 17.25, 19.73],
  [i`Romania`, 18.22, 22.94],
  [i`Slovakia`, 9.28, 12.36],
  [i`Slovenia`, 10.35, 11.28],
  [i`Spain`, 15.51, 14.59],
  [i`Sweden`, 11.19, 13.61],
  [i`United Kingdom (Great Britain)`, 3.06, 9.69],
  [i`United Kingdom (Scotland)`, 6.91, 9.69],
  [i`United Kingdom (Northern Ireland)`, 5.42, 9.69],
];

const experimentFeePerCountry = [
  [
    i`Austria`,
    3.95,
    4.38,
    4.6,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    4.81,
    8.86,
    8.86,
  ],
  [
    i`Belgium`,
    3.64,
    3.74,
    3.85,
    3.95,
    4.05,
    4.16,
    4.26,
    4.37,
    4.47,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    4.57,
    8.73,
    8.73,
  ],
  [
    i`Bulgaria`,
    4.5,
    5.04,
    5.59,
    6.14,
    6.69,
    7.24,
    7.79,
    8.33,
    8.88,
    9.43,
    9.98,
    10.53,
    11.08,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
    11.62,
  ],
  [
    i`Croatia`,
    3.32,
    3.85,
    4.38,
    4.92,
    5.45,
    5.98,
    6.52,
    7.05,
    7.58,
    8.12,
    8.65,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
    9.18,
  ],
  [
    i`Czech Republic`,
    3.14,
    3.6,
    4.06,
    4.52,
    4.98,
    5.44,
    5.9,
    6.36,
    6.82,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    7.28,
    11.23,
    11.23,
  ],
  [
    i`Denmark`,
    4.08,
    4.39,
    4.7,
    5.0,
    5.31,
    5.62,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    5.71,
    7.01,
    7.01,
    7.01,
    9.44,
    12.05,
  ],
  [
    i`Estonia`,
    5.29,
    5.84,
    6.4,
    6.95,
    7.51,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
    7.67,
  ],
  [
    i`Finland`,
    4.95,
    5.71,
    6.47,
    7.23,
    8.0,
    8.76,
    9.52,
    10.28,
    11.04,
    11.81,
    12.57,
    13.33,
    14.09,
    14.86,
    15.62,
    15.62,
    15.62,
    15.62,
    15.62,
    15.62,
    15.62,
    15.62,
    15.62,
    17.73,
    19.5,
  ],
  [
    i`France`,
    3.68,
    3.95,
    4.22,
    4.49,
    4.76,
    5.02,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    5.08,
    7.44,
    8.09,
    8.73,
    11.76,
    11.76,
  ],
  [
    i`Germany`,
    3.41,
    3.59,
    3.61,
    3.61,
    3.61,
    3.61,
    3.61,
    3.61,
    3.61,
    3.61,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.78,
    3.9,
    3.9,
    5.55,
    9.07,
  ],
  [
    i`Greece`,
    3.42,
    3.96,
    4.49,
    5.02,
    5.55,
    6.1,
    6.63,
    7.16,
    7.69,
    8.24,
    8.77,
    9.3,
    9.83,
    10.38,
    10.91,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
    11.44,
  ],
  [
    i`Hungary`,
    3.25,
    3.76,
    4.28,
    4.79,
    5.31,
    5.82,
    6.34,
    6.85,
    7.37,
    7.88,
    8.4,
    8.91,
    9.43,
    9.94,
    10.46,
    10.97,
    11.49,
    12.0,
    12.0,
    12.0,
    12.0,
    12.0,
    12.0,
    12.0,
    12.0,
  ],
  [
    i`Ireland`,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    4.43,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    6.06,
    7.17,
    9.77,
  ],
  [
    i`Italy`,
    4.64,
    4.78,
    4.92,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    4.98,
    5.36,
    7.03,
    7.03,
    7.86,
    8.57,
  ],
  [
    i`Latvia`,
    3.0,
    3.44,
    3.88,
    4.32,
    4.76,
    5.19,
    5.63,
    6.07,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
    6.15,
  ],
  [
    i`Lithuania`,
    2.99,
    3.44,
    3.89,
    4.34,
    4.79,
    5.24,
    5.68,
    6.13,
    6.58,
    7.03,
    7.48,
    7.93,
    8.38,
    8.83,
    9.28,
    9.73,
    10.18,
    10.63,
    11.08,
    11.53,
    11.53,
    11.53,
    11.53,
    11.53,
    11.53,
  ],
  [
    i`Luxembourg`,
    4.1,
    4.26,
    4.41,
    4.57,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    4.72,
    9.28,
    9.28,
  ],
  [
    i`Netherlands`,
    3.51,
    3.95,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    4.3,
    5.41,
    8.03,
  ],
  [
    i`Poland`,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.66,
    2.95,
    3.25,
    4.67,
  ],
  [
    i`Portugal`,
    3.55,
    4.1,
    4.65,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    5.2,
    8.86,
    9.99,
  ],
  [
    i`Romania`,
    2.95,
    3.37,
    3.79,
    4.22,
    4.64,
    5.06,
    5.48,
    5.91,
    6.33,
    6.75,
    7.17,
    7.6,
    8.02,
    8.44,
    8.86,
    9.29,
    9.71,
    9.71,
    9.71,
    9.71,
    9.71,
    9.71,
    9.71,
    11.17,
    12.72,
  ],
  [
    i`Slovakia`,
    3.31,
    3.85,
    4.38,
    4.91,
    5.44,
    5.98,
    6.51,
    7.04,
    7.57,
    8.1,
    8.64,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
    9.17,
  ],
  [
    i`Slovenia`,
    3.97,
    4.19,
    4.42,
    4.65,
    4.88,
    5.1,
    5.33,
    5.56,
    5.78,
    6.01,
    6.24,
    6.47,
    6.69,
    6.92,
    7.15,
    7.37,
    7.6,
    7.83,
    8.06,
    8.28,
    8.28,
    8.28,
    8.28,
    8.28,
    8.28,
  ],
  [
    i`Spain`,
    3.46,
    4.0,
    4.55,
    5.09,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    5.63,
    7.72,
    9.24,
  ],
  [
    i`Sweden`,
    3.57,
    4.17,
    4.77,
    5.37,
    5.97,
    6.57,
    7.17,
    7.78,
    8.38,
    8.98,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    9.58,
    10.68,
    11.99,
  ],
  [
    i`United Kingdom (Great Britain)`,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.74,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    2.98,
    3.92,
    3.92,
    3.92,
    5.03,
    8.4,
  ],
  [
    i`United Kingdom (Northern Ireland)`,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    6.29,
    6.29,
    6.29,
    7.39,
    10.77,
  ],
  [
    i`United Kingdom (Scotland)`,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.1,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    5.34,
    6.29,
    6.29,
    6.29,
    7.39,
    10.77,
  ],
];

const FBSEuropeFeeContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStyleSheet();

  const currentSelection = (window.location.hash || "").substring(1);

  const { ...user } = initialData.currentUser;
  const fbwFeeExperiment = user.gating.fbwFeeExperiment;

  const renderServiceFee = (item: ReadonlyArray<string | number>) => {
    return (
      <tr className={css(styles.tr)}>
        <td className={css(styles.td)}>
          <div className={css(styles.text)}>{item[0]}</div>
        </td>
        <td className={css(styles.td)}>
          <div className={css(styles.text)}>{`$${item[1]}`}</div>
        </td>
        <td className={css(styles.td)}>
          <div className={css(styles.horizontal)}>
            <div className={css(styles.text)}>{`$${item[2]}`}</div>
          </div>
        </td>
      </tr>
    );
  };

  const renderCountryFee = () => {
    return feePerCountry.map((item) => renderServiceFee(item));
  };

  const renderExperimentServiceFee = (item: ReadonlyArray<string | number>) => {
    const nonCountryCols = item.slice(1);

    return (
      <tr className={css(styles.tr)}>
        <td className={css(styles.td, styles.stickyColumn)}>
          <div className={css(styles.text)}>{item[0]}</div>
        </td>
        {nonCountryCols.map((i) => (
          <td className={css(styles.td)}>
            <div className={css(styles.text)}>{`$${i}`}</div>
          </td>
        ))}
      </tr>
    );
  };

  const renderExperimentCountryFee = () => {
    return experimentFeePerCountry.map((item) =>
      renderExperimentServiceFee(item)
    );
  };

  const header1 =
    i`Weight: <=3kg, Length: >=14cm and <=60cm, Width: >=9cm and ` +
    i`<=60cm, Height: <=60cm, L + W + H <= 90cm`;

  const header2 = i`Weight: >3kg and <= 22kg, Length: <150cm, L+2W+2H: <300cm`;

  const experimentHeader = i`Max. dims of L+2H+2W<300cm. max L < 150cm / 20 kg`;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.sideContainer)}>
        <Text weight="medium" className={css(styles.feeTypes)}>
          Fee Types
        </Text>
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
            title={i`FBW Outbound Fulfillment Fee`}
            href={`#${SectionOutbound}`}
            selected={currentSelection === SectionOutbound}
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
        <Text weight="bold" className={css(styles.pageHeader)}>
          FBS Fee Structure - Europe
        </Text>
        <div className={css(styles.pageDescription)}>
          To participate in FBS, merchants need to ship their inventory to one
          of the Fulfillment By Wish (FBW) warehouses. See below for applicable
          FBW warehousing fees and FBS service fee.
        </div>
        <ScrollableAnchor id={SectionFBWInbound}>
          <Card className={css(styles.card)}>
            <Text weight="bold" className={css(styles.header)}>
              FBW Inbound Fee
            </Text>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>
                  <Text weight="bold">Fee Type</Text>
                </th>
                <th className={css(styles.th)}>
                  <Text weight="bold">Price</Text>
                </th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        SKU Fee
                      </Text>
                      <div className={css(styles.text)}>
                        Fixed fee per SKU for initial inventory processing.
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        Free
                      </Text>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>

        <ScrollableAnchor id={SectionFBWStorage}>
          <Card className={css(styles.card)}>
            <Text weight="bold" className={css(styles.header)}>
              FBW Storage Fee
            </Text>
            <div className={css(styles.text)}>
              A storage charge for each item you have in the warehouse.
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
                    <div className={css(styles.text)}>$0.20</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>91-365</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$0.20</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>366+</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$0.20</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>
        <ScrollableAnchor id={SectionOutbound}>
          <Card className={css(styles.card)}>
            <Text weight="bold" className={css(styles.header)}>
              FBW Outbound Fulfillment Fee
            </Text>
            <div className={css(styles.text)}>
              A storage charge for each item you have in the warehouse.
            </div>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}></th>
                <th className={css(styles.th)}>Price Per Item</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>First Item</div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$0.65</div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>
                      Each Additional Item of the same SKU
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.text)}>$0.29</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </ScrollableAnchor>

        {fbwFeeExperiment ? (
          <ScrollableAnchor id={SectionFBSService}>
            <Card className={css(styles.card)}>
              <div className={css(styles.horizontal)}>
                <Text weight="bold" className={css(styles.header)}>
                  FBS Service Fee
                </Text>
              </div>
              <div className={css(styles.text)}>
                Fee per order to deliver inventory from FBW warehouses to stores
                for customers to pickup.
              </div>
              <div className={css(styles.text)}>
                (The same as FBW-AMS shipping fees rates)
              </div>
              <table className={css(styles.table)}>
                <thead>
                  <th className={css(styles.th)}>{experimentHeader}</th>
                </thead>
              </table>
              <div className={css(styles.scroll)} style={{ width: "1026px" }}>
                <table className={css(styles.table, styles.fixedRowAbove)}>
                  <tbody>
                    <tr>
                      <td className={css(styles.th, styles.stickyColumn)}>
                        Country
                      </td>
                      <td className={css(styles.th)}>0.1 kg</td>
                      <td className={css(styles.th)}>0.2 kg</td>
                      <td className={css(styles.th)}>0.3 kg</td>
                      <td className={css(styles.th)}>0.4 kg</td>
                      <td className={css(styles.th)}>0.5 kg</td>
                      <td className={css(styles.th)}>0.6 kg</td>
                      <td className={css(styles.th)}>0.7 kg</td>
                      <td className={css(styles.th)}>0.8 kg</td>
                      <td className={css(styles.th)}>0.9 kg</td>
                      <td className={css(styles.th)}>1 kg</td>
                      <td className={css(styles.th)}>1.1 kg</td>
                      <td className={css(styles.th)}>1.2 kg</td>
                      <td className={css(styles.th)}>1.3 kg</td>
                      <td className={css(styles.th)}>1.4 kg</td>
                      <td className={css(styles.th)}>1.5 kg</td>
                      <td className={css(styles.th)}>1.6 kg</td>
                      <td className={css(styles.th)}>1.7 kg</td>
                      <td className={css(styles.th)}>1.8 kg</td>
                      <td className={css(styles.th)}>1.9 kg</td>
                      <td className={css(styles.th)}>2 kg</td>
                      <td className={css(styles.th)}>3 kg</td>
                      <td className={css(styles.th)}>4 kg</td>
                      <td className={css(styles.th)}>5 kg</td>
                      <td className={css(styles.th)}>10 kg</td>
                      <td className={css(styles.th)}>20 kg</td>
                    </tr>
                    {renderExperimentCountryFee()}
                  </tbody>
                </table>
              </div>
              <div className={css(styles.noteSection)}>
                <p>Notes</p>
                <p>
                  1. Prices are charged based on payweight, the greater of
                  actual weight and volumetric weight using formula [length x
                  width x height in cm / 5000]
                </p>
                <p>
                  2. Shipping Fee is charged per customer order, based on
                  chargeable weight range.
                </p>
                <p>
                  3. Merchants are responsible for importing their products into
                  the Netherlands and paying duties, taxes and VAT in the
                  Netherlands and other EU countries where the order is sold to.
                </p>
                <p>
                  4. Warehouse does not accept illegal shipments. All products
                  violating local customs laws will be confiscated and handed
                  over to local authority for disposal and all legal liabilities
                  shall be undertook by the customer.
                </p>
                <p>
                  5. Please contact Wish merchant support for retrieve inventory
                  fee quotation based on the product and quantity that need to
                  be retrieved.
                </p>
              </div>
            </Card>
          </ScrollableAnchor>
        ) : (
          <ScrollableAnchor id={SectionFBSService}>
            <Card className={css(styles.card)}>
              <div className={css(styles.horizontal)}>
                <Text weight="bold" className={css(styles.header)}>
                  FBS Service Fee
                </Text>
              </div>
              <div className={css(styles.text)}>
                Fee per order to deliver inventory from FBW warehouses to stores
                for customers to pickup.
              </div>
              <div className={css(styles.text)}>
                (The same as FBW-AMS shipping fees rates)
              </div>
              <table className={css(styles.table)}>
                <thead>
                  <th className={css(styles.th)}>Weight and Dimension Limit</th>
                  <th className={css(styles.th)}>{header1}</th>
                  <th className={css(styles.th)}>{header2}</th>
                </thead>
                <tbody>
                  <tr>
                    <td className={css(styles.th)}>Country</td>
                    <td className={css(styles.th)}>Rate per parcel</td>
                    <td className={css(styles.th)}>Rate per carton</td>
                  </tr>
                  {renderCountryFee()}
                </tbody>
              </table>
              <div className={css(styles.noteSection)}>
                <p>Notes</p>
                <p>
                  1. Scotland and Northern Ireland have a different rate for UK
                  when weight is 3KG or less.
                </p>
                <p>
                  2. Shipping Fee is charged per customer order, based on
                  chargeable weight range.
                </p>
                <p>
                  3. Merchants are responsible for importing their products into
                  the Netherlands and paying duties, taxes and VAT in the
                  Netherlands and other EU countries where the order is sold to.
                </p>
                <p>
                  4. Warehouse does not accept illegal shipments. All products
                  violating local customs laws will be confiscated and handed
                  over to local authority for disposal and all legal liabilities
                  shall be undertook by the customer.
                </p>
                <p>
                  5. Please contact Wish merchant support for retrieve inventory
                  fee quotation based on the product and quantity that need to
                  be retrieved.
                </p>
              </div>
            </Card>
          </ScrollableAnchor>
        )}

        <ScrollableAnchor id={SectionMiscellaneous}>
          <Card className={css(styles.card)}>
            <Text weight="bold" className={css(styles.header)}>
              Miscellaneous Fee
            </Text>
            <table className={css(styles.table)}>
              <thead>
                <th className={css(styles.th)}>Fee Type</th>
                <th className={css(styles.th)}>Price</th>
              </thead>
              <tbody>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        FBW Disposal Fee
                      </Text>
                      <div className={css(styles.text)}>
                        Fee if merchant requests inventory disposal.
                      </div>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        $0.12 Per Unit
                      </Text>
                    </div>
                  </td>
                </tr>
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        FBW Retrieval Fee
                      </Text>
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
                <tr className={css(styles.tr)}>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <Text
                        weight="bold"
                        className={css(styles.text, styles.bold)}
                      >
                        Order Repackaging Fee
                      </Text>
                    </div>
                  </td>
                  <td className={css(styles.td)}>
                    <div className={css(styles.vertical)}>
                      <div className={css(styles.text)}>
                        A per order fee will be charged if the package needs to
                        be repacked.
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
        fixedRowAbove: {
          marginTop: 0,
        },
        noteSection: {
          backgroundColor: surfaceLight,
          border: `1px solid ${borderPrimary}`,
          color: textBlack,
          padding: "16px 20px",
        },
        bold: {
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
        th: {
          backgroundColor: primaryLight,
          color: textBlack,
          textAlign: "left",
          fontSize: 16,
          padding: "10px 24px",
        },
        stickyColumn: {
          position: "sticky",
          width: 100,
          minWidth: 100,
          maxWidth: 100,
          left: 0,
          backgroundColor: primaryLight,
        },
        scroll: {
          overflowX: "scroll",
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
    ]
  );
};

export default observer(FBSEuropeFeeContainer);
