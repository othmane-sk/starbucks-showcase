import { useState, useCallback, useRef } from "react";
import starbucksLogo from "@/assets/starbucks-logo2.png";
import sakuraImg from "@/assets/sakura-latte.png";
import matchaImg from "@/assets/matcha-latte-macchiato.png";
import strawberryImg from "@/assets/strawberry-s.png";
import sweetPotatoImg from "@/assets/sweet-potato-latte.png";

interface Product {
  name: string;
  desc: string;
  img: string;
  bgVar: string;
}

const products: Product[] = [
  {
    name: "Sakura Latte",
    desc: "Delicate cherry blossom-inspired latte with subtle floral notes and a whisper of spring sweetness.",
    img: sakuraImg,
    bgVar: "--bg-sakura",
  },
  {
    name: "Matcha Latte Macchiato",
    desc: "Layered ceremonial matcha and velvety milk with a bold, vibrant green color and creamy finish.",
    img: matchaImg,
    bgVar: "--bg-matcha",
  },
  {
    name: "Strawberry S",
    desc: "Sweet and fruity strawberry latte, visually bright and appealing with hand-shaken berry infusions.",
    img: strawberryImg,
    bgVar: "--bg-strawberry",
  },
  {
    name: "Sweet Potato Latte",
    desc: "Creamy, comforting latte with roasted sweet potato flavor, celebrating the warmth of the harvest.",
    img: sweetPotatoImg,
    bgVar: "--bg-potato",
  },
];

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (next: number, dir: "left" | "right") => {
      if (isTransitioning) return;
      setDirection(dir);
      setPrevIndex(currentIndex);
      setIsTransitioning(true);
      setCurrentIndex(next);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPrevIndex(null);
      }, 1200);
    },
    [isTransitioning, currentIndex]
  );

  const prev = () =>
    goTo((currentIndex - 1 + products.length) % products.length, "left");
  const next = () => goTo((currentIndex + 1) % products.length, "right");

  const currentBg = `hsl(var(${products[currentIndex].bgVar}))`;
  const prevBg = prevIndex !== null ? `hsl(var(${products[prevIndex].bgVar}))` : currentBg;

  // Clip-path: color comes FROM the direction opposite to arrow clicked
  // Right arrow → new color sweeps from LEFT; Left arrow → new color sweeps from RIGHT
  const clipFrom = direction === "right"
    ? "inset(0 100% 0 0)"
    : "inset(0 0 0 100%)";
  const clipTo = "inset(0 0 0 0)";

  return (
    <div className="relative h-screen w-screen overflow-hidden font-body">
      {/* Background layers for directional wipe */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: prevBg }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: currentBg,
          clipPath: isTransitioning ? clipTo : clipTo,
          animation: isTransitioning
            ? `colorWipe-${direction} 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards`
            : undefined,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full px-6 md:px-16 py-5 flex justify-between items-center z-50">
        <img src={starbucksLogo} alt="Starbucks" className="h-14 md:h-16 w-auto" />
        <span className="font-display text-lg md:text-xl tracking-wide text-foreground">
          Brew Studio
        </span>
      </header>

      {/* Slider */}
      <main className="relative h-full flex items-center justify-center z-10">
        {/* Prev Arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="nav-arrow-base left-4 md:left-16 hidden md:flex"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Slides */}
        <div className="w-full h-full relative">
          {products.map((product, i) => {
            const isActive = i === currentIndex;
            return (
              <div
                key={product.name}
                className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center px-6 md:px-24 lg:px-[10vw]"
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "all" : "none",
                  transition: `opacity 1s cubic-bezier(0.76, 0, 0.24, 1)`,
                }}
              >
                {/* Text */}
                <div
                  className="max-w-lg z-10 pt-24 lg:pt-0 text-center lg:text-left order-2 lg:order-1"
                  style={{
                    transform: isActive ? "translateY(0)" : "translateY(30px)",
                    opacity: isActive ? 1 : 0,
                    transition:
                      "transform 1s cubic-bezier(0.76, 0, 0.24, 1) 0.15s, opacity 1s cubic-bezier(0.76, 0, 0.24, 1) 0.15s",
                  }}
                >
                  <h2 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] mb-8 text-foreground">
                    {product.name}
                  </h2>
                  <p
                    className="text-base md:text-lg leading-relaxed text-muted-foreground"
                    style={{
                      transform: isActive ? "translateY(0)" : "translateY(20px)",
                      opacity: isActive ? 1 : 0,
                      transition:
                        "transform 1s cubic-bezier(0.76, 0, 0.24, 1) 0.25s, opacity 1s cubic-bezier(0.76, 0, 0.24, 1) 0.25s",
                    }}
                  >
                    {product.desc}
                  </p>
                </div>

                {/* Image */}
                <div className="flex justify-center items-center order-1 lg:order-2 pt-20 lg:pt-0">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-48 md:w-64 lg:w-[340px] max-h-[70vh] object-contain"
                    style={{
                      filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.08))",
                      transform: isActive
                        ? "scale(1) translateX(0)"
                        : "scale(0.8) translateX(50px)",
                      transition:
                        "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="nav-arrow-base right-4 md:right-16 hidden md:flex"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile arrows */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 md:hidden z-10">
          <button onClick={prev} aria-label="Previous" className="nav-arrow-base relative !top-auto !translate-y-0 !w-12 !h-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next" className="nav-arrow-base relative !top-auto !translate-y-0 !w-12 !h-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductSlider;
