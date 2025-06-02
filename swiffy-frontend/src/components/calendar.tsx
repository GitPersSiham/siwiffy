import React, { useState} from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBookingsByUserId } from '@/hooks/useBookingByUserId';
import { getOccupiedSlots } from '@/api/bookingApi';
import { toast } from 'react-hot-toast';
import { DateTime } from 'luxon';

interface BookingCalendarProps {
  formData: {
    date: Date | null | string;
    endDate: Date | null | string;
    duration: number;
    adress: string;
    amount: number;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      date: Date | null | string;
      endDate: Date | null | string;
      duration: number;
      adress: string;
      amount: number;
    }>
  >;
  isEditing?: boolean;
  editingId?: string;
  onDateChange?: (date: Date | null) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
}

const HOURS = Array.from({ length: 11 }, (_, i) => 6 + i); // Affichage: 6h à 16h UTC
const timeZone = 'Europe/Paris';

// Fonction utilitaire pour convertir l'heure d'affichage en heure locale
const UTCToLocalHour = (utcHour: number): number => {
  return utcHour + 2; // 6h UTC = 8h locale
};

// Fonction utilitaire pour convertir l'heure locale en heure d'affichage
const localToUTCHour = (localHour: number): number => {
  return localHour - 2; // 8h locale = 6h UTC
};

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  formData,
  setFormData,
  isEditing,
  editingId,
  onDateChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('userId');
  const { data: bookings } = useBookingsByUserId(userId || '');

  // Fonction pour récupérer les créneaux occupés
  const fetchOccupiedSlots = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching occupied slots for date:', date.toISOString());
      const data = await getOccupiedSlots(date.toISOString());
      console.log('Received occupied slots:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        return;
      }

      const formattedSlots = data
        .map((slot: any) => {
          if (!slot.start || !slot.end) {
            console.warn('Invalid slot format:', slot);
            return null;
          }

          try {
            // Les dates sont déjà des objets Date
            const startDate = new Date(slot.start);
            const endDate = new Date(slot.end);

            console.log('Processing slot:', {
              originalStart: slot.start,
              originalEnd: slot.end,
              convertedStart: startDate.toISOString(),
              convertedEnd: endDate.toISOString(),
              localStart: startDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
              localEnd: endDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
            });

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.warn('Invalid date conversion:', {
                start: slot.start,
                end: slot.end,
                convertedStart: startDate,
                convertedEnd: endDate
              });
              return null;
            }

            return {
              start: startDate,
              end: endDate
            };
          } catch (error) {
            console.warn('Error parsing dates:', error);
            return null;
          }
        })
        .filter((slot): slot is TimeSlot => slot !== null);

      console.log('Formatted slots:', formattedSlots);
      setOccupiedSlots(formattedSlots);
    } catch (err: any) {
      console.error('Erreur détaillée:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Impossible de charger les créneaux occupés';
      if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur lors du chargement des créneaux. Veuillez réessayer plus tard.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service de réservation temporairement indisponible.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        style: {
          background: 'transparent',
          boxShadow: 'none'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la sélection d'une heure
  const handleTimeSelect = (localHour: number) => {
    if (!selectedDate || isSlotOccupied(localHour) || !isValidTimeSlot(localHour)) {
      if (!selectedDate) {
        toast.error('Veuillez sélectionner une date');
      } else if (isSlotOccupied(localHour)) {
        toast.error('Ce créneau est déjà réservé');
      } else if (!isValidTimeSlot(localHour)) {
        toast.error('Veuillez sélectionner une heure entre 8h et 17h');
      }
      return;
    }

    // Créer la date en heure locale (Paris)
    const parisStart = DateTime.fromJSDate(selectedDate)
      .setZone('Europe/Paris')
      .set({ hour: localHour, minute: 0, second: 0, millisecond: 0 });
    const parisEnd = parisStart.plus({ hours: formData.duration });
    
    // Convertir en UTC pour le stockage
    const startDateUTC = parisStart.toUTC().toJSDate();
    const endDateUTC = parisEnd.toUTC().toJSDate();

    console.log('Dates sélectionnées:', {
      paris: {
        start: parisStart.toFormat('yyyy-MM-dd HH:mm:ss'),
        end: parisEnd.toFormat('yyyy-MM-dd HH:mm:ss'),
        startHour: parisStart.hour,
        endHour: parisEnd.hour
      },
      utc: {
        start: startDateUTC.toISOString(),
        end: endDateUTC.toISOString(),
        startHour: DateTime.fromJSDate(startDateUTC).hour,
        endHour: DateTime.fromJSDate(endDateUTC).hour
      }
    });

    // Stocker les dates en UTC
    setFormData(prev => ({
      ...prev,
      date: startDateUTC,
      endDate: endDateUTC
    }));

    // Appeler onDateChange si fourni
    if (onDateChange) {
      onDateChange(startDateUTC);
    }
  };

  // Vérifier si un créneau est valide (heures de bureau)
  const isValidTimeSlot = (localHour: number) => {
    if (!selectedDate) return false;

    // Vérifier si l'heure est dans les heures de bureau (8h-18h locale)
    if (localHour < 8 || localHour >= 18) return false;

    // Vérifier si le créneau est occupé
    if (isSlotOccupied(localHour)) return false;

    // Vérifier si le créneau dépasse les heures de bureau
    const endHour = localHour + formData.duration;
    if (endHour > 18) return false;

    return true;
  };

  const isSlotOccupied = (localHour: number) => {
    if (!selectedDate) return false;

    return occupiedSlots.some(slot => {
      // Convertir les dates en heure locale de Paris
      const slotStart = DateTime.fromJSDate(slot.start).setZone('Europe/Paris');
      const slotEnd = DateTime.fromJSDate(slot.end).setZone('Europe/Paris');
      const selectedDateTime = DateTime.fromJSDate(selectedDate).setZone('Europe/Paris');

      // Vérifier si le créneau sélectionné chevauche le créneau occupé
      const slotStartHour = slotStart.hour;
      const slotEndHour = slotEnd.hour;
      const selectedDateHour = selectedDateTime.hour;

      // Un créneau est occupé si l'heure sélectionnée est dans le créneau occupé
      const isOccupied = localHour >= slotStartHour && localHour < slotEndHour;

      if (isOccupied) {
        console.log(`Créneau ${localHour}h est occupé par le slot ${slotStartHour}h → ${slotEndHour}h`);
      }

      return isOccupied;
    });
  };

  // Gérer la sélection d'une date
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchOccupiedSlots(date);
    
    // Initialiser la date de début avec l'heure actuelle
    const startDate = new Date(date);
    const currentHour = new Date().getHours();
    
    // Si l'heure actuelle est avant 8h, on met 8h
    // Si l'heure actuelle est après 17h, on met 8h le lendemain
    if (currentHour < 8) {
      startDate.setHours(8, 0, 0, 0);
    } else if (currentHour >= 17) {
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(8, 0, 0, 0);
    } else {
      startDate.setHours(currentHour, 0, 0, 0);
    }

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + formData.duration);

    setFormData(prev => ({
      ...prev,
      date: startDate,
      endDate: endDate
    }));

    // Appeler onDateChange si fourni
    if (onDateChange) {
      onDateChange(startDate);
    }
  };

  // Générer les dates pour le calendrier
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour la comparaison
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);

    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Vérifier si une date est valide (pas dans le passé)
  const isValidDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
  };

  // Générer les heures disponibles
  const generateTimeSlots = () => {
    const slots = [];
    // Générer les créneaux de 8h à 17h en heure locale
    for (let localHour = 8; localHour <= 17; localHour++) {
      slots.push(localHour);
    }
    return slots;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {generateCalendarDays().map((date, index) => {
          const isPastDate = !isValidDate(date);
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isPastDate) {
                  handleDateSelect(date);
                }
              }}
              disabled={isPastDate}
              className={`p-3 text-center rounded-lg ${
                selectedDate && isSameDay(date, selectedDate)
                  ? 'bg-teal-700 text-white'
                  : isPastDate
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm font-medium truncate">
                {format(date, 'EEEE', { locale: fr })}
              </div>
              <div className="text-lg font-bold">
                {format(date, 'd')}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {format(date, 'MMMM', { locale: fr })}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Créneaux horaires pour le {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          {isLoading ? (
            <div className="text-center py-4">Chargement des créneaux...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {generateTimeSlots().map((localHour) => {
                const isOccupied = isSlotOccupied(localHour);
                const isValid = isValidTimeSlot(localHour);
                const isSelected = formData.date instanceof Date && 
                  DateTime.fromJSDate(formData.date)
                    .setZone('Europe/Paris')
                    .hour === localHour;

                return (
                  <button
                    key={localHour}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isOccupied && isValid) {
                        handleTimeSelect(localHour);
                      }
                    }}
                    disabled={isOccupied || !isValid}
                    className={`p-3 text-center rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-lg transform scale-105'
                        : isOccupied
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-teal-500'
                    }`}
                  >
                    <div className="text-lg font-medium">{localHour}h00</div>
                    {isOccupied && (
                      <div className="text-xs text-gray-500 mt-1">Réservé</div>
                    )}
                    {!isOccupied && isValid && (
                      <div className="text-xs text-teal-600 mt-1">Disponible</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {formData.date && formData.endDate && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Résumé de la réservation</h3>
          <p>Date de début : {format(new Date(formData.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}</p>
          <p>Date de fin : {format(new Date(formData.endDate), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}</p>
          <p>Durée : {formData.duration} heure(s)</p>
        </div>
      )}
    </div>
  );
};
