import { useEffect, useRef, useState } from "react";
import nextPrev from "../../assets/icons/next.svg";
// import Test3 from "../../assets/images/products/link.jpg";
import Test from "../../assets/images/products/profile_pic.jpg";
// import Test2 from "../../assets/images/products/test.png";
import "../../styles/slider.css";

const products = [Test, Test];

const SLIDE_SIZE = 72;
const GAP = 10;
const STEP = SLIDE_SIZE + GAP;

export default function Slider() {
  const sliderRef = useRef(null);
  const indexRef = useRef(0);

  const [sidePadding, setSidePadding] = useState(0);

  const scrollToIndex = () => {
    // console.log(i, "index");
    const el = sliderRef.current;
    if (!el) return;

    const left = 2 * sidePadding;
    // console.log("left, sidePadding" + left, sidePadding);
    el.scrollTo({ left, behavior: "smooth" });
  };

  // Calculate padding based on viewport geometry
  useEffect(() => {
    const updatePadding = () => {
      const el = sliderRef.current;
      if (!el) return;

      const containerWidth = el.clientWidth;
      console.log("container" + containerWidth);
      const padding = containerWidth / 2 + 120 - SLIDE_SIZE / 2;
      // console.log("padding" + padding);
      setSidePadding(Math.max(padding, 0));
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  // Initial alignment after padding is applied
  useEffect(() => {
    if (sidePadding) {
      scrollToIndex();
    }
  }, [sidePadding]);

  const scrollPrev = () => {
    indexRef.current = Math.max(indexRef.current - 1, 0);
    scrollToIndex(indexRef.current);
  };

  const scrollNext = () => {
    indexRef.current = Math.min(indexRef.current + 1, products.length - 1);
    scrollToIndex(indexRef.current);
  };

  // console.log("render", num++, sidePadding);
  return (
    <div className="slider-wrapper">
      <button className="nav-btn" onClick={scrollPrev}>
        <img src={nextPrev} alt="prev" className="rotate" />
      </button>

      <div
        ref={sliderRef}
        className="slider bg-red-700 bg-clip-padding"
        style={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
      >
        {products.map((p, i) => (
          <div className="slide" key={i}>
            <img src={p} alt="" />
          </div>
        ))}
      </div>

      <button className="nav-btn" onClick={scrollNext}>
        <img src={nextPrev} alt="next" />
      </button>

      <div className="focus-window" />
    </div>
  );
}
