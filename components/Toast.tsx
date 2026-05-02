interface ToastProps {
  message: string;
  show: boolean;
  onClose?: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  if (!show) return null;

  const normalizedMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const hasErrorKeyword = /(erreur|echec|fail|failed)/.test(normalizedMessage);
  const hasSuccessKeyword = /(succes|success|effectue|effectuee|ajoute|modifie|supprime)/.test(normalizedMessage);
  const isSuccess = hasSuccessKeyword && !hasErrorKeyword;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in-95 duration-300">
      <div className={`rounded-xl shadow-2xl p-6 flex items-center gap-4 min-w-[450px] ${
        isSuccess ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'
      }`}>
        <div className={`${isSuccess ? 'bg-green-500' : 'bg-red-500'} rounded-full p-2`}>
          {isSuccess ? (
            <svg className="h-8 w-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-8 w-8 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`text-xl font-bold ${isSuccess ? 'text-green-900' : 'text-red-900'}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-colors flex-shrink-0"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
