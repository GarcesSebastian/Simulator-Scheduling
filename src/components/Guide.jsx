import React, { useState } from 'react';

const SimuladorSchedulingGuia = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      title: "Selección de Algoritmo",
      description: "Usa el menú desplegable para elegir entre FCFS (First-Come, First-Served) y SJF (Shortest Job First).",
    },
    {
      title: "Número de Procesos",
      description: "Ingresa el número de procesos que deseas simular y haz clic en 'Generate Processes' para crearlos.",
    },
    {
      title: "Velocidad de Simulación",
      description: "Ajusta la velocidad de la simulación ingresando un valor entre 1 y 10 en el campo 'Velocity'.",
    },
    {
      title: "Inicio y Pausa",
      description: "Utiliza el botón 'Start' para iniciar la simulación. Durante la ejecución, este botón se convierte en 'Pause' para permitirte detener temporalmente la simulación.",
    },
    {
      title: "Reinicio",
      description: "El botón 'Reset' te permite volver al estado inicial, borrando todos los datos y deteniendo la simulación en curso.",
    },
    {
      title: "Edición de Datos",
      description: "Haz doble clic en cualquier celda de la tabla para editar los valores de los procesos manualmente.",
    },
    {
      title: "Seguimiento del Progreso",
      description: "Observa la sección de 'Log' para ver el progreso detallado de la simulación en tiempo real.",
    },
    {
      title: "Importar JSON",
      description: "Usa la función 'Import JSON' para cargar datos de procesos desde un archivo JSON. Asegúrate de que el formato coincida con el ejemplo proporcionado.",
    },
    {
      title: "Importar CSV o Texto",
      description: "Utiliza la función 'Import CSV or Text' para cargar datos desde un archivo CSV o de texto. El archivo debe tener encabezados y seguir el formato especificado.",
    },
  ];

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev < tips.length - 1 ? prev + 1 : 0));
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev > 0 ? prev - 1 : tips.length - 1));
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center col-span-2">
      <button
        onClick={togglePopup}
        className="bg-green-500 w-full max-w-md text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Guía del Simulador
      </button>

      {isOpen && (
        <div className="fixed px-2 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-slate-400">Guía del Simulador de Scheduling</h2>
            
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">ℹ️</span>
                <div>
                  <h3 className="font-bold">Consejo {currentTip + 1} de {tips.length}</h3>
                  <h4 className="font-semibold">{tips[currentTip].title}</h4>
                  <p>{tips[currentTip].description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between max-[300px]:flex-col max-[300px]:gap-y-2">
              <button
                onClick={prevTip}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Anterior
              </button>
              <button
                onClick={nextTip}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimuladorSchedulingGuia;