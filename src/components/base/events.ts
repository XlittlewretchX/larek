type EventName = string | RegExp;
type Subscriber = (data: object) => void;
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    once<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(
        event: string,
        context?: Partial<T>
    ): (data: T) => void;
}

export class EventEmitter implements IEvents {
    private _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T extends object>(eventName: EventName, callback: (data: T) => void): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)!.add(callback as Subscriber);
    }

    // Подписка на событие, которое сработает только один раз
    once<T extends object>(eventName: EventName, callback: (data: T) => void): void {
        const onceCallback = (data: object) => {
            callback(data as T);
            this.off(eventName, onceCallback);
        };
        this.on(eventName, onceCallback);
    }

    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') {
                subscribers.forEach((callback) =>
                    callback({
                        eventName,
                        data,
                    })
                );
            }
            if (
                (name instanceof RegExp && name.test(eventName)) ||
                name === eventName
            ) {
                subscribers.forEach((callback) => callback(data || {}));
            }
        });
    }

    onAll(callback: (event: EmitterEvent) => void) {
        this.on('*', callback);
    }

    offAll() {
        this._events.clear();
    }

    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {}),
            });
        };
    }
}
