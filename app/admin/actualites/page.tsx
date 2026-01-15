// app/admin/actualites/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import uploadActualite from "@/lib/uploadActualite";
import getActualites from "@/lib/getActualites";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";

type Actualite = {
  id: string;
  title: string;
  date: string;
  content: string;
  category: string;
  slug: string;
  image?: string;
};

export default function AdminActualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Actualité");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const data = await getActualites();
        setActualites(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des actualités :", error);
      }
    };

    fetchActualites();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const id = await uploadActualite({ 
        title, 
        content, 
        category, 
        image: image?.name // Temporaire - à remplacer par l'URL après upload
      });
      setMessage(`✅ Actualité ajoutée avec succès (ID : ${id})`);
      setTitle("");
      setContent("");
      setCategory("Actualité");
      setImage(null);
      
      // Rafraîchir la liste
      const data = await getActualites();
      setActualites(data);
    } catch (error) {
      setMessage("❌ Erreur lors de l'ajout de l'actualité.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "actualites", id));
      setActualites((prev) => prev.filter((actu) => actu.id !== id));
      setMessage("✅ Actualité supprimée avec succès.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Actualité supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité :", error);
      setMessage("❌ Erreur lors de la suppression de l'actualité.");
    }
  };

  const handleEditClick = (actu: Actualite) => {
    setEditingActualite({
      ...actu,
      category: actu.category || "Actualité", // Valeur par défaut si non définie
      slug: actu.slug || actu.title.toLowerCase().replace(/\s+/g, "-"), // Générer un slug si absent
    });
    setShowAddForm(false); // Fermer le formulaire d'ajout si ouvert
    
    // Scroll vers le formulaire d'édition après un court délai
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingActualite) return;

    try {
      await updateDoc(doc(db, "actualites", editingActualite.id), {
        title: editingActualite.title,
        content: editingActualite.content,
        category: editingActualite.category,
        image: editingActualite.image,
        date: new Date().toISOString(), // Ajout de la date de modification
      });
      setActualites((prev) =>
        prev.map((actu) =>
          actu.id === editingActualite.id ? editingActualite : actu
        )
      );
      setEditingActualite(null);
      setMessage("✅ Actualité modifiée avec succès.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Actualité modifiée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la modification de l'actualité :", error);
      setMessage("❌ Erreur lors de la modification de l'actualité.");
    }
  };

  const formatDate = (date: any) => {
    if (date instanceof Date) return date;
    if (date?.toDate) return date.toDate();
    return new Date(date);
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 p-8">
        <AdminHeader />
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Actualités
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Publier des nouvelles et des événements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton Ajouter */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          + Ajouter une actualité
        </button>
      </div>

      {/* Formulaire d'ajout (si visible) */}
      {showAddForm && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Nouvelle actualité
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ex: Vente de plats le 15 janvier"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Contenu
                </label>
                <textarea
                  rows={6}
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Décrivez l'actualité..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Catégorie
                </label>
                <select
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Actualité">Actualité</option>
                  <option value="Événement">Événement</option>
                  <option value="Vente de plats">Vente de plats</option>
                  <option value="Témoignage">Témoignage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Image de l'actualité
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
                  Publier
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
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
          </div>
        </div>
      )}

      {/* Formulaire de modification (si une actualité est en cours d'édition) */}
      {editingActualite && (
        <div ref={editFormRef} className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm border-2 border-indigo-500 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Modifier l'actualité
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingActualite.title}
                  onChange={(e) =>
                    setEditingActualite({ ...editingActualite, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Contenu
                </label>
                <textarea
                  rows={6}
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingActualite.content}
                  onChange={(e) =>
                    setEditingActualite({ ...editingActualite, content: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Catégorie
                </label>
                <select
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={editingActualite.category}
                  onChange={(e) =>
                    setEditingActualite({ ...editingActualite, category: e.target.value })
                  }
                  required
                >
                  <option value="Actualité">Actualité</option>
                  <option value="Événement">Événement</option>
                  <option value="Vente de plats">Vente de plats</option>
                  <option value="Témoignage">Témoignage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Image de l'actualité
                </label>
                {editingActualite.image && (
                  <p className="text-xs text-gray-500 mb-2">Image actuelle : {editingActualite.image}</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  onChange={(e) =>
                    setEditingActualite({ ...editingActualite, image: e.target.files?.[0]?.name || editingActualite.image })
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
                  onClick={() => setEditingActualite(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des actualités */}
      <div className="max-w-7xl mx-auto space-y-4">
        {actualites.map((actu) => (
          <div
            key={actu.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {actu.title}
                </h3>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    {formatDate(actu.date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {actu.content}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleEditClick(actu)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(actu.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si pas d'actualités */}
      {actualites.length === 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              Aucune actualité pour le moment
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Cliquez sur "Ajouter une actualité" pour commencer
            </p>
          </div>
        </div>
      )}
      </main>
    </AdminProtection>
  );
}
