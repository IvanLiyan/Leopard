import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import HomeSection from "./HomeSection";
import SupportCard from "@home/components/cards/SupportCard";
import { HomeInitialData } from "@home/toolkit/home";
import { css } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly initialData: HomeInitialData;
};

const QuestionsSection: React.FC<Props> = ({
  style,
  className,
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const { currentMerchant } = initialData;

  if (currentMerchant == null) {
    return null;
  }

  const { accountManager } = currentMerchant;

  const name =
    accountManager?.name == null ? i`General Support` : accountManager.name;
  const email =
    accountManager == null ? "merchant_support@wish.com" : accountManager.email;
  const qqGroup =
    accountManager?.qqGroupNumber != null &&
    accountManager.qqGroupNumber.trim() !== ""
      ? i`QQ Group: ${accountManager.qqGroupNumber}`
      : "";

  const contentText = name + "\n\n" + email + "\n\n" + qqGroup;

  return (
    <HomeSection title={i`Have a question?`} className={css(style, className)}>
      <div className={css(styles.cardsContainer)}>
        <SupportCard
          titleText={i`Contact account manager`}
          contentText={contentText}
          buttonLink={`mailto:${email}`}
          buttonText={i`Contact account manager`}
          iconIllustrationName="ladyHoldingPackage"
        />
      </div>
    </HomeSection>
  );
};

export default QuestionsSection;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        cardsContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
        },
      }),
    [],
  );
