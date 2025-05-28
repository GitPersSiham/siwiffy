// Types pour les forfaits et propriétés
export type PackageType = 'Simple' | 'Confort' | 'Premium';
export type PropertyType = 'Studio' | 'T1' | 'T2' | 'T3' | 'T4';

// Interface pour les options de nettoyage
export interface CleaningOptions {
  windows: boolean;
  fridge: boolean;
  ironing: boolean;
}

// Interface pour les données du formulaire
export interface BookingFormData {
  date: Date | null | string;
  endDate: Date | null | string;
  duration: number;
  adress: string;
  amount: number;
} 