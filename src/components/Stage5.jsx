import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/soundEffects';

export default function Stage5({ onComplete, addOlho, onGameOver, setDialogue }) {
  const [tempo, setTempo] = useState(12);
  const [olhos, setOlhos] = useState([
    { id: 1, top: '25%', left: '20%' },
    { id: 2, top: '45%', left: '65%' },
    { id: 3, top: '62%', left: '25%' },
    { id: 4, top: '30%', left: '75%' },
    { id: 5, top: '48%', left: '42%' },
  ]);
  const [venceu, setVenceu] = useState(false);

  useEffect(() => {
    setDialogue({
      speaker: 'Outra Mãe (Bela Dama)',
      avatar: '🕷️',
      text: 'Você nunca vai escapar de mim! Destrua meus botões antes que o tempo acabe!',
    });
  }, []);

  useEffect(() => {
    if (venceu) return;
    const timer = setInterval(() => {
      setTempo((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sfx.playError();
          onGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [venceu]);

  useEffect(() => {
    if (venceu) return;
    const interval = setInterval(() => {
      setOlhos((prev) =>
        prev.map((o) => ({
          ...o,
          top: `${Math.floor(Math.random() * 48 + 22)}%`,
          left: `${Math.floor(Math.random() * 70 + 10)}%`,
        }))
      );
    }, 750);

    return () => clearInterval(interval);
  }, [venceu]);

  const handleClickOlho = (id) => {
    if (venceu) return;
    sfx.playClick();
    const restantes = olhos.filter((o) => o.id !== id);
    setOlhos(restantes);

    if (restantes.length === 0) {
      setVenceu(true);
      sfx.playCollect();
      sfx.playStageClear();
      addOlho();
      setDialogue({
        speaker: 'Gato Preto',
        avatar: '🐈‍⬛',
        text: 'Você conseguiu todos os 3 olhos! Corra para o túnel agora mesmo!',
      });
      onComplete();
    }
  };

  return (
    <div className="area-jogo">
      <h2>Outra Mãe</h2>
      <p className={`temporizador ${tempo <= 4 ? 'urgente' : ''}`}>⏳ {tempo}s</p>

      {olhos.map((olho) => (
        <div
          key={olho.id}
          className="olho-botao"
          style={{ top: olho.top, left: olho.left }}
          onClick={() => handleClickOlho(olho.id)}
        />
      ))}

      <div className="outra-mae-icon">🕷️</div>
    </div>
  );
}