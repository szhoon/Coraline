import React, { useState } from 'react';
import { sfx } from '../utils/soundEffects';

export default function StartScreen({ onStart, muted, onToggleMute }) {
  const [modalRegras, setModalRegras] = useState(false);

  const alternarSom = () => {
    onToggleMute();
    if (muted) sfx.playClick();
  };

  return (
    <div className="vn-start-screen" style={{ justifyContent: 'flex-end' }}>
      <img src="/capa-coraline.jpg" alt="Capa Coraline" className="full-bg" />

      <div className="vn-menu-side">
        <div className="vn-title-block">
          <h1 className="vn-title">Coraline</h1>
          <div className="vn-ornament">
            <span className="vn-line" />
            <span className="vn-ornament-text">✦ O Outro Mundo ✦</span>
            <span className="vn-line" />
          </div>
        </div>

        <nav className="vn-menu-list">
          <button
            className="vn-menu-item"
            onMouseEnter={() => sfx.playClick()}
            onClick={() => {
              sfx.playClick();
              onStart();
            }}
          >
            <span className="vn-flourish">❧</span>
            <span>Novo Jogo</span>
            <span className="vn-flourish flip">❧</span>
          </button>

          <button
            className="vn-menu-item"
            onMouseEnter={() => sfx.playClick()}
            onClick={() => {
              sfx.playClick();
              setModalRegras(true);
            }}
          >
            <span className="vn-flourish">❧</span>
            <span>Como Jogar</span>
            <span className="vn-flourish flip">❧</span>
          </button>

          <button
            className="vn-menu-item"
            onMouseEnter={() => sfx.playClick()}
            onClick={alternarSom}
          >
            <span className="vn-flourish">❧</span>
            <span>Áudio: {!muted ? 'Ligado' : 'Mudo'}</span>
            <span className="vn-flourish flip">❧</span>
          </button>
        </nav>
      </div>

      <span className="vn-version">Versão 1.0</span>

      {modalRegras && (
        <div
          className="vn-modal-backdrop"
          onClick={() => {
            sfx.playClick();
            setModalRegras(false);
          }}
        >
          <div className="vn-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Como Jogar</h3>
            <p>
              Atravesse as <strong>5 salas</strong> do Outro Mundo para recuperar os{' '}
              <strong>3 olhos</strong> das crianças fantasmas e escapar antes que a Outra Mãe
              costure botões em você.
            </p>
            <p>
              Observe atentamente as melodias no piano, a dança dos ratinhos e seja rápido no
              confronto final.
            </p>
            <button
              className="btn"
              onClick={() => {
                sfx.playClick();
                setModalRegras(false);
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}