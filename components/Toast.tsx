interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  if (!show) return null;

  const isSuccess = message.includes('succès');

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
      </div>
    </div>
  );
}
