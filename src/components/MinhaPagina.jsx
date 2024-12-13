import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDatabase } from "../DatabaseContext";
import SessaoTerapia from "./SessaoTerapia";
import ChatEspecialista from "./ChatEspecialista";
import JornadaCuidado from "./JornadaCuidado";
import ConteudosBemEstar from "./ConteudosBemEstar";
import AvaliacaoMensal from "./AvaliacaoMensal";
import ColetivaMente from "./ColetivaMente";
import AudiosBemEstar from "./AudiosBemEstar";
import ReflexaoHumor from "./ReflexaoHumor";
import "../styles/MinhaPagina.css";

const MinhaPagina = () => {
  const [nome, setNome] = useState(""); // Para armazenar o nome do usuário
  const email = localStorage.getItem("userEmail"); // Recupera o email do localStorage
  const { getUserName } = useDatabase();

  useEffect(() => {
    if (email) {
      const nomeUsuario = getUserName(email); // Pega o nome do usuário a partir do contexto
      setNome(nomeUsuario); // Atualiza o estado com o nome do usuário
    }
  }, [email, getUserName]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // Remove o e-mail do localStorage
    window.location.href = "/login"; // Redireciona para a página de login
  };

  return (
    <div className="login-container">
      {/* Menu Lateral */}
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/sessao-terapia">Sessão de Terapia</Link></li>
          <li><Link to="/chat-especialista">Chat com Especialista</Link></li>
          <li><Link to="/jornada-cuidado">Jornada de Cuidado</Link></li>
          <li><Link to="/conteudos-bem-estar">Conteúdos Personalizados</Link></li>
          <li><Link to="/avaliacao-mensal">Avaliação Mensal</Link></li>
          <li><Link to="/coletiva-mente">Encontros ColetivaMente</Link></li>
          <li><Link to="/audios-bem-estar">Áudios de Bem-estar</Link></li>
          <li><Link to="/reflexao-humor">Reflexão e Humor</Link></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </div>

      {/* Área de Conteúdo */}
      <div className="main-content">
        <header>
          <h1>Minha Página - FiqueBem</h1>
        </header>

        <main>
          {nome ? (
            <h2>Bem-vindo, <span className="user-name">{nome}</span>!</h2>
          ) : (
            <h2>Bem-vindo, Usuário não encontrado!</h2>
          )}
          <p>Aqui você pode acessar seus registros, sessões e muito mais.</p>

          {/* Navegação de Páginas */}
          <Routes>
            <Route path="/sessao-terapia" element={<SessaoTerapia />} />
            <Route path="/chat-especialista" element={<ChatEspecialista />} />
            <Route path="/jornada-cuidado" element={<JornadaCuidado />} />
            <Route path="/conteudos-bem-estar" element={<ConteudosBemEstar />} />
            <Route path="/avaliacao-mensal" element={<AvaliacaoMensal />} />
            <Route path="/coletiva-mente" element={<ColetivaMente />} />
            <Route path="/audios-bem-estar" element={<AudiosBemEstar />} />
            <Route path="/reflexao-humor" element={<ReflexaoHumor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MinhaPagina;
