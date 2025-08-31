import { useEffect, useState, useCallback, useRef } from 'react';

// 连接状态枚举
export type SseConnectionState = 'CONNECTING' | 'OPEN' | 'CLOSED' | 'ERROR';

// 事件数据接口
interface EventData {
  [key: string]: string;
}

// 错误信息接口
interface SseError {
  event: Event;
  timestamp: number;
  readyState: number;
}

// Hook 返回值接口
interface UseSseReturn {
  connectionState: SseConnectionState;
  connectionError: SseError | null;
  addListener: (eventName: string, eventHandler: (data: string) => void) => (() => void) | undefined;
  getEventData: (eventName: string) => string | undefined;
  closeConnection: () => void;
  reconnect: () => void;
  isConnected: boolean;
}

const useSse = (url: string, options?: EventSourceInit): UseSseReturn => {
  const [connectionState, setConnectionState] = useState<SseConnectionState>('CONNECTING');
  const [connectionError, setConnectionError] = useState<SseError | null>(null);
  const [eventData, setEventData] = useState<EventData>({});
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const isMountedRef = useRef(true);
  const listenersRef = useRef<Map<string, Set<(data: string) => void>>>(new Map());

  // 序列化 options 以便正确比较依赖
  const optionsString = JSON.stringify(options);

  // 创建连接的函数
  const createConnection = useCallback(() => {
    // 清理旧连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState('CONNECTING');
    setConnectionError(null);

    try {
      const es = new EventSource(url, options);
      eventSourceRef.current = es;

      es.onopen = () => {
        if (isMountedRef.current) {
          setConnectionState('OPEN');
          setConnectionError(null);
        }
      };

      es.onerror = (error: Event) => {
        if (isMountedRef.current) {
          const sseError: SseError = {
            event: error,
            timestamp: Date.now(),
            readyState: es.readyState
          };
          
          setConnectionError(sseError);
          
          // 根据 readyState 设置不同的状态
          if (es.readyState === EventSource.CLOSED) {
            setConnectionState('CLOSED');
          } else {
            setConnectionState('ERROR');
          }
        }
      };

      es.onmessage = (event: MessageEvent) => {
        if (isMountedRef.current) {
          setEventData(prevData => ({
            ...prevData,
            message: event.data
          }));
        }
      };

    } catch (error) {
      if (isMountedRef.current) {
        setConnectionState('ERROR');
        setConnectionError({
          event: error as Event,
          timestamp: Date.now(),
          readyState: EventSource.CLOSED
        });
      }
    }
  }, [url, optionsString]);

  // 初始化连接
  useEffect(() => {
    isMountedRef.current = true;
    createConnection();

    return () => {
      isMountedRef.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      listenersRef.current.clear();
    };
  }, [createConnection]);

  // 添加事件监听器
  const addListener = useCallback((eventName: string, eventHandler: (data: string) => void) => {
    const es = eventSourceRef.current;
    if (!es || !isMountedRef.current) {
      return undefined;
    }

    // 管理监听器引用
    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, new Set());
    }
    listenersRef.current.get(eventName)!.add(eventHandler);

    const handleMessage = (event: MessageEvent) => {
      if (isMountedRef.current) {
        setEventData(prevData => ({
          ...prevData,
          [eventName]: event.data,
        }));
        eventHandler(event.data);
      }
    };

    es.addEventListener(eventName, handleMessage);

    // 返回清理函数
    return () => {
      if (es && es.readyState !== EventSource.CLOSED) {
        es.removeEventListener(eventName, handleMessage);
      }
      
      // 清理监听器引用
      const listeners = listenersRef.current.get(eventName);
      if (listeners) {
        listeners.delete(eventHandler);
        if (listeners.size === 0) {
          listenersRef.current.delete(eventName);
        }
      }
    };
  }, []);

  // 获取事件数据
  const getEventData = useCallback((eventName: string) => {
    return eventData[eventName];
  }, [eventData]);

  // 关闭连接
  const closeConnection = useCallback(() => {
    const es = eventSourceRef.current;
    if (es) {
      es.close();
      eventSourceRef.current = null;
      if (isMountedRef.current) {
        setConnectionState('CLOSED');
      }
    }
  }, []);

  // 重新连接
  const reconnect = useCallback(() => {
    createConnection();
  }, [createConnection]);

  // 计算是否已连接
  const isConnected = connectionState === 'OPEN';

  return { 
    connectionState, 
    connectionError, 
    addListener, 
    getEventData, 
    closeConnection,
    reconnect,
    isConnected
  };
};

export default useSse;