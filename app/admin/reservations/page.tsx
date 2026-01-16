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
  emailEnvoye?: boolean;
  emailErreur?: string | null;
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

  const exporterCSV = () => {
    // En-têtes du CSV
    const headers = ['Plat', 'Quantité', 'Client', 'Email', 'Téléphone', 'Message', 'Date de réservation'];
    
    // Créer les lignes de données
    const lignes = reservations.map(reservation => [
      reservation.platNom,
      reservation.quantite.toString(),
      reservation.clientNom,
      reservation.clientEmail,
      reservation.clientTelephone,
      reservation.message || '',
      formatDate(reservation.dateReservation)
    ]);

    // Combiner headers et lignes
    const csvContent = [
      headers.join(','),
      ...lignes.map(ligne => 
        ligne.map(cell => 
          // Échapper les virgules et guillemets dans les cellules
          `"${cell.replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    // Créer un Blob et télécharger
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Nom du fichier avec la date actuelle
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <div className="flex items-center gap-4">
                  {reservations.length > 0 && (
                    <button
                      onClick={exporterCSV}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Télécharger CSV
                    </button>
                  )}
                  <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                    <div className="text-xs text-indigo-600 font-medium">Total commandé</div>
                    <div className="text-2xl font-bold text-indigo-600">{totalGeneral}</div>
                  </div>
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
                          {/* Indicateur d'email */}
                          {reservation.emailEnvoye === false && (
                            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded" title={reservation.emailErreur || "Email non envoyé"}>
                              <svg className="h-3 w-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="text-xs font-semibold text-yellow-700">Email non envoyé</span>
                            </div>
                          )}
                          {reservation.emailEnvoye === true && (
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
                              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-green-700">Email OK</span>
                            </div>
                          )}
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
