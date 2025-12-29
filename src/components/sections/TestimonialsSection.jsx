"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import { testimonials } from "@/data/testimonials";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function TestimonialsSection() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 2600,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true, // inertia-like feel
      containScroll: "trimSnaps",
    },
    [autoplay]
  );

  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16">
      <Container>
        <Parallax from={12} to={-12}>
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="What clients say"
              desc="Autoplay slider with drag & inertia feel."
            />
          </Reveal>
        </Parallax>

        <Reveal delay={0.12}>
          <div className="relative">
            <div
              ref={emblaRef}
              className="overflow-hidden"
              onMouseEnter={() => autoplay.stop()}
              onMouseLeave={() => autoplay.play()}
            >
              <div className="flex gap-6">
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="min-w-0 flex-[0_0_92%] sm:flex-[0_0_70%] md:flex-[0_0_48%]"
                  >
                    <Card className="h-full">
                      <p className="text-white/80 leading-relaxed">
                        “{t.text}”
                      </p>
                      <div className="mt-5">
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-white/60">{t.role}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => {
                  autoplay.stop();
                  emblaApi?.scrollPrev();
                  autoplay.play();
                }}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
              >
                ← Prev
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      autoplay.stop();
                      emblaApi?.scrollTo(i);
                      autoplay.play();
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      selected === i
                        ? "bg-white"
                        : "bg-white/25 hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  autoplay.stop();
                  emblaApi?.scrollNext();
                  autoplay.play();
                }}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
              >
                Next →
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
