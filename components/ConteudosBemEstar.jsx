import React, { useState, useEffect } from "react";

const ConteudosBemEstar = () => {
  const [conteudos, setConteudos] = useState([]);

  useEffect(() => {
    // Lógica para carregar conteúdos com base nas respostas dos questionários
    setConteudos([
      "Atividade 1: Relaxamento muscular progressivo",
      "Atividade 2: Meditação guiada para redução do estresse"
    ]);
  }, []);

  return (
    <div>
      <h2>Conteúdos Personalizados de Bem-estar</h2>
      <ul>
        {conteudos.map((conteudo, index) => (
          <li key={index}>{conteudo}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConteudosBemEstar;
