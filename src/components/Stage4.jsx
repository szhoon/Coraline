import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/soundEffects';

export default function Stage4({ onComplete, setDialogue, onError }) {
  const [ordem, setOrdem] = useState([]);
  const [pos, setPos] = useState(0);
  const [activeMice, setActiveMice] = useState(null);
  const [bloqueado, setBloqueado] = useState(true);
  const [concluido, setConcluido] = useState(false);

  const iniciarSequencia = () => {
    setBloqueado(true);
    setDialogue({
      speaker: 'Sr. Bobinsky',
      avatar: '🎪',
      text: 'Meus ratinhos acrobáticos vão mostrar uma coreografia secreta. Observe!',
    });

    const novaOrdem = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    setOrdem(novaOrdem);
    setPos(0);

    novaOrdem.forEach((mId, index) => {
      setTimeout(() => {
        setActiveMice(mId);
        sfx.playSqueak();
        setTimeout(() => setActiveMice(null), 300);
      }, (index + 1) * 600);
    });

    setTimeout(() => {
      setBloqueado(false);
      setDialogue({
        speaker: 'Sr. Bobinsky',
        avatar: '🎪',
        text: 'Sua vez, pequena Coraline! Clique nos ratinhos na ordem do espetáculo!',
      });
    }, (novaOrdem.length + 1) * 600);
  };

  useEffect(() => {
    iniciarSequencia();
  }, []);

  const handleClickRatinho = (id) => {
    if (bloqueado || concluido) return;

    setActiveMice(id);
    sfx.playSqueak();
    setTimeout(() => setActiveMice(null), 200);

    if (id === ordem[pos]) {
      const prox = pos + 1;
      setPos(prox);
      if (prox === ordem.length) {
        setConcluido(true);
        sfx.playStageClear();
        setDialogue({
          speaker: 'Sr. Bobinsky',
          avatar: '🎪',
          text: 'Magnífico! Os ratinhos abriram a porta para o covil da Outra Mãe!',
        });
        onComplete();
      }
    } else {
      sfx.playError();
      onError();
      setDialogue({
        speaker: 'Sr. Bobinsky',
        avatar: '🎪',
        text: 'Ops! Você trocou os passos! Os ratinhos vão repetir...',
      });
      setTimeout(iniciarSequencia, 1100);
    }
  };

  return (
    <div className="area-jogo">
      <h2>Circo dos Ratinhos</h2>
      <div className="mice-area">
        {[0, 1, 2, 3].map((id) => (
          <div
            key={id}
            className={`mice ${activeMice === id ? 'pulse' : ''}`}
            onClick={() => handleClickRatinho(id)}
          >
            🐭
          </div>
        ))}
      </div>
    </div>
  );
}