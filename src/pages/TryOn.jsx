import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

export default function TryOn() {
  return (
    <div className="relative mx-auto max-h-screen overflow-hidden">
      <MyCam />
      <div className="absolute bottom-2 w-full h-50">
        <Slider />
      </div>
    </div>
  );
}
