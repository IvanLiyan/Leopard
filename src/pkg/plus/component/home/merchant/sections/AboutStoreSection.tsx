import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import numeral from "numeral";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego */
import {
  Card,
  H4Markdown,
  H6,
  Link,
  StaggeredFadeIn,
  Markdown,
  Layout,
} from "@ContextLogic/lego";

/* Merchant Imports */
import { Icon } from "@merchant/component/core";
import StarRating from "@merchant/component/performance/overview/StarRating";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

import HomeSection from "@plus/component/home/HomeSection";

/* Model */
import { CurrencyValue, MerchantRatingStats, Datetime } from "@schema/types";

const getAccountBalanceQuery = (primaryCurrency: string) => gql`
  query PlusPayments_GetAccountBalance {
    payments {
      currentMerchant {
        confirmedAccountBalance: accountBalance(currency: ${primaryCurrency}, balanceType: CONFIRMED) {
          display
        }
        pendingAccountBalance: accountBalance(currency: ${primaryCurrency}, balanceType: PENDING) {
          display
          amount
        }
      }
    }
    currentMerchant {
      storeStats{
        rating{
          averageProductRating
          startDate{
            formatted(fmt: "%m/%d")
          }
          endDate{
            formatted(fmt: "%m/%d")
          }
        }
      }
    }
  }
`;

type GetAccountBalance = {
  readonly payments?: {
    readonly currentMerchant?: {
      readonly confirmedAccountBalance?: Pick<CurrencyValue, "display"> | null;
      readonly pendingAccountBalance?: Pick<
        CurrencyValue,
        "display" | "amount"
      > | null;
    } | null;
  } | null;
  readonly currentMerchant?: {
    readonly storeStats: {
      readonly rating: Pick<MerchantRatingStats, "averageProductRating"> & {
        readonly startDate: Pick<Datetime, "formatted">;
        readonly endDate: Pick<Datetime, "formatted">;
      };
    };
  };
};

type Props = BaseProps & {
  readonly primaryCurrency: string;
  readonly isMerchantPlus: boolean;
};

const AboutStoreSection: React.FC<Props> = ({
  primaryCurrency,
  isMerchantPlus,
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const { primary } = useTheme();

  const { data } = useQuery<GetAccountBalance, void>(
    getAccountBalanceQuery(primaryCurrency),
  );

  if (data?.payments?.currentMerchant == null || data.currentMerchant == null) {
    return null;
  }

  const { confirmedAccountBalance, pendingAccountBalance } =
    data.payments.currentMerchant;

  const { averageProductRating, startDate, endDate } =
    data.currentMerchant.storeStats.rating;

  const renderRight = () => (
    <Link href="/performance-overview">
      <Layout.FlexRow>
        {i`View sales performance`}
        <Icon name="arrowRight" color={primary} />
      </Layout.FlexRow>
    </Link>
  );

  return (
    <StaggeredFadeIn>
      <HomeSection
        title={i`About my store`}
        renderRight={!isMerchantPlus ? renderRight : undefined}
        className={css(style, className)}
      >
        <Layout.GridRow
          gap={16}
          smallScreenTemplateColumns="100%"
          templateColumns="1fr 1fr 1fr"
          className={css(styles.firstRow)}
        >
          <Card contentContainerStyle={css(styles.card)}>
            <Layout.FlexColumn>
              <H6 className={css(styles.cardHeader)}>Average product rating</H6>
              <Layout.FlexRow
                justifyContent="flex-start"
                className={css(styles.storeRating)}
              >
                {averageProductRating && (
                  <H4Markdown
                    style={{ paddingRight: 8 }}
                    text={numeral(averageProductRating).format("0.0")}
                  />
                )}
                <StarRating ratingValue={averageProductRating || 0} />
              </Layout.FlexRow>
              <Markdown
                className={css(styles.date)}
                text={`Week of ${startDate.formatted} to ${endDate.formatted}`}
              />
            </Layout.FlexColumn>
            {!isMerchantPlus && (
              <Link href="/performance-overview/health">
                {ci18n("Refers to store metrics", "View store health")}
              </Link>
            )}
          </Card>
          {confirmedAccountBalance && (
            <Card contentContainerStyle={css(styles.card)}>
              <Layout.FlexColumn>
                <H6 className={css(styles.cardHeader)}>
                  {i`Current balance` + ` (${primaryCurrency})`}
                </H6>
                <H4Markdown
                  className={css(styles.contentHeader)}
                  text={confirmedAccountBalance.display}
                />
              </Layout.FlexColumn>
              <Link href="/account-balance">View account balance</Link>
            </Card>
          )}
          {pendingAccountBalance && (
            <Card contentContainerStyle={css(styles.card)}>
              <Layout.FlexColumn>
                <H6 className={css(styles.cardHeader)}>
                  {i`Pending balance` + ` (${primaryCurrency})`}
                </H6>
                <H4Markdown
                  className={css(styles.contentHeader)}
                  text={
                    pendingAccountBalance.amount < 0
                      ? formatCurrency(0, primaryCurrency)
                      : pendingAccountBalance.display
                  }
                />
              </Layout.FlexColumn>
              <Link href="/account-balance">View account balance</Link>
            </Card>
          )}
        </Layout.GridRow>
      </HomeSection>
    </StaggeredFadeIn>
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
