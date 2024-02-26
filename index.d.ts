/*
 * index.d.ts
 * merchant-web
 *
 * Created by Sola Ogunsakin on 5/2/2020, 2:50:18 PM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
declare module "*.json";
declare module "*.mp4";
declare module "*.csv";
declare module "*.xlsx";
declare module "*.pdf";
declare module "*.gif";

// legacy imports
declare module "moment-timezone";
declare module "moment-timezone/moment-timezone";

// (lliepert) the following modules have missing or broken @types
declare module "jed";
declare module "react-day-picker/moment";
declare module "happypack";
declare module "react-tooltip";
declare module "react-reveal/makeCarousel";
declare module "react-reveal/Slide";
declare module "currency-symbol-map";
declare module "valid-objectid";
declare module "query-string";
declare module "recharts/es6/util/DataUtils";
declare module "relative-time-format";
declare module "tableau-react";
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
declare module "styled-components";
declare module "@legacy/core/api";
