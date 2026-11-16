import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/soundEffects';

export default function Stage3({ onComplete, addOlho, setDialogue, onGameOver, onError }) {
  const [premioIndex, setPremioIndex] = useState(null);
  const [caixasAbertas, setCaixasAbertas] = useState({});
  const [vidas, setVidas] = useState(3);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    setPremioIndex(Math.floor(Math.random() * 8));
    setDialogue({
      speaker: 'Miss Spink & Forcible',
      avatar: '🍬',
      text: 'Guardamos um olho de fantasma entre essas caixas de balas antigas. Escolha com sabedoria!',
    });
  }, []);

  const handleClickCaixa = (index) => {
    if (finalizado || caixasAbertas[index]) return;

    if (index === premioIndex) {
      sfx.playCollect();
      sfx.playStageClear();
      setCaixasAbertas((prev) => ({ ...prev, [index]: '👁️' }));
      setFinalizado(true);
      addOlho();
      setDialogue({
        speaker: 'Miss Spink & Forcible',
        avatar: '🍬',
        text: 'Esplêndido! Você encontrou o segundo olho antes que o doce estragasse!',
      });
      onComplete();
    } else {
      sfx.playError();
      onError();
      const novasVidas = vidas - 1;
      setVidas(novasVidas);
      setCaixasAbertas((prev) => ({ ...prev, [index]: '🕷️' }));

      if (novasVidas <= 0) {
        setFinalizado(true);
        setDialogue({
          speaker: 'Miss Spink & Forcible',
          avatar: '🍬',
          text: 'Oh querida, suas chances acabaram... a Bela Dama encontrou você!',
        });
        setTimeout(() => onGameOver(), 1400);
      } else {
        setDialogue({
          speaker: 'Miss Spink & Forcible',
          avatar: '🍬',
          text: `Apenas aranhas aí dentro! Restam ${novasVidas} tentativa(s).`,
        });
      }
    }
  };

  return (
    <div className="area-jogo">
      <h2>Miss Spink & Miss Forcible</h2>
      <div className="vidas-container">Chances: {'❤️'.repeat(vidas)}{'🖤'.repeat(3 - vidas)}</div>

      <div className="grid-balas">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`box-bala ${finalizado || caixasAbertas[i] ? 'desativada' : ''}`}
            onClick={() => handleClickCaixa(i)}
          >
            {caixasAbertas[i] || '🎁'}
          </div>
        ))}
      </div>
    </div>
  );
}