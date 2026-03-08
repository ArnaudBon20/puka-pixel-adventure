import React, { useMemo, useState } from 'react';

type Face = {
  id: string;
  label: string;
  symbol: string;
};

type MemoryCard = {
  uid: string;
  faceId: string;
  label: string;
  symbol: string;
  flipped: boolean;
  matched: boolean;
};

const FACES: Face[] = [
  { id: 'puka', label: 'Puka', symbol: '🐰' },
  { id: 'bebe-puka', label: 'Baby Puka', symbol: '🍼🐰' },
  { id: 'maman-puka', label: 'Mama Puka', symbol: '👩🐰' },
  { id: 'petit-garcon-blond', label: 'Kleiner blonder Junge', symbol: '👱‍♂️' },
  { id: 'maman-brune', label: 'Brünette Mama', symbol: '👩🏽' },
  { id: 'papa-brun', label: 'Brünetter Papa', symbol: '👨🏽' },
  { id: 'petit-ours', label: 'Kleiner Bär', symbol: '🧸' },
  { id: 'lapin-brun', label: 'Brauner Hase', symbol: '🤎🐇' },
  { id: 'drapeau-turc', label: 'Türkische Flagge', symbol: '🇹🇷' },
  { id: 'drapeau-suisse', label: 'Schweizer Flagge', symbol: '🇨🇭' }
];

const shuffle = <T,>(arr: T[]): T[] => {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const buildDeck = (): MemoryCard[] => {
  const doubled = [...FACES, ...FACES].map((face, index) => ({
    uid: `${face.id}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    faceId: face.id,
    label: face.label,
    symbol: face.symbol,
    flipped: false,
    matched: false
  }));
  return shuffle(doubled);
};

const App: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const matchedCount = useMemo(() => cards.filter(card => card.matched).length, [cards]);
  const gameWon = matchedCount === cards.length;

  const flipCard = (index: number): void => {
    if (busy || gameWon) return;
    const card = cards[index];
    if (!card || card.flipped || card.matched) return;

    const nextCards = [...cards];
    nextCards[index] = { ...nextCards[index], flipped: true };
    const nextSelected = [...selected, index];

    setCards(nextCards);
    setSelected(nextSelected);

    if (nextSelected.length < 2) {
      return;
    }

    setMoves(value => value + 1);
    setBusy(true);

    const [firstIdx, secondIdx] = nextSelected;
    const first = nextCards[firstIdx];
    const second = nextCards[secondIdx];

    if (first.faceId === second.faceId) {
      const matchedCards = [...nextCards];
      matchedCards[firstIdx] = { ...matchedCards[firstIdx], matched: true };
      matchedCards[secondIdx] = { ...matchedCards[secondIdx], matched: true };
      setTimeout(() => {
        setCards(matchedCards);
        setSelected([]);
        setBusy(false);
      }, 250);
      return;
    }

    setTimeout(() => {
      const hiddenCards = [...nextCards];
      hiddenCards[firstIdx] = { ...hiddenCards[firstIdx], flipped: false };
      hiddenCards[secondIdx] = { ...hiddenCards[secondIdx], flipped: false };
      setCards(hiddenCards);
      setSelected([]);
      setBusy(false);
    }, 850);
  };

  const resetGame = (): void => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setBusy(false);
  };

  const basePath = window.location.pathname.includes('/puka-pixel-adventure/') ? '/puka-pixel-adventure' : '';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '16px' }}>
      <div style={{ width: 'min(100%, 1080px)', background: '#2E7D32', border: '4px solid #1B5E20', borderRadius: 12, padding: 14, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', color: '#E8F5E9' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div>
            <strong style={{ fontSize: 20, color: '#FFEB3B', textShadow: '2px 2px 0 #000' }}>Puka&apos;s Party Memory</strong>
            <div style={{ marginTop: 8, fontSize: 11 }}>Finde 10 Paare: Familie, Tiere und Flaggen.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11 }}>Züge: {moves}</span>
            <span style={{ fontSize: 11 }}>Paare: {matchedCount / 2}/10</span>
          </div>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 10,
            marginBottom: 12
          }}
        >
          {cards.map((card, index) => {
            const showFace = card.flipped || card.matched;
            return (
              <button
                key={card.uid}
                onClick={() => flipCard(index)}
                style={{
                  minHeight: 96,
                  borderRadius: 10,
                  border: `3px solid ${showFace ? '#66BB6A' : '#1B5E20'}`,
                  background: showFace ? '#E8F5E9' : '#1B5E20',
                  color: showFace ? '#10294a' : '#C8E6C9',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  padding: 8,
                  textAlign: 'center',
                  transition: 'transform 120ms ease'
                }}
              >
                {showFace ? (
                  <div style={{ display: 'grid', gap: 8, placeItems: 'center' }}>
                    <span style={{ fontSize: 30, lineHeight: 1 }}>{card.symbol}</span>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      border: '2px solid #0D47A1',
                      background:
                        'linear-gradient(135deg, #1E88E5 0%, #1976D2 45%, #1565C0 100%)',
                      display: 'grid',
                      alignContent: 'center',
                      gap: 2,
                      overflow: 'hidden',
                      transform: 'rotate(-8deg)'
                    }}
                  >
                    {Array.from({ length: 8 }).map((_, row) => (
                      <div
                        key={`pattern-${card.uid}-${row}`}
                        style={{
                          fontSize: 7,
                          letterSpacing: 1,
                          color: '#BBDEFB',
                          opacity: 0.9,
                          whiteSpace: 'nowrap',
                          transform: `translateX(${row % 2 === 0 ? '-6px' : '2px'})`
                        }}
                      >
                        PUKA PUKA PUKA PUKA
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </section>

        <footer style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11 }}>
            {gameWon ? 'Super! Du hast alle Paare gefunden.' : 'Drehe zwei gleiche Karten um, um ein Paar zu bilden.'}
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={resetGame}
              style={{
                border: '2px solid #880E4F',
                background: '#F06292',
                color: '#fff',
                borderRadius: 6,
                padding: '7px 14px',
                cursor: 'pointer',
                fontSize: 10,
                lineHeight: 1.25
              }}
            >
              Nochmal spielen
            </button>
            <a
              href={`${basePath}/`}
              style={{
                border: '2px solid #263238',
                background: '#546E7A',
                color: '#fff',
                borderRadius: 6,
                padding: '7px 14px',
                textDecoration: 'none',
                fontSize: 10,
                lineHeight: 1.25,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Alle Spiele
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default App;
