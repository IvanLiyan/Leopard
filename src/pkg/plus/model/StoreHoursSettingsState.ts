import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import {
  SetStoreHoursMutation,
  StoreHoursInput,
  DayStoreHoursConfiguration,
} from "@schema/types";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

type Duration = {
  readonly startTime: string;
  readonly endTime: string;
};

export type DayOfTheWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type UpdateStoreDurationInput = {
  readonly day: DayOfTheWeek;
  readonly durationIndex: number;
  readonly startTimeValue?: string;
  readonly endTimeValue?: string;
};

const TIME_FORMAT = "%I:%M%p";

const SET_STORE_HOURS_MUTATION = gql`
  mutation StoreHoursSettingsState_SetStoreHoursMutation(
    $input: StoreHoursInput!
  ) {
    localOnboarding {
      storeHours(input: $input) {
        ok
        message
      }
    }
  }
`;

type SetStoreHoursResponseType = {
  readonly localOnboarding: {
    readonly storeHours: Pick<SetStoreHoursMutation, "ok" | "message">;
  };
};

class StoreHourState {
  @observable
  durations: Array<Duration> = [];

  @observable
  isOpen: boolean;

  constructor() {
    this.isOpen = false;
  }

  @action
  setDuration(input: UpdateStoreDurationInput) {
    const { durationIndex, startTimeValue, endTimeValue } = input;
    const currentDuration =
      durationIndex < this.durations.length
        ? this.durations[durationIndex]
        : null;

    const startTime = startTimeValue || currentDuration?.startTime || "09:00AM";
    const endTime = endTimeValue || currentDuration?.endTime || "05:00PM";

    const durations = this.durations;

    this.durations = [
      ...durations.slice(0, durationIndex),
      { startTime, endTime },
      ...durations.slice(durationIndex + 1),
    ];
  }

  @action
  removeDuration(shift: number) {
    if (!this.durations || shift >= this.durations.length) {
      return;
    }

    const durations = this.durations;

    this.durations = [
      ...durations.slice(0, shift),
      ...durations.slice(shift + 1),
    ];
  }
}
export default class StoreHoursSettingsState {
  @observable
  isOnboarding: boolean = false;

  @observable
  storeHours: Map<DayOfTheWeek, StoreHourState>;

  @observable
  isSubmitting: boolean = false;

  constructor(args: { readonly isOnboarding: boolean }) {
    const { isOnboarding } = args;
    this.isOnboarding = isOnboarding;

    this.storeHours = new Map([
      [0, new StoreHourState()],
      [1, new StoreHourState()],
      [2, new StoreHourState()],
      [3, new StoreHourState()],
      [4, new StoreHourState()],
      [5, new StoreHourState()],
      [6, new StoreHourState()],
    ]);
  }

  @action
  getIsOpen = (day: DayOfTheWeek): boolean => {
    const currentDay = this.storeHours.get(day);
    if (!currentDay) {
      return false;
    }
    return currentDay.isOpen;
  };

  @action
  updateStoreDuration(input: UpdateStoreDurationInput) {
    const { day, durationIndex, startTimeValue, endTimeValue } = input;
    const currentDay = this.storeHours.get(day);
    if (!currentDay) {
      return;
    }

    if (startTimeValue === "" || endTimeValue === "") {
      currentDay.removeDuration(durationIndex);
    }

    currentDay.setDuration(input);
  }

  @action
  setDayClosure(day: DayOfTheWeek, isOpen: boolean) {
    const currentDay = this.storeHours.get(day);
    if (!currentDay) {
      return;
    }

    if (currentDay.durations && currentDay.durations?.length > 0) {
      currentDay.isOpen = isOpen;
    } else {
      currentDay.isOpen = isOpen;
      currentDay.durations = [
        {
          startTime: "09:00AM",
          endTime: "05:00PM",
        },
      ];
    }
  }

  @computed
  private get asInput(): StoreHoursInput {
    let storeHours: Array<DayStoreHoursConfiguration> = [];

    for (const dayConfig of this.storeHours.values()) {
      const isOpen = dayConfig.isOpen;

      const durations = dayConfig.durations.map((duration) => ({
        startTime: {
          fmt: TIME_FORMAT,
          formatted: duration.startTime,
        },
        endTime: {
          fmt: TIME_FORMAT,
          formatted: duration.endTime,
        },
      }));

      storeHours = isOpen
        ? [...storeHours, { isOpen, durations }]
        : [...storeHours, { isOpen }];
    }

    return { storeHours };
  }

  @action
  async submit() {
    const { asInput: input, isOnboarding } = this;
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    this.isSubmitting = true;

    const { data } = await client.mutate<
      SetStoreHoursResponseType,
      { input: StoreHoursInput }
    >({
      mutation: SET_STORE_HOURS_MUTATION,
      variables: { input },
    });

    const ok = data?.localOnboarding.storeHours.ok;
    const message = data?.localOnboarding.storeHours.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(message || i`Could not update store hours.`);
      return;
    }

    navigationStore.releaseNavigationLock();
    if (isOnboarding) {
      await navigationStore.navigate("/plus/home/onboarding-steps");
    }

    toastStore.positive(i`Success! Your store hours have been updated.`, {
      timeoutMs: 7000,
    });
  }
}
