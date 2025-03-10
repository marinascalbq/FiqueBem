import React, { useState } from "react";

const ChatEspecialista = () => {
  const [mensagem, setMensagem] = useState("");
  const [historicoChat, setHistoricoChat] = useState([]);

  const handleEnviarMensagem = () => {
    if (!mensagem.trim()) return; // Evita mensagens vazias

    const novaConversa = [
      ...historicoChat,
      { usuario: mensagem },  
      { especialista: "Recebemos sua mensagem! Um especialista responderá em breve." } 
    ];

    setHistoricoChat(novaConversa);
    setMensagem("");
  };

  return (
    <div>
      <h2>Chat com Especialista FiqueBem</h2>
      <div>
        {historicoChat.map((item, index) => (
          <div key={index}>
            {item.usuario && <strong>Usuário:</strong>} {item.usuario}
            {item.especialista && <p><strong>Especialista:</strong> {item.especialista}</p>}
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
