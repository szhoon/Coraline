import React from 'react';
import { sfx } from '../utils/soundEffects';

export default function EndScreen({ type, olhos, onRestart }) {
  if (type === 'WIN') {
    return (
      <div className="tela">
        <img src="/tunel-final.gif" alt="Final" className="full-bg" />
        <div className="vignette" />
        <div className="end-card win">
          <h2 className="titulo-final">Você Escapou!</h2>
          <p className="final-desc">
            A porta secreta foi trancada e a chave jogada no fundo do poço. As almas estão livres!
          </p>
          <p className="final-olhos">👁️ Olhos Recuperados: {olhos} / 3</p>
          <button
            className="btn btn-glow"
            onClick={() => {
              sfx.playClick();
              onRestart();
            }}
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tela tela-final-alt">
      <img src="/tunel-final-alternativo.gif" alt="GameOver" className="full-bg" />
      <div className="vignette" />
      <div className="end-card lose">
        <h2 className="titulo-final-alt">Presa no Outro Mundo...</h2>
        <p className="final-desc">
          Agulha e linha brilhavam na escuridão. Agora você ficará com a Outra Mãe para sempre...
        </p>
        <button
          className="btn"
          onClick={() => {
            sfx.playClick();
            onRestart();
          }}
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}