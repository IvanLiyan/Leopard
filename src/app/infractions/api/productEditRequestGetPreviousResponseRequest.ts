export type ProductEditRequestGetPreviousResponse = {
  readonly result?: {
    readonly small_picture?: Maybe<string>;
    readonly extra_photos?: ReadonlyArray<number>;
    readonly human_readable_url?: Maybe<string>;
    readonly meta_keywords?: Maybe<unknown>;
    readonly share_message?: Maybe<string>;
    readonly id?: Maybe<string>;
    readonly meta_description?: Maybe<string>;
    readonly share_subject?: Maybe<string>;
    readonly source_country?: Maybe<string>;
    readonly label?: ReadonlyArray<string>;
    readonly is_concept?: Maybe<boolean>;
    readonly is_verified?: Maybe<boolean>;
    readonly meta_title?: Maybe<string>;
    readonly external_mobile_url?: Maybe<string>;
    readonly description?: Maybe<string>;
    readonly fb_comment_url?: Maybe<string>;
    readonly is_active?: Maybe<boolean>;
    readonly contest_page_picture?: Maybe<string>;
    readonly display_picture?: Maybe<string>;
    readonly generation_time?: Maybe<string>;
    readonly parent_sku?: Maybe<string>;
    readonly name?: Maybe<string>;
    readonly orig_width?: Maybe<string>;
    readonly gender?: Maybe<string>;
    readonly variations?: Maybe<
      Record<
        string,
        {
          readonly upload_date?: Maybe<string>;
          readonly color?: Maybe<string>;
          readonly price?: Maybe<string>;
          readonly currency?: Maybe<string>;
          readonly max_shipping_time?: Maybe<number>;
          readonly is_banned?: Maybe<boolean>;
          readonly removed?: Maybe<boolean>;
          readonly min_shipping_time?: Maybe<number>;
          readonly size?: Maybe<string>;
          readonly inventory?: Maybe<number>;
          readonly manufacturer_id?: Maybe<string>;
          readonly img_url?: Maybe<string>;
        }
      >
    >;
    readonly value?: Maybe<number>;
    readonly orig_height?: Maybe<number>;
    readonly cache_buster?: Maybe<string>;
    readonly aspect_ratio?: Maybe<number>;
    readonly video?: Maybe<unknown>;
    readonly external_url?: Maybe<string>;
  };
};
