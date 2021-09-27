import loadable from "@loadable/component";
import { LoadableContainerProps } from "@toolkit/loadable/loadable-utils";

export default loadable((props: LoadableContainerProps) => import(`./index`), {
  cacheKey: (props) => props.container,
  resolveComponent: (components, props) => (components as any)[props.container],
});
