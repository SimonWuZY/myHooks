import { useState, useEffect, useMemo, useCallback } from 'react';

// 通用防抖函数
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  time: number
): (...args: Parameters<T>) => void {
  let timer: any | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

// 防抖值 Hook - 延迟更新值
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 防抖状态 Hook - 防抖的 setState（你原来的实现，优化后）
export function useDebounceState<T>(
  defaultValue: T,
  time: number
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, changeValue] = useState<T>(defaultValue);

  // 对 changeValue 做防抖处理
  const debouncedChangeValue = useMemo(
    () => debounce(changeValue, time),
    [time]
  );

  return [value, debouncedChangeValue];
}

// 防抖回调 Hook - 防抖的回调函数
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  return useMemo(
    () => debounce(callback, delay),
    [callback, delay, ...deps]
  );
}

export default useDebounce;