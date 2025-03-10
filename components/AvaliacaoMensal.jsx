import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AvaliacaoMensal = () => {
  const [ansiedade, setAnsiedade] = useState("");
  const [depressao, setDepressao] = useState("");
  const [bemEstar, setBemEstar] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [avaliacaoSalva, setAvaliacaoSalva] = useState(null);
  const [avaliacoesAnteriores, setAvaliacoesAnteriores] = useState([]);
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false);

  // Simulação do usuário logado (substituir por autenticação real)
  const usuarioLogado = localStorage.getItem("userEmail") || "paciente@email.com";

  const formatarData = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString("pt-BR");
  };

  // Função para salvar uma nova avaliação
  const handleSalvarAvaliacao = async (e) => {
    e.preventDefault();

    if (!ansiedade || !depressao || !bemEstar) {
      setMensagem("⚠️ Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const avaliacao = {
        paciente: usuarioLogado,
        ansiedade,
        depressao,
        bemEstar,
        data: formatarData(),
      };

      await addDoc(collection(db, "avaliacoes_mensais"), avaliacao);

      setAvaliacaoSalva(avaliacao);
      setMensagem("Avaliação salva com sucesso");

      // Limpa os campos após salvar
      setAnsiedade("");
      setDepressao("");
      setBemEstar("");
    } catch (error) {
      console.error("❌ Erro ao salvar avaliação:", error);
      setMensagem(`⚠️ Ocorreu um erro ao salvar sua avaliação. Erro: ${error.message}`);
    }
  };

  // Função para buscar avaliações anteriores do paciente logado
  const fetchAvaliacoes = async () => {
    try {
      const q = query(collection(db, "avaliacoes_mensais"), where("paciente", "==", usuarioLogado));
      const querySnapshot = await getDocs(q);

      const listaAvaliacoes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAvaliacoesAnteriores(listaAvaliacoes);
      setMostrarAvaliacoes(true);
    } catch (error) {
      console.error("❌ Erro ao buscar avaliações:", error);
      setMensagem("⚠️ Erro ao carregar avaliações anteriores.");
    }
  };

  return (
    <div>
      <h2>Avaliação Mensal</h2>
      {mensagem && <p>{mensagem}</p>}

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

      {/* Exibe os dados salvos após o envio bem-sucedido */}
      {avaliacaoSalva && (
        <div>
          <h3>Resumo da Avaliação</h3>
          <p>📅 <strong>Data:</strong> {avaliacaoSalva.data}</p>
          <p>👤 <strong>Paciente:</strong> {avaliacaoSalva.paciente}</p>
          <p>😟 <strong>Ansiedade:</strong> {avaliacaoSalva.ansiedade}</p>
          <p>😔 <strong>Depressão:</strong> {avaliacaoSalva.depressao}</p>
          <p>😊 <strong>Bem-estar:</strong> {avaliacaoSalva.bemEstar}</p>
        </div>
      )}

      {/* Botão para carregar avaliações anteriores */}
      <button onClick={fetchAvaliacoes} style={{ marginTop: "10px" }}>
        Ver Avaliações Anteriores
      </button>

      {/* Exibe a lista de avaliações anteriores */}
      {mostrarAvaliacoes && avaliacoesAnteriores.length > 0 && (
        <div>
          <h3>Suas Avaliações Anteriores</h3>
          <ul>
            {avaliacoesAnteriores.map((avaliacao) => (
              <li key={avaliacao.id}>
                <p>📅 <strong>Data:</strong> {avaliacao.data}</p>
                <p>😟 <strong>Ansiedade:</strong> {avaliacao.ansiedade}</p>
                <p>😔 <strong>Depressão:</strong> {avaliacao.depressao}</p>
                <p>😊 <strong>Bem-estar:</strong> {avaliacao.bemEstar}</p>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}

      {mostrarAvaliacoes && avaliacoesAnteriores.length === 0 && (
        <p>⚠️ Nenhuma avaliação anterior encontrada.</p>
      )}
    </div>
  );
};

export default AvaliacaoMensal;
