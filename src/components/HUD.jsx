import React from 'react';

const nomesFases = {
  1: 'Sala 1: A Visão da Pedra Verde',
  2: 'Sala 2: O Estúdio do Outro Pai',
  3: 'Sala 3: O Teatro de Spink & Forcible',
  4: 'Sala 4: O Sótão do Circo',
  5: 'Sala Final: A Teia da Bela Dama',
};

export default function HUD({ fase, olhos, muted, onToggleMute }) {
  return (
    <div className="hud">
      <div className="hud-left">
        <span className="fase-badge">Capítulo {fase}/5</span>
        <p className="info-fase">{nomesFases[fase]}</p>
      </div>

      <div className="hud-right">
        <div className="eyes-counter" title="Almas Libertadas">
          🔮 <span>{olhos} / 3</span>
        </div>
        <button
          className="btn-mute"
          onClick={onToggleMute}
          title={muted ? 'Ativar Som' : 'Silenciar'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
}