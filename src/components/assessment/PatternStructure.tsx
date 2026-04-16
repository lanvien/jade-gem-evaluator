import { useState, useEffect } from "react";

export interface PatternData {
  groupA: Record<string, { checked: boolean; density?: "low" | "medium" | "high" }>;
  groupB: Record<string, { checked: boolean; density?: "low" | "medium" | "high" }>;
  maxSize?: "lt3cm" | "gt3cm";
  feelConfirm?: boolean;
}

const GROUP_A_ITEMS = [
  { id: "van-ngoc", label: "Vân ngọc" },
  { id: "gan-ngoc", label: "Gân ngọc" },
  { id: "so-bong", label: "Sớ bông" },
  { id: "mat-cat", label: "Mắt cát" },
];

const GROUP_B_ITEMS = [
  { id: "so-am", label: "Sớ âm" },
  { id: "so-luoi-ga", label: "Sớ lưỡi gà" },
  { id: "so-doc", label: "Sớ dọc" },
  { id: "so-ngang-cheo", label: "Sớ ngang/chéo" },
  { id: "vet-nut", label: "Vết nứt" },
];

const FEEL_CONFIRM_IDS = ["so-doc", "so-luoi-ga", "vet-nut"];

const DENSITY_OPTIONS: { value: "low" | "medium" | "high"; label: string }[] = [
  { value: "low", label: "Ít" },
  { value: "medium", label: "Vừa" },
  { value: "high", label: "Nhiều" },
];

interface Props {
  value: PatternData;
  onChange: (data: PatternData) => void;
  surfaceSmooth: boolean;
}

const PatternStructure = ({ value, onChange, surfaceSmooth }: Props) => {
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");

  const toggleItem = (group: "groupA" | "groupB", id: string) => {
    const current = value[group][id];
    const updated = { ...value[group] };
    if (current?.checked) {
      updated[id] = { checked: false };
    } else {
      updated[id] = { checked: true, density: "low" };
    }
    onChange({ ...value, [group]: updated });
  };

  const setDensity = (group: "groupA" | "groupB", id: string, density: "low" | "medium" | "high") => {
    const updated = { ...value[group] };
    updated[id] = { ...updated[id], density };
    onChange({ ...value, [group]: updated });
  };

  const hasGroupBSelection = Object.values(value.groupB).some((v) => v.checked);
  const needsFeelConfirm = FEEL_CONFIRM_IDS.some((id) => value.groupB[id]?.checked);

  // If surface is smooth, hide Group B structural warnings
  const showGroupB = !surfaceSmooth;

  const renderCheckItem = (
    item: { id: string; label: string },
    group: "groupA" | "groupB",
    data: PatternData["groupA"]
  ) => {
    const entry = data[item.id];
    const isChecked = entry?.checked || false;

    return (
      <div key={item.id} className="space-y-2">
        <button
          onClick={() => toggleItem(group, item.id)}
          className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
            isChecked
              ? "border-gold bg-gold/10"
              : "border-border bg-card hover:border-gold/50"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
              isChecked ? "border-gold bg-gold text-primary-foreground" : "border-muted-foreground"
            }`}>
              {isChecked && "✓"}
            </span>
            <span className="font-semibold text-foreground">{item.label}</span>
          </span>
        </button>

        {/* Density selector - animated */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isChecked ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 pl-7 pt-1">
            <span className="text-sm text-muted-foreground">Mật độ:</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {DENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDensity(group, item.id, opt.value)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    entry?.density === opt.value
                      ? "bg-gold text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Tab selector */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setActiveTab("A")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "A"
              ? "bg-accent text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          🌿 Vẻ đẹp tự nhiên
        </button>
        {showGroupB && (
          <button
            onClick={() => setActiveTab("B")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "B"
                ? "bg-destructive text-white"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            ⚠️ Cảnh báo cấu trúc
          </button>
        )}
      </div>

      {/* Group A */}
      <div className={`space-y-3 transition-all duration-300 ${activeTab === "A" ? "block" : "hidden"}`}>
        {GROUP_A_ITEMS.map((item) => renderCheckItem(item, "groupA", value.groupA))}
      </div>

      {/* Group B */}
      {showGroupB && (
        <div className={`space-y-3 transition-all duration-300 ${activeTab === "B" ? "block" : "hidden"}`}>
          {GROUP_B_ITEMS.map((item) => renderCheckItem(item, "groupB", value.groupB))}
        </div>
      )}

      {/* Error Detail Box - only when Group B has selections */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          hasGroupBSelection && showGroupB ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "#d4c9a8" }}>
          <h4 className="font-bold text-foreground flex items-center gap-2">
            📏 Chi tiết lỗi cấu trúc
          </h4>

          {/* Max size */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Kích thước vết lớn nhất:</p>
            <div className="flex gap-3">
              <button
                onClick={() => onChange({ ...value, maxSize: "lt3cm" })}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  value.maxSize === "lt3cm"
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {"< 3cm"}
              </button>
              <button
                onClick={() => onChange({ ...value, maxSize: "gt3cm" })}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  value.maxSize === "gt3cm"
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {"> 3cm"}
              </button>
            </div>
          </div>

          {/* Feel confirmation - only for specific items */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              needsFeelConfirm ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value.feelConfirm}
                onChange={(e) => onChange({ ...value, feelConfirm: e.target.checked })}
                className="mt-0.5 rounded border-border text-gold focus:ring-gold"
              />
              <span className="text-sm text-foreground">
                Vết sớ/nứt này sờ trên bề mặt có thấy cấn tay không?
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternStructure;
