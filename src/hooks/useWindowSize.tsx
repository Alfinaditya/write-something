import { useEffect, useState } from 'react';
interface Size {
  witdh: number;
  height: number;
}
const useWindowSize = () => {
  const [size, setSize] = useState<Size>();
  function handleSize() {
    setSize({
      witdh: window.innerWidth,
      height: window.innerHeight,
    });
  }
  useEffect(() => {
    handleSize();
    window.addEventListener('resize', handleSize);
    return () => window.removeEventListener('resize', handleSize);
  }, []);
  return size as Size;
};

export default useWindowSize;
