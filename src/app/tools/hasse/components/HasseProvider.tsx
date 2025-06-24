"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type HasseContextType = {
  poset: number[][];
  setPoset: Dispatch<SetStateAction<number[][]>>;
  transitiveReduction: number[][];
  setTransitiveReduction: Dispatch<SetStateAction<number[][]>>;
  elementsType: string;
  setElementsType: Dispatch<SetStateAction<string>>;
  elements: number[];
  setElements: Dispatch<SetStateAction<number[]>>;
  rangeStart: number | "";
  setRangeStart: Dispatch<SetStateAction<number | "">>;
  rangeEnd: number | "";
  setRangeEnd: Dispatch<SetStateAction<number | "">>;
  setInput: string;
  setSetInput: Dispatch<SetStateAction<string>>;
  relation: string;
  setRelation: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  totalSteps: number;
  setTotalSteps: Dispatch<SetStateAction<number>>;
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
  speedOptions: number[];
  speedIndex: number;
  setSpeedIndex: Dispatch<SetStateAction<number>>;
};

const HasseContext = createContext<HasseContextType | undefined>(undefined);

export default function HasseProvider({ children }: { children: ReactNode }) {
  const [poset, setPoset] = useState<number[][]>([]);
  const [transitiveReduction, setTransitiveReduction] = useState<number[][]>(
    []
  );

  const [elementsType, setElementsType] = useState<string>("range");
  const [elements, setElements] = useState<number[]>([]);

  const [rangeStart, setRangeStart] = useState<number | "">("");
  const [rangeEnd, setRangeEnd] = useState<number | "">("");
  const [setInput, setSetInput] = useState("");

  const [relation, setRelation] = useState<string>("divisibility");

  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [paused, setPaused] = useState(true);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4, 8, 16];
  const [speedIndex, setSpeedIndex] = useState(3);

  return (
    <HasseContext.Provider
      value={{
        poset,
        setPoset,
        transitiveReduction,
        setTransitiveReduction,

        elementsType,
        setElementsType,
        elements,
        setElements,

        rangeStart,
        setRangeStart,
        rangeEnd,
        setRangeEnd,
        setInput,
        setSetInput,

        relation,
        setRelation,

        currentStep,
        setCurrentStep,
        totalSteps,
        setTotalSteps,

        paused,
        setPaused,
        speedOptions,
        speedIndex,
        setSpeedIndex,
      }}
    >
      {children}
    </HasseContext.Provider>
  );
}

export function useHasseContext() {
  const context = useContext(HasseContext);
  if (!context) {
    throw new Error("useHasseContext must be used within a HasseProvider");
  }
  return context;
}
