"use client";

import { useState, useEffect } from "react";
import getReservations from "@/lib/getReservations";
import annulerReservation from "@/lib/annulerReservation";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";

type Reservation = {
  id: string;
  platNom: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  quantite: number;
  message: string;
  dateReservation: any;
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnuler = async (id: string) => {
    if (!confirm("Annuler cette réservation ? La quantité sera remise en stock.")) return;
    try {
      await annulerReservation(id);
      fetchReservations();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'annulation");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          
          {/* En-tête */}
          <div className="mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Réservations
              </h1>
              <p className="text-sm text-gray-600">
                {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

        {/* Liste des réservations */}
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Aucune réservation</p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {reservation.platNom}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(reservation.dateReservation)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        × {reservation.quantite}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Client</div>
                      <div className="font-semibold">{reservation.clientNom}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email</div>
                      <div className="font-semibold">
                        <a href={`mailto:${reservation.clientEmail}`} className="text-orange-600 hover:underline">
                          {reservation.clientEmail}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Téléphone</div>
                      <div className="font-semibold">
                        <a href={`tel:${reservation.clientTelephone}`} className="text-orange-600 hover:underline">
                          {reservation.clientTelephone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {reservation.message && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-600 font-semibold mb-1">Message :</div>
                      <div className="text-sm text-gray-700">{reservation.message}</div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleAnnuler(reservation.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Annuler la réservation
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </main>
    </AdminProtection>
  );
}
