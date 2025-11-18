import { useEffect, useState } from 'react';

export function useResendTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [secondsLeft]);

  const resetTimer = () => {
    setSecondsLeft(initialSeconds);
  };

  const isActive = secondsLeft > 0;

  return { secondsLeft, isActive, resetTimer };
}
