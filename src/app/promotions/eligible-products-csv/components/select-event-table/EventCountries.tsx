import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy Import */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";

/* Merchant Components */
import Flag from "@core/components/Flag";

/* Model */
import { CountryCode } from "@schema";

/* Merchant Stores */
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly countries: ReadonlyArray<CountryCode>;
};

const maxVisible = 3;

const EventCountries = (props: Props) => {
  const { className, style, countries } = props;
  const styles = useStylesheet();
  const [showAll, setShowAll] = useState(false);

  const remainingAmount = Math.max(0, countries.length - maxVisible);

  return (
    <Layout.FlexRow style={[styles.root, className, style]}>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={8}
        style={styles.flags}
      >
        {countries
          .slice(0, showAll ? countries.length : maxVisible)
          .map((country) => (
            <Flag
              key={country}
              className={css(styles.flag)}
              aspectRatio="4x3"
              countryCode={country}
              alt={country}
            />
          ))}
      </Layout.GridRow>
      {remainingAmount > 0 && (
        <Layout.FlexColumn
          onClick={() => setShowAll(!showAll)}
          style={styles.toggle}
        >
          <Text>
            {showAll
              ? ci18n("UI command to show hide elements", "Collapse")
              : ci18n(
                  "UI button where clicking it shows X more items (plus X more)",
                  "+ {%1=remaining amount} more",
                  remainingAmount,
                )}
          </Text>
        </Layout.FlexColumn>
      )}
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { textLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 8,
        },
        flags: {
          padding: "8px 0px",
        },
        flag: {
          width: 24,
        },
        toggle: {
          color: textLight,
          cursor: "pointer",
        },
      }),
    [textLight],
  );
};

export default observer(EventCountries);
