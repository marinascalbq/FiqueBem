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
  
  // Simulação de usuário logado (deve ser substituído pelo usuário autenticado)
  const pacienteNome = localStorage.getItem("pacienteNome") || "Paciente Anônimo";

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

  // Buscar nome do terapeuta a partir do ID salvo na sessão
  const fetchNomeTerapeuta = async (terapeutaId) => {
    try {
      const terapeutaRef = doc(db, "therapists", terapeutaId);
      const terapeutaDoc = await getDoc(terapeutaRef);

      if (terapeutaDoc.exists()) {
        return terapeutaDoc.data().nome;
      } else {
        return "Terapeuta não encontrado";
      }
    } catch (error) {
      console.error("Erro ao buscar nome do terapeuta:", error);
      return "Erro ao carregar terapeuta";
    }
  };

  // Verifica se o terapeuta está disponível no horário escolhido
  const verificarDisponibilidadeTerapeuta = async () => {
    try {
      const terapeutaRef = doc(db, "therapists", terapeuta);
      const terapeutaDoc = await getDoc(terapeutaRef);

      if (terapeutaDoc.exists()) {
        const { dataInicio, dataFim, horarioInicio, horarioFim } = terapeutaDoc.data();

        const dataSelecionada = new Date(dataSessao);
        const dataInicioDisp = new Date(dataInicio);
        const dataFimDisp = new Date(dataFim);

        if (dataSelecionada < dataInicioDisp || dataSelecionada > dataFimDisp) {
          return false; // Fora do período de disponibilidade
        }

        if (horario < horarioInicio || horario > horarioFim) {
          return false; // Fora do horário de atendimento
        }

        return true;
      } else {
        return false; // Terapeuta não encontrado
      }
    } catch (error) {
      console.error("Erro ao verificar disponibilidade do terapeuta:", error);
      return false;
    }
  };

  // Função para formatar a data (YYYY-MM-DD → DD/MM/YYYY)
  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Buscar sessões do Firestore apenas do paciente logado
  const fetchSessoes = async () => {
    try {
      const q = query(collection(db, "sessao_terapia"), where("paciente", "==", pacienteNome));
      const querySnapshot = await getDocs(q);
      const sessoesList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const sessao = doc.data();
          const nomeTerapeuta = await fetchNomeTerapeuta(sessao.terapeuta);
          return {
            id: doc.id,
            ...sessao,
            terapeutaNome: nomeTerapeuta,
            dataSessao: formatarData(sessao.dataSessao),
          };
        })
      );
      setSessoesMarcadas(sessoesList);
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
      setMensagem("⚠️ Erro ao carregar as sessões agendadas.");
    }
  };

  // Verificar se a sessão já está marcada
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

  // Função para agendar sessão
  const handleAgendar = async (e) => {
    e.preventDefault();

    if (!dataSessao || !terapeuta || !horario) {
      setMensagem("⚠️ Preencha todos os campos para agendar sua sessão.");
      return;
    }

    // Verificar disponibilidade do terapeuta antes de agendar
    const disponivel = await verificarDisponibilidadeTerapeuta();
    if (!disponivel) {
      setMensagem("⚠️ O terapeuta não está disponível na data ou horário selecionado.");
      return;
    }

    const sessaoExistente = await verificarSessaoExistente();
    if (sessaoExistente) {
      setMensagem("⚠️ Já existe uma sessão agendada para este terapeuta no mesmo dia e horário.");
      return;
    }

    try {
      // Buscar nome do terapeuta antes de salvar
      const terapeutaNome = await fetchNomeTerapeuta(terapeuta);

      await addDoc(collection(db, "sessao_terapia"), {
        terapeuta,
        terapeutaNome,
        paciente: pacienteNome,
        dataSessao,
        horario,
        frequencia,
        lembrar,
      });

      setMensagem(`✅ Sessão agendada com ${terapeutaNome} para ${formatarData(dataSessao)} às ${horario}`);
    } catch (error) {
      console.error("Erro ao agendar sessão:", error);
      setMensagem("⚠️ Ocorreu um erro ao agendar a sessão.");
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
          <label>Data da Sessão:</label>
          <input type="date" onChange={(e) => setDataSessao(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Horário:</label>
          <input type="time" onChange={(e) => setHorario(e.target.value)} required />
        </div>

        <button type="submit">Agendar Sessão</button>
      </form>

      <button onClick={fetchSessoes} className="ver-sessoes-btn">Ver Sessões Agendadas</button>

      {sessoesMarcadas.length > 0 && (
        <div className="sessoes-list" style={{ marginTop: "15px" }}>
          <h3>Sessões Agendadas:</h3>
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
