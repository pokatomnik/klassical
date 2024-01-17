# Klassical

The library allows you to create components that are based on functional components, but can be described as classes

## Props and state

```tsx
@Component
class StatefulExample extends BaseComponent<
  { readonly placeholder: string },
  { readonly userInput: string }
> {
  public readonly state = { userInput: "" };

  public override componentDidMount() {
    console.log("Just mounted!");
  }

  public override componentDidUpdate(): void {
    console.log("Just updated!");
  }

  public override componentWillUnmount(): void {
    console.log("Will be unmounted");
  }

  @Autobind
  private setInput(evt: React.ChangeEvent<HTMLInputElement>) {
    this.applyState((draft) => {
      draft.userInput = evt.currentTarget.value;
    });
  }

  public override render() {
    return (
      <input
        type="text"
        value={this.state.userInput}
        placeholder={this.props.placeholder}
        onChange={this.setInput}
      />
    );
  }
}
```

## Context example

```tsx
interface ContextType {
  readonly clicks: number;
  readonly increase: () => void;
  readonly decrease: () => void;
}

const MyContext = React.createContext<ContextType>({
  clicks: 0,
  increase: () => {},
  decrease: () => {},
});

@Component
class ProviderExample extends BaseComponent<
  React.PropsWithChildren<object>,
  { readonly clicks: number }
> {
  public readonly state = { clicks: 0 };

  @Autobind
  private decrease() {
    this.applyState((draft) => {
      --draft.clicks;
    });
  }

  @Autobind
  private increase() {
    this.setState((oldState) => ({
      clicks: oldState.clicks + 1,
    }));
  }

  public override render() {
    return (
      <MyContext.Provider
        value={{
          clicks: this.state.clicks,
          increase: this.increase,
          decrease: this.decrease,
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

@Component
class ConsumerExample extends BaseComponent<object, object> {
  // Injection will be performed right after class constructor invocation
  @Inject(MyContext)
  public readonly contextState: ContextType = {
    clicks: 0,
    increase: () => {},
    decrease: () => {},
  };
  // Or this way:
  // @Inject(MyContext)
  // public readonly contextState!: ContextType;

  public override state = {};

  public override render() {
    // Or even this way
    // const contextState = React.useContext(MyContext);
    return (
      <p>
        <button type="button" onClick={this.contextState.decrease}>
          -
        </button>
        <span>{this.contextState.clicks}</span>
        <button type="button" onClick={this.contextState.increase}>
          +
        </button>
      </p>
    );
  }
}
```

## Usage example (Composition component)

```tsx
@Component
export class CompositionExample extends BaseComponent<object, object> {
  public readonly state = {};

  public override render() {
    return (
      <React.Fragment>
        <ProviderExample>
          <ConsumerExample />
          <StatefulExample placeholder="This is placeholder" />
        </ProviderExample>
      </React.Fragment>
    );
  }
}
```
