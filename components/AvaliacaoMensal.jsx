import React, { useState } from "react";

const AvaliacaoMensal = () => {
  const [ansiedade, setAnsiedade] = useState("");
  const [depressao, setDepressao] = useState("");
  const [bemEstar, setBemEstar] = useState("");

  const handleSalvarAvaliacao = (e) => {
    e.preventDefault();
    alert("Avaliação salva com sucesso!");
    // Lógica para atualizar a avaliação no banco de dados
  };

  return (
    <div>
      <h2>Avaliação Mensal</h2>
      <form onSubmit={handleSalvarAvaliacao}>
        <div>
          <label>Como você tem se sentido em relação à ansiedade?</label>
          <input
            type="text"
            value={ansiedade}
            onChange={(e) => setAnsiedade(e.target.value)}
            placeholder="Descreva seu nível de ansiedade"
          />
        </div>
        <div>
          <label>Como você tem se sentido em relação à depressão?</label>
          <input
            type="text"
            value={depressao}
            onChange={(e) => setDepressao(e.target.value)}
            placeholder="Descreva seu nível de depressão"
          />
        </div>
        <div>
          <label>Como você avalia seu nível geral de bem-estar?</label>
          <input
            type="text"
            value={bemEstar}
            onChange={(e) => setBemEstar(e.target.value)}
            placeholder="Descreva seu bem-estar"
          />
        </div>
        <button type="submit">Salvar Avaliação</button>
      </form>
    </div>
  );
};

export default AvaliacaoMensal;
