import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/soundEffects';

const NOTAS = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];

export default function Stage2({ onComplete, setDialogue, onError }) {
  const [sequencia, setSequencia] = useState([]);
  const [posicao, setPosicao] = useState(0);
  const [teclaAtiva, setTeclaAtiva] = useState(null);
  const [bloqueado, setBloqueado] = useState(true);
  const [concluido, setConcluido] = useState(false);

  const tocarNota = (nota) => {
    const audio = new Audio(`/${nota.toLowerCase()}.mp3`);
    audio.play().catch(() => {});
  };

  const gerarEExecutarSequencia = () => {
    setBloqueado(true);
    setDialogue({
      speaker: 'Outro Pai',
      avatar: '🎹',
      text: 'Preste atenção na melodia que o piano vai tocar para você...',
    });

    const novaSeq = Array.from({ length: 4 }, () =>
      NOTAS[Math.floor(Math.random() * NOTAS.length)]
    );
    setSequencia(novaSeq);
    setPosicao(0);

    novaSeq.forEach((nota, index) => {
      setTimeout(() => {
        setTeclaAtiva(nota);
        tocarNota(nota);
        setTimeout(() => setTeclaAtiva(null), 300);
      }, (index + 1) * 600);
    });

    setTimeout(() => {
      setBloqueado(false);
      setDialogue({
        speaker: 'Outro Pai',
        avatar: '🎹',
        text: 'Agora repita as notas na ordem exata!',
      });
    }, (novaSeq.length + 1) * 600);
  };

  useEffect(() => {
    gerarEExecutarSequencia();
  }, []);

  const handleNotaClick = (nota) => {
    if (bloqueado || concluido) return;

    setTeclaAtiva(nota);
    tocarNota(nota);
    setTimeout(() => setTeclaAtiva(null), 200);

    if (nota === sequencia[posicao]) {
      const proxPos = posicao + 1;
      setPosicao(proxPos);
      if (proxPos === sequencia.length) {
        setConcluido(true);
        sfx.playStageClear();
        setDialogue({
          speaker: 'Outro Pai',
          avatar: '🎹',
          text: 'Bravo! A música abriu a passagem para o teatro.',
        });
        onComplete();
      }
    } else {
      sfx.playError();
      onError();
      setDialogue({
        speaker: 'Outro Pai',
        avatar: '🎹',
        text: 'Nota errada! As mãos mecânicas vão reiniciar a melodia...',
      });
      setTimeout(gerarEExecutarSequencia, 1100);
    }
  };

  return (
    <div className="area-jogo">
      <h2>Outro Pai</h2>
      <div className="piano">
        {NOTAS.map((nota) => (
          <button
            key={nota}
            className={`tecla ${teclaAtiva === nota ? 'active' : ''}`}
            onClick={() => handleNotaClick(nota)}
          >
            {nota}
          </button>
        ))}
      </div>
    </div>
  );
}