import { getEnvVariables } from "@/helpers";
import { useState, createContext, useEffect, ReactNode } from "react";

interface TimerType {
  seconds: number;
  resetTimer: () => void;
}

interface TimerProviderProp {
  children: ReactNode;
}

const init: TimerType = {
  seconds: 0,
  resetTimer: () => {},
};

const TimerContext = createContext<TimerType>(init);

const { ACTIVITY_TIME } = getEnvVariables();

const TimerProvider = ({ children }: TimerProviderProp) => {
  const [seconds, setSeconds] = useState(ACTIVITY_TIME);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const resetTimer = () => {
    setSeconds(ACTIVITY_TIME);
  };

  return <TimerContext.Provider value={{ seconds, resetTimer }}>{children}</TimerContext.Provider>;
};

export { TimerContext, TimerProvider };
