import * as React from "react";
import { ClassComponent } from "./ClassComponent";

export const Component = <
  TProps extends object = object,
  TState extends object = object,
>(
  ClassComponent: new (props: TProps) => ClassComponent<TProps, TState>,
) => {
  return function WrappedComponent(props: TProps): JSX.Element {
    const mountedRef = React.useRef(false);

    const [instance] = React.useState(() => new ClassComponent(props));

    const { render: Render } = instance;

    const oldProps = instance.props;

    instance.props = props;

    for (const [fieldName, CurrentContext] of instance.$$contextMap.entries()) {
      const contextValue = React.useContext(CurrentContext);
      const instanceAsAny: any = instance;
      instanceAsAny[fieldName] = contextValue;
    }

    const [state, setState] = React.useState<unknown>(instance.state);

    React.useEffect(() => {
      if (!mountedRef.current) {
        instance.componentDidMount();
        mountedRef.current = true;
      }
    }, [instance]);

    React.useEffect(() => {
      return instance.$$subscribeOnNextState(setState).unsubscribe;
    }, [state]);

    React.useEffect(() => {
      if (mountedRef.current) {
        instance.componentDidUpdate(oldProps);
      }
    });

    React.useEffect(() => {
      return () => {
        instance.componentWillUnmount();
      };
    }, [instance]);

    return <Render />;
  };
};
