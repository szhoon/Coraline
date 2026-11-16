import React, { useState, useRef } from 'react';
import { sfx } from '../utils/soundEffects';

const OLHOS_INICIAIS = [
  { id: 'star', nome: 'Bolinha de Gude Estrela', top: 32, left: 22 },
  { id: 'gear', nome: 'Esfera de Câmbio', top: 65, left: 74 },
  { id: 'pearl', nome: 'Anel de Pérola', top: 44, left: 48 },
];

export default function Stage1({ onComplete, addOlho, setDialogue }) {
  const [olhos, setOlhos] = useState(OLHOS_INICIAIS);
  const [mousePos, setMousePos] = useState(null);
  const areaRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Calcula o quanto a pedra verde está perto de cada olho
  const getVisibilidade = (olho) => {
    if (!mousePos) return 0;
    const eyeX = (olho.left / 100) * mousePos.width;
    const eyeY = (olho.top / 100) * mousePos.height;
    const dist = Math.hypot(mousePos.x - eyeX, mousePos.y - eyeY);

    const raioVisao = 120;
    if (dist > raioVisao) return 0;
    return Math.max(0, 1 - dist / raioVisao);
  };

  const renderOlhoArte = (id) => {
    // 1. Bolinha vermelha com estrela amarela
    if (id === 'star') {
      return (
        <svg viewBox="0 0 60 60" width="54" height="54">
          <defs>
            <radialGradient id="redMarble" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="55%" stopColor="#c92a2a" />
              <stop offset="100%" stopColor="#5c0b0b" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="24" fill="url(#redMarble)" stroke="#2df5c8" strokeWidth="2" />
          <polygon
            points="30,11 35,23 48,24 38,33 41,46 30,39 19,46 22,33 12,24 25,23"
            fill="#ffd43b"
            stroke="#e67700"
            strokeWidth="1"
          />
          <ellipse cx="22" cy="19" rx="5" ry="2.5" transform="rotate(-30 22 19)" fill="rgba(255,255,255,0.65)" />
        </svg>
      );
    }

    // 2. Bolinha escura de marcha (R 1 3 / 2 4)
    if (id === 'gear') {
      return (
        <svg viewBox="0 0 60 60" width="54" height="54">
          <defs>
            <radialGradient id="gearBall" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#5c4738" />
              <stop offset="60%" stopColor="#261b14" />
              <stop offset="100%" stopColor="#0d0907" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="24" fill="url(#gearBall)" stroke="#2df5c8" strokeWidth="2" />
          {/* Diagrama de marchas */}
          <path d="M21,23 L21,37 M30,23 L30,37 M39,23 L39,37 M21,30 L39,30" stroke="#f1f3f5" strokeWidth="2" strokeLinecap="round" />
          <text x="19" y="20" fill="#fff" fontSize="6.5" fontWeight="bold">R</text>
          <text x="28.5" y="20" fill="#fff" fontSize="6.5" fontWeight="bold">1</text>
          <text x="37.5" y="20" fill="#fff" fontSize="6.5" fontWeight="bold">3</text>
          <text x="28.5" y="44" fill="#fff" fontSize="6.5" fontWeight="bold">2</text>
          <text x="37.5" y="44" fill="#fff" fontSize="6.5" fontWeight="bold">4</text>
        </svg>
      );
    }

    // 3. Anel de Pérola Branca com garras escuras
    return (
      <svg viewBox="0 0 60 60" width="56" height="56">
        {/* Aro do anel */}
        <circle cx="22" cy="42" r="8" fill="none" stroke="#868e96" strokeWidth="3.5" />
        {/* Pérola branca */}
        <circle cx="34" cy="26" r="15" fill="#f8f9fa" stroke="#2df5c8" strokeWidth="1.5" />
        {/* Garras escuras segurando a pérola */}
        <path d="M20,32 Q24,22 29,29 Q27,36 22,38 Z" fill="#343a40" />
        <path d="M32,39 Q38,31 46,33 Q42,41 32,41 Z" fill="#343a40" />
      </svg>
    );
  };

  const handleClickOlho = (olho) => {
    const visibilidade = getVisibilidade(olho);
    if (visibilidade < 0.25) return; // Só coleta se estiver olhando através da pedra!

    sfx.playCollect();
    const restantes = olhos.filter((o) => o.id !== olho.id);
    setOlhos(restantes);

    if (restantes.length > 0) {
      setDialogue({
        speaker: 'Coraline',
        mood: 'happy',
        text: `Encontrei! Era a ${olho.nome}! Ainda faltam ${restantes.length} escondidos na neblina...`,
      });
    } else {
      sfx.playStageClear();
      addOlho();
      setDialogue({
        speaker: 'Criança Fantasma',
        mood: 'happy',
        text: 'Você encontrou todos os nossos olhos com a pedra verde! A passagem está aberta...',
      });
      onComplete();
    }
  };

  return (
    <div
      ref={areaRef}
      className={`area-jogo sala-pedra ${mousePos ? 'pedra-ativa' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h2>Procure com a Pedra de Visão</h2>

      {!mousePos && (
        <div className="dica-pedra">
          Passe o mouse aqui dentro para olhar através da pedra triangular verde
        </div>
      )}

      {/* Filtro Verde-Água que acompanha a pedra do mouse */}
      {mousePos && (
        <div
          className="lente-verde-agua"
          style={{
            background: `radial-gradient(circle 125px at ${mousePos.x}px ${mousePos.y}px, rgba(45, 245, 200, 0.26) 0%, rgba(16, 145, 135, 0.14) 55%, rgba(4, 10, 20, 0.88) 100%)`,
          }}
        />
      )}

      {/* Os 3 Olhos das Crianças Fantasmas (só aparecem sob a luz verde-água da pedra) */}
      {olhos.map((olho) => {
        const vis = getVisibilidade(olho);
        return (
          <div
            key={olho.id}
            className="olho-fantasma-item"
            style={{
              top: `${olho.top}%`,
              left: `${olho.left}%`,
              opacity: vis,
              transform: `translate(-50%, -50%) scale(${0.75 + vis * 0.35})`,
              pointerEvents: vis >= 0.25 ? 'auto' : 'none',
            }}
            onClick={() => handleClickOlho(olho)}
            title={olho.nome}
          >
            {renderOlhoArte(olho.id)}
          </div>
        );
      })}

      {/* Cursor Customizado: Pedra Triangular Verde com Furo */}
      {mousePos && (
        <div
          className="pedra-cursor"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <svg viewBox="0 0 100 100" width="96" height="96">
            <defs>
              <linearGradient id="pedraVerde" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2ecc71" />
                <stop offset="50%" stopColor="#138d58" />
                <stop offset="100%" stopColor="#09472c" />
              </linearGradient>
            </defs>
            {/* Triângulo arredondado com furo no meio (fill-rule evenodd) */}
            <path
              fillRule="evenodd"
              d="M50,8 C66,8 90,62 84,78 C78,94 22,94 16,78 C10,62 34,8 50,8 Z M50,36 C39,36 33,47 35,58 C37,69 63,69 65,58 C67,47 61,36 50,36 Z"
              fill="url(#pedraVerde)"
              stroke="#7efcd8"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
}