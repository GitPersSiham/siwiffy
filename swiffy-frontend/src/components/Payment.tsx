import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaymentSession } from '../api/paymentApi';
import { toast } from 'react-hot-toast';

export const Payment: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<{ id: string; amount: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBooking = localStorage.getItem('currentBooking');
    if (storedBooking) {
      const booking = JSON.parse(storedBooking);
      setBookingInfo({
        id: booking.id,
        amount: booking.amount
      });
    } else {
      toast.error('Aucune réservation trouvée');
      navigate('/reservations');
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!bookingInfo) {
      toast.error('Informations de réservation manquantes');
      return;
    }

    try {
      setIsLoading(true);
      const response = await createPaymentSession(bookingInfo.id, bookingInfo.amount);
      
      if (response.success && response.clientSecret) {
        // Stocker les informations de paiement dans le localStorage
        localStorage.setItem('paymentIntent', JSON.stringify({
          clientSecret: response.clientSecret,
          bookingId: bookingInfo.id,
          amount: bookingInfo.amount
        }));
        
        // Rediriger vers la page de paiement Stripe
        window.location.href = response.url;
      } else {
        throw new Error('Erreur lors de la création de la session de paiement');
      }
    } catch (error: any) {
      console.error('Erreur lors du paiement ou de la création:', error);
      toast.error(error.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingInfo) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="mt-4">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
      >
        {isLoading ? 'Chargement...' : `Payer ${bookingInfo.amount} €`}
      </button>
    </div>
  );
};
