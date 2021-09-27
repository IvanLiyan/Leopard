import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxGroupField } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import {
  useIntQueryParam,
  useIntArrayQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  InfractionReasonSpec,
  InfractionFinesSpec,
  InfractionStatesSpec,
} from "@merchant/api/warnings";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";

type InfractionsFilterProps = BaseProps & {
  readonly availableReasons: ReadonlyArray<InfractionReasonSpec>;
  readonly hasActiveFilters: boolean;
  readonly infractionFines: ReadonlyArray<InfractionFinesSpec>;
  readonly infractionStatesOptions: ReadonlyArray<InfractionStatesSpec>;
};

const InfractionsFilter = (props: InfractionsFilterProps) => {
  const { className, hasActiveFilters } = props;
  const styles = useStylesheet();

  const availableReasons = useAvailableReasons(props);
  const infractionFines = useInfractionFines(props);
  const infractionStatesOptions = useInfractionStatesOptions(props);

  const [, setInfractionsOffset] = useIntQueryParam("infractions_offset");
  const [infractionReasons, setInfractionReasons] = useIntArrayQueryParam(
    "infraction_reasons"
  );

  const [infractionStates, setInfractionStates] = useIntArrayQueryParam(
    "infraction_states"
  );

  const [hasPenalties, setHasPenalties] = useIntArrayQueryParam(
    "has_penalties"
  );

  const [
    infractionFineTypes,
    setInfractionFineTypes,
  ] = useStringArrayQueryParam("infraction_fine_types");

  const onInfractionReasonToggled = ({ value }: OptionType<number>) => {
    const typeSet: Set<number> = new Set(infractionReasons || []);
    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }

    setInfractionsOffset(0);
    setInfractionReasons(Array.from(typeSet));
  };

  const onFineTypeToggled = ({ value }: OptionType<string>) => {
    const typeSet: Set<string> = new Set(infractionFineTypes || []);

    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }

    setInfractionsOffset(0);
    setInfractionFineTypes(Array.from(typeSet));
  };

  const onInfractionStateToggled = ({
    value,
  }: OptionType<ReadonlyArray<number>>) => {
    const typeSet: Set<number> = new Set(infractionStates || []);

    // We can do this because the lists contain distinct elements
    if (value.every((x) => typeSet.has(x))) {
      value.forEach((x) => typeSet.delete(x));
    } else {
      value.forEach((x) => typeSet.add(x));
    }

    setInfractionsOffset(0);
    setInfractionStates(Array.from(typeSet));
  };

  const checkInfractionStateSelected = (
    { value }: OptionType<ReadonlyArray<number>>,
    selected: ReadonlyArray<number>
  ) => {
    const typeSet: Set<number> = new Set(infractionStates || []);

    if (value.every((x) => typeSet.has(x))) {
      return true;
    }
    return false;
  };

  const deselectAllFilters = () => {
    setInfractionsOffset(0);
    setInfractionReasons([]);
    setInfractionFineTypes([]);
    setInfractionStates([]);
    setHasPenalties([]);
  };

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.content)}>
        <div className={css(styles.header)}>
          <section className={css(styles.title)}>Filter</section>
          {hasActiveFilters && (
            <Button
              onClick={deselectAllFilters}
              disabled={false}
              hideBorder
              style={{ padding: "7px 0px", color: palettes.textColors.DarkInk }}
            >
              Deselect all
            </Button>
          )}
        </div>

        <div className={css(styles.body)}>
          <div className={css(styles.col, styles.leftCol)}>
            <CheckboxGroupField
              className={css(styles.fineType)}
              title={i`Reasons`}
              options={availableReasons}
              onChecked={onInfractionReasonToggled}
              selected={infractionReasons || []}
            />
          </div>
          <div className={css(styles.col)}>
            <CheckboxGroupField
              className={css(styles.fineType)}
              title={i`Penalty Issued`}
              options={[
                { value: 1, title: i`Yes` },
                { value: 0, title: i`No` },
              ]}
              onChecked={({ value }: OptionType<number>) => {
                const penaltiesSet = new Set(hasPenalties || []);
                if (penaltiesSet.has(value)) {
                  penaltiesSet.delete(value);
                  setHasPenalties(Array.from(penaltiesSet));
                } else {
                  penaltiesSet.add(value);
                  setHasPenalties(Array.from(penaltiesSet));
                }
              }}
              selected={hasPenalties || []}
            />
            <br />
            <CheckboxGroupField
              className={css(styles.fineType)}
              title={i`States`}
              options={infractionStatesOptions}
              onChecked={onInfractionStateToggled}
              selected={infractionStates || []}
              checkSelected={checkInfractionStateSelected}
            />
          </div>
        </div>

        {false && (
          <CheckboxGroupField
            className={css(styles.fineType)}
            title={i`Fine Reasons`}
            options={infractionFines}
            onChecked={onFineTypeToggled}
            selected={infractionFineTypes || []}
          />
        )}
      </div>
      <div className={css(styles.footer)}>
        <Button
          onClick={() => {
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          disabled={false}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <PrimaryButton
          onClick={() => {
            // eslint-disable-next-line local-rules/unwrapped-i18n
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          className={css(styles.applyButton)}
        >
          Apply Filters
        </PrimaryButton>
      </div>
    </div>
  );
};

export default observer(InfractionsFilter);

const useAvailableReasons = (
  props: InfractionsFilterProps
): ReadonlyArray<OptionType<string>> => {
  const { availableReasons } = props;
  return useMemo(
    () =>
      [...availableReasons]
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          if (a.name > b.name) {
            return 1;
          }

          return 0;
        })
        .map((f) => {
          const icon = null;
          return { value: f.reason, title: `${f.name} (${f.count})`, icon };
        }),
    [availableReasons]
  );
};

const useInfractionFines = (
  props: InfractionsFilterProps
): ReadonlyArray<OptionType<string>> => {
  const { infractionFines } = props;
  return useMemo(
    () =>
      [...infractionFines]
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          if (a.name > b.name) {
            return 1;
          }

          return 0;
        })
        .map((f) => {
          const icon = null;
          return { value: f.name, title: f.name, icon };
        }),
    [infractionFines]
  );
};

const useInfractionStatesOptions = (
  props: InfractionsFilterProps
): ReadonlyArray<OptionType<ReadonlyArray<number>>> => {
  const { infractionStatesOptions } = props;
  return useMemo(
    () =>
      [...infractionStatesOptions]
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          if (a.name > b.name) {
            return 1;
          }

          return 0;
        })
        .map((f) => {
          const icon = null;
          return { value: f.state, title: f.name, icon };
        }),
    [infractionStatesOptions]
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          overflow: "hidden",
          display: "flex",
          paddingRight: 0,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          maxHeight: 388,
          marginBottom: 80,
          padding: 20,
          paddingBottom: 0,
          paddingRight: 0,
          // overflow: "auto",

          flex: 1,
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "20px 20px 0px 0px",
        },
        body: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          overflow: "scroll",
          overflowX: "hidden",
        },
        col: {
          display: "flex",
          flexDirection: "column",
          padding: 16,
          width: "50%",
        },
        disputeStatus: {
          marginTop: 16,
          paddingBottom: 16,
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
        fineType: {
          paddingBottom: 17,
        },
        leftCol: {
          borderRight: "1px dashed #D5DFE6",
          paddingLeft: 0,
          height: "100%",
        },
        date: {
          marginBottom: 15,
        },
        cancelButton: {
          margin: 4,
          padding: "7px 20px",
          borderRadius: 3,
          textColor: palettes.textColors.DarkInk,
        },
        footer: {
          borderTop: "1px solid #D5DFE6",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "flex-end",
          padding: 16,
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: palettes.textColors.White,
        },
        applyButton: {
          margin: 4,
        },
      }),
    []
  );
