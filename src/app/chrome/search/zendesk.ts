import useSWR, { Fetcher } from "swr";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { Locale } from "@schema";

type ZendeskResult = {
  readonly id: number;
  readonly url: string;
  readonly html_url: string;
  readonly author_id: number;
  readonly comments_disable: boolean;
  readonly draft: boolean;
  readonly promoted: boolean;
  readonly position: number;
  readonly vote_sum: number;
  readonly vote_count: number;
  readonly section_id: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly name: string;
  readonly title: string;
  readonly source_locale: string;
  readonly locale: string;
  readonly outdated: boolean;
  readonly outdated_locales: ReadonlyArray<string>;
  readonly edited_at: string;
  readonly user_segment_id: unknown;
  readonly permission_group_id: number | null;
  readonly label_names: ReadonlyArray<unknown>;
  readonly body: string;
  readonly snippet: string;
  readonly result_type: string;
};

type ZendeskResponse = {
  readonly count: number;
  readonly next_page: string | null;
  readonly page: number;
  readonly page_count: number;
  readonly per_page: number;
  readonly previous_page: string | null;
  readonly results: ReadonlyArray<ZendeskResult>;
};

const fetcher: Fetcher<ZendeskResponse> = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const useZendesk = (
  query: string | undefined,
): {
  data: ZendeskResponse | undefined;
  isLoading: boolean;
  error: unknown;
} => {
  const { locale } = useLocalizationStore();
  const { data, error } = useSWR(
    query !== undefined
      ? `https://merchantfaq.wish.com/api/v2/help_center/articles/search.json?${new URLSearchParams(
          {
            query,
            locale,
          },
        )}`
      : null,
    fetcher,
  );

  return { data, isLoading: !data && !error, error };
};

export const queryZendesk = async ({
  query,
  locale,
}: {
  readonly query: string;
  readonly locale: Locale;
}): Promise<ZendeskResponse | undefined> => {
  const data = await fetcher(
    `https://merchantfaq.wish.com/api/v2/help_center/articles/search.json?${new URLSearchParams(
      {
        query,
        locale,
      },
    )}`,
  );

  return data ?? undefined;
};
