import { log } from "@core/toolkit/logger";
import { LogActions, LogEventNames, Page } from "./constants";

type LogPayload = {
  readonly action: keyof typeof LogActions;
  readonly event_name: keyof typeof LogEventNames;
  readonly page: Page;
  readonly old_value?: string | number;
  readonly new_value?: string | number;
  readonly from_page_url?: string;
  readonly to_page_url?: string;
  readonly search_input?: string | null;
  readonly product_id?: string;
  readonly product_id_position?: number;
};

const PERFORMANCE_OVERVIEW_DASHBOARD_TABLE = "PERFORMANCE_OVERVIEW_DASHBOARD";

const logger = (payload: LogPayload) => {
  void log(PERFORMANCE_OVERVIEW_DASHBOARD_TABLE, {
    ...payload,
    ...(payload.to_page_url != null
      ? { from_page_url: window.location.pathname }
      : {}),
  });
};

export default logger;
