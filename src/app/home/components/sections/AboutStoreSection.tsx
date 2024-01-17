import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import numeral from "numeral";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import CircularProgressSection from "@listing-fees/components/CircularProgress";
import {
  Card,
  H4Markdown,
  H6,
  Link,
  Markdown,
  Layout,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  PickedMerchant,
  ACCOUNT_BALANCE_QUERY,
  AccountBalanceResponseData,
  HOME_LISTING_FEE_DATA_QUERY,
  HomeListingFeeDataResponse,
} from "@home/toolkit/home";
import { MerchantListingFeeHub } from "@schema";

import HomeSection from "./HomeSection";

import {
  MerchantPaymentDetailAccountBalanceArgs,
  PaymentCurrencyCode,
} from "@schema";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { css } from "@core/toolkit/styling";
import Icon from "@core/components/Icon";
import StarRating from "@home/components/StarRating";
import { merchFeUrl } from "@core/toolkit/router";

type Props = BaseProps & {
  readonly primaryCurrency: PaymentCurrencyCode;
  readonly storeStats: PickedMerchant["storeStats"];
};

const AboutStoreSection: React.FC<Props> = ({
  primaryCurrency,
  style,
  className,
  storeStats,
}: Props) => {
  const styles = useStylesheet();
  const { primary } = useTheme();

  const { data } = useQuery<
    AccountBalanceResponseData,
    MerchantPaymentDetailAccountBalanceArgs
  >(ACCOUNT_BALANCE_QUERY, {
    variables: {
      currency: primaryCurrency,
      balanceType: "CONFIRMED",
    },
  });

  const { data: listingFeeData } = useQuery<HomeListingFeeDataResponse>(
    HOME_LISTING_FEE_DATA_QUERY,
  );

  const ListingFee: Maybe<MerchantListingFeeHub> = useMemo(() => {
    return listingFeeData?.currentMerchant?.merchantListingFee;
  }, [listingFeeData?.currentMerchant?.merchantListingFee]);

  const ledgerConfirmedAccountBalances =
    data?.payments?.paymentInfo.ledgerAccountBalances.filter(
      (balance) =>
        balance.balanceType === "CONFIRMED" &&
        balance.currency === primaryCurrency,
    );
  const ledgerPendingAccountBalances =
    data?.payments?.paymentInfo.ledgerAccountBalances.filter(
      (balance) =>
        balance.balanceType === "PENDING" &&
        balance.currency === primaryCurrency,
    );
  const ledgerConfirmedAccountBalance =
    ledgerConfirmedAccountBalances && ledgerConfirmedAccountBalances.length > 0
      ? ledgerConfirmedAccountBalances[0]
      : null;
  const ledgerPendingAccountBalance =
    ledgerPendingAccountBalances && ledgerPendingAccountBalances.length > 0
      ? ledgerPendingAccountBalances[0]
      : null;

  const showLedgerUi = data?.payments?.paymentInfo.showLedgerUi;

  const confirmedAccountBalanceDisplay =
    showLedgerUi && ledgerConfirmedAccountBalance
      ? formatCurrency(ledgerConfirmedAccountBalance.amount, primaryCurrency)
      : data?.payments?.currentMerchant?.confirmedAccountBalance?.display;

  const pendingAccountBalanceDisplay =
    showLedgerUi && ledgerPendingAccountBalance
      ? formatCurrency(ledgerPendingAccountBalance.amount, primaryCurrency)
      : data?.payments?.currentMerchant?.pendingAccountBalance?.display;

  const pendingAccountBalanceAmount =
    showLedgerUi && ledgerPendingAccountBalance
      ? ledgerPendingAccountBalance.amount
      : data?.payments?.currentMerchant?.pendingAccountBalance?.amount;

  const accountBalanceLink = showLedgerUi
    ? merchFeUrl("/account-balance-v2")
    : merchFeUrl("/account-balance");

  const renderRight = () => (
    <Link href={merchFeUrl("/performance-overview")}>
      <Layout.FlexRow>
        {i`View sales performance`}
        <Icon name="arrowRight" color={primary} />
      </Layout.FlexRow>
    </Link>
  );

  return (
    <HomeSection
      title={i`About my store`}
      renderRight={renderRight}
      className={css(style, className)}
    >
      <Layout.GridRow
        gap={16}
        smallScreenTemplateColumns="100%"
        templateColumns="1fr 1fr 1fr"
        className={css(styles.firstRow)}
      >
        {storeStats.rating != null && (
          <Card contentContainerStyle={css(styles.card)}>
            <Layout.FlexColumn>
              <H6 className={css(styles.cardHeader)}>Average product rating</H6>
              <Layout.FlexRow
                justifyContent="flex-start"
                className={css(styles.storeRating)}
              >
                {storeStats.rating.averageProductRating && (
                  <H4Markdown
                    style={{ paddingRight: 8 }}
                    text={numeral(
                      storeStats.rating.averageProductRating,
                    ).format("0.0")}
                  />
                )}
                <StarRating
                  ratingValue={storeStats.rating.averageProductRating || 0}
                />
              </Layout.FlexRow>
              <Markdown
                className={css(styles.date)}
                text={i`Week of ${storeStats.rating.startDate.formatted} to ${storeStats.rating.endDate.formatted}`}
              />
            </Layout.FlexColumn>
            <Link href={merchFeUrl("/performance-overview/wish-standards")}>
              {ci18n("Refers to store metrics", "View Wish Standards")}
            </Link>
          </Card>
        )}

        {confirmedAccountBalanceDisplay && (
          <Card contentContainerStyle={css(styles.card)}>
            <Layout.FlexColumn>
              <H6 className={css(styles.cardHeader)}>
                {ci18n("Payment balance", "Current balance") +
                  ` (${primaryCurrency})`}
              </H6>
              <H4Markdown
                className={css(styles.contentHeader)}
                text={confirmedAccountBalanceDisplay}
              />
            </Layout.FlexColumn>
            <Link href={accountBalanceLink}>View account balance</Link>
          </Card>
        )}
        {pendingAccountBalanceDisplay && pendingAccountBalanceAmount != null && (
          <Card contentContainerStyle={css(styles.card)}>
            <Layout.FlexColumn>
              <H6 className={css(styles.cardHeader)}>
                {ci18n("Payment balance", "Pending balance") +
                  ` (${primaryCurrency})`}
              </H6>
              <H4Markdown
                className={css(styles.contentHeader)}
                text={
                  pendingAccountBalanceAmount < 0
                    ? formatCurrency(0, primaryCurrency)
                    : pendingAccountBalanceDisplay
                }
              />
            </Layout.FlexColumn>
            <Link href={accountBalanceLink}>View account balance</Link>
          </Card>
        )}
        {ListingFee && (
          <Card style={styles.card}>
            <Layout.FlexRow justifyContent="space-between">
              <Layout.FlexColumn>
                <H6 className={css(styles.cardHeader)}>Products listed</H6>
                <Text>Current / Free</Text>
                <Text weight="bold" style={{ marginBottom: 16 }}>
                  {ListingFee?.latestListingFeeDetails.latestItems} /
                  {
                    ListingFee?.currentCycleListingFeeDetails
                      .currentFreeThreshold
                  }
                </Text>
                <Link href={merchFeUrl("/md/products/listing-fees")}>
                  View product listings
                </Link>
              </Layout.FlexColumn>
              <Layout.FlexColumn>
                <CircularProgressSection
                  currentCount={
                    ListingFee?.latestListingFeeDetails.latestItems || 0
                  }
                  freeCount={
                    ListingFee?.currentCycleListingFeeDetails
                      .currentFreeThreshold || 0
                  }
                  size={70}
                ></CircularProgressSection>
              </Layout.FlexColumn>
            </Layout.FlexRow>
          </Card>
        )}
      </Layout.GridRow>
    </HomeSection>
  );
};

export default observer(AboutStoreSection);

const useStylesheet = () => {
  const { textLight, textDark } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      firstRow: {
        flex: 1,
      },
      card: {
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      cardHeader: {
        color: textLight,
        textTransform: "uppercase",
        lineHeight: "24px",
        letterSpacing: "0.12em",
        marginBottom: 10,
      },
      cardContentHeader: {
        fontSize: 24,
        lineHeight: "28px",
        color: textDark,
      },
      storeRating: {
        marginBottom: 16,
      },
      contentHeader: {
        marginBottom: 16,
      },
      date: {
        fontSize: 12,
        marginBottom: 37,
      },
    });
  }, [textLight, textDark]);
};
