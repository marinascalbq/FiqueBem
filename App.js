import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Home from "./components/Home";
import Registro from "./components/Registro";
import Login from "./components/Login";
import MinhaPagina from "./components/MinhaPagina";
import SessaoTerapia from "./components/SessaoTerapia";
import ChatEspecialista from "./components/ChatEspecialista";
import JornadaCuidado from "./components/JornadaCuidado";
import ConteudosBemEstar from "./components/ConteudosBemEstar";
import AvaliacaoMensal from "./components/AvaliacaoMensal";
import ColetivaMente from "./components/ColetivaMente";
import AudiosBemEstar from "./components/AudiosBemEstar";
import ReflexaoHumor from "./components/ReflexaoHumor";
import CadastrarTerapeuta from "./components/CadastrarTerapeuta";
import { DatabaseProvider } from "./DatabaseContext"; 



const App = () => {
  return (
    <DatabaseProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/minhapagina" element={<MinhaPagina />} />
        <Route path="/sessao-terapia" element={<SessaoTerapia />} />
        <Route path="/chat-especialista" element={<ChatEspecialista />} />
        <Route path="/jornada-cuidado" element={<JornadaCuidado />} />
        <Route path="/conteudos-bem-estar" element={<ConteudosBemEstar />} />
        <Route path="/avaliacao-mensal" element={<AvaliacaoMensal />} />
        <Route path="/coletiva-mente" element={<ColetivaMente />} />
        <Route path="/audios-bem-estar" element={<AudiosBemEstar />} />
        <Route path="/reflexao-humor" element={<ReflexaoHumor />} />
        <Route path="/cadastrar-terapeuta" element={<CadastrarTerapeuta />} />
      </Routes>
    </DatabaseProvider>
  );
};

export default App;
