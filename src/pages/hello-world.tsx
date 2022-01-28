import { NextPage } from "next";
import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

type CounterContextType = {
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
};

const CounterContext = createContext<CounterContextType>({
  counter: -1,
  setCounter: () => {
    throw "hit default setCounter";
  },
});

const CounterProvider: React.FC = ({ children }) => {
  const [counter, setCounter] = useState(0);

  return (
    <CounterContext.Provider value={{ counter, setCounter }}>
      {children}
    </CounterContext.Provider>
  );
};

const CounterConsumer: React.FC = () => {
  const { counter, setCounter } = useContext(CounterContext);

  return (
    <div style={{ backgroundColor: "pink", margin: 10, padding: 10 }}>
      <button
        onClick={() => {
          setCounter((counter) => counter + 1);
        }}
      >
        {counter}
      </button>
    </div>
  );
};

const OtherChild: React.FC = () => {
  return useMemo(
    () => (
      <div style={{ backgroundColor: "green", margin: 10, padding: 10 }}>
        I should not re-render
      </div>
    ),
    [],
  );
};

const Parent: React.FC = () => {
  return (
    <div style={{ backgroundColor: "blue", padding: 10, margin: 10 }}>
      <CounterProvider>
        <CounterConsumer />
        <OtherChild />
      </CounterProvider>
    </div>
  );
};

const HelloWorldPage: NextPage<Record<string, never>> = () => {
  return <Parent />;
};

export default HelloWorldPage;
