"use client";

import { motion, useDragControls } from "motion/react";
import { useHasseContext } from "./HasseProvider";
import { ReactNode, useEffect } from "react";

export default function HasseCanvas() {
  const {
    transitiveReduction,
    elements,

    currentStep,
    setCurrentStep,
    totalSteps,
    paused,
    setPaused,

    speedOptions,
    speedIndex,
  } = useHasseContext();

  const controls = useDragControls();

  function getGraphSteps() {
    const steps: ReactNode[] = [];

    const addedNodes: boolean[] = Array(transitiveReduction.length).fill(false);
    const [cols, nodeLevels]: [number[], number[]] = getNodeLevels();

    function getNodeLevels(): [number[], number[]] {
      const n = transitiveReduction.length;
      const levels = new Array(n).fill(0);

      const visited = new Set<number>();

      function dfs(node: number): number {
        if (visited.has(node)) return levels[node];
        visited.add(node);

        let maxPredecessorLevel = 0;
        for (let i = 0; i < n; i++) {
          if (transitiveReduction[i][node] === 1) {
            maxPredecessorLevel = Math.max(maxPredecessorLevel, dfs(i) + 1);
          }
        }

        levels[node] = maxPredecessorLevel;
        return levels[node];
      }

      for (let i = 0; i < n; i++) {
        dfs(i);
      }

      const counts = Array(Math.max(...levels) + 1).fill(0);
      const cols = Array(n).fill(0);

      for (let i = 0; i < n; i++) {
        cols[i] = counts[levels[i]];
        counts[levels[i]]++;
      }

      return [cols, levels];
    }

    function graphNode(step: number, x: number, y: number) {
      return (
        <motion.g key={step} transform={`translate(${500 + x}, ${500 + y})`}>
          <motion.circle
            r={50}
            fill="skyblue"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-black text-sm font-semibold"
          >
            {elements[step]}
          </text>
        </motion.g>
      );
    }

    function graphEdge(from: number, to: number) {
      return (
        <motion.line
          key={`${from}-${to}`}
          x1={500 + 125 * cols[from]}
          y1={500 - nodeLevels[from] * 125}
          x2={500 + 125 * cols[to]}
          y2={500 - nodeLevels[to] * 125}
          stroke="black"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
      );
    }

    for (let i = 0; i < transitiveReduction.length; i++) {
      for (let j = 0; j < transitiveReduction[i].length; j++) {
        if (transitiveReduction[i][j] === 0) continue;

        if (!addedNodes[i]) {
          steps.push(graphNode(i, 125 * cols[i], -nodeLevels[i] * 125));
          addedNodes[i] = true;
        }

        if (!addedNodes[j]) {
          steps.push(graphNode(j, 125 * cols[j], -nodeLevels[j] * 125));
          addedNodes[j] = true;
        }

        steps.push(graphEdge(i, j));
      }
    }

    for (let i = 0; i < addedNodes.length; i++) {
      if (!addedNodes[i]) {
        steps.push(graphNode(i, 125 * cols[i], -nodeLevels[i] * 125));
      }
    }

    return steps;
  }

  let steps: ReactNode[] = [];

  // Update steps whenever transitiveReduction changes
  if (transitiveReduction.length > 0) {
    steps = getGraphSteps();
  }

  useEffect(() => {
    if (paused || currentStep >= totalSteps) return;

    console.log("Current step:", currentStep, "Total steps:", totalSteps);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps) {
          clearInterval(interval);
          setPaused(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speedOptions[speedIndex]);

    return () => clearInterval(interval);
  }, [paused, speedIndex, totalSteps]);

  return (
    <svg
      width="100%"
      height="100vh"
      onPointerDown={e => {
        controls.start(e);
        e.currentTarget.classList.add("cursor-grabbing");
      }}
      onPointerUp={e => {
        e.currentTarget.classList.remove("cursor-grabbing");
      }}
      className="cursor-grab"
      id="hasse-diagram"
    >
      <motion.g
        drag
        dragControls={controls}
        dragConstraints={{ right: -400 }}
        style={{ cursor: "grab" }}
      >
        {steps.slice(0, currentStep)}
      </motion.g>
    </svg>
  );
}
