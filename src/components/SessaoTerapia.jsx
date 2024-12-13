import React, { useState } from "react";
import { useDatabase } from "../DatabaseContext";

const SessaoTerapia = () => {
  const [dataSessao, setDataSessao] = useState("");
  const [frequencia, setFrequencia] = useState("semanal");
  const [terapeuta, setTerapeuta] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const { therapists } = useDatabase();

  const handleAgendar = (e) => {
    e.preventDefault();
    if (!dataSessao || !terapeuta) {
      alert("Preencha todos os campos.");
      return;
    }

    alert(`Sessão agendada com ${terapeuta} para ${dataSessao}`);
    // Implementar lógica para adicionar a sessão ao banco de dados
  };

  return (
    <div>
      <h2>Agendar Sessão de Terapia Online</h2>
      <form onSubmit={handleAgendar}>
        <div>
          <label>Escolha o Terapeuta:</label>
          <select onChange={(e) => setTerapeuta(e.target.value)} required>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.name}>
                {therapist.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Data da Sessão:</label>
          <input
            type="date"
            onChange={(e) => setDataSessao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Frequência:</label>
          <select
            onChange={(e) => setFrequencia(e.target.value)}
            value={frequencia}
          >
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
          </select>
        </div>
        <div>
          <label>
            Lembrar de agendamento:
            <input
              type="checkbox"
              checked={lembrar}
              onChange={() => setLembrar(!lembrar)}
            />
          </label>
        </div>
        <button type="submit">Agendar Sessão</button>
      </form>
    </div>
  );
};

export default SessaoTerapia;
