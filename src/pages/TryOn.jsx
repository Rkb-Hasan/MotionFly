import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

export default function TryOn() {
  return (
    <div className="border  md:gap-7 mx-auto justify-between">
      <MyCam />
      <Slider />
    </div>
  );
}
