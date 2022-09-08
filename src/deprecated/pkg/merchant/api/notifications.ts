/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type MarkNotiMigrationBannerDismissResponse = {
  readonly show_noti_migration_banner: boolean;
};

export const markNotiMigrationBannerDismiss = (): MerchantAPIRequest<
  null,
  MarkNotiMigrationBannerDismissResponse
> => new MerchantAPIRequest("merchant-notifications/mark-noti-banner-dismiss");
