import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";
import { wishExpressTruck } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineSpec, FineDisputeStatus } from "@merchant/api/fines";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import _ from "lodash";

type OrderFinesFilterProps = BaseProps & {
  readonly availableFines: ReadonlyArray<FineSpec>;
};

const OrderFinesFilter = (props: OrderFinesFilterProps) => {
  const { className } = props;
  const styles = useStylesheet();

  const availableFines = useAvailableFines(props);

  const [, setOffset] = useIntQueryParam("offset");
  const [fineTypes, setFineTypes] = useIntArrayQueryParam("fine_types");
  const [disputeStatuses, setDisputeStatuses] = useStringArrayQueryParam(
    "dispute_statuses"
  );

  const onFineTypeToggled = ({ value }: OptionType<number>) => {
    const typeSet: Set<number> = new Set(fineTypes || []);
    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }

    setOffset(0);
    setFineTypes(Array.from(typeSet));
  };

  const onFineDisputeStatusToggled = ({
    value,
  }: OptionType<FineDisputeStatus>) => {
    const disputeSet = new Set(disputeStatuses || []);
    if (disputeSet.has(value)) {
      disputeSet.delete(value);
    } else {
      disputeSet.add(value);
    }

    setOffset(0);
    setDisputeStatuses(Array.from(disputeSet));
  };

  return (
    <div className={css(styles.root, className)}>
      <section className={css(styles.title)}>Penalty Filters</section>
      <CheckboxGroupField
        className={css(styles.fineType)}
        title={i`Policy`}
        options={availableFines}
        onChecked={onFineTypeToggled}
        selected={fineTypes || []}
      />
      <CheckboxGroupField
        className={css(styles.disputeStatus)}
        title={i`Dispute Status`}
        options={DisputeStatuses.map((s) => {
          return { value: s.value, title: s.title };
        })}
        onChecked={onFineDisputeStatusToggled}
        selected={disputeStatuses || []}
      />
    </div>
  );
};

export default observer(OrderFinesFilter);

const useAvailableFines = (
  props: OrderFinesFilterProps
): ReadonlyArray<OptionType<string>> => {
  const { availableFines } = props;
  return useMemo(
    () =>
      _.sortBy(availableFines, (f) => f.name)
        .sort((a) => (a.is_wish_express ? 1 : -1))
        .map((f) => {
          const icon = f.is_wish_express ? wishExpressTruck : null;
          return { value: f.id, title: f.name, icon };
        }),
    [availableFines]
  );
};

const DisputeStatuses: ReadonlyArray<{
  title: string;
  value: FineDisputeStatus;
}> = [
  {
    value: "SUBMITTED",
    title: i`Dispute in progress`,
  },
  {
    value: "APPROVED",
    title: i`Dispute success`,
  },
  {
    value: "DECLINED",
    title: i`Dispute denied`,
  },
];

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        disputeStatus: {
          marginTop: 17,
        },
        buttonsContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          height: 32,
        },
        buttonsBottomRight: {
          display: "flex",
          flexDirection: "row",
        },
        cancelButton: {
          marginRight: 8,
        },
        applyButton: {},
        fineType: {
          borderBottom: "1px solid #c4cdd5",
          paddingBottom: 17,
        },
        date: {
          marginBottom: 15,
        },
      }),
    []
  );
