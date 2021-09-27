/* Lego Components */
import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";

// One entity can have multiple materials
// For example:
//
// PingPong account            -- entity
// |--Photo of account owner   -- material
// |--Snapshot of transactions -- material

export type MaterialProps = {
  type: "text" | "image" | "choice";
  id: string;
  name?: string;
  tip?: string;
  text?: string;
  images?: ImageGroupProps;
  maxImageCount?: number;
  choices?: {
    [key: string]: string;
  };
  userChoice?: string;
  comment?: string;
};

export type EntityProps = {
  id: string;
  name: string;
  materials: ReadonlyArray<MaterialProps>;
  extraKey?: string;
  extraValue?: string;
  comment?: string;
};

export type MessageProps = {
  isWish: boolean;
  messageId: string;
  username: string;
  messageTitle: string;
  time: string;
  entities: ReadonlyArray<EntityProps>;
};

export type ReauthType = "ATO" | "registration_info";
