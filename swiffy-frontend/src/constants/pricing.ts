export const BASE_PRICES: Record<string, number> = {
  Simple: 30,
  Confort: 50,
  Premium: 90,
};

export const OPTION_PRICES = {
  windows: 10,
  fridge: 10,
  ironing: 15,
} as const;

// Type pour les options disponibles
export type CleaningOption = keyof typeof OPTION_PRICES;

// Type pour les forfaits disponibles
export type CleaningPlan = keyof typeof BASE_PRICES; 