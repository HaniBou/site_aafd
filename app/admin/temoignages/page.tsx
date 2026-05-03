"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import getTemoignages from "@/lib/getTemoignages";
import uploadTemoignage from "@/lib/uploadTemoignage";
import uploadToCloudinary from "@/lib/uploadToCloudinary";
import AdminProtection from "@/components/AdminProtection";
import AdminHeader from "@/components/AdminHeader";
import TemoignageModal from "@/components/TemoignageModal";
import Toast from "@/components/Toast";

type Temoignage = {
  id: string;
  nom: string;
  role?: string;
  type: "Famille accompagnee" | "Benevole";
  contenu: string;
  image?: string;
  date: string;
};

export default function AdminTemoignages() {
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [contenu, setContenu] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingTemoignage, setEditingTemoignage] = useState<Temoignage | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

  const fallbackThumbStyles = [
    "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-300",
    "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-300",
    "bg-gradient-to-br from-green-100 to-green-200 text-green-300",
    "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-300",
  ];

  const fetchTemoignages = async () => {
    try {
      const data = await getTemoignages();
      const sorted = data.sort((a: Temoignage, b: Temoignage) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTemoignages(sorted);
    } catch (error) {
      console.error("Erreur lors de la récupération des témoignages :", error);
    }
  };

  useEffect(() => {
    fetchTemoignages();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const resetForm = () => {
    setNom("");
    setRole("");
    setType("");
    setContenu("");
    setDate(new Date().toISOString().split("T")[0]);
    setImage(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "none";
      if (image) {
        setMessage("Upload de l'image en cours...");
        imageUrl = await uploadToCloudinary(image);
      }

      await uploadTemoignage({
        nom,
        role,
        type,
        contenu,
        date: new Date(date).toISOString(),
        image: imageUrl,
      });

      setMessage("Témoignage ajouté avec succès");
      setShowToast(true);
      resetForm();
      fetchTemoignages();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
      setShowToast(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (temoignage: Temoignage) => {
    const dateForInput = temoignage.date
      ? new Date(temoignage.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setEditingTemoignage({ ...temoignage, date: dateForInput });
    setEditImage(null);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTemoignage) return;

    setIsUploading(true);

    try {
      let imageUrl = editingTemoignage.image;

      if (editImage) {
        setMessage("Upload de la nouvelle image en cours...");
        imageUrl = await uploadToCloudinary(editImage);
      }

      await updateDoc(doc(db, "temoignages", editingTemoignage.id), {
        nom: editingTemoignage.nom,
        role: editingTemoignage.role || "",
        type: editingTemoignage.type,
        contenu: editingTemoignage.contenu,
        date: editingTemoignage.date,
        image: imageUrl,
      });

      setEditingTemoignage(null);
      setEditImage(null);
      setMessage("Témoignage modifié avec succès");
      setShowToast(true);
      fetchTemoignages();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la modification");
      setShowToast(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;

    try {
      await deleteDoc(doc(db, "temoignages", id));
      setTemoignages((prev) => prev.filter((item) => item.id !== id));
      setMessage("Témoignage supprimé avec succès");
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la suppression");
      setShowToast(true);
    }
  };

  return (
    <AdminProtection>
      <main className="min-h-screen bg-gray-50 px-4 py-6 md:p-8">
        <AdminHeader />
        <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />

        <div className="max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Témoignages</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Gérer les témoignages des familles accompagnées et des bénévoles</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-4 md:mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            + Ajouter un témoignage
          </button>
        </div>

        <TemoignageModal
          isOpen={showAddForm}
          onClose={resetForm}
          onSubmit={handleSubmit}
          title="Nouveau témoignage"
          nom={nom}
          setNom={setNom}
          role={role}
          setRole={setRole}
          type={type}
          setType={setType}
          contenu={contenu}
          setContenu={setContenu}
          date={date}
          setDate={setDate}
          image={image}
          setImage={setImage}
          isUploading={isUploading}
        />

        <TemoignageModal
          isOpen={!!editingTemoignage}
          onClose={() => setEditingTemoignage(null)}
          onSubmit={handleEditSubmit}
          title="Modifier le témoignage"
          nom={editingTemoignage?.nom || ""}
          setNom={(v) => editingTemoignage && setEditingTemoignage({ ...editingTemoignage, nom: v })}
          role={editingTemoignage?.role || ""}
          setRole={(v) => editingTemoignage && setEditingTemoignage({ ...editingTemoignage, role: v })}
          type={editingTemoignage?.type || ""}
          setType={(v) => editingTemoignage && setEditingTemoignage({ ...editingTemoignage, type: v as Temoignage["type"] })}
          contenu={editingTemoignage?.contenu || ""}
          setContenu={(v) => editingTemoignage && setEditingTemoignage({ ...editingTemoignage, contenu: v })}
          date={editingTemoignage?.date || ""}
          setDate={(v) => editingTemoignage && setEditingTemoignage({ ...editingTemoignage, date: v })}
          image={editImage}
          setImage={setEditImage}
          isEditing
          isUploading={isUploading}
        />

        <div className="max-w-7xl mx-auto space-y-3 md:space-y-4">
          {temoignages.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {item.image && item.image !== "none" && (
                  <div className="relative h-32 w-full sm:h-24 sm:w-24 rounded-lg overflow-hidden border shrink-0">
                    <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="(max-width: 640px) 100vw, 96px" />
                  </div>
                )}
                {(!item.image || item.image === "none") && (
                  <div
                    className={`relative h-32 w-full sm:h-24 sm:w-24 rounded-lg overflow-hidden border shrink-0 flex items-center justify-center ${fallbackThumbStyles[index % fallbackThumbStyles.length]}`}
                    aria-label="Image de remplacement"
                  >
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{item.nom} ({item.type})</h3>
                  {item.role && <p className="text-xs md:text-sm text-gray-600 mb-1">{item.role}</p>}
                  <p className="text-xs text-gray-500 mb-2">{new Date(item.date).toLocaleDateString("fr-FR")}</p>
                  <p className="text-xs md:text-sm text-gray-700 line-clamp-3 whitespace-pre-line">{item.contenu}</p>
                </div>

                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 sm:py-1.5 rounded text-xs transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 sm:py-1.5 rounded text-xs transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {temoignages.length === 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 text-center">
              <p className="text-sm md:text-base text-gray-500">Aucun témoignage pour le moment</p>
              <p className="text-xs md:text-sm text-gray-400 mt-2">Cliquez sur "Ajouter un témoignage" pour commencer</p>
            </div>
          </div>
        )}
      </main>
    </AdminProtection>
  );
}
