"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GameButton, GameCard, ToastContainer, toast } from "@/components/ui";

interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  haptics: boolean;
  theme: "dark" | "fantasy";
}

export default function MenuPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({
    musicVolume: 70,
    sfxVolume: 80,
    haptics: true,
    theme: "dark",
  });

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("game_settings", JSON.stringify(settings));
    toast.success("Settings saved");
  }

  return (
    <div className="game-viewport overflow-y-auto bg-gradient-game">
      <ToastContainer />

      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-game-primary">
            Settings
          </h1>
          <GameButton variant="ghost" size="sm" onClick={() => router.push("/")}>
            Back
          </GameButton>
        </div>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Audio */}
          <GameCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-game-text-dim">
              Audio
            </h3>
            <div className="flex flex-col gap-4">
              <SliderRow
                label="Music"
                value={settings.musicVolume}
                onChange={(v) => update("musicVolume", v)}
              />
              <SliderRow
                label="Sound FX"
                value={settings.sfxVolume}
                onChange={(v) => update("sfxVolume", v)}
              />
            </div>
          </GameCard>

          {/* Controls */}
          <GameCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-game-text-dim">
              Controls
            </h3>
            <ToggleRow
              label="Haptic Feedback"
              value={settings.haptics}
              onChange={(v) => update("haptics", v)}
            />
          </GameCard>

          {/* Theme */}
          <GameCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-game-text-dim">
              Theme
            </h3>
            <div className="flex gap-3">
              {(["dark", "fantasy"] as const).map((t) => (
                <GameButton
                  key={t}
                  variant={settings.theme === t ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => update("theme", t)}
                >
                  {t}
                </GameButton>
              ))}
            </div>
          </GameCard>

          <GameButton variant="primary" size="lg" onClick={handleSave}>
            Save Settings
          </GameButton>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Small helper components ───

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="w-24 font-body text-sm text-game-text">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[var(--game-primary)]"
      />
      <span className="w-10 text-right font-mono text-xs text-game-text-dim">
        {value}%
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-sm text-game-text">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-game-primary" : "bg-game-border"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
