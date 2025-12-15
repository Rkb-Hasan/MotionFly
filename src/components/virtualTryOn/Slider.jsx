import { useEffect, useRef } from "react";
import Test3 from "../../assets/images/products/link.jpg";
import Test from "../../assets/images/products/profile_pic.jpg";
import Test2 from "../../assets/images/products/test.png";
import "../../styles/slider.css";
const products = [
  Test,
  Test2,
  Test3,
  Test,
  Test2,
  Test3,
  Test,
  Test2,
  Test3,
  Test,
  Test2,
  Test3,
  Test,
  Test2,
  Test3,
  Test3,
  Test,
  Test2,
  Test3,
];

export default function Slider() {
  const items = [...products, ...products, ...products];
  const sliderRef = useRef(null);

  useEffect(() => {
    const el = sliderRef.current;
    el.scrollLeft = el.scrollWidth / 3;
  }, []);

  const onScroll = () => {
    const el = sliderRef.current;
    const third = el.scrollWidth / 3;

    if (el.scrollLeft < third * 0.5) {
      el.scrollLeft += third;
    } else if (el.scrollLeft > third * 1.5) {
      el.scrollLeft -= third;
    }
  };

  return (
    <div ref={sliderRef} onScroll={onScroll} className="slider">
      {items.map((p, i) => (
        <div className="slide" key={i}>
          <img src={p} />
        </div>
      ))}
    </div>
  );
}
