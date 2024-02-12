import areEqual from "lodash/isEqual";

type MemoizedState<T> = Readonly<{ value: T }> | null;

interface ComputedField<T> {
  memoizationKey: unknown;
  memoizedState: MemoizedState<T>;
}

export function Memo<TThis extends object, TValue>(
  getMemoKey: (self: TThis) => unknown = () => null,
) {
  const instanceAssociatedFields = new InstanceAssociatedDataMap<
    TThis,
    FieldsStorage<ComputedField<TValue>>
  >(() => {
    return new FieldsStorage<ComputedField<TValue>>(() => ({
      memoizationKey: Symbol("lastKey"),
      memoizedState: null,
    }));
  });

  return function (
    target: () => TValue,
    context: ClassGetterDecoratorContext<TThis, TValue>,
  ) {
    const fieldName = context.name;
    return function (this: TThis) {
      const instanceFields = instanceAssociatedFields.getByInstance(this);
      const currentFieldData = instanceFields.getByFieldName(fieldName);

      const newKey = getMemoKey(this);
      if (
        currentFieldData.memoizedState &&
        areEqual(currentFieldData.memoizationKey, newKey)
      ) {
        return currentFieldData.memoizedState.value;
      }
      const newValue = target.call(this);
      currentFieldData.memoizationKey = newKey;
      currentFieldData.memoizedState = { value: newValue };
      return newValue;
    };
  };
}

class FieldsStorage<TValueType> {
  readonly #fields = new Map<string | symbol, TValueType>();

  readonly #defaultDataFabric: () => TValueType;

  public constructor(defaultDataFabric: () => TValueType) {
    this.#defaultDataFabric = defaultDataFabric;
  }

  public getByFieldName(fieldName: string | symbol) {
    const existingField = this.#fields.get(fieldName);
    if (existingField) {
      return existingField;
    }
    const newField = this.#defaultDataFabric();
    this.#fields.set(fieldName, newField);
    return newField;
  }
}

class InstanceAssociatedDataMap<TInstanceType extends object, TValueType> {
  readonly #data = new WeakMap<TInstanceType, TValueType>();

  readonly #defaultDataFabric: () => TValueType;

  public constructor(defaultDataFabric: () => TValueType) {
    this.#defaultDataFabric = defaultDataFabric;
  }

  public getByInstance(instance: TInstanceType) {
    const existingData = this.#data.get(instance);
    if (existingData) {
      return existingData;
    }
    const newData = this.#defaultDataFabric();
    this.#data.set(instance, newData);
    return newData;
  }
}
