import React, { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import { useNavigate } from 'react-router-dom';
import { useBookingsByUserId } from '@/hooks/useBookingByUserId';
import { useAuthStore } from '@/store/useAuthStore';
import { useDeleteBooking } from '@/hooks/useDeleteBooking';
import { toast } from 'react-hot-toast';
import { createPaymentSession } from '../api/paymentApi';
import { Booking } from '@/types';
import { useBookingUpdateStore } from '@/store/useBookingUpdateStore';

const BookingList: React.FC = () => {
  const { mutate: deleteBookingMutation } = useDeleteBooking();
  const { isAuthenticated } = useAuthStore();
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const { hasUpdated, setHasUpdated } = useBookingUpdateStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
  } = useBookingsByUserId(userId || '');

  useEffect(() => {
    console.log('BookingList - État actuel:', {
      isAuthenticated,
      userId,
      isLoading,
      isError,
      error,
      bookings
    });

    // Vérifier si nous avons un token valide
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      console.log('Redirection vers login - Pas de token ou userId');
      navigate('/login', { state: { from: '/mes-reservations' } });
      return;
    }

    if (hasUpdated) {
      console.log('Mise à jour des réservations');
      refetch();
      setHasUpdated(false);
    }
  }, [navigate, hasUpdated, refetch, setHasUpdated, userId, isLoading, isError, error, bookings]);

  const handlePayment = async (booking: any) => {
    try {
      // Sauvegarder les informations d'authentification
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      localStorage.setItem('currentBooking', JSON.stringify({
        id: booking.id,
        amount: booking.amount,
        dateStart: booking.dateStart,
        dateEnd: booking.dateEnd,
        packageType: booking.packageType,
        propertyType: booking.propertyType,
        options: booking.options
      }));

      const response = await createPaymentSession(booking.id, booking.amount);
      
      if (response.success && response.url) {
        // Restaurer les informations d'authentification
        if (token) localStorage.setItem('token', token);
        if (userId) localStorage.setItem('userId', userId);
        
        // Extraire l'ID de l'intention de paiement de l'URL
        const paymentIntentId = response.url.split('payment_intent=')[1];
        if (paymentIntentId) {
          // Rediriger vers la page de paiement avec l'ID de l'intention
          navigate(`/payment?payment_intent=${paymentIntentId}`);
        } else {
          throw new Error('ID de paiement non trouvé dans l\'URL');
        }
      } else {
        throw new Error('Erreur lors de la création de la session de paiement');
      }
    } catch (error: any) {
      console.error('Erreur lors du paiement:', error);
      toast.error(error.message || 'Une erreur est survenue lors du paiement');
    }
  };

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;
    
    try {
      await deleteBookingMutation(bookingToDelete.id);
      toast.success('Réservation supprimée avec succès');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la suppression de la réservation');
    } finally {
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  if (!isAuthenticated || !userId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-2">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('Erreur dans BookingList:', error);
    return (
      <div className="container mx-auto py-8 px-2">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Erreur lors du chargement des réservations</p>
          <p className="text-sm">{error?.message || 'Une erreur inattendue est survenue'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="container mx-auto py-8 px-2">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Liste de vos réservations
        </h1>
        <div className="text-center text-gray-600">
          Aucune réservation trouvée pour cet utilisateur.
          <div className="mt-4">
            <button
              onClick={() => navigate('/reservation')}
              className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors duration-200"
            >
              Créer une réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Liste de vos réservations
      </h1>
      <div className="flex justify-start mb-4">
        <button
          onClick={() => navigate('/nouvelle-reservation')}
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span>
          Créer une nouvelle réservation
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forfait
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de début
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de fin
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {booking.packageType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {new Date(booking.dateStart).toLocaleString('fr-FR', {
                    timeZone: 'Europe/Paris',
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {new Date(booking.dateEnd).toLocaleString('fr-FR', {
                    timeZone: 'Europe/Paris',
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {booking.propertyType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">
                  {booking.adress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {booking.amount} €
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  <ul className="list-disc list-inside space-y-1">
                    {booking.options?.windows && <li>Nettoyage des fenêtres (+10 €)</li>}
                    {booking.options?.fridge && <li>Réfrigérateur (+10 €)</li>}
                    {booking.options?.ironing && <li>Repassage (+15 €)</li>}
                    {!booking.options?.windows && !booking.options?.fridge && !booking.options?.ironing && 
                      <li>Aucune option sélectionnée</li>}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'confirmed' 
                      ? 'Confirmée'
                      : booking.status === 'cancelled'
                      ? 'Annulée'
                      : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                    >
                      Payer
                    </button>
                  )}
                  {booking.status !== 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleDeleteClick(booking)}
                        className="border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors duration-200"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => navigate(`/modifier-reservation/${booking.id}`)}
                        className="bg-teal-700 text-white px-3 py-1 rounded hover:bg-teal-800 transition-colors duration-200"
                      >
                        Modifier
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && bookingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer la réservation du {new Date(bookingToDelete.dateStart).toLocaleDateString('fr-FR')} à {new Date(bookingToDelete.dateStart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
