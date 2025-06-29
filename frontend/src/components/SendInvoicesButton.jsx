import { useState } from 'react';
import { API_URL } from '../config.js';

export default function SendInvoicesButton() {
  const [status, setStatus] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendInvoices = async () => {
    setDisabled(true);
    setIsLoading(true);
    setStatus('Wysyłanie...');

    try {
      const res = await fetch(`${API_URL}/invoices/send-monthly`, {
        method: 'POST',
        credentials: 'include'
      });

      const json = await res.json();
      setStatus(json.message);
      if (res.status === 409) setDisabled(true); // już wysłane
    } catch (err) {
      setStatus('Błąd podczas wysyłki.');
      setDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Wysyłka faktur
          </h3>
          <p className="text-sm text-gray-600">
            Wyślij wszystkie faktury za bieżący miesiąc
          </p>
        </div>
        
        <button
          onClick={sendInvoices}
          disabled={disabled || isLoading}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wysyłanie...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Wyślij faktury
            </>
          )}
        </button>
      </div>
      
      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status.includes('Błąd') 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}
