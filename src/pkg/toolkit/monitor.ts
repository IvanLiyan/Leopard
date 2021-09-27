//
//  toolkit/monitor.tsx
//  Project-Lego
//
//  Created by Andrew Yang on 3/23/2020.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import { useMemo } from "react";

/* Merchant API */
import * as prometheusApi from "@merchant/api/prometheus";

export const counterInc = (args: prometheusApi.SimpleMetricLogParams) => {
  prometheusApi.counterInc(args).call();
};

export const gaugeInc = (args: prometheusApi.SimpleMetricLogParams) => {
  prometheusApi.gaugeInc(args).call();
};

export const gaugeSet = (args: prometheusApi.SimpleMetricLogParams) => {
  prometheusApi.gaugeSet(args).call();
};

export const useMonitor = (args: prometheusApi.SimpleMetricLogParams) => {
  return useMemo(
    () => ({
      counterInc() {
        counterInc(args);
      },
      gaugeInc() {
        gaugeInc(args);
      },
      gaugeSet() {
        gaugeSet(args);
      },
    }),
    [args]
  );
};
