import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

export default function TryOn() {
  return (
    <div className="relative mx-auto max-h-screen overflow-hidden my-3">
      <MyCam />
      <div className="absolute bottom-0 w-full ">
        <Slider />
      </div>
    </div>
  );
}
