import { useEffect, useRef } from "react";
import nextPrev from "../../assets/icons/next.svg";
// import Test3 from "../../assets/images/products/link.jpg";
import Test from "../../assets/images/products/profile_pic.jpg";
// import Test2 from "../../assets/images/products/test.png";
import "../../styles/slider.css";

const products = [Test, Test, Test, Test, Test, Test, Test];

const SLIDE_SIZE = 72;
const GAP = 10;
const STEP = SLIDE_SIZE + GAP;

export default function Slider() {
  const sliderRef = useRef(null);
  const indexRef = useRef(0);
  // const [sidePadding, setSidePadding] = useState(0);

  useEffect(() => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const scrollRight = () => {
    indexRef.current = indexRef.current + 1;
    // console.log(indexRef.current);
    sliderRef.current.scrollBy({
      left: 82,
      behavior: "smooth",
    });
  };
  const scrollLeft = () => {
    indexRef.current = indexRef.current - 1;
    console.log(indexRef.current);

    sliderRef.current.scrollBy({
      left: -82,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center justify-between w-full pb-2">
      <button onClick={scrollLeft} className="p-4 cursor-pointer">
        <img
          src={nextPrev}
          alt="prev"
          className="transform rotate-y-180 w-5 h-5"
        />
      </button>

      <div
        ref={sliderRef}
        className="flex-1 flex gap-2.5 overflow-x-auto bg-red-700  items-center px-[420px] slider"
      >
        {products.map((p, i) => (
          <div className="w-[72px] h-[72px] rounded-full shrink-0" key={i}>
            <img
              className="w-[72px] h-[72px] rounded-full object-cover"
              src={p}
              alt=""
            />
          </div>
        ))}
      </div>

      <button onClick={scrollRight} className="p-4 cursor-pointer">
        <img src={nextPrev} alt="next" className=" w-5 h-5" />
      </button>

      <div className="focus-window" />
    </div>
  );
}
