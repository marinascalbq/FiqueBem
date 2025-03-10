import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where, doc, getDoc } from "firebase/firestore";
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

  const usuarioLogado = localStorage.getItem("userEmail") || "paciente@email.com";  

  useEffect(() => {
    fetchTherapists();
  }, []);

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
      setMensagem("Erro ao carregar a lista de terapeutas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalhesTerapeuta = async (terapeutaId) => {
    try {
      const terapeutaRef = doc(db, "therapists", terapeutaId);
      const terapeutaDoc = await getDoc(terapeutaRef);

      if (terapeutaDoc.exists()) {
        return terapeutaDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do terapeuta:", error);
      return null;
    }
  };

  const verificarDisponibilidadeTerapeuta = async () => {
    try {
      const terapeutaDetalhes = await fetchDetalhesTerapeuta(terapeuta);
      if (!terapeutaDetalhes) {
        setMensagem("Terapeuta não encontrado.");
        return false;
      }

      const { dataInicio, dataFim, horarioInicio, horarioFim } = terapeutaDetalhes;

      if (dataSessao < dataInicio || dataSessao > dataFim) {
        setMensagem("O terapeuta não está disponível nesta data.");
        return false;
      }

      if (horario < horarioInicio || horario > horarioFim) {
        setMensagem("O terapeuta não atende neste horário.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade do terapeuta:", error);
      setMensagem("Erro ao verificar disponibilidade do terapeuta.");
      return false;
    }
  };

  const verificarSessaoExistente = async () => {
    try {
      const q = query(
        collection(db, "sessao_terapia"),
        where("terapeuta", "==", terapeuta),
        where("paciente", "==", usuarioLogado),
        where("dataSessao", "==", dataSessao),
        where("horario", "==", horario)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Erro ao verificar sessão existente:", error);
      setMensagem("Erro ao verificar disponibilidade.");
    }
    return false;
  };

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const fetchSessoes = async () => {
    try {
      const q = query(collection(db, "sessao_terapia"), where("paciente", "==", usuarioLogado));
      const querySnapshot = await getDocs(q);

      const sessoesList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const sessao = doc.data();
          const nomeTerapeuta = await fetchDetalhesTerapeuta(sessao.terapeuta);
          return {
            id: doc.id,
            ...sessao,
            terapeutaNome: nomeTerapeuta ? nomeTerapeuta.nome : "Terapeuta não encontrado",
            dataSessao: formatarData(sessao.dataSessao),
          };
        })
      );

      setSessoesMarcadas(sessoesList);
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
      setMensagem("Erro ao carregar as sessões agendadas.");
    }
  };

  const handleAgendar = async (e) => {
    e.preventDefault();

    if (!dataSessao || !terapeuta || !horario) {
      setMensagem("Preencha todos os campos para agendar sua sessão.");
      return;
    }

    const disponibilidade = await verificarDisponibilidadeTerapeuta();
    if (!disponibilidade) {
      return;
    }

    const sessaoExistente = await verificarSessaoExistente();
    if (sessaoExistente) {
      setMensagem("Você já tem uma sessão agendada com este terapeuta neste horário.");
      return;
    }

    try {
      const terapeutaDetalhes = await fetchDetalhesTerapeuta(terapeuta);
      if (!terapeutaDetalhes) {
        setMensagem("Ocorreu um erro ao buscar informações do terapeuta.");
        return;
      }

      await addDoc(collection(db, "sessao_terapia"), {
        paciente: usuarioLogado,
        terapeuta,
        terapeutaNome: terapeutaDetalhes.nome,
        dataSessao,
        horario,
        frequencia,
        lembrar,
      });

      setMensagem(`Sessão agendada com ${terapeutaDetalhes.nome} para ${formatarData(dataSessao)} às ${horario}`);
    } catch (error) {
      console.error("Erro ao agendar sessão:", error);
      setMensagem("Ocorreu um erro ao agendar a sessão.");
    }
  };

  return (
    <div className="sessao-container">
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
            <label htmlFor="dataSessao">Data da Sessão:</label>
            <input type="date" onChange={(e) => setDataSessao(e.target.value)} required />
          </div>

        <div className="form-group">
          <label>Horário:</label>
          <input type="time" onChange={(e) => setHorario(e.target.value)} required />
        </div>

        <button type="submit">Agendar Sessão</button>
      </form>

      <button onClick={fetchSessoes} className="ver-sessoes-btn">Ver Minhas Sessões</button>

      {sessoesMarcadas.length > 0 && (
        <div className="sessoes-list">
          <h3>Minhas Sessões Agendadas:</h3>
          <ul>
            {sessoesMarcadas.map((sessao) => (
              <li key={sessao.id}>
                📅 {sessao.dataSessao} ⏰ {sessao.horario} <br />
                👨‍⚕️ Terapeuta: {sessao.terapeutaNome} <br />
                🔁 Frequência: {sessao.frequencia}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SessaoTerapia;
