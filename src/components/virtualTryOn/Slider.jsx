import { useEffect, useRef, useState } from "react";
import nextPrev from "../../assets/icons/next.svg";
import Test3 from "../../assets/images/products/link.jpg";
import Test from "../../assets/images/products/profile_pic.jpg";
import Test2 from "../../assets/images/products/test.png";
import "../../styles/slider.css";

const products = [Test, Test2, Test3, Test, Test2, Test3, Test, Test2, Test3];

const SLIDE_SIZE = 72;
const GAP = 10;
const STEP = SLIDE_SIZE + GAP;

export default function Slider() {
  const sliderRef = useRef(null);
  const indexRef = useRef(0);

  const [sidePadding, setSidePadding] = useState(0);

  // Calculate padding based on viewport geometry
  useEffect(() => {
    const updatePadding = () => {
      const el = sliderRef.current;
      if (!el) return;

      const containerWidth = el.clientWidth;
      const padding = containerWidth / 2 - SLIDE_SIZE / 2;

      setSidePadding(Math.max(padding, 0));
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  // Scroll to an exact index (no drift, no overscroll)
  const scrollToIndex = (i) => {
    const el = sliderRef.current;
    if (!el) return;

    const left = sidePadding + i * STEP;
    el.scrollTo({ left, behavior: "smooth" });
  };

  // Initial alignment after padding is applied
  // useEffect(() => {
  //   indexRef.current = 0;
  //   scrollToIndex(0);
  // }, [sidePadding]);

  const scrollPrev = () => {
    indexRef.current = Math.max(indexRef.current - 1, 0);
    scrollToIndex(indexRef.current);
  };

  const scrollNext = () => {
    indexRef.current = Math.min(indexRef.current + 1, products.length - 1);
    scrollToIndex(indexRef.current);
  };

  return (
    <div className="slider-wrapper">
      <button className="nav-btn" onClick={scrollPrev}>
        <img src={nextPrev} alt="prev" className="rotate" />
      </button>

      <div
        ref={sliderRef}
        className="slider"
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
