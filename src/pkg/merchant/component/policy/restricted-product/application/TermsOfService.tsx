/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Accordion,
  Card,
  CheckboxField,
  H6,
  Markdown,
  Text,
} from "@ContextLogic/lego";

/* Merchant Components */
import { CountryCodeToTermsOfServicesDoc } from "@merchant/component/policy/restricted-product/RestrictedProduct";
import RPApplicationState from "@merchant/model/policy/restricted-product/RPApplicationState";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RestrictedProductCountryCode } from "@schema/types";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type LegalInformationProps = BaseProps & {
  readonly currentApplication: RPApplicationState;
  readonly suspectedCountry: RestrictedProductCountryCode;
};

const TermsOfService = ({
  style,
  currentApplication,
  suspectedCountry,
}: LegalInformationProps) => {
  const tosLink = "/terms-of-service";
  const termsOfServicesDoc = CountryCodeToTermsOfServicesDoc[suspectedCountry];

  const [tosIsOpen, setTosIsOpen] = useState(true);
  const [plantOpen, setPlantOpen] = useState(false);
  const [otcIsOpen, setOtcIsOpen] = useState(false);
  const [mwIsOpen, setMwIsOpen] = useState(false);

  const styles = useStylesheet();

  return (
    <div className={css(styles.root, style)}>
      <Accordion
        header={i`Terms of Service`}
        onOpenToggled={(tosIsOpen) => {
          setTosIsOpen(tosIsOpen);
        }}
        isOpen={tosIsOpen}
      >
        <div className={css(styles.content)}>
          <Markdown
            text={
              i`Participant agrees that it is bound by the ` +
              i`[Terms of Service](${tosLink}) for Merchants, including, ` +
              i`without limitation, the requirements to comply with all ` +
              i`applicable law and to comply with Wish Merchant Policies.`
            }
          />
          <br />
          <p>By signing below, Participant represents and warrants that:</p>
          <p>
            (i) its participation shall not violate Merchant Terms of Service or
            Wish Policies;
          </p>
          <br />
          <p>
            (ii) it has conducted research or other diligence to understand and
            comply with the legal and regulatory regimes applicable to the
            products it intends to offer in the Program;
          </p>
          <br />
          <p>
            (iii) it has obtained any authorizations, permits or licenses
            (“Licenses”) required to sell or resell the products listed below;
            and
          </p>
          <br />
          <p>
            (iv) it will promptly provide proof of Licenses upon request by
            Wish.
          </p>
          <br />
          <p>
            Participant acknowledges and agrees that failure to comply with Wish
            Merchant Terms of Service, Merchant Policies or this Agreement may
            result in, among other things, removal of item listings, fines or
            suspensions. Moreover, if Participant conduct violates applicable
            law, Participant may be subject to investigation and enforcement by
            applicable regulators and law enforcement agencies.
          </p>
        </div>
      </Accordion>
      <Accordion
        header={i`Plant & Plant Seeds`}
        onOpenToggled={(plantOpen) => {
          setPlantOpen(plantOpen);
        }}
        isOpen={plantOpen}
      >
        <div className={css(styles.content)}>
          <H6>Product listings must comply with Wish policies</H6>
          <p>
            Wish does not generally permit the sale of Plants & Plant Seeds. At
            its option Wish may develop and support programs to permit select
            merchants to offer certain items under special terms or conditions.
          </p>
          <br />
          <p>
            Merchants must comply with national, state, and local laws when
            selling plant and plant seed products. Products may be eligible for
            sale within certain shipping regions. The merchant is responsible
            for acquiring permits, licenses, and proof of authorization for
            sales. Merchant must produce, upon Wish request proof of merchant’s
            authorization to trade in the applicable materials. Listings found
            to be in violation of this policy are subject to monetary penalties
            and/or removal without notice.
          </p>
          <br />
          <p>
            If you are approved to sell Plants & Plant Seeds, you must abide by
            our Plants & Plant Seeds sale restrictions under this L2L
            authorization.
          </p>
          <br />
          <H6>Restrictions</H6>
          <p>
            Even if you are permitted to sell under this L2L authorization, you
            are never permitted to offer plants or seeds that:
          </p>
          <ul>
            <li>Are classified as noxious</li>
            <li>Are endangered species</li>
            <li>Are considered a controlled substance</li>
            <li>Make impossible claims</li>
            <li>
              Use images that misrepresent the type of seeds being sold within
              the listing
            </li>
          </ul>
          <br />
          <H6>Requirements for Plant & Plant Seed-Sales</H6>
          <Card contentContainerStyle={css(styles.card)}>
            <div className={css(styles.cardContentTop)}>
              <div className={css(styles.cardContent)}>
                <Text weight="bold" className={css(styles.cardLeft)}>
                  United States Requirements
                </Text>
                <div className={css(styles.cardRight)}>
                  <Markdown
                    text={i`Merchants must abide by national laws​ by the **Federal Seed Act​ policy**:`}
                  />
                  <ul>
                    <li>
                      Plants & Plant Seeds must be labeled in the language
                      corresponding to the country of sale it is sold to (Ex.
                      English for the United States) with the following
                      information
                    </li>
                    <li>
                      Full name and address of the shipper or a code designation
                      identifying the shipper must be printed on the label
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr className={css(styles.line)} />
            <div className={css(styles.cardContentMid)}>
              <div className={css(styles.cardContent)}>
                <Text weight="bold" className={css(styles.cardLeft)}>
                  Europe Requirements
                </Text>
                <div className={css(styles.cardRight)}>
                  <Markdown
                    text={i`Merchants must abide by national laws​ by the **EU Plant Health Rules**:`}
                  />
                  <ul>
                    <li>
                      Requirements for internal movements – Regulation (EU)
                      2019/2072 – Annex VIII, IX and X
                    </li>
                    <li>
                      Production controls and inspections at the place of
                      production during the growing season and immediately after
                      harvest;
                    </li>
                    <li>Official producer registration;</li>
                    <li>
                      Plant passports, issued to accompany the plants, products
                      and other objects once they have passed all the EU
                      checks​.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr className={css(styles.line)} />
            <div className={css(styles.cardContentBot)}>
              <div className={css(styles.cardContent)}>
                <Text weight="bold" className={css(styles.cardLeft)}>
                  Asia Requirements
                </Text>
                <div className={css(styles.cardRight)}>
                  <Markdown
                    text={
                      i`Merchants must abide by national laws and the ` +
                      i`**Food and Agriculture Organization of the United Nation**` +
                      i`**(Asia and the Pacific)’s​​ Plant Protection Agreement**`
                    }
                  />
                </div>
              </div>
            </div>
            <hr className={css(styles.line)} />
            <div className={css(styles.cardContentBot)}>
              <div className={css(styles.cardContent)}>
                <Text weight="bold" className={css(styles.cardLeft)}>
                  Oceana Requirements
                </Text>
                <div className={css(styles.cardRight)}>
                  <Markdown
                    text={
                      i`Merchants must abide by national laws and the ` +
                      i`**Hazardous Substances and New Organisms Act ** ` +
                      i`**(New Zealand)** ​and the ​` +
                      i`**Biosecurity Import Conditions system (Australia)**​​ `
                    }
                  />
                </div>
              </div>
            </div>
            <hr className={css(styles.line)} />
            <div className={css(styles.cardContentBot)}>
              <div className={css(styles.cardContent)}>
                <Text weight="bold" className={css(styles.cardLeft)}>
                  Latin America Requirements
                </Text>
                <div className={css(styles.cardRight)}>
                  <Markdown
                    text={
                      i`Merchants must abide by national laws and the ` +
                      i`**International Plant Protection Convention (IPPC) ​** and the ` +
                      i`**International Union for the Protection of ` +
                      i`New Varieties of Plants 1961 (UPOV Convention)**​​ `
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Accordion>
      {currentApplication.hasOTCMedication && (
        <Accordion
          header={i`OTC Medication Addendum`}
          onOpenToggled={(otcIsOpen) => {
            setOtcIsOpen(otcIsOpen);
          }}
          isOpen={otcIsOpen}
        >
          <div className={css(styles.content)}>
            <H6>
              Over the country drug listings must comply with Wish policies
            </H6>
            <p>
              Wish does not generally permit the sale of products classified by
              regulators as medical devices or which require a prescription
              and/or a medical professional's supervision. For example, in the
              U.S. products classified by the Food and Drug Administration (FDA)
              as medical devices or that have not been approved by the FDA for
              over-the-counter sales may not be sold on Wish. At its option Wish
              may develop and support programs to permit select merchants to
              offer certain items under special terms or conditions.
            </p>
            <br />
            <p>
              Some products may be eligible for sale within certain shipping
              regions if the Merchant provides adequate safety certifications
              and proof of authorization. Listings found to be in violation of
              this policy are subject to monetary penalties and/or removal
              without notice.
            </p>
            <br />
            <p>Prohibited products include but are not limited to:</p>
            <ul>
              <li>Contact Lenses (U.S. and Other Countries)</li>
              <li>Contact Lens Solution</li>
              <li>Human Growth Hormone</li>
              <li>Chloroform</li>
              <li>Penicillin</li>
              <li>Eyelash Growth Serum</li>
              <li>Substances administered via injection</li>
              <li>
                Any product that is used primarily for preparing or using a
                controlled substance
              </li>
            </ul>

            <br />
            <H6>Requirements for Over The Counter Drug Sales</H6>
            <Card contentContainerStyle={css(styles.card)}>
              <div className={css(styles.cardContentTop)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    Labeling Requirements
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <p>
                      Drugs must be labeled in the language corresponding to the
                      country of sale it is sold to (Ex. English for the United
                      States) with the following information:
                    </p>
                    <ul>
                      <li>The title of the drug</li>
                      <li>The “Drug Facts” label</li>
                      <li>The active ingredient(s) of the drug</li>
                      <li>The purpose(s) of the drug</li>
                      <li>The use(s) of the drug</li>
                      <li>Any required warning(s)</li>
                      <li>Directions for the usage of the drug</li>
                      <li>
                        Any other information/directions for the specific
                        product
                      </li>
                      <li>Inactive ingredients</li>
                      <li>
                        Drug labels must not use unauthorized national
                        regulatory agency(ies) logo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className={css(styles.line)} />
              <div className={css(styles.cardContentMid)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    Packaging Requirements
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <ul>
                      <li>
                        Drugs must be sealed and packaged by the original
                        manufacturer
                      </li>
                      <li>Drugs must be new and unused</li>
                      <li>
                        Drugs must display identification codes on the package
                        by the manufacturer or distributor (ie. matrix codes,
                        lot numbers, or serial numbers)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className={css(styles.line)} />
              <div className={css(styles.cardContentBot)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    Drug products and ingredients requirements
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <ul>
                      <li>
                        Drug products must be approved by the respective
                        country’s national regulatory agency(ies) for
                        over-the-counter (OTC) sales
                      </li>
                      <li>
                        {i`Drug products must not require a medical professional's ` +
                          i`prescription, supervision or direction for their use, such as:`}
                        <ul>
                          <li>
                            Prescription drugs and their active ingredients
                          </li>
                          <li>Antibiotics</li>
                          <li>Vaccines</li>
                          <li>
                            Prescription veterinary products and their active
                            ingredients
                          </li>
                        </ul>
                      </li>
                      <li>
                        Drug listings must not be for controlled substances or
                        products containing controlled substances (see
                        information on Controlled Substances on the below table)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <br />
            <H6>
              Types of Controlled and Other Substances that are Prohibited
            </H6>
            <Card contentContainerStyle={css(styles.card)}>
              <div className={css(styles.cardContentTop)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    Schedules I, II, III, IV or V of the Controlled Substances
                    Act
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <ul>
                      <li>
                        Coca Leaves (all variations of leaves, tea, and coca
                        extract)
                      </li>
                      <li>Hallucinogenic mushrooms</li>
                      <li>
                        Poppy pods, poppy straw, and poppy straw concentrate
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className={css(styles.line)} />
              <div className={css(styles.cardContentMid)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    "List I" chemicals or their derivatives as designated by the
                    Drug Enforcement Administration (DEA)
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <ul>
                      <li>Ephedrine</li>
                      <li>Phenylpropanalomine</li>
                      <li>Pseudoephedrine</li>
                      <li>Ergotamine</li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className={css(styles.line)} />
              <div className={css(styles.cardContentBot)}>
                <div className={css(styles.cardContent)}>
                  <Text weight="bold" className={css(styles.cardLeft)}>
                    Chemical or substance of concern by DEA
                  </Text>
                  <div className={css(styles.cardRight)}>
                    <ul>
                      <li>Jimson Weed</li>
                      <li>Kratom</li>
                      <li>Salvia Divinorum</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Accordion>
      )}

      <Accordion
        header={i`Merchant Warranties`}
        onOpenToggled={(mwIsOpen) => {
          setMwIsOpen(mwIsOpen);
        }}
        isOpen={mwIsOpen}
      >
        <div className={css(styles.content)}>
          <H6>Merchant warranties must comply with Wish policies</H6>
          <p>
            If the merchant is approved to offer a warranty, merchant must honor
            any warranty provided to the customer and respond to warranty
            inquiries in a timely manner, but in any event not more than 5
            business days after any customer inquiry.
          </p>
        </div>
      </Accordion>

      <CheckboxField
        title={
          i`I accept and agree to be bound by the terms above. In addition, ` +
          i`I agree, under the penalty of perjury, that the information I have ` +
          i`provided is correct. [Download terms](${termsOfServicesDoc})`
        }
        wrapTitle
        className={css(styles.checkbox)}
        onChange={(checked: boolean) =>
          currentApplication.setTosCheckBox(checked)
        }
        checked={currentApplication.agreeTos}
      />
    </div>
  );
};
export default observer(TermsOfService);

const useStylesheet = () => {
  const { borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 8,
        },
        content: {
          padding: "20px 30px",
        },
        card: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
        },
        cardContent: {
          display: "flex",
          flexDirection: "row",
        },
        cardContentTop: {
          margin: "16px 16px 0px 16px",
        },
        cardContentMid: {
          margin: "0px 16px 0px 16px",
        },
        cardContentBot: {
          margin: "0px 16px 16px 16px",
        },
        line: {
          borderTop: `solid 1px ${borderPrimaryDark}`,
        },
        cardLeft: {
          display: "flex",
          flexDirection: "column",
          width: "30%",
        },
        cardRight: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "70%",
        },
        checkbox: {
          margin: "16px 20px 16px 20px",
        },
      }),
    [borderPrimaryDark]
  );
};
