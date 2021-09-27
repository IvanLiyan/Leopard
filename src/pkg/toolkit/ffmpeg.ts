//
//  toolkit/ffmpeg.ts
//  Project-Lego
//
//  Created by Jason Sang on 10/19/20.
//  Copyright © 2020 ContextLogic Inc. All rights reserved.
//
import ffmpeg from "ffmpeg.js/ffmpeg-mp4";

export type CropProperties = {
  readonly position: {
    readonly x: number;
    readonly y: number;
  }; // From the topleft corner of the image
  readonly size: {
    readonly width: number;
    readonly height: number;
  };
};

export const crop = async (
  file: File,
  props: CropProperties,
): Promise<Blob> => {
  if (!file.type.startsWith("video")) {
  }
  const {
    position: { x: positionX, y: positionY },
    size: { width, height },
  } = props;

  const fileArrayBuffer = new Uint8Array(await file.arrayBuffer());
  const result = ffmpeg({
    arguments: [
      "-i",
      "input",
      "-vf",
      `crop=${width}:${height}:${positionX}:${positionY}`,
      "-c:a",
      "copy",
      "-preset",
      "ultrafast",
      "out.mp4",
    ],
    MEMFS: [{ name: "input", data: fileArrayBuffer }],
    print: (data) => {},
    printErr: (data) => {}, // Can be used for a loading indicator
    onExit: (code) => {},
  });

  const video = result.MEMFS[0];
  const blob = new Blob([video.data], { type: "video/mp4" });
  return blob;
};
