// app/admin/page.tsx
'use client';

import Link from "next/link";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";

export default function AdminHome() {
  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 p-8">
        <AdminHeader />
        
        {/* Header simple */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Gérez votre contenu et vos paramètres
            </p>
          </div>
        </div>

      {/* Boutons principaux */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/actualites"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Actualités
          </h2>
          <p className="text-sm text-gray-600">
            Publier des nouvelles et des événements
          </p>
        </Link>

        <Link
          href="/admin/plats"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Vente de plats
          </h2>
          <p className="text-sm text-gray-600">
            Gérer les plats à vendre
          </p>
        </Link>

        <Link
          href="/admin/temoignages"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Témoignages
          </h2>
          <p className="text-sm text-gray-600">
            Gérer les témoignages
          </p>
        </Link>

        <Link
          href="/admin/parametres"
          className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Paramètres
          </h2>
          <p className="text-sm text-gray-600">
            Configuration du site
          </p>
        </Link>
      </div>

      {/* Bouton retour vers le site */}
      <div className="max-w-7xl mx-auto mt-8">
        <Link
          href="/"
          className="inline-block text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
        >
          ← Retour au site
        </Link>
      </div>
      </main>
    </AdminProtection>
  );
}
