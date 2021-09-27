export type LoadableContainerProps = {
  readonly key: number;
  readonly container: string;
  readonly initialData: { [key: string]: any } | null;
};
