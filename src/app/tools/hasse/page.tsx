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
  RotateCcw,
  Save,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Upload,
} from "lucide-react";

export default function Hasse() {
  return (
    <div>
      <SidebarProvider>
        <Sidebar className="">
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
                <Button variant="outline" className="w-full justify-start">
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
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="size-4 mr-1" />
                  Load Poset
                </Button>
                <Button variant="outline" className="w-full justify-start">
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
                  <Tabs defaultValue="range">
                    <TabsList className="w-full">
                      <TabsTrigger value="range">Range</TabsTrigger>
                      <TabsTrigger value="set">Set</TabsTrigger>
                    </TabsList>
                    <TabsContent value="range" className="flex gap-2">
                      <Input
                        placeholder="1"
                        type="number"
                        className="text-xs"
                      />
                      <span className="text-xs self-center">to</span>
                      <Input
                        placeholder="999"
                        type="number"
                        className="text-xs"
                      />
                    </TabsContent>
                    <TabsContent value="set">
                      <Input
                        placeholder="1, 2, 3, 5, 7, 11, ..."
                        className="text-xs"
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Relation</Label>
                  <Select defaultValue="divisibility">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="divisibility">Divisibility</SelectItem>
                      <SelectItem value="subset">Subset</SelectItem>
                      <SelectItem value="less-equal">
                        Less Than or Equal
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="size-4 mr-1" />
                    Load Custom Relation
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">Randomise</Button>
                  <Button>Generate</Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t px-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="w-20 bg-primary rounded-full h-2" />
            </div>
            <div className="flex w-full gap-2">
              <Button size="sm" variant="outline">
                <StepBack className="size-4" />
              </Button>
              <Button size="sm" variant="outline">
                <SkipBack className="size-4" />
              </Button>
              <Button size="sm" className="flex-1">
                <Pause className="size-4" />
              </Button>
              <Button size="sm" variant="outline">
                <SkipForward className="size-4" />
              </Button>
              <Button size="sm" variant="outline">
                <StepForward className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <Gauge className="size-4" />
                x1
              </Button>
              <Button variant="outline">
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </SidebarFooter>
          <footer className="border-t flex gap-2 justify-around text-xs text-muted-foreground px-2 py-1">
            <span>
              Made by{" "}
              <a
                href="https://www.milesscherer.com"
                className="hover:underline"
              >
                Miles Scherer
              </a>
            </span>
            <a
              href="https://github.com/kiwikodes/kiwikodes.github.io"
              className="hover:underline"
            >
              GitHub
            </a>
            <span className="hover:underline">Feedback</span>
          </footer>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
