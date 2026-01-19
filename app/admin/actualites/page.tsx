// app/admin/actualites/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import uploadActualite from "@/lib/uploadActualite";
import getActualites from "@/lib/getActualites";
import uploadToCloudinary from "@/lib/uploadToCloudinary";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";
import ActualiteModal from "@/components/ActualiteModal";
import Toast from "@/components/Toast";

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
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Actualité");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

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
      const id = await uploadActualite({ 
        title, 
        content, 
        category, 
        image: imageUrl
      });
      
      setMessage(`Actualité ajoutée avec succès`);
      setShowToast(true);
      setTitle("");
      setContent("");
      setCategory("Actualité");
      setImage(null);
      setShowAddForm(false);
      
      // Rafraîchir la liste
      const data = await getActualites();
      setActualites(data);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "actualites", id));
      setActualites((prev) => prev.filter((actu) => actu.id !== id));
      setMessage("Actualité supprimée avec succès");
      setShowToast(true);
      console.log("Actualité supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité :", error);
      setMessage("Erreur lors de la suppression");
      setShowToast(true);
    }
  };

  const handleEditClick = (actu: Actualite) => {
    setEditingActualite({
      ...actu,
      category: actu.category || "Actualité",
      slug: actu.slug || actu.title.toLowerCase().replace(/\s+/g, "-"),
    });
    setEditImage(null);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingActualite) return;

    setIsUploading(true);
    try {
      let imageUrl = editingActualite.image;
      
      // Si une nouvelle image a été sélectionnée, l'uploader vers Cloudinary
      if (editImage) {
        setMessage("📤 Upload de la nouvelle image en cours...");
        imageUrl = await uploadToCloudinary(editImage);
      }
      
      await updateDoc(doc(db, "actualites", editingActualite.id), {
        title: editingActualite.title,
        content: editingActualite.content,
        category: editingActualite.category,
        image: imageUrl,
        date: new Date().toISOString(), // Ajout de la date de modification
      });
      setActualites((prev) =>
        prev.map((actu) =>
          actu.id === editingActualite.id ? { ...editingActualite, image: imageUrl } : actu
        )
      );
      setEditingActualite(null);
      setEditImage(null);
      setShowAddForm(false);
      setMessage("Actualité modifiée avec succès");
      setShowToast(true);
      console.log("Actualité modifiée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la modification de l'actualité :", error);
      setMessage("Erreur lors de la modification");
      setShowToast(true);
    } finally {
      setIsUploading(false);
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

        {/* Toast de notification */}
        <Toast message={message} show={showToast} />

        {/* Bouton Ajouter */}
        <div className="max-w-7xl mx-auto mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            + Ajouter une actualité
          </button>
        </div>

        {/* Modal d'ajout */}
        <ActualiteModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleSubmit}
          title="Nouvelle actualité"
          titre={title}
          setTitre={setTitle}
          contenu={content}
          setContenu={setContent}
          date={date}
          setDate={setDate}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          image={image}
          setImage={setImage}
        />

        {/* Modal de modification */}
        <ActualiteModal
          isOpen={!!editingActualite}
          onClose={() => {
            setEditingActualite(null);
            setEditImage(null);
          }}
          onSubmit={handleEditSubmit}
          title="Modifier l'actualité"
          titre={editingActualite?.title || ""}
          setTitre={(value) => editingActualite && setEditingActualite({ ...editingActualite, title: value })}
          contenu={editingActualite?.content || ""}
          setContenu={(value) => editingActualite && setEditingActualite({ ...editingActualite, content: value })}
          date={editingActualite?.date || ""}
          setDate={(value) => editingActualite && setEditingActualite({ ...editingActualite, date: value })}
          imageUrl={editingActualite?.image || ""}
          setImageUrl={() => {}}
          image={editImage}
          setImage={setEditImage}
          isEditing
        />

      {/* Liste des actualités */}
      <div className="max-w-7xl mx-auto space-y-4">
        {actualites.map((actu) => (
          <div
            key={actu.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start gap-4">
              {/* Image de l'actualité */}
              {actu.image && actu.image !== 'none' && (
                <div className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                  <Image
                    src={actu.image}
                    alt={actu.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              
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
