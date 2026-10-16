"use client";

import React, { useEffect, useState } from "react";
import { fetchShootWeather, ShootWeatherReport } from "@/lib/weather";
import { CloudRain, Sun, Sparkles } from "lucide-react";

interface LiveWeatherCardProps {
  latitude: number;
  longitude: number;
  venueName: string;
}

export const LiveWeatherCard: React.FC<LiveWeatherCardProps> = ({
  latitude,
  longitude,
  venueName,
}) => {
  const [report, setReport] = useState<ShootWeatherReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;
    setLoading(true);
    fetchShootWeather(latitude, longitude)
      .then((data) => setReport(data))
      .catch((err) => console.warn("Live weather preview error:", err))
      .finally(() => setLoading(false));
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return null;
  }

  if (loading && !report) {
    return (
      <div className="p-4 bg-white dark:bg-[#1F1B18] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm text-xs text-neutral-500 animate-pulse flex items-center gap-2">
        <Sun className="w-4 h-4 text-[#C5A880] animate-spin" />
        <span>Fetching live photoshoot weather forecast & lighting recommendations...</span>
      </div>
    );
  }

  if (!report) return null;

  const { current, overallLightingRecommendation, forecast } = report;
  const isHighRainRisk = current.rainProbability >= 40;

  return (
    <div className="bg-white dark:bg-[#1F1B18] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#C5A880]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
            Live Venue Weather & Photography Lighting
          </span>
        </div>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {venueName || report.city}
        </span>
      </div>

      {/* Main Condition Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Weather Metrics */}
        <div className="sm:col-span-5 flex items-center gap-4">
          <div className="text-3xl sm:text-4xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
            {current.temp}°C
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-semibold text-[#2C2420] dark:text-[#FAF8F5] flex items-center gap-1.5">
              <span>{current.description}</span>
            </div>
            <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">
              Feels like {current.feelsLike}°C • Wind {current.windSpeed} km/h
            </div>
          </div>
        </div>

        {/* Rain Probability Badge */}
        <div className="sm:col-span-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isHighRainRisk
                ? "bg-amber-600/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                : "bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-300 border border-[#2E5E43]/30"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 shrink-0" />
            <span>{current.rainProbability}% Rain Risk</span>
          </div>
        </div>

        {/* Forecast Mini Strip */}
        <div className="sm:col-span-4 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-1">
          {forecast.slice(0, 4).map((f, i) => (
            <div key={i} className="text-center px-2 py-1 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9]/60 dark:border-[#3A332C] text-[10px]">
              <span className="text-neutral-400 block">{f.timeStr}</span>
              <span className="font-bold text-[#2C2420] dark:text-[#FAF8F5]">{f.temp}°</span>
              <span className="text-[#C5A880] block font-semibold">{f.rainProbability}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photography Lighting Recommendation Card */}
      <div className="p-3 bg-[#C5A880]/10 dark:bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-sm text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Photography Lighting Condition Advice:</span>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
          {overallLightingRecommendation}
        </p>
      </div>
    </div>
  );
};
