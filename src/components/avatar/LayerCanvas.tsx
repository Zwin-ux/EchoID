"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { TraitDefinition } from "@/config/traits";

export interface LayerCanvasProps {
  traits: TraitDefinition[];
  size?: number;
  className?: string;
  backgroundColor?: string;
  onRendered?: (dataUrl: string) => void;
}

const resolveSrc = (src: string) => {
  if (typeof window === "undefined") return src;
  if (src.startsWith("http")) return src;
  return `${window.location.origin}${src}`;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = resolveSrc(src);
  });

const LayerCanvas = ({
  traits,
  size = 512,
  className,
  backgroundColor = "transparent",
  onRendered,
}: LayerCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = size;
    canvas.height = size;

    async function renderLayers() {
      setLoading(true);
      context.clearRect(0, 0, size, size);

      if (backgroundColor !== "transparent") {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, size, size);
      }

      try {
        for (const trait of traits) {
          if (!trait?.image) continue;
          const image = await loadImage(String(trait.image));
          if (cancelled) return;
          context.drawImage(image, 0, 0, size, size);
        }

        if (cancelled) return;
        setLoading(false);
        if (onRendered) {
          const dataUrl = canvas.toDataURL("image/png", 1);
          onRendered(dataUrl);
        }
      } catch (error) {
        console.error("LayerCanvas render error", error);
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    renderLayers();

    return () => {
      cancelled = true;
    };
  }, [traits, size, backgroundColor, onRendered]);

  return (
    <div className={`relative flex items-center justify-center ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="aspect-square w-full max-w-full rounded-3xl border border-white/10 bg-[#050509] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[#0A0A0F]/60 backdrop-blur">
          <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
        </div>
      )}
    </div>
  );
};

export default LayerCanvas;
