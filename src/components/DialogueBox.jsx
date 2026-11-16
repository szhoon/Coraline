import React, { useState, useEffect } from 'react';
import CharacterPortrait from './CharacterPortrait';

export default function DialogueBox({ speaker, mood = 'idle', text }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="dialogue-box">
      <CharacterPortrait speaker={speaker} mood={mood} size="normal" />
      <div className="dialogue-content">
        <span className="dialogue-speaker">{speaker}</span>
        <p className="dialogue-text">{displayed}</p>
      </div>
    </div>
  );
}