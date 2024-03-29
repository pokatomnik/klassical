import * as React from "react";
import { BaseComponent } from "./BaseComponent";

export function Inject<
  TContextValue extends unknown,
  TThis extends BaseComponent<object, object>,
>(reactContext: React.Context<TContextValue>) {
  return function (
    _target: unknown,
    context: ClassFieldDecoratorContext<TThis, TContextValue>,
  ) {
    context.addInitializer(function () {
      const unknownContext: React.Context<any> = reactContext;
      this.$$contextMap.set(context.name, unknownContext);
    });
  };
}
