import React from "react";

const AudiosBemEstar = () => {
  const audios = [
    { id: 1, titulo: "Meditação guiada", url: "audio1.mp3" },
    { id: 2, titulo: "Música relaxante", url: "audio2.mp3" }
  ];

  return (
    <div>
      <h2>Áudios de Bem-estar</h2>
      <ul>
        {audios.map((audio) => (
          <li key={audio.id}>
            <span>{audio.titulo}</span>
            <audio controls>
              <source src={audio.url} />
              Seu navegador não suporta áudio.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudiosBemEstar;
