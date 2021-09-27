import React, { useMemo, useState } from "react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CountryCode } from "@toolkit/countries";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, Link } from "@ContextLogic/lego";

/* Merchant Components */
import { CountryLabel } from "@merchant/component/core";

type FlagProps = BaseProps & {
  readonly countryCodes: ReadonlyArray<CountryCode>;
  readonly maxVisible?: number;
};

const CountryLabelGroup = (props: FlagProps) => {
  const { countryCodes, maxVisible = 3, className, style } = props;

  const [showMore, setShowMore] = useState(false);
  const numberOfItems = countryCodes.length;
  const numberOfItemsRemaining = countryCodes.length - maxVisible;

  const visibleCountryCodes = useMemo(
    () => countryCodes.slice(0, !showMore ? maxVisible : numberOfItems + 1),
    [countryCodes, numberOfItems, showMore, maxVisible]
  );

  return (
    <Layout.GridRow
      templateColumns={`repeat(${maxVisible}, 1fr)`}
      smallScreenTemplateColumns="repeat(auto-fit, 1fr)"
      gap={8}
      alignItems="center"
      className={css(className, style)}
    >
      {visibleCountryCodes.map((countryCode) => (
        <CountryLabel countryCode={countryCode} />
      ))}
      {!showMore && numberOfItemsRemaining > 0 && (
        <Link onClick={() => setShowMore(true)}>
          {ci18n(
            "Clicking the link shows more hidden items",
            "+%1$d more",
            numberOfItemsRemaining
          )}
        </Link>
      )}
      {showMore && <Link onClick={() => setShowMore(false)}>Show less</Link>}
    </Layout.GridRow>
  );
};

export default CountryLabelGroup;
