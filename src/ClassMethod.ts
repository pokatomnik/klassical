export type ClassMethod<
  TThis extends object,
  TReturn,
  TArgs extends ReadonlyArray<unknown>,
> = (this: TThis, ...args: TArgs) => TReturn;
