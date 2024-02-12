import { BaseComponent } from "./BaseComponent";
import type { ClassMethod } from "./ClassMethod";

const watchSymbol = Symbol("$watch");

type ValueHolder<T> = Readonly<{ value: T }>;

type WatchState<TInstance extends object> = {
  readonly method: ClassMethod<TInstance, void, []>;
  prevVal: ValueHolder<unknown> | null;
};

export function getOrInitializeWatchMap<TInstance extends object>(
  instance: TInstance,
): Map<(self: TInstance) => unknown, WatchState<TInstance>> {
  if (!(watchSymbol in instance)) {
    const emptyWatchMap = getEmptyWatchMap<TInstance>();
    assignValueByKey(instance, watchSymbol, emptyWatchMap);
    return emptyWatchMap;
  }
  const existingWatchMap = instance[watchSymbol];
  if (!(existingWatchMap instanceof Map)) {
    const emptyWatchMap = getEmptyWatchMap<TInstance>();
    assignValueByKey(instance, watchSymbol, emptyWatchMap);
    return emptyWatchMap;
  }
  return existingWatchMap;
}

export function Watch<TThis extends BaseComponent<object, object>>(
  what: (self: TThis) => unknown,
) {
  return function (
    target: ClassMethod<TThis, void, []>,
    context: ClassMethodDecoratorContext<TThis, ClassMethod<TThis, void, []>>,
  ) {
    context.addInitializer(function (this: TThis) {
      const watchMap = getOrInitializeWatchMap(this);
      watchMap.set(what, { method: target, prevVal: null });
    });
  };
}

function getEmptyWatchMap<TInstance extends object>() {
  return new Map<(self: TInstance) => unknown, WatchState<TInstance>>();
}

function assignValueByKey(instance: object, key: symbol, value: unknown) {
  Object.defineProperty(instance, key, { value });
}
