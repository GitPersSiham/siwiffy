import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

// Utiliser la clé publique Stripe depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem('currentBooking');
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking));
    } else {
      toast.error('Aucune réservation trouvée');
      navigate('/mes-reservations');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || 'Une erreur est survenue lors de la soumission du formulaire');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/mes-reservations`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Une erreur est survenue lors du paiement');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await handlePaymentSuccess();
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Session expirée');
      }

      // Mettre à jour le statut de la réservation
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'confirmed'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut de la réservation');
      }

      toast.success('Paiement effectué avec succès !');
      localStorage.removeItem('currentBooking');
      navigate('/mes-reservations', { replace: true });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du statut');
    }
  };

  if (!booking) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Paiement</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Récapitulatif de la réservation</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p><strong>Forfait:</strong> {booking.packageType}</p>
          <p><strong>Type:</strong> {booking.propertyType}</p>
          <p><strong>Date:</strong> {new Date(booking.dateStart).toLocaleDateString('fr-FR')}</p>
          <p><strong>Heure:</strong> {new Date(booking.dateStart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Montant total:</strong> {booking.amount} €</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border p-4 rounded">
          <PaymentElement />
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-2 px-4 rounded text-white font-semibold ${
            !stripe || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isProcessing ? 'Traitement en cours...' : 'Payer ' + booking.amount + ' €'}
        </button>
      </form>
    </div>
  );
};

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const paymentIntent = searchParams.get('payment_intent');
    
    if (paymentIntent && token) {
      const fetchClientSecret = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/retrieve-intent/${paymentIntent}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success && data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error('Client secret non trouvé');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du client secret:', error);
          toast.error('Erreur lors de la récupération des informations de paiement');
        }
      };
      fetchClientSecret();
    }
  }, [searchParams, navigate, isAuthenticated]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du formulaire de paiement...</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage; 