export type SubscriberCallback<T> = (value: T) => void;

export interface Publisher<T> {
  publish(value: T): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscriber<T> {
  subscribe(subscriberCallback: SubscriberCallback<T>): Subscription;
}

export class PubSub<T> implements Publisher<T>, Subscriber<T> {
  private readonly subscribers = new Set<SubscriberCallback<T>>();

  public subscribe(subscriberCallback: SubscriberCallback<T>): Subscription {
    this.subscribers.add(subscriberCallback);
    const unsubscribe = () => {
      this.subscribers.delete(subscriberCallback);
    };
    return { unsubscribe };
  }

  public publish(value: T): void {
    for (const subscriberCallback of this.subscribers) {
      subscriberCallback(value);
    }
  }
}
