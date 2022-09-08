/* Toolkit */
import { ExternalAPIRequest } from "@core/toolkit/api";

export type ZendeskResultType = "result_type";

export type SearchZendeskRequest = {
  readonly query: string;
  readonly locale: string;
};

export type ZendeskSearchResult = {
  readonly id: number;
  readonly url: string;
  readonly html_url: string;
  readonly title: string;
  readonly result_type: ZendeskResultType;
  readonly snippet: string;
};

export type SearchZendeskResponse = {
  readonly results: ReadonlyArray<ZendeskSearchResult>;
};

export const searchZendesk = (
  args: SearchZendeskRequest,
): ExternalAPIRequest<SearchZendeskRequest, SearchZendeskResponse> =>
  new ExternalAPIRequest({
    // Reason: this is not an FAQ url, we're calling the API
    // and specifying the locale via a param.
    // eslint-disable-next-line local-rules/no-hardcoded-faq-url
    url: `https://merchantfaq.wish.com/api/v2/help_center/articles/search.json?query=${encodeURIComponent(
      args.query,
    )}&locale=${encodeURIComponent(args.locale)}`,
    method: "GET",
  });
