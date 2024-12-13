import React, { useState } from "react";

const ChatEspecialista = () => {
  const [mensagem, setMensagem] = useState("");
  const [historicoChat, setHistoricoChat] = useState([]);

  const handleEnviarMensagem = () => {
    setHistoricoChat([...historicoChat, { usuario: mensagem }]);
    setMensagem("");
  };

  return (
    <div>
      <h2>Chat com Especialista FiqueBem</h2>
      <div>
        {historicoChat.map((item, index) => (
          <div key={index}>
            <strong>Usuário:</strong> {item.usuario}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button onClick={handleEnviarMensagem}>Enviar</button>
    </div>
  );
};

export default ChatEspecialista;
