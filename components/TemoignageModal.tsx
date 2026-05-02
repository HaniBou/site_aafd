import { FormEvent, useEffect } from "react";

interface TemoignageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  title: string;
  nom: string;
  setNom: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  contenu: string;
  setContenu: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  image: File | null;
  setImage: (file: File | null) => void;
  isEditing?: boolean;
  isUploading?: boolean;
}

export default function TemoignageModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  nom,
  setNom,
  role,
  setRole,
  type,
  setType,
  contenu,
  setContenu,
  date,
  setDate,
  image,
  setImage,
  isEditing = false,
  isUploading = false,
}: TemoignageModalProps) {
  useEffect(() => {
    const floatingButton = document.getElementById("floating-don-button");
    if (isOpen && floatingButton) {
      floatingButton.style.opacity = "0";
      floatingButton.style.pointerEvents = "none";
    } else if (floatingButton) {
      floatingButton.style.opacity = "";
      floatingButton.style.pointerEvents = "";
    }

    return () => {
      if (floatingButton) {
        floatingButton.style.opacity = "";
        floatingButton.style.pointerEvents = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Sarah M."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Choisir un type</option>
              <option value="Famille accompagnee">Famille accompagnée</option>
              <option value="Benevole">Bénévole</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre (rôle)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Famille accompagnée depuis 2020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Témoignage</label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Contenu du témoignage..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEditing ? "Changer l'image (optionnel)" : "Image du témoignage (optionnel)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {image && (
              <p className="text-xs text-gray-500 mt-2">Fichier sélectionné : {image.name}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isUploading ? "Enregistrement..." : isEditing ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
