import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

export default function TryOn() {
  return (
    <div className="border  mx-auto justify-between">
      <MyCam />
      <Slider />
    </div>
  );
}
