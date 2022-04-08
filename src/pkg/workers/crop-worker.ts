// @ts-nocheck
// Workers are named .worker.ts so they can be tested for by worker-loader
/* eslint-disable filenames/match-exported */
/* eslint-disable filenames/match-regex */
/* eslint-disable local-rules/no-complex-relative-imports */

import "regenerator-runtime/runtime"; // needed for async in webworkers
import ffmpeg from "ffmpeg.js/ffmpeg-mp4";

// Copy of crop in @toolkit/ffmpeg.ts but without types
const crop = async ({ file, dimensions, onProgress }) => {
  if (!file.type.startsWith("video")) {
  }
  const {
    position: { x: positionX, y: positionY },
    size: { width, height },
  } = dimensions;

  const fileArrayBuffer = new Uint8Array(await file.arrayBuffer());

  let duration = 0;
  const updateProgress = (data) => {
    // Not a user facing string
    // eslint-disable-next-line local-rules/unwrapped-i18n
    const isDurationString = data.slice(2, 10) == "Duration";
    if (isDurationString) {
      const totalSeconds = parseFloat(data.slice(18, 23));
      duration = totalSeconds;
      return;
    }

    const isTimeString = data.slice(43, 47) == "time";
    if (isTimeString) {
      const time = parseFloat(data.slice(54, 59));
      onProgress(time / duration);
    }
  };

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
    printErr: updateProgress,
    onExit: (code) => {},
  });

  const video = result.MEMFS[0];
  const blob = new Blob([video.data], { type: "video/mp4" });
  return blob;
};

onmessage = async (event) => {
  if (event.data.type === "start") {
    const { file, dimensions } = event.data.message;
    const onProgress = (percentage) => {
      postMessage({
        type: "progress",
        message: percentage,
      });
    };
    const croppedFile = await crop({ file, dimensions, onProgress });
    postMessage({
      type: "done",
      message: croppedFile,
    });
    close();
  }
};
