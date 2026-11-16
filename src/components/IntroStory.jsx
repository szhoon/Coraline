import React, { useState, useEffect } from 'react';
import CharacterPortrait from './CharacterPortrait';
import { sfx } from '../utils/soundEffects';

const CENAS_INTRO = [
  {
    speaker: 'Narrador',
    mood: 'mysterious',
    texto: 'Atrás do papel de parede da sala, uma pequena porta trancada revelou um túnel azulado e hipnotizante...',
  },
  {
    speaker: 'Coraline',
    mood: 'surprised',
    texto: 'Tudo aqui parece perfeito... mas por que todos têm botões negros costurados no lugar dos olhos?',
  },
  {
    speaker: 'Gato Preto',
    mood: 'smug',
    texto: 'É uma armadilha, garota. A Bela Dama escondeu as almas de três crianças fantasmas. Use a pedra verde para encontrar os olhos delas!',
  },
  {
    speaker: 'Coraline',
    mood: 'scared',
    texto: 'Eu preciso salvar eles e voltar para casa antes que ela tente costurar botões em mim!',
  },
];

export default function IntroStory({ onFinishIntro }) {
  const [indice, setIndice] = useState(0);
  const [textoExibido, setTextoExibido] = useState('');

  const cenaAtual = CENAS_INTRO[indice];

  useEffect(() => {
    setTextoExibido('');
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      setTextoExibido(cenaAtual.texto.slice(0, i));
      if (i >= cenaAtual.texto.length) {
        clearInterval(intervalo);
      }
    }, 24);

    return () => clearInterval(intervalo);
  }, [indice]);

  const avancarCena = () => {
    sfx.playClick();
    if (textoExibido.length < cenaAtual.texto.length) {
      setTextoExibido(cenaAtual.texto);
      return;
    }

    if (indice < CENAS_INTRO.length - 1) {
      setIndice((prev) => prev + 1);
    } else {
      onFinishIntro();
    }
  };

  return (
    <div className="tela intro-screen">
      <img src="/capa-coraline.jpg" alt="Fundo" className="full-bg intro-bg-blur" />
      <div className="vignette" />

      <div className="intro-card">
        <div className="intro-header">
          <CharacterPortrait
            speaker={cenaAtual.speaker}
            mood={cenaAtual.mood}
            size="large"
          />
          <div className="intro-dialogue-area">
            <h3 className="intro-speaker">{cenaAtual.speaker}</h3>
            <p className="intro-text">{textoExibido}</p>
          </div>
        </div>

        <div className="intro-actions">
          <button
            className="btn-skip"
            onClick={() => {
              sfx.playClick();
              onFinishIntro();
            }}
          >
            Pular Intro
          </button>

          <button className="btn" onClick={avancarCena}>
            {indice < CENAS_INTRO.length - 1 ? 'Continuar ➔' : 'Entrar no Outro Mundo'}
          </button>
        </div>
      </div>
    </div>
  );
}