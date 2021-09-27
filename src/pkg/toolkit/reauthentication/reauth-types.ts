/* Lego Components */
import { AttachmentInfo } from "@ContextLogic/lego";

export type TicketProps = {
  readonly ticketId: string;
  readonly createdTime: string;
  readonly updatedTime: string;
  readonly merchantId: string;
  readonly storeName: string;
  readonly reason: string;
  readonly creator: string;
  readonly bd: string;
  readonly allowSetFollowupOp: boolean;
  readonly followupOpDone?: boolean;
  readonly merchantState: string;
};

export type LetterOfCommitProps = {
  readonly canReachEveryone: boolean;
  readonly letterImages: ReadonlyArray<AttachmentInfo> | null | undefined;
  readonly ownershipImages: ReadonlyArray<AttachmentInfo> | null | undefined;
  readonly includeCompany: boolean;
  readonly bizLicImages: ReadonlyArray<AttachmentInfo> | null | undefined;
  readonly comment: string | null | undefined;
};
