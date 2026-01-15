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

  // Grouper les réservations par plat
  const reservationsParPlat = reservations.reduce((acc, reservation) => {
    const platNom = reservation.platNom;
    if (!acc[platNom]) {
      acc[platNom] = [];
    }
    acc[platNom].push(reservation);
    return acc;
  }, {} as Record<string, Reservation[]>);

  // Calculer les totaux
  const calculerTotalPlat = (reservations: Reservation[]) => {
    return reservations.reduce((sum, r) => sum + r.quantite, 0);
  };

  const totalGeneral = reservations.reduce((sum, r) => sum + r.quantite, 0);

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
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Réservations
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {reservations.length} réservation{reservations.length > 1 ? 's' : ''} • {Object.keys(reservationsParPlat).length} plat{Object.keys(reservationsParPlat).length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                  <div className="text-xs text-indigo-600 font-medium">Total commandé</div>
                  <div className="text-2xl font-bold text-indigo-600">{totalGeneral}</div>
                </div>
              </div>
            </div>
          </div>

        {/* Réservations groupées par plat */}
        <div className="space-y-6">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Aucune réservation</p>
              <p className="text-sm text-gray-400 mt-2">Les réservations apparaîtront ici</p>
            </div>
          ) : (
            Object.entries(reservationsParPlat).map(([platNom, reservationsPlat]) => {
              const totalPlat = calculerTotalPlat(reservationsPlat);
              return (
                <div key={platNom} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* En-tête du plat */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-900">{platNom}</h2>
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-lg">
                        <span className="text-sm font-semibold">Total: {totalPlat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liste des réservations pour ce plat */}
                  <div className="divide-y divide-gray-200">
                    {reservationsPlat.map((reservation) => (
                      <div key={reservation.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-orange-50 px-2 py-0.5 rounded">
                            <span className="text-xs font-semibold text-orange-600">× {reservation.quantite}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(reservation.dateReservation)}
                          </span>
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 grid md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                              <div className="text-xs text-gray-500 mb-0.5">Client</div>
                              <div className="text-sm font-medium text-gray-900">{reservation.clientNom}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-0.5">Email</div>
                              <div className="text-sm font-medium">
                                <a href={`mailto:${reservation.clientEmail}`} className="text-indigo-600 hover:text-indigo-700">
                                  {reservation.clientEmail}
                                </a>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-0.5">Téléphone</div>
                              <div className="text-sm font-medium">
                                <a href={`tel:${reservation.clientTelephone}`} className="text-indigo-600 hover:text-indigo-700">
                                  {reservation.clientTelephone}
                                </a>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAnnuler(reservation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors shrink-0"
                          >
                            Annuler
                          </button>
                        </div>

                        {reservation.message && (
                          <div className="p-2 bg-blue-50 rounded border border-blue-200">
                            <div className="text-xs text-blue-600 font-medium mb-0.5">Message :</div>
                            <div className="text-sm text-gray-700">{reservation.message}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      </main>
    </AdminProtection>
  );
}
