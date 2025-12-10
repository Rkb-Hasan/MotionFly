import { useState } from "react";

const items = ["1", "2", "3", "4"];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative h-64 overflow-hidden perspective-1000">
      <div
        className="absolute inset-0 flex flex-col items-center transition-transform duration-300"
        // style={{ transform: `translateY(${offset * -60}px)` }}
      >
        <button
          onClick={() =>
            setCurrent((prev) => Math.min(prev + 1, items.length - 1))
          }
          className="bg-gray-300 px-2 py-1 rounded-md"
        >
          up
        </button>

        {items.map((item, i) => {
          const diff = i - current;
          const scale = Math.max(0.4, 1 - Math.abs(diff) * 0.15);
          const opacity = Math.max(0.2, 1 - Math.abs(diff) * 0.25);
          const rotateX = diff * 18; // cylinder tilt effect
          const z = 80 - Math.abs(diff) * 40; // closer = bigger

          return (
            <div
              key={i}
              className="w-40 h-12 flex items-center justify-center bg-gray-800 text-white rounded-lg absolute transition-all duration-300"
              style={{
                transform: `translateZ(${z}px) rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                top: `calc(50% + ${diff * 60}px)`,
              }}
            >
              {item}
            </div>
          );
        })}

        <button
          onClick={() =>
            setCurrent((prev) => Math.min(prev - 1, items.length - 1))
          }
          className="bg-gray-300 px-2 py-1 rounded-md"
        >
          Down
        </button>
      </div>
    </div>
  );
}
