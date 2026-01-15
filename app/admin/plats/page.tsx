// app/admin/plats/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import uploadPlat from "@/lib/uploadPlat";
import getPlats from "@/lib/getPlats";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";

type Plat = {
  id: string;
  nom: string;
  description: string;
  quantite: number;
  prix: number;
  image?: string;
  dateAjout: string;
};

export default function AdminPlats() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [quantite, setQuantite] = useState(0);
  const [prix, setPrix] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [editingPlat, setEditingPlat] = useState<Plat | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const data = await getPlats();
        setPlats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
      }
    };

    fetchPlats();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const id = await uploadPlat({ 
        nom, 
        description, 
        quantite: Number(quantite),
        prix: Number(prix), 
        image: image?.name // Temporaire - à remplacer par l'URL après upload
      });
      setMessage(`✅ Plat ajouté avec succès (ID : ${id})`);
      setNom("");
      setDescription("");
      setQuantite(0);
      setPrix(0);
      setImage(null);
      
      // Rafraîchir la liste
      const data = await getPlats();
      setPlats(data);
    } catch (error) {
      setMessage("❌ Erreur lors de l'ajout du plat.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "plats", id));
      setPlats((prev) => prev.filter((plat) => plat.id !== id));
      setMessage("✅ Plat supprimé avec succès.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Plat supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du plat :", error);
      setMessage("❌ Erreur lors de la suppression du plat.");
    }
  };

  const handleEditClick = (plat: Plat) => {
    setEditingPlat(plat);
    setShowAddForm(false);
    
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlat) return;

    try {
      await updateDoc(doc(db, "plats", editingPlat.id), {
        nom: editingPlat.nom,
        description: editingPlat.description,
        quantite: Number(editingPlat.quantite),
        prix: Number(editingPlat.prix),
        image: editingPlat.image,
      });
      setPlats((prev) =>
        prev.map((plat) =>
          plat.id === editingPlat.id ? editingPlat : plat
        )
      );
      setEditingPlat(null);
      setMessage("✅ Plat modifié avec succès.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Plat modifié avec succès.");
    } catch (error) {
      console.error("Erreur lors de la modification du plat :", error);
      setMessage("❌ Erreur lors de la modification du plat.");
    }
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 p-8">
        <AdminHeader />
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Vente de plats
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gérer les plats disponibles à la vente
                </p>
              </div>
              <Link
                href="/admin/reservations"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Voir les réservations
              </Link>
            </div>
          </div>
        </div>

      {/* Message de feedback */}
      {message && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <p className="text-sm text-indigo-800">{message}</p>
          </div>
        </div>
      )}

      {/* Bouton Ajouter */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          + Ajouter un plat
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Nouveau plat
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nom du plat
                </label>
                <input
                  type="text"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ex: Couscous royal"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Décrivez le plat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Quantité disponible
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ex: 20"
                  value={quantite}
                  onChange={(e) => setQuantite(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Prix (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ex: 12.50"
                  value={prix}
                  onChange={(e) => setPrix(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Image du plat
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                {image && (
                  <p className="text-xs text-gray-500 mt-1">Fichier sélectionné : {image.name}</p>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire de modification */}
      {editingPlat && (
        <div ref={editFormRef} className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm border-2 border-indigo-500 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Modifier le plat
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nom du plat
                </label>
                <input
                  type="text"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingPlat.nom}
                  onChange={(e) =>
                    setEditingPlat({ ...editingPlat, nom: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingPlat.description}
                  onChange={(e) =>
                    setEditingPlat({ ...editingPlat, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Quantité disponible
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingPlat.quantite}
                  onChange={(e) =>
                    setEditingPlat({ ...editingPlat, quantite: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Prix (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingPlat.prix || 0}
                  onChange={(e) =>
                    setEditingPlat({ ...editingPlat, prix: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Image du plat
                </label>
                {editingPlat.image && (
                  <p className="text-xs text-gray-500 mb-2">Image actuelle : {editingPlat.image}</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={(e) =>
                    setEditingPlat({ ...editingPlat, image: e.target.files?.[0]?.name || editingPlat.image })
                  }
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlat(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des plats */}
      <div className="max-w-7xl mx-auto space-y-4">
        {plats.map((plat) => (
          <div
            key={plat.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plat.nom}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {plat.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    Quantité: <strong className="text-indigo-600">{plat.quantite}</strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>
                    Prix: <strong className="text-green-600">{plat.prix}€</strong>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleEditClick(plat)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(plat.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si pas de plats */}
      {plats.length === 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              Aucun plat pour le moment
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Cliquez sur "Ajouter un plat" pour commencer
            </p>
          </div>
        </div>
      )}
      </main>
    </AdminProtection>
  );
}
             