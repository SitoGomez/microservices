export interface IMessageRelay {
  processEvents(): Promise<void>;
}

export const MESSAGE_RELAY = Symbol('MessageRelay');
