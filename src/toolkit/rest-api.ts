export type FetchProductFeedArgs = {
  readonly id: string;
};

export const fetchProductFeed = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
}: FetchProductFeedArgs): Promise<Response> => {
  return new Promise((resolve) => {
    resolve(new Response());
  });
};
