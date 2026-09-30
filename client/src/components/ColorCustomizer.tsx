import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, RotateCcw } from "lucide-react";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

const PRESET_SCHEMES: Record<string, ColorScheme> = {
  "Badge Gold": {
    primary: "#d8ae55",
    secondary: "#00eaff",
    accent: "#d8ae55",
  },
  "Neon Blue": {
    primary: "#00eaff",
    secondary: "#d8ae55",
    accent: "#d8ae55",
  },
  "Gold Archive": {
    primary: "#d8ae55",
    secondary: "#00eaff",
    accent: "#d8ae55",
  },
  "Cyan Signal": {
    primary: "#00eaff",
    secondary: "#d8ae55",
    accent: "#00eaff",
  },
  "Gold Signal": {
    primary: "#d8ae55",
    secondary: "#00eaff",
    accent: "#d8ae55",
  },
};

export default function ColorCustomizer() {
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#d8ae55",
    secondary: "#00eaff",
    accent: "#d8ae55",
  });
  const [isOpen, setIsOpen] = useState(false);

  // Load colors from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("anom-colors");
    if (saved) {
      setColors(JSON.parse(saved));
      applyColors(JSON.parse(saved));
    }
  }, []);

  const applyColors = (colorScheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", colorScheme.primary);
    root.style.setProperty("--color-secondary", colorScheme.secondary);
    root.style.setProperty("--color-accent", colorScheme.accent);
  };

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    applyColors(newColors);
    localStorage.setItem("anom-colors", JSON.stringify(newColors));
  };

  const applyPreset = (scheme: ColorScheme) => {
    setColors(scheme);
    applyColors(scheme);
    localStorage.setItem("anom-colors", JSON.stringify(scheme));
  };

  const resetColors = () => {
    const defaultColors = {
      primary: "#d8ae55",
      secondary: "#00eaff",
      accent: "#d8ae55",
    };
    setColors(defaultColors);
    applyColors(defaultColors);
    localStorage.removeItem("anom-colors");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d8ae55] to-[#00eaff] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Customize Colors"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Customization Panel */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 bg-[#000000] border border-[#08080f] p-6 w-80 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#d8ae55]">Theme Colors</h3>
              <button
                onClick={resetColors}
                className="p-1 hover:bg-[#08080f] rounded transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="w-4 h-4 text-[#cccccc]" />
              </button>
            </div>

            {/* Color Pickers */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-[#00eaff] font-bold mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-[#08080f]"
                  />
                  <input
                    type="text"
                    value={colors.primary}
                    onChange={(e) => handleColorChange("primary", e.target.value)}
                    className="flex-1 bg-[#0A0A10] border border-[#08080f] text-[#00eaff] px-2 py-1 rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#00eaff] font-bold mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-[#08080f]"
                  />
                  <input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange("secondary", e.target.value)}
                    className="flex-1 bg-[#0A0A10] border border-[#08080f] text-[#00eaff] px-2 py-1 rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#00eaff] font-bold mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colors.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-[#08080f]"
                  />
                  <input
                    type="text"
                    value={colors.accent}
                    onChange={(e) => handleColorChange("accent", e.target.value)}
                    className="flex-1 bg-[#0A0A10] border border-[#08080f] text-[#00eaff] px-2 py-1 rounded text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Preset Schemes */}
            <div className="border-t border-[#08080f] pt-4">
              <p className="text-xs text-[#cccccc] font-bold mb-2">PRESET SCHEMES</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PRESET_SCHEMES).map(([name, scheme]) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(scheme)}
                    className="p-2 bg-[#0A0A10] border border-[#08080f] rounded hover:border-[#00eaff] transition-colors text-xs font-bold text-[#cccccc] hover:text-[#00eaff]"
                  >
                    <div className="flex gap-1 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: scheme.secondary }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: scheme.accent }}
                      />
                    </div>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <Button
              className="w-full btn-secondary text-sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
