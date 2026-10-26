import { useRef, useState } from "react";
import Icon from "./Icon";
export const screenshots = Array.from(
  { length: 7 },
  (_, i) => `/assets/image-${6 + i}.webp`,
);
export default function Carousel({
  onOpen,
}: {
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const scroll = (direction: number) =>
    ref.current?.scrollBy({
      left: direction * (ref.current.clientWidth * 0.8),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  return (
    <section className="carousel" aria-label="App screenshots">
      {" "}
      <div
        className="screenshot-track"
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label="Screenshot carousel, use left and right arrow keys"
        onScroll={() => setPosition(ref.current?.scrollLeft || 0)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            scroll(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {screenshots.map((src, i) => (
          <button
            key={src}
            onClick={() => onOpen(i)}
            aria-label={`Open screenshot ${i + 1}`}
          >
            <picture>
              <source
                media="(max-width: 1279px)"
                srcSet={`/assets/screenshot-mobile-${i}.webp`}
              />
              <img
                src={src}
                alt={`NextGen mParivahan screenshot ${i + 1}`}
                width="131"
                height="296"
              />
            </picture>
          </button>
        ))}
      </div>
      {position > 5 ? (
        <button
          className="carousel-arrow previous"
          aria-label="Previous screenshots"
          onClick={() => scroll(-1)}
        >
          <Icon name="chevron_left" />
        </button>
      ) : null}
      <button
        className="carousel-arrow next"
        aria-label="Next screenshots"
        onClick={() => scroll(1)}
      >
        <Icon name="chevron_right" />
      </button>
    </section>
  );
}
