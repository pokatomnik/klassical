import { PubSub } from "./PubSub";
import { type Draft, produce } from "immer";
import { Autobind } from "./Autobind";

export abstract class ClassComponent<
  TComponentProps extends object,
  TComponentState extends object,
> {
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

  public $$subscribeOnNextState(callback: (state: unknown) => void) {
    return this.renderPubSub.subscribe(callback);
  }

  @Autobind
  public render(this: this): React.ReactNode {
    return null;
  }
}
