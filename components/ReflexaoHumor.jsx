import React, { useState } from "react";

const ReflexaoHumor = () => {
  const [reflexao, setReflexao] = useState("");
  const [humor, setHumor] = useState("neutro");

  const handleSalvar = () => {
    alert("Reflexão registrada com sucesso!");
    // Lógica para salvar a reflexão no banco de dados
  };

  return (
    <div>
      <h2>Reflexões e Registros de Humor</h2>
      <textarea
        value={reflexao}
        onChange={(e) => setReflexao(e.target.value)}
        placeholder="Compartilhe suas reflexões"
      />
      <div>
        <label>Como você se sente hoje?</label>
        <select onChange={(e) => setHumor(e.target.value)} value={humor}>
          <option value="neutro">Neutro</option>
          <option value="feliz">Feliz</option>
          <option value="triste">Triste</option>
        </select>
      </div>
      <button onClick={handleSalvar}>Salvar</button>
    </div>
  );
};

export default ReflexaoHumor;
