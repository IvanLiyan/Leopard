/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import {
  MerchantCategoryType,
  MerchantProgramType,
} from "@toolkit/announcements";

export type Announcement = {
  readonly id: number | string;
  readonly announcement_type_name: string;
  readonly announcement_type: number;
  readonly title: string;
  readonly message: string;
  readonly link: string;
  readonly sender_id: string;
  readonly sender_name: string;
  readonly display_sender_name: string;
  readonly created: number;
  readonly created_dt_str: string;
  readonly created_dt_str_day: string;
  readonly state: number;
  readonly complete: boolean;
  readonly categories: ReadonlyArray<[MerchantCategoryType, string]>;
  readonly program: [MerchantProgramType, string];
  readonly important: boolean;
  readonly cta_text: string | null | undefined;
  readonly cta_due_date: string | null | undefined;
};

export type GetAnnouncementsListParams = {
  readonly ann_type: string;
  readonly is_api_announcement: boolean;
  readonly count?: number;
  readonly is_dashboard_mode: boolean | null | undefined;
};

export type ProgramSelectOption = {
  text: string;
  value: MerchantProgramType;
  img?: string;
};

export type CategoryOption = {
  title: string;
  value: MerchantCategoryType;
  icon?: string;
};

export type CategoryTypeDict = { [key in MerchantCategoryType]: string };

export type ProgramTypeDict = { [key in MerchantProgramType]: string };

export type AnnouncementCallResult = {
  readonly announcement_dicts: ReadonlyArray<Announcement>;
  readonly programs_dict: ProgramTypeDict;
  readonly categories_dict: CategoryTypeDict;
  readonly has_tags: boolean;
};

export type GetAnnouncementsListResponse = {
  readonly results: AnnouncementCallResult;
};

export type GetAnnouncementDetailResponse = {
  readonly announcement: Announcement;
};

export type GetAnnouncementDetailParams = {
  readonly ann_id: string;
};

export type ValidateCsvParams = {
  readonly message_template_en: string;
  readonly message_template_cn: string;
  readonly csv_file_url: string;
  readonly announcement_job_type: AnnouncementJobTypeType;
};

export type AnnouncementFieldsWithoutMessage = {
  title: string;
  link: string | null;
  titleCn: string;
  linkCn: string | null;
  program: MerchantProgramType | null;
  categories: Array<MerchantCategoryType>;
  important: boolean;
  ctaTextEn: string | null;
  ctaTextCn: string | null;
  ctaDueDate: Date | undefined;
  ctaDueTime: string | undefined;
  isCtaDueTimeValid: boolean;
};

export type CreateCsvAnnouncementParams = {
  readonly message_template_en: string;
  readonly message_template_cn: string;
  readonly csv_file_url: string;
  readonly announcement_job_type: AnnouncementJobTypeType;
  readonly title: string;
  readonly link: string | null;
  readonly title_cn: string;
  readonly link_cn: string | null;
  readonly is_api_announcement: boolean | null;
  readonly program: MerchantProgramType | null;
  readonly categories: string;
  readonly important: boolean;
  readonly cta_text_en: string | null;
  readonly cta_text_cn: string | null;
  readonly cta_due_date: string | null;
};

export type PreviewData = {
  [mid: string]: string;
};

export type ValidatedCsvResponse = {
  readonly preview_data_en: PreviewData;
  readonly preview_data_cn: PreviewData | null;
  readonly placeholders: ReadonlyArray<string>;
  readonly mid_count: number;
};

export type CreateCSVAnnouncementResponse = {};

export type AnnouncementJobTypeType = "STATIC_TEXT" | "DYNAMIC_TEXT";

export const getAnnouncementsList = (
  args: GetAnnouncementsListParams
): MerchantAPIRequest<
  GetAnnouncementsListParams,
  GetAnnouncementsListResponse
> => new MerchantAPIRequest("announcements-list/get", args);

export const getAnnouncementDetail = (
  args: GetAnnouncementDetailParams
): MerchantAPIRequest<
  GetAnnouncementDetailParams,
  GetAnnouncementDetailResponse
> => new MerchantAPIRequest("announcement-detail", args);

export const validateCSV = (
  args: ValidateCsvParams
): MerchantAPIRequest<ValidateCsvParams, ValidatedCsvResponse> =>
  new MerchantAPIRequest("announcement/validate-csv", args);

export const createCSVAnnouncement = (
  args: CreateCsvAnnouncementParams
): MerchantAPIRequest<
  CreateCsvAnnouncementParams,
  CreateCSVAnnouncementResponse
> => new MerchantAPIRequest("announcement/create-from-csv", args);
