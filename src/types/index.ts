// 通用类型定义
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// SSE 相关类型
export type SseConnectionState = 'CONNECTING' | 'OPEN' | 'CLOSED' | 'ERROR';

export interface SseEventData {
  [key: string]: string;
}

export interface SseError {
  event: Event;
  timestamp: number;
  readyState: number;
}

export interface SseReturn {
  connectionState: SseConnectionState;
  connectionError: SseError | null;
  addListener: (eventName: string, eventHandler: (data: string) => void) => (() => void) | undefined;
  getEventData: (eventName: string) => string | undefined;
  closeConnection: () => void;
  reconnect: () => void;
  isConnected: boolean;
}

// 其他类型
export type SetValue<T> = T | ((val: T) => T);
export type ToggleReturn = [boolean, () => void, (value?: boolean) => void];