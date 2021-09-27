import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useStringQueryParam } from "@toolkit/url";

/* Relative Imports */
import BrandAccordianHeader from "./BrandAccordianHeader";
import ABSBBrandApplicationTable from "./ABSBBrandApplicationTable";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBBrandApplication } from "@toolkit/brand/branded-products/abs";

type ABSBApplicationListProps = BaseProps & {
  readonly brandApplications: ReadonlyArray<ABSBBrandApplication>;
};

const ABSBApplicationList = ({
  brandApplications,
  style,
}: ABSBApplicationListProps) => {
  const styles = useStylesheet();
  const initialAccordionStates = brandApplications.map((_) => {
    return false;
  });

  const [sortBy, setSortBy] = useStringQueryParam("sort_by", "brand_name");
  const [accordionStates, setAccordionStates] = useState(
    initialAccordionStates
  );
  const [sortedBrandApplications, setSortedBrandApplications] = useState(
    null as Array<ABSBBrandApplication> | null
  );
  const isLoading = sortedBrandApplications == null;

  useEffect(() => {
    const newSortedBrandApplications = [...brandApplications];

    if (sortBy === "recent") {
      newSortedBrandApplications.sort((a, b) => {
        const aa = a.applications[0];
        const bb = b.applications[0];
        if (aa.date_completed && bb.date_completed) {
          return Number(bb.date_completed) - Number(aa.date_completed);
        } else if (aa.date_completed) {
          return -1;
        } else if (bb.date_completed) {
          return 1;
        }

        return Number(bb.date_submitted) - Number(aa.date_submitted);
      });
    } else {
      newSortedBrandApplications.sort((a, b) => {
        return a.brand_name > b.brand_name ? 1 : -1;
      });
    }

    setSortedBrandApplications(newSortedBrandApplications);
  }, [sortBy, brandApplications]);

  return (
    <LoadingIndicator
      loadingComplete={!isLoading}
      className={css(style, styles.loadingIndicator)}
    >
      <div>
        <HorizontalField
          title={i`Sort by`}
          className={css(styles.sortField)}
          titleAlign="start"
          titleWidth={50}
          centerTitleVertically
        >
          <Select
            options={[
              {
                value: "brand_name",
                text: i`Brand Name`,
              },
              {
                value: "recent",
                text: i`Recent`,
              },
            ]}
            onSelected={(val) => {
              setSortBy(val);
            }}
            selectedValue={sortBy}
            minWidth={100}
          />
        </HorizontalField>
        <div className={css(styles.appList)}>
          {sortedBrandApplications &&
            sortedBrandApplications.map((brandApp, index) => {
              return (
                <Accordion
                  key={brandApp.brand_id}
                  header={() => <BrandAccordianHeader brandApp={brandApp} />}
                  isOpen={accordionStates[index]}
                  onOpenToggled={(isOpen) => {
                    const newAccordionStates = [...accordionStates];
                    newAccordionStates[index] = isOpen;
                    setAccordionStates(newAccordionStates);
                  }}
                  chevronSize={11}
                >
                  <ABSBBrandApplicationTable brandApp={brandApp} />
                </Accordion>
              );
            })}
        </div>
      </div>
    </LoadingIndicator>
  );
};

export default observer(ABSBApplicationList);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        appList: {
          borderTop: "1px solid #D5DFE6",
        },
        sortField: {
          width: "fit-content",
          marginLeft: "28px",
          marginBottom: "16px",
        },
        loadingIndicator: {
          alignSelf: "center",
          marginTop: "10%",
        },
      }),
    []
  );
};
