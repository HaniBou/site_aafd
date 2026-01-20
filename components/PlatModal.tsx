import { FormEvent, useEffect } from 'react';

interface PlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  title: string;
  nom: string;
  setNom: (value: string) => void;
  typeMenu: string;
  setTypeMenu: (value: string) => void;
  cuisiniers: string;
  setCuisiniers: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  prix: string;
  setPrix: (value: string) => void;
  quantite: string;
  setQuantite: (value: string) => void;
  image: File | null;
  setImage: (file: File | null) => void;
  isEditing?: boolean;
  isUploading?: boolean;
}

export default function PlatModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  nom,
  setNom,
  typeMenu,
  setTypeMenu,
  cuisiniers,
  setCuisiniers,
  description,
  setDescription,
  prix,
  setPrix,
  quantite,
  setQuantite,
  image,
  setImage,
  isEditing = false,
  isUploading = false
}: PlatModalProps) {
  useEffect(() => {
    const floatingButton = document.getElementById('floating-don-button');
    if (isOpen && floatingButton) {
      floatingButton.style.opacity = '0';
      floatingButton.style.pointerEvents = 'none';
    } else if (floatingButton) {
      floatingButton.style.opacity = '';
      floatingButton.style.pointerEvents = '';
    }
    return () => {
      if (floatingButton) {
        floatingButton.style.opacity = '';
        floatingButton.style.pointerEvents = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
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

        {/* Formulaire */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de menu (ex: Menu congolais)
            </label>
            <input
              type="text"
              value={typeMenu}
              onChange={(e) => setTypeMenu(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Menu congolais"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du plat
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Couscous royal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisiniers
            </label>
            <input
              type="text"
              value={cuisiniers}
              onChange={(e) => setCuisiniers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Marie, Jean ou Marie & Jean"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Couscous avec poulet, merguez et légumes de saison"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Ex: 12.50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité disponible
              </label>
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Ex: 20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEditing ? 'Changer l\'image (optionnel)' : 'Image du plat'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              required={!isEditing}
            />
            {image && (
              <p className="text-xs text-gray-500 mt-2">Fichier sélectionné : {image.name}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isUploading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Ajouter')}
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
