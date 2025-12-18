import { useState } from "react";
import Shirt from "../assets/images/products/shirt.png";
import MyCam from "../components/virtualTryOn/MyCam";
import Slider from "../components/virtualTryOn/Slider";

const products = Array(21).fill(Shirt);

export default function TryOn() {
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedDress = products[activeIndex];
  return (
    <div className="relative mx-auto max-h-screen overflow-hidden my-3">
      <MyCam selectedDress={selectedDress} />

      <div className="absolute bottom-0 w-full">
        <Slider
          products={products}
          activeIndex={activeIndex}
          onChangeIndex={setActiveIndex}
        />
      </div>
    </div>
  );
}
