import * as React from "react";

import { BaseComponent } from "./BaseComponent";

type ClassComponentConstructor<
  TProps extends object = object,
  TState extends object = object,
> = new (props: TProps) => BaseComponent<TProps, TState>;

export function Component<
  TClassComponent extends ClassComponentConstructor<TProps, TState>,
  TProps extends object = object,
  TState extends object = object,
>(
  ClassComponent: TClassComponent,
  _context: ClassDecoratorContext<ClassComponentConstructor<TProps, TState>>,
): TClassComponent & React.FC<TProps> {
  function WrappedComponent(props: TProps): JSX.Element {
    const mountedRef = React.useRef(false);

    const [, forceUpdate] = React.useReducer(
      (x) => x + 1,
      Number.MIN_SAFE_INTEGER,
    );

    const [instance] = React.useState(() => new ClassComponent(props));

    const { render: Render } = instance;

    instance.props = props;

    for (const [fieldName, CurrentContext] of instance.$$contextMap.entries()) {
      const contextValue = React.useContext(CurrentContext);
      const instanceAsAny: any = instance;
      instanceAsAny[fieldName] = contextValue;
    }

    const [state, setState] = React.useState<unknown>(instance.state);

    React.useEffect(() => {
      if (mountedRef.current) {
        instance.componentDidUpdate();
      }
    });

    React.useEffect(() => {
      instance.componentDidMount();
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        instance.componentWillUnmount();
      };
    }, []);

    React.useEffect(() => {
      return instance.$$subscribeOnNextState(setState).unsubscribe;
    }, [state]);

    React.useEffect(() => {
      return instance.$$subscribeOnForceUpdate(forceUpdate).unsubscribe;
    }, []);

    return <Render />;
  }

  return Object.assign(WrappedComponent, ClassComponent);
}
