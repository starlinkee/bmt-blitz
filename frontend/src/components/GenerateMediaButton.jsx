import { useState } from 'react';
import { API_URL } from '../config.js';

export default function GenerateMediaButton() {
  const [status, setStatus] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pobierz bieżący miesiąc w formacie YYYY-MM
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const generateMediaRecords = async () => {
    setDisabled(true);
    setIsLoading(true);
    setStatus('Generowanie pozycji za media...');

    try {
      const currentMonth = getCurrentMonth();
      const res = await fetch(`${API_URL}/media/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ month: currentMonth })
      });

      const json = await res.json();
      
      if (res.ok) {
        setStatus(json.message);
        if (json.records && json.records.length > 0) {
          setStatus(`${json.message} (${json.records.length} pozycji)`);
        }
      } else {
        setStatus(json.error || 'Błąd podczas generowania pozycji.');
        setDisabled(false);
      }
    } catch (err) {
      setStatus('Błąd podczas generowania pozycji za media.');
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
            Pozycje za media
          </h3>
          <p className="text-sm text-gray-600">
            Wygeneruj pozycje za media dla bieżącego miesiąca
          </p>
        </div>
        
        <button
          onClick={generateMediaRecords}
          disabled={disabled || isLoading}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generowanie...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generuj pozycje za media
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