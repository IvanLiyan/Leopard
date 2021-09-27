import React, { useMemo, useEffect, useState, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import {
  Maybe,
  MerchantSchema,
  MerchantTermsOfServiceAgreementSchema,
  TermsOfServiceSchema,
  ViewTermsOfService,
  Datetime,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useIntQueryParam } from "@toolkit/url";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Lego Components */
import { Banner, Link, Layout } from "@ContextLogic/lego";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Components */
import TermsOfService2018 from "@merchant/component/policy/terms/version-2018/MerchantTermsOfService";
import TermsOfService2020 from "@merchant/component/policy/terms/version-2020/MerchantTermsOfService";
import TermsOfService2021 from "@merchant/component/policy/terms/version-2021/MerchantTermsOfService";
import CnMerchantTermsOfService2021 from "@merchant/component/policy/terms/version-2021/CnMerchantTermsOfService";
import EuMerchantTermsOfService2021 from "@merchant/component/policy/terms/version-2021/EuMerchantTermsOfService";
import AcceptTermsOfServiceComponent from "@merchant/component/policy/terms/AcceptTermsOfServiceComponent";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { useUIStateBool } from "@toolkit/ui-state";

const VIEW_TERMS_OF_SERVICE_MUTATION = gql`
  mutation ViewTermsOfServiceMutation {
    currentUser {
      merchant {
        merchantTermsAgreed {
          viewTermsOfService {
            ok
            message
          }
        }
      }
    }
  }
`;

type ViewTermsOfServiceType = Pick<ViewTermsOfService, "ok" | "message">;

type ViewTermsResponseType = {
  readonly currentUser: {
    readonly merchant: {
      readonly merchantTermsAgreed: {
        readonly viewTermsOfService: ViewTermsOfServiceType;
      };
    };
  };
};

type InitialMerchantData = Pick<MerchantSchema, "id" | "isMerchantPlus">;

type InitialTermsOfServiceData = Pick<
  TermsOfServiceSchema,
  "tosType" | "version" | "region" | "canAccept"
> & {
  readonly merchantTermsOfServiceAgreement?: Maybe<
    Pick<MerchantTermsOfServiceAgreementSchema, "state">
  >;
  readonly releaseDate: Pick<Datetime, "unix">;
};

type InitialData = {
  readonly currentMerchant: InitialMerchantData | null;
  readonly tos: {
    readonly termsOfService: InitialTermsOfServiceData | null;
  };
};

type Props = {
  readonly initialData: InitialData;
};

const MerchantTermsOfServiceContainer = ({ initialData }: Props) => {
  const [homepage] = useIntQueryParam("homepage");
  const [showAcceptedBanner] = useIntQueryParam("accepted");
  const { value: prefersNewNav } = useUIStateBool("PREFERS_NEW_NAV");
  const merchant = initialData.currentMerchant;
  const isMerchantPlus = merchant?.isMerchantPlus;
  const merchantId = merchant?.id;
  const tosData = initialData.tos.termsOfService;
  const tosAgreementData = tosData?.merchantTermsOfServiceAgreement;
  const canAcceptTos = tosData?.canAccept;
  const version = tosData?.version;
  const region = tosData?.region;
  const releaseDate = tosData?.releaseDate;

  const [viewTerms] = useMutation<ViewTermsResponseType, void>(
    VIEW_TERMS_OF_SERVICE_MUTATION,
  );

  useEffect(() => {
    const callViewTerms = async () => {
      await viewTerms();
    };
    if (merchantId) {
      callViewTerms();
    }
  }, [merchantId, viewTerms]);

  const hasFooter = !prefersNewNav && !isMerchantPlus;
  const styles = useStylesheet({ hasFooter, showReturnToHome: homepage == 1 });
  const [acceptTosDisabled, setAcceptTosDisabled] = useState(true);
  const [acceptedTos, setAcceptedTos] = useState(false);

  const termsRef = useRef<HTMLDivElement>(null);
  useMountEffect(() => {
    const handleScroll = () => {
      const el = termsRef.current;
      // If user has scrolled to the bottom of ToS, enable accept button.
      if (el && el.getBoundingClientRect().bottom <= window.innerHeight) {
        setAcceptTosDisabled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
  });

  const showAcceptComponent =
    canAcceptTos == true &&
    tosAgreementData?.state != "AGREED" &&
    !acceptedTos &&
    !showAcceptedBanner;

  return (
    <>
      <PageGuide hideFooter style={styles.termsContainer}>
        <div className={css(styles.terms)} ref={termsRef}>
          {version == 3 && <TermsOfService2018 />}
          {version == 4 && <TermsOfService2020 />}
          {version == 5 && region == "EU" && (
            <EuMerchantTermsOfService2021 releaseDate={releaseDate} />
          )}
          {version == 5 && region == "CN" && (
            <CnMerchantTermsOfService2021 releaseDate={releaseDate} />
          )}
          {version == 5 && region == "US" && (
            <TermsOfService2021 releaseDate={releaseDate} />
          )}
        </div>
        {homepage == 1 && (
          <Layout.FlexRow
            style={styles.returnContainer}
            justifyContent="center"
          >
            <Link href="/home">Return to Homepage</Link>
          </Layout.FlexRow>
        )}
      </PageGuide>
      {showAcceptComponent && (
        <AcceptTermsOfServiceComponent
          isDisabled={acceptTosDisabled}
          hasFooter={hasFooter}
          onAccept={() => setAcceptedTos(true)}
          tosVersion={version}
          tosRegion={region}
        />
      )}
      {(acceptedTos || showAcceptedBanner == 1) && (
        <div className={css(styles.acceptedBanner)}>
          <Banner
            text={i`Thank you for accepting the terms of service`}
            sentiment="success"
          />
        </div>
      )}
    </>
  );
};

const useStylesheet = ({
  hasFooter,
  showReturnToHome,
}: {
  readonly hasFooter: boolean;
  readonly showReturnToHome: boolean;
}) => {
  const { surfaceLightest, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        termsContainer: {
          paddingTop: 16,
          paddingBottom: showReturnToHome ? 24 : 51,
          marginBottom: hasFooter ? 41 : 0,
        },
        terms: {
          padding: "35px 37px 10px 37px",
          backgroundColor: surfaceLightest,
          color: textBlack,
        },
        returnContainer: {
          paddingTop: 24,
        },
        acceptedBanner: {
          position: "sticky",
          bottom: hasFooter ? 41 : 0,
        },
      }),
    [surfaceLightest, textBlack, hasFooter, showReturnToHome],
  );
};

export default observer(MerchantTermsOfServiceContainer);
