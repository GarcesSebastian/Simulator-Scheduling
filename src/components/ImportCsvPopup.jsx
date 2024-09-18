import React, { useState, useEffect } from 'react';

const ImportDataPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const importButton = document.getElementById('import-csv-button');
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
    setFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleImport = () => {
    if (!file) {
      setError('Please select a CSV or TXT file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        const headers = lines[0].toLowerCase().split(',');
        const expectedHeaders = ['process', 'at', 'bt', 'ct', 'tat', 'wt\r'];

        if (!expectedHeaders.every(header => headers.includes(header))) {
          throw new Error('File headers do not match the expected format');
        }

        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].trim().split(',');
          if (values.length === headers.length) {
            const obj = {
              process: values[headers.indexOf('process')],
              colums: expectedHeaders.slice(1).map(header => ({
                key: header,
                value: parseInt(values[headers.indexOf(header)], 10) || 0
              }))
            };
            data.push(obj);
          }
        }

        if (data.length > 0) {
          const event = new CustomEvent('dataImported', { detail: data });
          document.dispatchEvent(event);
          handleClose();
        } else {
          throw new Error('No valid data found in file');
        }
      } catch (err) {
        setError(`Invalid file format: ${err.message}. Please check your file.`);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Import Data</h2>
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
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="file-upload">
            Upload CSV or TXT file
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition duration-150 ease-in-out">
            <input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">
                CSV or TXT up to 10MB
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-gray-700 font-bold mb-2">Expected CSV or TXT Format:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            process,at,bt,ct,tat,wt<br />
            P1,0,10,0,0,0<br />
            P2,1,5,0,0,0<br />
            P3,3,8,0,0,0
          </pre>
        </div>
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

export default ImportDataPopup;