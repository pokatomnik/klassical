import * as React from "react";
import { ClassComponent } from "./ClassComponent";

export const Component = <
  TProps extends object | null = null,
  TState extends object | null = null,
>(
  ClassComponent: new (props: TProps) => ClassComponent<TProps, TState>,
) => {
  return function WrappedComponent(props: TProps): React.ReactElement | null {
    const mountedRef = React.useRef(false);

    const classRef = React.useRef(new ClassComponent(props));

    const clazz = classRef.current;

    const { render: Render } = clazz;

    const oldProps = clazz.props;

    clazz.props = props;

    const [state, setState] = React.useState<unknown>(clazz.state);

    React.useEffect(() => {
      if (!mountedRef.current) {
        clazz.componentDidMount();
        mountedRef.current = true;
      }
    }, [clazz]);

    React.useEffect(() => {
      return clazz.$$subscribeOnNextState(setState).unsubscribe;
    }, [clazz, state]);

    React.useEffect(() => {
      if (mountedRef.current) {
        clazz.componentDidUpdate(oldProps);
      }
    });

    return <Render />;
  };
};
