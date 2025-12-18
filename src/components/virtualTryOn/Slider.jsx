import { useEffect, useLayoutEffect, useRef, useState } from "react";
import nextPrev from "../../assets/icons/next.svg";
// import Test from "../../assets/images/products/profile_pic.jpg";

import "../../styles/slider.css";

const SLIDE_SIZE = 72;
const GAP = 10;
const STEP = SLIDE_SIZE + GAP;

export default function Slider({ products, activeIndex, onChangeIndex }) {
  const sliderRef = useRef(null);
  const [sidePadding, setSidePadding] = useState(0);

  /* ---------- Padding calculation ---------- */
  useLayoutEffect(() => {
    if (!sliderRef.current) return;

    const updatePadding = () => {
      const width = sliderRef.current.clientWidth;
      const padding = (width - SLIDE_SIZE) / 2;
      setSidePadding(Math.max(padding, 0));
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  /* ---------- Scroll to index ---------- */
  useEffect(() => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollTo({
      left: activeIndex * STEP,
      behavior: "smooth",
    });
  }, [activeIndex]);

  /* ---------- Controls ---------- */
  const scrollRight = () => {
    onChangeIndex((i) => Math.min(i + 1, products.length - 1));
  };

  const scrollLeft = () => {
    onChangeIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="relative flex items-center w-full pb-2 hover:bg-gray-500/10 border-2 border-gray-200 backdrop-blur-[1px] z-20">
      <button onClick={scrollLeft} className="p-4 cursor-pointer">
        <img src={nextPrev} className="w-5 h-5 rotate-y-180" />
      </button>

      <div
        ref={sliderRef}
        style={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
        className="slider flex-1 flex gap-2.5 overflow-x-auto"
      >
        {products.map((p, i) => (
          <div
            key={i}
            className="
              w-[72px] h-[72px]
              shrink-0
              rounded-full
              snap-center
            "
          >
            <img src={p} className="w-full h-full rounded-full object-cover" />
          </div>
        ))}
      </div>

      <button onClick={scrollRight} className="p-4 cursor-pointer">
        <img src={nextPrev} className="w-5 h-5" />
      </button>

      <div className="focus-window" />
    </div>
  );
}
