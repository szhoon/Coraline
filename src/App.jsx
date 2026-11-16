import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import IntroStory from './components/IntroStory';
import HUD from './components/HUD';
import DialogueBox from './components/DialogueBox';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import Stage5 from './components/Stage5';
import EndScreen from './components/EndScreen';
import { sfx } from './utils/soundEffects';
import './App.css';

const ARQUIVOS_MUSICA = [
  '/fundo.mp3',
  '/fundo.m4a',
  '/fundo.ogg',
  '/fundo.wav',
  '/musica.mp3',
  '/coraline.mp3',
];

export default function App() {
  const [gameState, setGameState] = useState('START');
  const [faseAtual, setFaseAtual] = useState(1);
  const [olhosColetados, setOlhosColetados] = useState(0);
  const [podeAvancar, setPodeAvancar] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shake, setShake] = useState(false);

  const [dialogue, setDialogue] = useState({
    speaker: 'Coraline',
    mood: 'idle',
    text: 'Com a pedra que a Miss Spink me deu, consigo ver o que está escondido na escuridão...',
  });

  const audioFundoRef = useRef(null);
  const mutedRef = useRef(false);

  useEffect(() => {
    let indice = 0;
    let ativo = true;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.35;
    audioFundoRef.current = audio;

    const tentarTocar = () => {
      if (!ativo || mutedRef.current || !audio.src) return;
      audio
        .play()
        .then(() => {
          window.removeEventListener('pointerdown', tentarTocar);
          window.removeEventListener('keydown', tentarTocar);
        })
        .catch(() => {});
    };

    const handleError = () => {
      indice++;
      if (indice < ARQUIVOS_MUSICA.length && ativo) {
        audio.src = ARQUIVOS_MUSICA[indice];
        audio.load();
      } else {
        console.warn('Nenhum arquivo de música encontrado na pasta public/ (ex: public/fundo.mp3)');
      }
    };

    const handleLoaded = () => {
      tentarTocar();
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoaded);

    audio.src = ARQUIVOS_MUSICA[0];
    audio.load();

    window.addEventListener('pointerdown', tentarTocar);
    window.addEventListener('keydown', tentarTocar);

    return () => {
      ativo = false;
      window.removeEventListener('pointerdown', tentarTocar);
      window.removeEventListener('keydown', tentarTocar);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoaded);
      audio.pause();
    };
  }, []);

  const toggleMute = () => {
    const novoMute = !muted;
    setMuted(novoMute);
    mutedRef.current = novoMute;
    sfx.setMuted(novoMute);

    if (audioFundoRef.current) {
      audioFundoRef.current.muted = novoMute;
      if (!novoMute && audioFundoRef.current.paused) {
        audioFundoRef.current.play().catch(() => {});
      }
    }
  };

  const triggerErrorShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const abrirIntro = () => {
    if (audioFundoRef.current && !mutedRef.current && audioFundoRef.current.paused) {
      audioFundoRef.current.play().catch(() => {});
    }
    setGameState('INTRO');
  };

  const iniciarGameplay = () => {
    setOlhosColetados(0);
    setFaseAtual(1);
    setGameState('PLAYING');
    setPodeAvancar(false);
    setDialogue({
      speaker: 'Coraline',
      mood: 'idle',
      text: 'Com a pedra que a Miss Spink me deu, consigo enxergar através da névoa verde-água...',
    });
  };

  const proximaFase = () => {
    sfx.playClick();
    if (faseAtual < 5) {
      setFaseAtual((prev) => prev + 1);
      setPodeAvancar(false);
    } else {
      setGameState('WIN');
    }
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
  };

  return (
    <div className="app-container">
      <div className="floating-particles" />

      {gameState === 'START' && (
        <StartScreen
          onStart={abrirIntro}
          muted={muted}
          onToggleMute={toggleMute}
        />
      )}

      {gameState === 'INTRO' && <IntroStory onFinishIntro={iniciarGameplay} />}

      {gameState === 'PLAYING' && (
        <div className={`game-screen ${shake ? 'shake-error' : ''}`}>
          <HUD
            fase={faseAtual}
            olhos={olhosColetados}
            muted={muted}
            onToggleMute={toggleMute}
          />

          <div className="stage-content">
            {faseAtual === 1 && (
              <Stage1
                onComplete={() => setPodeAvancar(true)}
                addOlho={() => setOlhosColetados((prev) => prev + 1)}
                setDialogue={setDialogue}
              />
            )}
            {faseAtual === 2 && (
              <Stage2
                onComplete={() => setPodeAvancar(true)}
                setDialogue={setDialogue}
                onError={triggerErrorShake}
              />
            )}
            {faseAtual === 3 && (
              <Stage3
                onComplete={() => setPodeAvancar(true)}
                addOlho={() => setOlhosColetados((prev) => prev + 1)}
                onGameOver={gameOver}
                setDialogue={setDialogue}
                onError={triggerErrorShake}
              />
            )}
            {faseAtual === 4 && (
              <Stage4
                onComplete={() => setPodeAvancar(true)}
                setDialogue={setDialogue}
                onError={triggerErrorShake}
              />
            )}
            {faseAtual === 5 && (
              <Stage5
                onComplete={() => setPodeAvancar(true)}
                addOlho={() => setOlhosColetados((prev) => prev + 1)}
                onGameOver={gameOver}
                setDialogue={setDialogue}
              />
            )}
          </div>

          <DialogueBox
            speaker={dialogue.speaker}
            mood={dialogue.mood}
            text={dialogue.text}
          />

          <button
            className="btn btn-avancar"
            disabled={!podeAvancar}
            onClick={proximaFase}
          >
            {faseAtual === 5 ? 'Escapar pelo Túnel ➔' : 'Avançar para Próxima Sala ➔'}
          </button>
        </div>
      )}

      {(gameState === 'WIN' || gameState === 'GAMEOVER') && (
        <EndScreen
          type={gameState}
          olhos={olhosColetados}
          onRestart={iniciarGameplay}
        />
      )}
    </div>
  );
}