import React, { useState, useEffect } from 'react';

const CAMINHOS = [
  (nome) => `/${nome}.jpg`,
  (nome) => `/${nome}.png`,
  (nome) => `/${nome}.jpeg`,
  (nome) => `/${nome}.webp`,
  (nome) => `/personagens/${nome}.jpg`,
  (nome) => `/personagens/${nome}.png`,
  (nome) => `/personagens/${nome}.jpeg`,
  (nome) => `/personagens/${nome}.webp`,
];

export default function CharacterPortrait({ speaker, size = 'normal' }) {
  const [tentativa, setTentativa] = useState(0);
  const s = speaker.toLowerCase();

  useEffect(() => {
    setTentativa(0);
  }, [speaker]);

  const getArquivoPersonagem = () => {
    if (s.includes('coraline')) return 'coraline';
    if (s.includes('gato')) return 'gato';
    if (s.includes('outra mãe') || s.includes('bela dama')) return 'outra-mae';
    if (s.includes('fantasma')) return 'fantasma';
    if (s.includes('outro pai')) return 'outro-pai';
    if (s.includes('spink') || s.includes('forcible')) return 'spink-forcible';
    if (s.includes('bobinsky')) return 'bobinsky';
    return null;
  };

  const arquivoBase = getArquivoPersonagem();
  const mostrarImagem = arquivoBase && tentativa < CAMINHOS.length;
  const tamanhoPx = size === 'large' ? 110 : 68;

  return (
    <div
      className={`vn-portrait-frame ${size}`}
      style={{
        width: `${tamanhoPx + 8}px`,
        minWidth: `${tamanhoPx + 8}px`,
        maxWidth: `${tamanhoPx + 8}px`,
        overflow: 'hidden',
      }}
    >
      {mostrarImagem ? (
        <img
          src={CAMINHOS[tentativa](arquivoBase)}
          alt={speaker}
          className="portrait-img"
          style={{
            width: `${tamanhoPx}px`,
            height: `${tamanhoPx}px`,
            objectFit: 'cover',
            borderRadius: '6px',
            display: 'block',
          }}
          onError={() => setTentativa((prev) => prev + 1)}
        />
      ) : (
        <svg
          viewBox="0 0 120 120"
          className="portrait-svg"
          style={{ width: `${tamanhoPx}px`, height: `${tamanhoPx}px` }}
        >
          <rect width="120" height="120" fill="#0c2038" />
          <circle
            cx="60"
            cy="60"
            r="38"
            fill="none"
            stroke="#38b6ff"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="60" y="72" textAnchor="middle" fontSize="42">
            🗝️
          </text>
        </svg>
      )}
    </div>
  );
}