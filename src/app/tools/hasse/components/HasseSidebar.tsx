"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gauge,
  Image,
  LayoutGrid,
  Pause,
  Play,
  RotateCcw,
  Save,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Upload,
} from "lucide-react";
import { useHasseContext } from "./HasseProvider";
import { useRef } from "react";

export default function HasseSidebar() {
  const {
    poset,
    setPoset,
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
  } = useHasseContext();

  const posetInputRef = useRef<HTMLInputElement>(null);

  function downloadSVG() {
    const el = document.getElementById("hasse-diagram");
    if (!(el instanceof SVGSVGElement)) {
      alert("SVG not found!");
      return;
    }
    const svg = el;

    // Clone the SVG to avoid modifying the original
    const clone = svg.cloneNode(true) as SVGSVGElement;

    // Optional: add XML namespaces if missing
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);

    // Create a Blob and download link
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hasse-diagram.svg";
    a.click();

    URL.revokeObjectURL(url);
  }

  function loadPoset(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      const lines = content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);

      const values = lines[0]
        .split(" ")
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num));

      if (lines.length - 1 !== values.length) {
        alert("Invalid file format: number of elements does not match matrix");
        return;
      }

      const posetFromFile = lines.slice(1).map((line: string, i: number) => {
        const row = line
          .split(" ")
          .map((num: string) => parseInt(num.trim(), 10))
          .filter((num: number) => num === 0 || num === 1);
        if (row.length !== values.length) {
          alert(
            `Invalid file format: matrix row length does not match set size (row ${
              i + 1
            })`
          );
          throw new Error("Invalid file format");
        }
        return row;
      });

      if (!validatePoset(posetFromFile)) {
        alert(
          "Invalid poset: does not satisfy reflexivity, antisymmetry, or transitivity"
        );
        return;
      }

      const isRange = values.slice(1).every((val, i) => val - values[i] === 1);

      if (isRange) {
        setRangeStart(values[0]);
        setRangeEnd(values[values.length - 1]);
        setElementsType("range");
      } else {
        setSetInput(values.join(", "));
        setElementsType("set");
      }

      setPoset(posetFromFile);
    };
    reader.onerror = () => {
      alert("Failed to read file");
    };
    reader.readAsText(file);
  }

  function savePoset() {
    const blob = new Blob(
      [elements.join(" "), "\n", poset.map(arr => arr.join(" ")).join("\n")],
      {
        type: "text/plain",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poset.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function validatePoset(poset: number[][]) {
    if (poset.length === 0) return false;

    if (poset.length !== poset[0].length) return false;

    for (let i = 0; i < poset.length; i++) {
      for (let j = 0; j < poset[i].length; j++) {
        if (i === j && poset[i][j] !== 1) return false;
        if (i !== j && poset[i][j] === 1 && poset[j][i] === 1) return false;

        for (let k = 0; k < poset.length; k++) {
          if (
            poset[i][j] === 1 &&
            poset[j][k] === 1 &&
            poset[i][k] !== 1 &&
            i !== k
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }

  function processValues() {
    let values: number[] = [];

    if (elementsType === "range") {
      if (rangeStart === "" || rangeEnd === "" || rangeStart > rangeEnd) {
        alert("Please enter valid range start and end values.");
        return null;
      }

      values = Array.from(
        { length: rangeEnd - rangeStart + 1 },
        (_, i) => i + rangeStart
      );
    } else if (elementsType === "set") {
      if (setInput.trim() === "") {
        alert("Please enter a valid set of elements.");
        return null;
      }

      values = setInput
        .replace(/[^0-9 ]/g, "")
        .split(" ")
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num));
    }

    if (values.length > 1000) {
      alert("Too many elements! Please limit to 1000 or fewer.");
      return null;
    }

    setElements(values);
    return values;
  }

  function generatePoset() {
    const values = processValues();
    if (!values) return;

    const newPoset: number[][] = Array.from({ length: values.length }, () =>
      Array(values.length).fill(0)
    );

    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (i === j) {
          newPoset[i][j] = 1; // Reflexivity
        } else {
          switch (relation) {
            case "divisibility":
              newPoset[i][j] = values[j] % values[i] === 0 ? 1 : 0;
              break;
            case "less-equal":
              newPoset[i][j] = values[i] <= values[j] ? 1 : 0;
              break;
            case "digit-wise":
              const strA = values[i].toString();
              const strB = values[j].toString();

              newPoset[i][j] = 1;

              if (strB.length < strA.length) {
                newPoset[i][j] = 0;
                break;
              }

              for (let k = 1; k <= strA.length; k++) {
                if (strA[strA.length - k] > strB[strB.length - k]) {
                  newPoset[i][j] = 0;
                  break;
                }
              }
              break;
            default:
              newPoset[i][j] = 0;
          }
        }
      }
    }

    setPoset(newPoset);
    getTransitiveReduction(newPoset);
    setCurrentStep(0);
    setPaused(true);

    alert("Success! Poset generated.");
  }

  function randomisePoset() {
    const values = processValues();
    if (!values) return;

    const newPoset: number[][] = Array.from({ length: values.length }, () =>
      Array(values.length).fill(0)
    );

    for (let i = 0; i < newPoset.length; i++) {
      newPoset[i][i] = 1;
      for (let j = i + 1; j < newPoset[i].length; j++) {
        newPoset[i][j] = Math.random() < 0.05 ? 1 : 0;
      }
    }

    for (let i = 0; i < newPoset.length; i++) {
      for (let j = 0; j < newPoset[i].length; j++) {
        for (let k = 0; k < newPoset.length; k++) {
          if (
            newPoset[i][j] === 1 &&
            newPoset[j][k] === 1 &&
            newPoset[i][k] !== 1 &&
            i !== k
          ) {
            newPoset[i][k] = 1;
          }
        }
      }
    }

    setPoset(newPoset);
    getTransitiveReduction(newPoset);
    setCurrentStep(0);
    setPaused(true);

    alert("Success! Poset randomised.");
  }

  function getTransitiveReduction(poset: number[][]) {
    const n = poset.length;
    const transitiveReduction: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(0)
    );

    let count = 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (poset[i][j] === 0) continue;
        if (i === j) continue;

        transitiveReduction[i][j] = 1;
        count++;

        for (let k = 0; k < n; k++) {
          if (poset[i][k] === 1 && poset[k][j] === 1 && i !== k && j !== k) {
            transitiveReduction[i][j] = 0;
            count--;
            break;
          }
        }
      }
    }

    setTotalSteps(count + n);
    setTransitiveReduction(transitiveReduction);
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarHeader className="flex-row items-center p-4 py-3">
          <LayoutGrid className="size-8 p-2 bg-sidebar-primary text-sidebar-primary-foreground rounded" />
          <div className="flex flex-col leading-tight">
            <h1 className="font-semibold">Hasse Diagram</h1>
            <span className="text-xs">Editor</span>
          </div>
          <div className="text-xs ml-auto px-2 py-1 bg-muted text-muted-foreground rounded">
            v0.1.0
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          {/* Diagram Options */}
          <SidebarGroup>
            <SidebarGroupLabel>Diagram Options</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2 px-2 py-1">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={downloadSVG}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="size-4 mr-1" />
                Save Diagram
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Poset Actions */}
          <SidebarGroup>
            <SidebarGroupLabel>Poset Actions</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2 px-2 py-1">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => posetInputRef.current?.click()}
              >
                <Upload className="size-4 mr-1" />
                Load Poset
                <Input
                  type="file"
                  className="hidden"
                  ref={posetInputRef}
                  accept=".txt"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) loadPoset(file);
                  }}
                />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={savePoset}
              >
                <Save className="size-4 mr-1" />
                Save Poset
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Generate Poset */}
          <SidebarGroup>
            <SidebarGroupLabel>Generate Poset</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4 px-2 py-1">
              <div className="space-y-2">
                <Label className="text-xs">Elements</Label>
                <Tabs value={elementsType} onValueChange={setElementsType}>
                  <TabsList className="w-full">
                    <TabsTrigger value="range">Range</TabsTrigger>
                    <TabsTrigger value="set">Set</TabsTrigger>
                  </TabsList>
                  <TabsContent value="range" className="flex gap-2">
                    <Input
                      placeholder="1"
                      type="number"
                      className="text-xs"
                      value={rangeStart}
                      onChange={e => {
                        const value = Number(e.target.value);
                        setRangeStart(value);
                      }}
                    />
                    <span className="text-xs self-center">to</span>
                    <Input
                      placeholder="100"
                      type="number"
                      className="text-xs"
                      value={rangeEnd}
                      onChange={e => {
                        const value = Number(e.target.value);
                        setRangeEnd(value);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="set">
                    <Input
                      placeholder="1, 2, 3, 5, 7, 11, ..."
                      className="text-xs"
                      value={setInput}
                      onChange={e => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9, ]/g, "");
                        setSetInput(value);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Relation</Label>
                <Select value={relation} onValueChange={setRelation}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="divisibility">Divisibility</SelectItem>
                    <SelectItem value="less-equal">
                      Less Than or Equal
                    </SelectItem>
                    <SelectItem value="digit-wise">
                      Digit-Wise Less Than or Equal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={randomisePoset}>
                  Randomise
                </Button>
                <Button onClick={generatePoset}>Generate</Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t px-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{
                width: `${(currentStep / (totalSteps || 1)) * 100}%`,
              }}
            />
          </div>
          <div className="flex w-full gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep(currentStep - 1);
                setPaused(true);
              }}
              disabled={currentStep === 0}
            >
              <StepBack className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep(0);
                setPaused(true);
              }}
              disabled={currentStep === 0}
            >
              <SkipBack className="size-4" />
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setPaused(!paused)}
              disabled={totalSteps === 0 || currentStep === totalSteps}
            >
              {paused ? (
                <Play className="size-4" />
              ) : (
                <Pause className="size-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep(totalSteps);
                setPaused(true);
              }}
              disabled={currentStep === totalSteps}
            >
              <SkipForward className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep(currentStep + 1);
                setPaused(true);
              }}
              disabled={currentStep === totalSteps}
            >
              <StepForward className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setSpeedIndex(i => (i + 1) % speedOptions.length)}
            >
              <Gauge className="size-4" />x{speedOptions[speedIndex]}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(0);
                setSpeedIndex(3);
                setRangeStart("");
                setRangeEnd("");
                setSetInput("");
                setPaused(true);
              }}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </SidebarFooter>
        <footer className="border-t flex gap-2 justify-around text-xs text-muted-foreground px-2 py-1">
          <span>
            Made by{" "}
            <a href="https://www.milesscherer.com" className="hover:underline">
              Miles Scherer
            </a>
          </span>
          <a href="https://github.com/kiwikodes" className="hover:underline">
            GitHub
          </a>
          <span className="hover:underline">Feedback</span>
        </footer>
      </Sidebar>
    </SidebarProvider>
  );
}
