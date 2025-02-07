import React, { useState, useEffect } from "react";

const JornadaCuidado = () => {
  const [conteudos, setConteudos] = useState([]);
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    // Lógica para carregar os conteúdos e mensagens
    setConteudos([
      "Exercício de respiração",
      "Prática de mindfulness",
      "Dicas de autocuidado"
    ]);
    setMensagens([
      "Você tem se sentido mais relaxado?",
      "Considere falar com um terapeuta se precisar de ajuda."
    ]);
  }, []);

  return (
    <div>
      <h2>Jornada de Cuidado Contínuo</h2>
      <div>
        <h3>Conteúdos Personalizados</h3>
        <ul>
          {conteudos.map((conteudo, index) => (
            <li key={index}>{conteudo}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Mensagens de Suporte</h3>
        <ul>
          {mensagens.map((mensagem, index) => (
            <li key={index}>{mensagem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JornadaCuidado;
