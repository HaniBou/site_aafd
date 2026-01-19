// app/admin/plats/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import uploadPlat from "@/lib/uploadPlat";
import getPlats from "@/lib/getPlats";
import uploadToCloudinary from "@/lib/uploadToCloudinary";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";
import PlatModal from "@/components/PlatModal";
import Toast from "@/components/Toast";

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
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPlat, setEditingPlat] = useState<Plat | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

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

  // Auto-fermer le toast après 6 secondes
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsUploading(true);

    try {
      let imageUrl = 'none';
      
      // Upload l'image vers Cloudinary si elle existe
      if (image) {
        setMessage("📤 Upload de l'image en cours...");
        imageUrl = await uploadToCloudinary(image);
      }
      
      // Ensuite sauvegarde dans Firestore avec l'URL de l'image
      const id = await uploadPlat({ 
        nom, 
        description, 
        quantite: Number(quantite),
        prix: Number(prix), 
        image: imageUrl
      });
      
      setMessage(`Plat ajouté avec succès`);
      setShowToast(true);
      setNom("");
      setDescription("");
      setQuantite("");
      setPrix("");
      setImage(null);
      setShowAddForm(false);
      
      // Rafraîchir la liste
      const data = await getPlats();
      setPlats(data);
    } catch (error: any) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
      setShowToast(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "plats", id));
      setPlats((prev) => prev.filter((plat) => plat.id !== id));
      setMessage("Plat supprimé avec succès");
      setShowToast(true);
      console.log("Plat supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du plat :", error);
      setMessage("Erreur lors de la suppression");
      setShowToast(true);
    }
  };

  const handleEditClick = (plat: Plat) => {
    setEditingPlat(plat);
    setEditImage(null);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlat) return;

    setIsUploading(true);
    try {
      let imageUrl = editingPlat.image;
      
      // Si une nouvelle image a été sélectionnée, l'uploader vers Cloudinary
      if (editImage) {
        setMessage("📤 Upload de la nouvelle image en cours...");
        imageUrl = await uploadToCloudinary(editImage);
      }
      
      await updateDoc(doc(db, "plats", editingPlat.id), {
        nom: editingPlat.nom,
        description: editingPlat.description,
        quantite: Number(editingPlat.quantite),
        prix: Number(editingPlat.prix),
        image: imageUrl,
      });
      setPlats((prev) =>
        prev.map((plat) =>
          plat.id === editingPlat.id ? { ...editingPlat, image: imageUrl } : plat
        )
      );
      setEditingPlat(null);
      setEditImage(null);
      setShowAddForm(false);
      setMessage("Plat modifié avec succès");
      setShowToast(true);
      console.log("Plat modifié avec succès.");
    } catch (error) {
      console.error("Erreur lors de la modification du plat :", error);
      setMessage("Erreur lors de la modification");
      setShowToast(true);
    } finally {
      setIsUploading(false);
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

      {/* Toast de notification */}
      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />

      {/* Bouton Ajouter */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          + Ajouter un plat
        </button>
      </div>

      {/* Modal d'ajout */}
      <PlatModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleSubmit}
        title="Nouveau plat"
        nom={nom}
        setNom={setNom}
        description={description}
        setDescription={setDescription}
        prix={prix}
        setPrix={setPrix}
        quantite={quantite}
        setQuantite={setQuantite}
        image={image}
        setImage={setImage}
        isUploading={isUploading}
      />

      {/* Modal de modification */}
      <PlatModal
        isOpen={!!editingPlat}
        onClose={() => {
          setEditingPlat(null);
          setEditImage(null);
        }}
        onSubmit={handleEditSubmit}
        title="Modifier le plat"
        nom={editingPlat?.nom || ""}
        setNom={(value) => editingPlat && setEditingPlat({ ...editingPlat, nom: value })}
        description={editingPlat?.description || ""}
        setDescription={(value) => editingPlat && setEditingPlat({ ...editingPlat, description: value })}
        prix={String(editingPlat?.prix || "")}
        setPrix={(value) => editingPlat && setEditingPlat({ ...editingPlat, prix: Number(value) })}
        quantite={String(editingPlat?.quantite || "")}
        setQuantite={(value) => editingPlat && setEditingPlat({ ...editingPlat, quantite: Number(value) })}
        image={editImage}
        setImage={setEditImage}
        isEditing
        isUploading={isUploading}
      />

      {/* Liste des plats */}
      <div className="max-w-7xl mx-auto space-y-4">
        {plats.map((plat) => (
          <div
            key={plat.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start gap-4">
              {/* Image du plat */}
              {plat.image && plat.image !== 'none' && (
                <div className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                  <Image
                    src={plat.image}
                    alt={plat.nom}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plat.nom}
                </h3>
                <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
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
             