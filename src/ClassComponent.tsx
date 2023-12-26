import { produce, type Draft } from "immer";
import * as React from "react";
import { Autobind } from "./Autobind";
import { PubSub } from "./PubSub";

export abstract class ClassComponent<
  TComponentProps extends object = object,
  TComponentState extends object = object,
> {
  public $$contextMap = new Map<string | symbol, React.Context<unknown>>();

  protected renderPubSub = new PubSub<unknown>();

  public constructor(public props: TComponentProps) {}

  public abstract state: TComponentState;

  public setState(
    newState:
      | TComponentState
      | ((oldState: TComponentState) => TComponentState),
  ): void {
    this.state =
      typeof newState === "function" ? newState(this.state) : newState;
    this.renderPubSub.publish(this.state);
  }

  public applyState(
    modifier: (oldState: Draft<TComponentState>) => void,
  ): void {
    this.state = produce(this.state, modifier);
    this.renderPubSub.publish(this.state);
  }

  @Autobind
  public componentDidUpdate(_nextProps: TComponentProps) {}

  @Autobind
  public componentDidMount() {}

  @Autobind
  public componentWillUnmount() {}

  public $$subscribeOnNextState(callback: (state: unknown) => void) {
    return this.renderPubSub.subscribe(callback);
  }

  @Autobind
  public render(): JSX.Element {
    return <React.Fragment />;
  }
}
