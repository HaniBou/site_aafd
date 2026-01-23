"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import uploadActualite from "@/lib/uploadActualite";
import getActualites from "@/lib/getActualites";
import uploadToCloudinary from "@/lib/uploadToCloudinary";
// Ajout des imports nécessaires pour la logique "À la une"
import { doc, deleteDoc, updateDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
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
  aLaUne?: boolean; // Ajouté au type
};

export default function AdminActualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [aLaUne, setALaUne] = useState(false);

  // Fonction utilitaire pour s'assurer qu'une seule actu est à la une
  const cleanOtherALaUne = async () => {
    const q = query(collection(db, "actualites"), where("aLaUne", "==", true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { aLaUne: false });
      });
      await batch.commit();
    }
  };

  const fetchActualites = async () => {
    try {
      const data = await getActualites();
      setActualites(data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useEffect(() => {
    fetchActualites();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // 1. Gérer l'exclusivité "À la une"
      if (aLaUne) {
        setMessage("🧹 Nettoyage des anciennes mises à la une...");
        await cleanOtherALaUne();
      }

      // 2. Upload Image
      let imageUrl = 'none';
      if (image) {
        setMessage("📤 Upload de l'image...");
        imageUrl = await uploadToCloudinary(image);
      }
      
      // 3. Sauvegarde Firestore
      await uploadActualite({ 
        title, 
        content, 
        category,
        date: new Date(date).toISOString(),
        image: imageUrl,
        aLaUne: aLaUne // On passe la valeur ici
      });
      
      setMessage(`Actualité ajoutée avec succès`);
      setShowToast(true);
      resetForm();
      fetchActualites();
    } catch (error) {
      setMessage("Erreur lors de l'ajout");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingActualite) return;
    setIsUploading(true);

    try {
      // 1. Si on active la une sur cette modif, on nettoie les autres
      if (editingActualite.aLaUne) {
        await cleanOtherALaUne();
      }

      let imageUrl = editingActualite.image;
      if (editImage) {
        setMessage("📤 Upload de la nouvelle image...");
        imageUrl = await uploadToCloudinary(editImage);
      }
      
      await updateDoc(doc(db, "actualites", editingActualite.id), {
        title: editingActualite.title,
        content: editingActualite.content,
        category: editingActualite.category,
        date: editingActualite.date,
        image: imageUrl,
        aLaUne: editingActualite.aLaUne || false
      });

      setEditingActualite(null);
      setMessage("Actualité modifiée avec succès");
      setShowToast(true);
      fetchActualites();
    } catch (error) {
      setMessage("Erreur lors de la modification");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setDate(new Date().toISOString().split('T')[0]);
    setImage(null);
    setALaUne(false);
    setShowAddForm(false);
  };

  const handleEditClick = (actu: Actualite) => {
    const dateForInput = actu.date ? new Date(actu.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setEditingActualite({ ...actu, date: dateForInput });
    setEditImage(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette actualité ?")) return;
    try {
      await deleteDoc(doc(db, "actualites", id));
      setActualites((prev) => prev.filter((actu) => actu.id !== id));
      setMessage("Supprimé avec succès");
      setShowToast(true);
    } catch (error) {
      setMessage("Erreur lors de la suppression");
    }
  };

  const formatDate = (date: any) => {
    return new Date(date);
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 p-8">
        <AdminHeader />
        <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />

        <div className="max-w-7xl mx-auto mb-6">
          <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors">
            + Ajouter une actualité
          </button>
        </div>

        {/* Modal d'ajout */}
        <ActualiteModal
          isOpen={showAddForm}
          onClose={resetForm}
          onSubmit={handleSubmit}
          title="Nouvelle actualité"
          titre={title} setTitre={setTitle}
          categorie={category} setCategorie={setCategory}
          contenu={content} setContenu={setContent}
          date={date} setDate={setDate}
          image={image} setImage={setImage}
          isUploading={isUploading}
          aLaUne={aLaUne} setALaUne={setALaUne}
        />

        {/* Modal de modification */}
        <ActualiteModal
          isOpen={!!editingActualite}
          onClose={() => setEditingActualite(null)}
          onSubmit={handleEditSubmit}
          title="Modifier l'actualité"
          titre={editingActualite?.title || ""}
          setTitre={(v) => editingActualite && setEditingActualite({ ...editingActualite, title: v })}
          categorie={editingActualite?.category || ""}
          setCategorie={(v) => editingActualite && setEditingActualite({ ...editingActualite, category: v })}
          contenu={editingActualite?.content || ""}
          setContenu={(v) => editingActualite && setEditingActualite({ ...editingActualite, content: v })}
          date={editingActualite?.date || ""}
          setDate={(v) => editingActualite && setEditingActualite({ ...editingActualite, date: v })}
          image={editImage} setImage={setEditImage}
          isEditing
          isUploading={isUploading}
          aLaUne={editingActualite?.aLaUne || false}
          setALaUne={(v) => editingActualite && setEditingActualite({ ...editingActualite, aLaUne: v })}
        />

        {/* Liste des cartes */}
        <div className="max-w-7xl mx-auto space-y-4">
          {actualites.map((actu) => (
            <div key={actu.id} className={`bg-white rounded-lg shadow-sm border p-6 ${actu.aLaUne ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start gap-4">
                {actu.aLaUne && <span className="absolute -top-2 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">À LA UNE</span>}
                {actu.image && actu.image !== 'none' && (
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden border shrink-0">
                    <Image src={actu.image} alt={actu.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{actu.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{formatDate(actu.date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{actu.content}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEditClick(actu)} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs">Modifier</button>
                  <button onClick={() => handleDelete(actu.id)} className="bg-red-600 text-white px-3 py-1.5 rounded text-xs">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminProtection>
  );
}