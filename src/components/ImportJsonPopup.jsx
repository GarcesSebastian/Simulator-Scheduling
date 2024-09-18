import React, { useState, useEffect } from 'react';

const ImportJsonPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');
  const exampleJson = `[
  {
    "process": "P1",
    "colums": [
      {"key": "at", "value": 8},
      {"key": "bt", "value": 3},
      {"key": "ct", "value": 0},
      {"key": "tat", "value": 0},
      {"key": "wt", "value": 0}
    ]
  },
  {
    "process": "P2",
    "colums": [
      {"key": "at", "value": 4},
      {"key": "bt", "value": 6},
      {"key": "ct", "value": 0},
      {"key": "tat", "value": 0},
      {"key": "wt", "value": 0}
    ]
  }
]`;

  useEffect(() => {
    const importButton = document.getElementById('import-json-button');
    if (importButton) {
      importButton.addEventListener('click', () => setIsOpen(true));
    }
    return () => {
      if (importButton) {
        importButton.removeEventListener('click', () => setIsOpen(true));
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setJsonContent('');
    setError('');
  };

  const handleImport = () => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      if (Array.isArray(parsedJson) && parsedJson.every(isValidProcess)) {
        const event = new CustomEvent('dataImported', { detail: parsedJson });
        document.dispatchEvent(event);
        handleClose();
      } else {
        throw new Error('Invalid JSON structure');
      }
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const isValidProcess = (process) => {
    return (
      process.process &&
      Array.isArray(process.colums) &&
      process.colums.every(
        (col) => col.key && ['at', 'bt', 'ct', 'tat', 'wt'].includes(col.key)
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Import JSON</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="json-input">
            Paste your JSON here
          </label>
          <textarea
            id="json-input"
            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-150 ease-in-out"
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            placeholder={`Example JSON format:\n${exampleJson}`}
          />
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportJsonPopup;