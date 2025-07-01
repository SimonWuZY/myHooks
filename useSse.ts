import { useEffect, useState, useCallback } from 'react';

interface EventData {
  [key: string]: string;
}

const useSse = (url: string, options?: EventSourceInit) => {
  const [connectionState, setConnectionState] = useState<string>('CONNECTING');
  const [connectionError, setConnectionError] = useState<Event | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [eventData, setEventData] = useState<EventData>({});

  useEffect(() => {
    const es = new EventSource(url, options);
    setEventSource(es);

    es.onopen = () => setConnectionState('OPEN');
    es.onerror = (error: Event) => {
      setConnectionState('CLOSED');
      setConnectionError(error);
    };

    return () => es.close();
  }, [url]);

  const addListener = useCallback((eventName: string, eventHandler: (data: string) => void) => {
    if (eventSource) {
      const handleMessage = (event: MessageEvent) => {
        setEventData((prevData) => ({
          ...prevData,
          [eventName]: event.data,
        }));
        eventHandler(event.data);
      };
      
      eventSource.addEventListener(eventName, handleMessage);
      
      // 返回清理函数
      return () => {
        eventSource.removeEventListener(eventName, handleMessage);
      };
    }
  }, [eventSource]);

  const getEventData = useCallback((eventName: string) => {
    return eventData[eventName];
  }, [eventData]);

  const closeConnection = useCallback(() => eventSource?.close(), [eventSource]);

  return { connectionState, connectionError, addListener, getEventData, closeConnection };
};

export default useSse;