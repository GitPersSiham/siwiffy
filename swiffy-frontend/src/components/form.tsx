import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/hooks/useBooking';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useUpdateBooking } from '@/hooks/useUpdateBooking';
import { BookingCalendar } from './calendar';
import { useBookingsByUserId } from '@/hooks/useBookingByUserId';
import { addHours } from 'date-fns';
import { useBookingUpdateStore } from '@/store/useBookingUpdateStore';
import { BASE_PRICES, OPTION_PRICES, CleaningOption, CleaningPlan } from '@/constants/pricing';
import { PackageType, PropertyType, CleaningOptions, BookingFormData } from '@/types/booking';

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;

  const userId = localStorage.getItem('userId');
  const { data: bookings, isLoading: isLoadingBookings } = useBookingsByUserId(
    userId || ''
  );
  const bookingToEdit = bookings?.find((booking) => booking.id === id);
  const { mutateAsync: createBooking } = useCreateBooking();
  const { mutateAsync: updateBooking } = useUpdateBooking();
  const { setHasUpdated } = useBookingUpdateStore();

  const [plan, setPlan] = useState<PackageType>('Simple');
  const [propertyType, setPropertyType] = useState<PropertyType>('Studio');
  const [options, setOptions] = useState<CleaningOptions>({
    windows: false,
    fridge: false,
    ironing: false,
  });
  const [formData, setFormData] = useState<BookingFormData>({
    date: null,
    endDate: null,
    duration: 1,
    adress: '',
    amount: 0,
  });

  const handlePlanChange = (selectedPlan: PackageType) => {
    setPlan(selectedPlan);
  };

  useEffect(() => {
    if (isEditing && bookingToEdit) {
      console.log('Loading booking to edit:', bookingToEdit);
      console.log('Current options:', bookingToEdit.options);
      setPlan(bookingToEdit.packageType);
      setPropertyType(bookingToEdit.propertyType);
      setFormData({
        date: bookingToEdit.dateStart ? new Date(bookingToEdit.dateStart) : null,
        endDate: bookingToEdit.dateEnd ? new Date(bookingToEdit.dateEnd) : null,
        duration: bookingToEdit.duration,
        adress: bookingToEdit.adress,
        amount: bookingToEdit.amount,
      });
      const newOptions = {
        windows: bookingToEdit.options?.windows ?? false,
        fridge: bookingToEdit.options?.fridge ?? false,
        ironing: bookingToEdit.options?.ironing ?? false,
      };
      console.log('Setting options to:', newOptions);
      setOptions(newOptions);
    }
  }, [isEditing, bookingToEdit]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log('Option changed:', name, checked);
    setOptions((prev) => {
      const newOptions = {
        ...prev,
        [name]: checked,
      };
      console.log('New options:', newOptions);
      // Recalculer le prix total après la mise à jour des options
      const basePrice = BASE_PRICES[plan];
      const optionsTotal =
        (newOptions.windows ? OPTION_PRICES.windows : 0) +
        (newOptions.fridge ? OPTION_PRICES.fridge : 0) +
        (newOptions.ironing ? OPTION_PRICES.ironing : 0);
      const newTotal = basePrice + optionsTotal;
      setFormData(prev => ({ ...prev, amount: newTotal }));
      return newOptions;
    });
  };

  const calculateTotal = () => {
    const basePrice = BASE_PRICES[plan];
    const optionsTotal =
      (options.windows ? OPTION_PRICES.windows : 0) +
      (options.fridge ? OPTION_PRICES.fridge : 0) +
      (options.ironing ? OPTION_PRICES.ironing : 0);
    return basePrice + optionsTotal;
  };

  const total = calculateTotal();

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = Number(e.target.value);
    if (formData.date) {
      const startDate = formData.date instanceof Date ? formData.date : new Date(formData.date);
      const endDate = addHours(startDate, duration);
      setFormData(prev => ({ ...prev, duration, endDate }));
    } else {
      setFormData(prev => ({ ...prev, duration }));
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      const endDate = addHours(newDate, formData.duration);
      setFormData(prev => ({
        ...prev,
        date: newDate,
        endDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        date: null,
        endDate: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Utilisateur non authentifié.');
      return;
    }

    // Validation des dates
    if (!formData.date || !formData.endDate) {
      toast.error("Les dates ne sont pas définies.");
      return;
    }

    // Convertir les dates en objets Date si ce sont des chaînes
    const startDate = formData.date instanceof Date ? formData.date : new Date(formData.date);
    const endDate = formData.endDate instanceof Date ? formData.endDate : new Date(formData.endDate);
    console.log("Heure locale (Europe/Paris):", startDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
    console.log("Heure UTC envoyée:", startDate.toISOString());
    // Validation des heures
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();
    console.log("Heure locale (Europe/Paris):", startDate.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
    console.log("Heure UTC envoyée:", startDate.toISOString());
    if (startHour < 8 || startHour >= 17 || endHour < 8 || endHour >= 17) {
      toast.error("Les heures doivent être comprises entre 8h et 17h (heure de Paris)");
      return;
    }

    // Vérifier si la durée correspond à la différence entre les dates
    const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (Math.abs(durationInHours - formData.duration) > 0.1) { // Tolérance de 6 minutes
      toast.error("La durée ne correspond pas à la différence entre les dates de début et de fin");
      return;
    }

    try {
      const payload = {
        userId,
        packageType: plan,
        propertyType,
        duration: formData.duration,
        amount: total,
        date: new Date().toISOString(),
        dateStart: startDate.toISOString(),
        dateEnd: endDate.toISOString(),
        adress: formData.adress,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        options: {
          windows: options.windows,
          fridge: options.fridge,
          ironing: options.ironing
        },
      };

      console.log('Payload envoyé:', {
        ...payload,
        dateStart: new Date(payload.dateStart).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        dateEnd: new Date(payload.dateEnd).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      });

      if (isEditing && id) {
        console.log('Mise à jour de la réservation avec ID:', id);
        const response = await updateBooking({ id, ...payload });
        console.log('Réponse de mise à jour:', response);
        toast.success('Réservation mise à jour avec succès.');
        setHasUpdated(true);
        navigate('/mes-reservations', { state: { updated: true } });
      } else {
        try {
          const response = await createBooking(payload);
          console.log('Réponse du serveur:', response);
          toast.success('Réservation créée avec succès.');
          setHasUpdated(true);
          localStorage.setItem('bookingPayload', JSON.stringify(payload));
          navigate('/mes-reservations');
        } catch (error: any) {
          console.error('Erreur complète:', error);
          
          // Vérifier si c'est une erreur de conflit de réservation
          if (error.response?.data?.error === 'Il y a déjà une réservation pour cette période') {
            toast.error(
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-xl border border-red-200">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-red-800">Créneau déjà réservé</h3>
                    <p className="text-sm text-red-600 mt-1">
                      Le créneau que vous avez sélectionné est déjà réservé.
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-lg p-4 shadow-inner">
                  <p className="text-sm text-gray-600">
                    Créneau sélectionné : {startDate.toLocaleString('fr-FR', {
                      timeZone: 'Europe/Paris',
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })} - {endDate.toLocaleString('fr-FR', {
                      timeZone: 'Europe/Paris',
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            );
          } else {
            // Erreur générique
            toast.error(
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800">
                  Erreur lors de la création de la réservation. Veuillez réessayer.
                </p>
              </div>,
              {
                position: "top-center",
                style: {
                  background: 'transparent',
                  boxShadow: 'none'
                }
              }
            );
            console.error('Erreur détaillée:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      toast.error(
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800">
            Erreur lors de la soumission du formulaire.
          </p>
        </div>,
        {
          position: "top-center",
          style: {
            background: 'transparent',
            boxShadow: 'none'
          }
        }
      );
    }
  };

  useEffect(() => {
    // Mettre à jour endDate lorsque la date de début change
    if (formData.date && formData.duration) {
      const startDateParis = formData.date instanceof Date ? formData.date : new Date(formData.date as string);
      const newEndDate = addHours(startDateParis, formData.duration);
      setFormData(prev => ({ ...prev, endDate: newEndDate }));
    }
  }, [formData.date, formData.duration]);

  if (isEditing && isLoadingBookings) {
    return <p className="text-center">Chargement de la réservation...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-8 mb-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Modifier votre réservation' : 'Réservez un ménage'}
        </h2>

        {/* Choix du plan */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['Simple', 'Confort', 'Premium'] as const).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => handlePlanChange(type as PackageType)}
              className={`border rounded-lg px-2 py-1 text-center text-sm ${
                plan === type
                  ? 'border-teal-700 text-teal-700 font-medium'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              <div>{type}</div>
              <div className="text-xs">À partir de {BASE_PRICES[type]} €</div>
            </button>
          ))}
        </div>

        {/* Type de logement */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Type de logement
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
            disabled={isEditing} // facultatif : désactiver pendant modification
          >
            <option value="">Sélectionner</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
            <option value="Studio">Studio</option>
          </select>
        </div>

        {/* Options */}
        <div className="mb-4 space-y-2 text-sm">
          <label className="block font-medium">Options</label>
          <div>
            <input
              type="checkbox"
              name="windows"
              checked={options.windows}
              onChange={handleOptionChange}
              className="mr-2"
            />
            Nettoyage des fenêtres (+10 €)
          </div>
          <div>
            <input
              type="checkbox"
              name="fridge"
              checked={options.fridge}
              onChange={handleOptionChange}
              className="mr-2"
            />
            Réfrigérateur (+10 €)
          </div>
          <div>
            <input
              type="checkbox"
              name="ironing"
              checked={options.ironing}
              onChange={handleOptionChange}
              className="mr-2"
            />
            Repassage (+15 €)
          </div>
        </div>

        {/* Durée */}
        <div className="mb-4">
          <label htmlFor="duration" className="block font-medium">
            Durée (en heures)
          </label>
          <input
            type="number"
            id="duration"
            min={1}
            max={3}
            value={formData.duration}
            onChange={handleDurationChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Adresse */}
        <div className="mb-4">
          <label htmlFor="adress" className="block font-medium">
            Votre adresse
          </label>
          <input
            type="text"
            id="adress"
            value={formData.adress}
            onChange={(e) => setFormData({ ...formData, adress: e.target.value })}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <BookingCalendar
            formData={{
              date: formData.date,
              endDate: formData.endDate,
              duration: formData.duration,
              adress: formData.adress,
              amount: formData.amount
            }}
            setFormData={setFormData}
            isEditing={isEditing}
            editingId={id}
            onDateChange={handleDateChange}
          />
        </div>
        <div className="flex justify-between">
          <span>Date et heure (Europe/Paris)</span>
          <span>
            {formData.date instanceof Date
              ? formData.date.toLocaleString('fr-FR', {
                  timeZone: 'Europe/Paris',
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : ''}
          </span>
        </div>
        {/* Résumé */}
        <div className="bg-gray-100 rounded-lg p-3 text-sm mb-4">
          <div className="flex justify-between">
            <span>Formule</span>
            <span>{plan}</span>
          </div>
          <div className="flex justify-between">
            <span>Date et heure de début</span>
            <span>{formData.date?.toLocaleString('fr-FR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'Europe/Paris'
                })}</span>
          </div>
          <div className="flex justify-between">
            <span>Date et heure de fin</span>
            <span>{formData.endDate?.toLocaleString('fr-FR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'Europe/Paris'
                })}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{total} €</span>
          </div>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="bg-teal-700 text-white w-full py-2 rounded hover:bg-teal-800 transition"
        >
          {isEditing ? 'Mettre à jour' : 'Réserver'}
        </button>
      </form>
    </div>
  );
};
export default BookingForm;
