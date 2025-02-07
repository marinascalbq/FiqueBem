import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/SessaoTerapia.css";

const SessaoTerapia = () => {
  const [dataSessao, setDataSessao] = useState("");
  const [horario, setHorario] = useState("");
  const [terapeuta, setTerapeuta] = useState("");
  const [frequencia, setFrequencia] = useState("semanal");
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [sessoesMarcadas, setSessoesMarcadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  // Buscar lista de terapeutas
  const fetchTherapists = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "therapists"));
      const therapistsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTherapists(therapistsList);
    } catch (error) {
      console.error("Erro ao buscar terapeutas:", error);
      setMensagem("⚠️ Erro ao carregar a lista de terapeutas.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar sessões já marcadas
  const verificarSessaoExistente = async () => {
    try {
      const q = query(
        collection(db, "sessao_terapia"),
        where("terapeuta", "==", terapeuta),
        where("dataSessao", "==", dataSessao),
        where("horario", "==", horario)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Erro ao verificar sessão existente:", error);
      setMensagem("⚠️ Erro ao verificar disponibilidade.");
    }
    return false;
  };

  // Formatar a data no formato DD/MM/YYYY
  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para agendar a sessão
  const handleAgendar = async (e) => {
    e.preventDefault();

    if (!dataSessao || !terapeuta || !horario) {
      setMensagem("⚠️ Preencha todos os campos para agendar sua sessão.");
      return;
    }

    // Verifica se a sessão já existe
    const sessaoExistente = await verificarSessaoExistente();
    if (sessaoExistente) {
      setMensagem("⚠️ Já existe uma sessão agendada para este terapeuta no mesmo dia e horário.");
      return;
    }

    // Obter o nome do terapeuta pelo ID
    const terapeutaSelecionado = therapists.find((t) => t.id === terapeuta);
    const nomeTerapeuta = terapeutaSelecionado ? terapeutaSelecionado.nome : "Terapeuta desconhecido";

    try {
      await addDoc(collection(db, "sessao_terapia"), {
        terapeuta,
        dataSessao,
        horario,
        frequencia,
        lembrar,
      });

      setMensagem(`✅ Sessão agendada com ${nomeTerapeuta} para ${formatarData(dataSessao)} às ${horario}`);
    } catch (error) {
      console.error("Erro ao agendar sessão:", error);
      setMensagem("⚠️ Ocorreu um erro ao agendar a sessão.");
    }
  };

  return (
    <div className="sessao-container" style={{ marginTop: "5px" }}>
      <h2>Agendar Sessão de Terapia Online</h2>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <form onSubmit={handleAgendar}>
        <div className="form-group">
          <label>Escolha o Terapeuta:</label>
          <select onChange={(e) => setTerapeuta(e.target.value)} required>
            <option value="">Selecione um Terapeuta</option>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.nome} - {therapist.especialidade}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data da Sessão:</label>
          <input type="date" onChange={(e) => setDataSessao(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Horário:</label>
          <input type="time" onChange={(e) => setHorario(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Frequência:</label>
          <select onChange={(e) => setFrequencia(e.target.value)} value={frequencia}>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <div className="form-group">
          <label>Lembrar:</label>
          <input type="checkbox" onChange={(e) => setLembrar(e.target.checked)} />
        </div>

        <button type="submit">Agendar Sessão</button>
      </form>
    </div>
  );
};

export default SessaoTerapia;
