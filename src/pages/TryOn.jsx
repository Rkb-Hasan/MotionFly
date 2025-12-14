import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

export default function TryOn() {
  return (
    <div className="relative   mx-auto my-2 max-h-screen overflow-hidden">
      <MyCam />
      <div className="w-full flex justify-center items-center">
        <Slider />
      </div>
    </div>
  );
}
