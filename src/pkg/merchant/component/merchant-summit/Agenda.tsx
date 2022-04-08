import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, H2, H4, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type AgendaProps = BaseProps;

type AgendaItem = {
  time: string;
  text: string;
  caption?: string;
};

const AGENDA_MORNING: ReadonlyArray<AgendaItem> = [
  {
    time: `09:00 - 10:00`,
    text: i`Warm-up videos + check-in`,
  },
  {
    time: `10:00 - 10:20`,
    text: i`Wish’s strategy update: long term and sustainable relationships`,
  },
  {
    time: `10:20 - 10:40`,
    text: i`Deep Dive: The Wish Standards Initiative`,
  },
  {
    time: `10:40 - 11:00`,
    text:
      i`Gain insight into domestic and international situation, make informed ` +
      i`decision in operation`,
    caption: ``,
  },
  {
    time: `11:00 - 11:40`,
    text: i`Merchant Panel`,
  },
  {
    time: `11:40 - 11:55`,
    text: i`Awarding Session`,
    caption: i`KA&SMB Merchants`,
  },
  {
    time: `11:55 - 13:00`,
    text: i`Lunch Break`,
  },
];

const AGENDA_AFTERNOON: ReadonlyArray<AgendaItem> = [
  {
    time: `13:00 - 14:00`,
    text: i`Warm-up videos + check-in`,
  },
  {
    time: `14:00 - 14:15`,
    text: i`Reinventing the Platform Experience for the Next Generation of Buyers and Brands`,
  },
  {
    time: `14:15 - 14:30`,
    text: i`Changes and Opportunities for Merchants in 2022`,
  },
  {
    time: `14:30 - 15:00`,
    text: i`China's merchant development plan in 2022`,
  },
  {
    time: `15:00 - 15:10`,
    text: i`Signing Ceremony`,
  },
  {
    time: `15:10 - 15:40`,
    text: i`A Brand Merchant's Story`,
  },
  {
    time: `15:40 - 15:50`,
    text: i`Awarding Session`,
    caption: i`Excellent Merchants of the Year`,
  },
  {
    time: `15:50 - 16:20`,
    text: i`Wish Global Logistics Project`,
  },
  {
    time: `16:20 - 17:00`,
    text: i`Logistics Panel`,
  },
  {
    time: `17:00 - 17:20`,
    text: i`Awarding Session`,
    caption: i`Partners of the Year`,
  },
  {
    time: `17:20 - 17:25`,
    text: i`Ending Video`,
  },
  {
    time: `17:25 - 18:55`,
    text: i`Dinner`,
  },
];

const Agenda = (props: AgendaProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const generateSchedule = (schedule: ReadonlyArray<AgendaItem>) => {
    return (
      <Layout.FlexColumn style={!isSmallScreen && styles.agendaContainerWeb}>
        {schedule.map((agendaItem: AgendaItem) => (
          <Layout.FlexRow
            style={
              isSmallScreen ? styles.agendaItemMobile : styles.agendaItemWeb
            }
            key={agendaItem.time}
            alignItems="flex-start"
          >
            <Text style={styles.time} weight="bold">
              {agendaItem.time}
            </Text>
            <Layout.FlexColumn style={styles.agendaTextContainer}>
              <Text weight="semibold" style={styles.text}>
                {agendaItem.text}
              </Text>
              <Text weight="semibold" style={styles.caption}>
                {agendaItem.caption}
              </Text>
            </Layout.FlexColumn>
          </Layout.FlexRow>
        ))}
      </Layout.FlexColumn>
    );
  };

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <H2 style={isSmallScreen ? styles.titleMobile : styles.titleWeb}>
        Full agenda for in-person attendees
      </H2>
      <H4 style={[isSmallScreen ? styles.subtitleMobile : styles.subtitleWeb]}>
        Merchants attending the in-person event, here’s your full agenda:
      </H4>
      {isSmallScreen ? (
        <Layout.FlexColumn style={styles.sectionContainer}>
          {generateSchedule(AGENDA_MORNING)}
          {generateSchedule(AGENDA_AFTERNOON)}
        </Layout.FlexColumn>
      ) : (
        <Layout.FlexRow
          style={styles.sectionContainer}
          justifyContent="center"
          alignItems="flex-start"
        >
          {generateSchedule(AGENDA_MORNING)}
          {generateSchedule(AGENDA_AFTERNOON)}
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(Agenda);

const useStylesheet = () => {
  const { textUltralight, primary, surfaceLighter } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          backgroundColor: surfaceLighter,
        },
        rootMobile: {
          padding: "80px 16px",
          backgroundColor: surfaceLighter,
        },
        titleMobile: {
          fontSize: 28,
          marginBottom: 10,
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          marginBottom: 10,
          width: "100%",
        },
        subtitleMobile: {
          fontSize: 16,
          marginBottom: 22,
          textAlign: "center",
        },
        subtitleWeb: {
          fontSize: 24,
          marginBottom: 60,
          width: "100%",
        },
        sectionContainer: {
          width: "100%",
        },
        section: {
          padding: 16,
        },
        icon: {
          width: 80,
          height: 80,
        },
        agendaContainerWeb: {
          ":not(:last-child)": {
            marginRight: 60,
          },
        },
        agendaItemMobile: {
          marginBottom: 22,
          ":last-child": {
            color: primary,
          },
        },
        agendaItemWeb: {
          marginBottom: 28,
          ":last-child": {
            color: primary,
          },
        },
        time: {
          minWidth: 100,
          marginRight: 60,
        },
        agendaTextContainer: {
          minWidth: "50%",
        },
        text: {
          lineHeight: "150%",
          marginBottom: 10,
        },
        caption: {
          color: textUltralight,
          fontSize: 14,
        },
      }),
    [textUltralight, primary, surfaceLighter]
  );
};
