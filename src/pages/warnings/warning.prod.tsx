import React from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { Layout } from "@ContextLogic/lego";
import { useStringQueryParam, zendeskURL } from "@core/toolkit/url";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import InfractionDetailsCard from "@infractions/components/cards/InfractionDetailsCard";
import InfractionImpactCard from "@infractions/components/cards/InfractionImpactCard";
import OrderDetailsCard from "@infractions/components/cards/OrderDetailsCard";
import ProductListingDetailsCard from "@infractions/components/cards/ProductListingDetailsCard";
import BrandDetailsCard from "@infractions/components/cards/BrandDetailsCard";
import InfractionEvidenceCard from "@infractions/components/cards/InfractionEvidenceCard";
import FixesCard from "@infractions/components/cards/FixesCard";
import RequestPaymentCard from "@infractions/components/cards/RequestPaymentCard";
import MessagesCard from "@infractions/components/cards/MessagesCard";
import {
  InfractionContext,
  InfractionContextType,
} from "@infractions/InfractionContext";
import { useQuery } from "@apollo/client";
import {
  InfractionQueryResponse,
  InfractionQueryVariables,
  INFRACTION_QUERY,
} from "@infractions/queries/infraction";
import { Text } from "@ContextLogic/atlas-ui";
import {
  CommerceTransactionStateDisplayText,
  MerchantWarningImpactTypeDisplayText,
  MerchantWarningStateDisplayText,
  getInfractionData,
} from "@infractions/toolkit";
import { useUserStore } from "@core/stores/UserStore";
import Skeleton from "@core/components/Skeleton";
import ErrorBoundary from "@core/components/ErrorBoundary";

const PageLayout = ({
  columns,
}: {
  columns: ReadonlyArray<React.ReactNode>;
}) => {
  const styles = useInfractionDetailsStylesheet();

  return (
    <PageRoot>
      <PageHeader relaxed title={i`Infraction Details`} />
      <PageGuide relaxed contentContainerStyle={styles.content}>
        {columns.map((col, i) => {
          return (
            <Layout.FlexColumn key={i} style={styles.column}>
              {col}
            </Layout.FlexColumn>
          );
        })}
      </PageGuide>
    </PageRoot>
  );
};

const InfractionsPage: NextPage<Record<string, never>> = () => {
  const [infractionId] = useStringQueryParam("id");
  const { merchantId } = useUserStore();

  const { data, loading, error } = useQuery<
    InfractionQueryResponse,
    InfractionQueryVariables
  >(INFRACTION_QUERY, {
    variables: {
      infractionId,
      merchantId: merchantId ?? "", // query is skipped in this case
    },
    skip: merchantId == null,
    errorPolicy: "all", // temporarily allowing errors while BE fixes things
  });

  if (loading) {
    return (
      <PageLayout
        columns={[
          <>
            <Skeleton height={294} />
            <Skeleton height={175} />
            <Skeleton height={460} />
          </>,
          <>
            <Skeleton height={640} />
            <Skeleton height={738} />
          </>,
        ]}
      />
    );
  }

  const infraction = data?.policy?.merchantWarning;

  // temporarily allowing errors while BE fixes things
  // if (error || infraction == null) {
  void error;
  if (infraction == null) {
    return (
      <PageLayout
        columns={[
          <Text key={1} variant="bodyLStrong">
            Something went wrong.
          </Text>,
        ]}
      />
    );
  }

  const infractionDisplayText = getInfractionData(
    infraction.reason.reason,
    infraction.productTrueTagInfo?.counterfeitViolation?.reason ??
      infraction.productTrueTagInfo?.inappropriateViolation?.reason ??
      undefined,
    infraction.productTrueTagInfo?.subreason?.subcategory,
  );

  const infractionContext: InfractionContextType = {
    infraction: {
      id: infractionId,
      title: infractionDisplayText.title,
      body: (infraction.merchantActions ?? []).includes("PRODUCT_AUTHORIZATION")
        ? i`[Learn more](${zendeskURL(
            "mu360055998653",
          )}) about the requirements needed to offer this category of product on Wish.`
        : infractionDisplayText.body,
      policy: infractionDisplayText.policy,
      faq: infractionDisplayText.faq,
      state: MerchantWarningStateDisplayText[infraction.state],
      issuedDate: infraction.createdTime.datetime,
      disputeDeadline: infraction.effectiveDisputeDeadlineDate.datetime,
      disputeDeadlineUnix: infraction.effectiveDisputeDeadlineDate.unix,
      disputeStatus:
        infraction.trackingDispute != null
          ? infraction.trackingDispute.state
          : infraction.proofs.length > 0
          ? infraction.proofs[0].disputeStatus
          : "NOT_DISPUTED",
      infractionImpacts:
        infraction.impacts != null
          ? infraction.impacts.map(({ type, startDate, endDate }) =>
              MerchantWarningImpactTypeDisplayText[type](
                startDate?.datetime,
                endDate?.datetime,
              ),
            )
          : [],
      wssImpact:
        infraction.wssImpact === "YES"
          ? true
          : infraction.wssImpact === "NO"
          ? false
          : undefined,
      order: infraction.order
        ? {
            orderCancellationReason:
              infraction.order?.refundItems &&
              infraction.order.refundItems.length > 0
                ? infraction.order.refundItems
                    .map(({ reasonInfo: { text } }) => text)
                    .join(", ")
                : undefined,
            orderId: infraction.order.id,
            orderStatus:
              CommerceTransactionStateDisplayText[infraction.order.state],
            orderTotal: infraction.order.merchantTotal.display,
            availableForFulfillmentDate:
              infraction.order.releasedTime?.datetime,
            confirmedFulfillmentDate:
              infraction.order.tracking?.confirmedFulfillmentDate?.datetime,
            confirmedDeliveryDate:
              infraction.order.tracking?.deliveredDate?.datetime,
            autoRefundedDate: infraction.order.refundedTime?.datetime,
            trackingDisputeId: infraction.trackingDispute?.id,
            trackingStatus:
              infraction.order.tracking?.checkpoints &&
              infraction.order.tracking.checkpoints.length > 0
                ? [...infraction.order.tracking.checkpoints].sort(
                    ({ date: { unix: unixA } }, { date: { unix: unixB } }) =>
                      unixA - unixB,
                  )[0].resultingTracking.text ?? undefined
                : undefined,
            trackingId:
              infraction.order.shippingDetails?.trackingId ?? undefined,
            carrier: infraction.order.shippingDetails?.provider?.name,
          }
        : undefined,
      product: infraction.product
        ? {
            productImageUrl: infraction.product.mainImage.wishUrl,
            productName: infraction.product.name,
            productId: infraction.product.id,
            productSku: infraction.product.sku,
            productDescription: infraction.product.description,
          }
        : undefined,
      brand: infraction.takedownRequest
        ? {
            brandName: infraction.takedownRequest.name ?? undefined,
            brandContactName: infraction.takedownRequest.contact ?? undefined,
            brandPhoneNumber:
              infraction.takedownRequest.phoneNumber ?? undefined,
            brandEmail: infraction.takedownRequest.email ?? undefined,
          }
        : undefined,
      infractionEvidence: infraction.proofs.map((proof) => ({
        type: proof.type,
        id: proof.id,
        note: proof.message ?? "--",
      })),
      actions: infraction.merchantActions ?? [],
      brandAuthorizations:
        data?.brand?.brandAuthorizations?.map((authorization) => ({
          id: authorization.id,
          name: authorization.brand.name,
        })) ?? [],
    },
  };

  return (
    <InfractionContext.Provider value={infractionContext}>
      <PageLayout
        columns={[
          <>
            <InfractionDetailsCard />
            <InfractionImpactCard />
            <OrderDetailsCard />
            <ProductListingDetailsCard />
            <BrandDetailsCard />
            <InfractionEvidenceCard />
          </>,
          <>
            <FixesCard />
            <RequestPaymentCard />
            <ErrorBoundary>
              <MessagesCard />
            </ErrorBoundary>
          </>,
        ]}
      />
    </InfractionContext.Provider>
  );
};

export default observer(InfractionsPage);
