# Klassical

This React library allows to write class components using the modern React component approach (i.e. using hooks, stateful functional components, etc).

## Just tase a look

```tsx
// Foo is a simple functional component with the props described below
export const Foo = Component(
  class Foo extends ClassComponent<
    { readonly name: string },
    { readonly clicks: number }
  > {
    // Use native React refs!
    private increaseButtonRef = React.createRef<HTMLButtonElement>();

    // Describe state just like in good old class-based components
    public readonly state = { clicks: 0 };

    public constructor(props: { readonly name: string }) {
      super(props);
    }

    // This lifecycle method works as well as `componentDidUpdate`
    override componentDidMount(): void {
      this.increaseButtonRef.current?.focus();
    }

    // Bind class methods easily
    @Autobind
    private decrease() {
      // Use immer updates...
      this.applyState((draft) => {
        draft.clicks -= 1;
      });
    }

    @Autobind
    public increase() {
      // ... or functional update...
      this.setState((oldState) => ({ clicks: oldState.clicks + 1 }));
    }

    @Autobind
    public reset() {
      // ... or just set a new state
      this.setState({ clicks: 0 });
    }

    public render() {
      // Hooks are working just fine even in `render` method
      const [renderOnlyState, setRenderOnlyState] =
        React.useState("Render-only state!");
      return (
        <div>
          <h1>Hello, {this.props.name}!</h1>
          <p>
            <button onClick={this.decrease}>-</button>
            <button onClick={this.reset}>{this.state.clicks}</button>
            <button ref={this.increaseButtonRef} onClick={this.increase}>
              +
            </button>
          </p>
          <a onClick={() => setRenderOnlyState((oldState) => oldState + "!")}>
            This is render-only state: {renderOnlyState}. Click to modify It!
          </a>
        </div>
      );
    }
  },
);
```
