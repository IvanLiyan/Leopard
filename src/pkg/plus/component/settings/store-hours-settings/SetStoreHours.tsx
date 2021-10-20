import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  Card,
  CheckboxField,
  PrimaryButton,
  Link,
  FormSelect,
} from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";

import StoreHoursSettingsState, {
  DayOfTheWeek,
} from "@plus/model/StoreHoursSettingsState";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly state: StoreHoursSettingsState;
};

const DAY_OPTIONS: ReadonlyArray<{ title: string; value: DayOfTheWeek }> = [
  { title: i`Monday`, value: 0 },
  { title: i`Tuesday`, value: 1 },
  { title: i`Wednesday`, value: 2 },
  { title: i`Thursday`, value: 3 },
  { title: i`Friday`, value: 4 },
  { title: i`Saturday`, value: 5 },
  { title: i`Sunday`, value: 6 },
];

const SetStoreHours: React.FC<Props> = ({ className, style, state }: Props) => {
  const styles = useStylesheet();
  const timeOptions = useTimeOptions();
  const [showSecond, setShowSecond] = useState(false);

  return (
    <div className={css(styles.wrapper, className, style)}>
      <Card className={css(styles.content)}>
        <div className={css(styles.fieldGroup)}>
          {DAY_OPTIONS.map((option) => {
            const currentDay = state.storeHours.get(option.value);
            const durations = currentDay?.durations || [];

            const firstStartTime =
              durations.length > 0 ? durations[0].startTime : null;
            const firstEndTime =
              durations.length > 0 ? durations[0].endTime : null;
            const secondStartTime =
              durations.length > 1 ? durations[1].startTime : null;
            const secondEndTime =
              durations.length > 1 ? durations[1].endTime : null;

            return (
              <div key={option.title}>
                <div className={css(styles.fieldRow)}>
                  <CheckboxField
                    title={option.title}
                    onChange={(checked) => {
                      state.setDayClosure(option.value, checked);
                    }}
                    checked={
                      state.storeHours.get(option.value)?.isOpen || false
                    }
                    wrapTitle
                  />
                  <div className={css(styles.dateFields)}>
                    <FormSelect
                      options={timeOptions}
                      selectedValue={firstStartTime}
                      onSelected={(value: string) =>
                        state.updateStoreDuration({
                          day: option.value,
                          durationIndex: 0,
                          startTimeValue: value,
                        })
                      }
                      disabled={!state.getIsOpen(option.value)}
                      className={css(styles.select)}
                    />
                    <span className={css(styles.body)}>to</span>
                    <FormSelect
                      options={timeOptions}
                      selectedValue={firstEndTime}
                      onSelected={(value: string) =>
                        state.updateStoreDuration({
                          day: option.value,
                          durationIndex: 0,
                          endTimeValue: value,
                        })
                      }
                      disabled={!state.getIsOpen(option.value)}
                      className={css(styles.select)}
                    />
                  </div>
                </div>
                {showSecond && (
                  <div className={css(styles.fieldRow)}>
                    <div className={css(styles.optional)}>Optional</div>
                    <div className={css(styles.dateFields)}>
                      <FormSelect
                        options={[{ value: "", text: "" }, ...timeOptions]}
                        placeholder=""
                        selectedValue={secondStartTime}
                        onSelected={(value: string) =>
                          state.updateStoreDuration({
                            day: option.value,
                            durationIndex: 1,
                            startTimeValue: value,
                          })
                        }
                        disabled={!state.getIsOpen(option.value)}
                        className={css(styles.select)}
                      />
                      <span className={css(styles.body)}>to</span>
                      <FormSelect
                        options={[{ value: "", text: "" }, ...timeOptions]}
                        placeholder=""
                        selectedValue={secondEndTime}
                        onSelected={(value: string) =>
                          state.updateStoreDuration({
                            day: option.value,
                            durationIndex: 1,
                            endTimeValue: value,
                          })
                        }
                        disabled={!state.getIsOpen(option.value)}
                        className={css(styles.select)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <span>Open for two time periods a day?</span>{" "}
        <Link onClick={() => setShowSecond(true)}>Add a shift</Link>
        <div className={css(styles.button)}>
          <PrimaryButton
            style={{ borderRadius: 2, padding: "11px 0" }}
            onClick={async () => await state.submit()}
          >
            Save changes
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default observer(SetStoreHours);

const useTimeOptions = () =>
  useMemo(() => {
    let timeOptions: string[] = [];

    const hours: ReadonlyArray<string> = [
      "12",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
    ];
    const minutes: ReadonlyArray<string> = ["00", "30"];
    const timeOfDay: ReadonlyArray<string> = ["AM", "PM"];

    timeOfDay.forEach((day) => {
      hours.forEach((hour) =>
        minutes.forEach(
          (minute) =>
            (timeOptions = [...timeOptions, `${hour}:${minute}${day}`]),
        ),
      );
    });

    // Shift the array 7 (hours) * 2 (00/30 minutes) times so the array starts at 07:00AM
    Array.from({ length: 14 }).forEach(() => {
      const front = timeOptions.shift();
      if (front) timeOptions.push(front);
    });

    return timeOptions.map((timeOption) => {
      return {
        value: timeOption,
        text: timeOption,
      };
    });
  }, []);

const useStylesheet = () => {
  const { textDark, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          marginTop: 40,
          flex: 1,
          display: "grid",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
        content: {
          padding: 24,
          color: textDark,
        },
        button: {
          marginTop: 40,
          fontSize: 14,
        },
        fieldGroup: {
          paddingBottom: 12,
        },
        fieldRow: {
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          color: textDark,
          paddingBottom: 13,
        },
        dateFields: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        },
        select: {
          maxWidth: 100,
        },
        optional: {
          fontSize: 12,
          color: textLight,
          paddingLeft: 26,
        },
        body: {
          padding: 12,
        },
      }),
    [textDark, textLight],
  );
};
