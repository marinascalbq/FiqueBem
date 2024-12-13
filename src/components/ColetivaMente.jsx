import React, { useState, useEffect } from "react";

const ColetivaMente = () => {
  const [encontros, setEncontros] = useState([]);

  useEffect(() => {
    // Lógica para carregar eventos
    setEncontros([
      { id: 1, tema: "Bem-estar no trabalho", data: "2024-12-20" },
      { id: 2, tema: "Técnicas de relaxamento", data: "2024-12-25" }
    ]);
  }, []);

  const handleInscricao = (id) => {
    alert(`Inscrito no encontro ${id}`);
    // Lógica para inscrever o usuário no evento
  };

  return (
    <div>
      <h2>Encontros ColetivaMente</h2>
      <ul>
        {encontros.map((encontro) => (
          <li key={encontro.id}>
            <span>{encontro.tema} - {encontro.data}</span>
            <button onClick={() => handleInscricao(encontro.id)}>Inscrever-se</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColetivaMente;
