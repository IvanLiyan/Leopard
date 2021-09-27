import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import {
  MerchantTermsAgreedSchema,
  MerchantTermsOfServiceSchema,
  ViewTermsOfService,
  TermsOfServiceSchema,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { useIntQueryParam } from "@toolkit/url";

/* Merchant Components */
import TermsOfService2018 from "@merchant/component/policy/terms/version-2018/MerchantTermsOfService";
import TermsOfService2020 from "@merchant/component/policy/terms/version-2020/MerchantTermsOfService";
import AcceptTermsOfServiceComponentV1 from "@merchant/component/policy/terms/AcceptTermsOfServiceComponentV1";

/* Merchant Plus Components */
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

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

type InitialMerchantTermsData = Pick<
  MerchantTermsAgreedSchema,
  "agreedToTermsOfService"
>;

type InitialMerchantTermsOfServiceData = Pick<
  MerchantTermsOfServiceSchema,
  "latestVersion"
>;

type InitialTermsOfServiceData = Pick<
  TermsOfServiceSchema,
  "tosType" | "version" | "region"
>;

type InitialData = {
  readonly currentUser: {
    readonly canAcceptMerchantTos: Boolean;
  };
  readonly currentMerchant: {
    readonly merchantTermsAgreed: InitialMerchantTermsData | null;
  };
  readonly merchantTermsOfService: InitialMerchantTermsOfServiceData;
  readonly tos: {
    readonly termsOfService: InitialTermsOfServiceData | null;
  };
};

type Props = {
  readonly initialData: InitialData;
};

const MerchantTermsOfServiceContainer = ({ initialData }: Props) => {
  const [version] = useIntQueryParam("version");
  const merchant = initialData.currentMerchant;
  const merchantTermsAgreed = merchant?.merchantTermsAgreed;
  const canAcceptMerchantTos = initialData.currentUser?.canAcceptMerchantTos;
  const {
    merchantTermsOfService: { latestVersion },
  } = initialData;

  const showLatestVersion = !version || version == latestVersion;
  const showAcceptComponent =
    canAcceptMerchantTos == true &&
    merchantTermsAgreed?.agreedToTermsOfService != true &&
    showLatestVersion;

  const [viewTerms] = useMutation<ViewTermsResponseType, void>(
    VIEW_TERMS_OF_SERVICE_MUTATION
  );

  useEffect(() => {
    const callViewTerms = async () => {
      await viewTerms();
    };
    if (merchant) {
      callViewTerms();
    }
  }, [merchant, viewTerms]);

  const styles = useStylesheet();

  return (
    <div className={css(styles.terms)}>
      <PageGuide>
        {showLatestVersion ? <TermsOfService2020 /> : <TermsOfService2018 />}
        <br />
        {showAcceptComponent && <AcceptTermsOfServiceComponentV1 />}
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  return useMemo(
    () =>
      StyleSheet.create({
        terms: {
          marginTop: 20,
          marginLeft: dimenStore.pageGuideX,
          marginRight: dimenStore.pageGuideX,
          color: palettes.textColors.Ink,
          marginBottom: 80,
          /* Extra bottom margin to take care of footer hiding the line */
        },
      }),
    [dimenStore.pageGuideX]
  );
};

export default observer(MerchantTermsOfServiceContainer);
