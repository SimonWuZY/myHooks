import { useState, useCallback } from 'react';

type UseToggleReturn = [boolean, () => void, (value?: boolean) => void];

function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((newValue?: boolean) => {
    setValue(newValue !== undefined ? newValue : prev => !prev);
  }, []);

  return [value, toggle, setToggle];
}

export default useToggle;