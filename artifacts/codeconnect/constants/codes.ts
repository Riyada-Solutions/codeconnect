export interface CodeType {
  id: string;
  type: string;
  color: string;
  icon: string;
  description: string;
  /** Shown under the code title on the alert form (e.g. severity line). */
  tagline?: string;
}

export const CODES: CodeType[] = [
  { id: "blue", type: "Code Blue", color: "#3b82f6", icon: "heart", description: "Cardiac arrest / Medical emergency" },
  {
    id: "red",
    type: "Code Red",
    color: "#ef4444",
    icon: "alert-triangle",
    description: "Fire / Smoke",
    tagline: "Critical Emergency",
  },
  { id: "pink", type: "Code Pink", color: "#ec4899", icon: "user", description: "Infant / Child abduction" },
  { id: "yellow", type: "Code Yellow", color: "#f59e0b", icon: "alert-circle", description: "Bomb threat" },
  { id: "orange", type: "Code Orange", color: "#f97316", icon: "zap", description: "Hazardous material spill" },
  { id: "green", type: "Code Green", color: "#10b981", icon: "shield", description: "Emergency activation" },
  { id: "purple", type: "Code Purple", color: "#8b5cf6", icon: "users", description: "Hostage situation" },
];

export const getCodeByType = (type: string): CodeType | undefined => {
  return CODES.find((c) => c.type.toLowerCase() === type.toLowerCase());
};

export const getCodeColor = (type: string): string => {
  const code = getCodeByType(type);
  return code?.color || "#3b82f6";
};
