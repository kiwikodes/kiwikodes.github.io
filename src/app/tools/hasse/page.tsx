import { HasseCanvas, HasseProvider, HasseSidebar } from "./components";

export default function Hasse() {
  return (
    <div className="flex">
      <HasseProvider>
        <HasseSidebar />
        <HasseCanvas />
      </HasseProvider>
    </div>
  );
}
