import React, { useRef, useEffect } from 'react';
export function usePrevious(data) {
  const ref = useRef();
  useEffect(() => {
    ref.current = data;
  }, [data]);
  return ref.current;
}
