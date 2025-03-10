import React, { useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/SessaoTerapia.css";

const CadastrarTerapeuta = () => {
  // Definindo os estados para os campos de dados do terapeuta
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [mensagem, setMensagem] = useState(''); // Estado para as mensagens de retorno

  // Função para verificar se o terapeuta já existe
  const verificarTerapeutaExistente = async () => {
    try {
      const q = query(
        collection(db, "therapists"),
        where("nome", "==", nome),
        where("especialidade", "==", especialidade)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0; // Se existir algum terapeuta com o mesmo nome e especialidade
    } catch (error) {
      console.error("Erro ao verificar terapeuta existente:", error);
      setMensagem("⚠️ Ocorreu um erro ao verificar o terapeuta.");
    }
    return false;
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();

    // Validação simples de campos obrigatórios
    if (!nome || !especialidade || !dataInicio || !dataFim || !horarioInicio || !horarioFim) {
      setMensagem('⚠️ Todos os campos são obrigatórios!');
      return;
    }

    // Verifica se o terapeuta já existe
    const terapeutaExistente = await verificarTerapeutaExistente();
    if (terapeutaExistente) {
      setMensagem('⚠️ Já existe um terapeuta com esse nome e especialidade.');
      return;
    }

    // Lógica para adicionar os dados no Firestore
    try {
      // Adicionando o novo terapeuta ao Firestore
      await addDoc(collection(db, "therapists"), {
        nome,
        especialidade,
        dataInicio,
        dataFim,
        horarioInicio,
        horarioFim,
      });

      // Sucesso: terapeuta cadastrado
      setMensagem('✅ Terapeuta cadastrado com sucesso!');
      
      // Resetando os campos após o envio
      setNome('');
      setEspecialidade('');
      setDataInicio('');
      setDataFim('');
      setHorarioInicio('');
      setHorarioFim('');
    } catch (error) {
      // Erro ao tentar cadastrar o terapeuta
      console.error("Erro ao cadastrar terapeuta:", error);
      setMensagem('⚠️ Ocorreu um erro ao cadastrar o terapeuta. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Terapeuta</h2>
      <form onSubmit={handleCadastrar}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Exemplo: Dra Maria Silva"
            required
          />
        </div>

        <div className="form-group">
          <label>Especialidade:</label>
          <input
            type="text"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            placeholder="Exemplo: Psicologia Clinica"
            required
          />
        </div>

        <div className="form-group">
          <label>Data de disponíveis de:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>até:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Horário de Início:</label>
          <input
            type="time"
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Horário de Fim:</label>
          <input
            type="time"
            value={horarioFim}
            onChange={(e) => setHorarioFim(e.target.value)}
            required
          />
        </div>

        <button type="submit">Cadastrar Terapeuta</button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
};

export default CadastrarTerapeuta;