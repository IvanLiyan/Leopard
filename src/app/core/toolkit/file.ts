export type CreateFileAndDownloadProps = {
  readonly filename: string;
  readonly content: string;
  readonly mimeType?: string;
};

export const createFileAndDownload = ({
  filename,
  content,
  mimeType = "text/plain",
}: CreateFileAndDownloadProps) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`,
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
