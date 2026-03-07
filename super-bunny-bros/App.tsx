import React, { useEffect, useMemo, useRef, useState } from 'react';

type Variant = 'SuperMarioBros-v0' | 'SuperMarioBros2-v0';
type Platform = { x: number; y: number; w: number; h: number; style?: 'ground' | 'brick' | 'pipe' };
type Coin = { x: number; y: number; r: number; collected: boolean };
type Enemy = { x: number; y: number; w: number; h: number; vx: number; minX: number; maxX: number; alive: boolean };
type Level = {
  worldWidth: number;
  winX: number;
  playerStartX: number;
  playerStartY: number;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
};

const WIDTH = 960;
const HEIGHT = 540;
const GRAVITY = 0.8;
const MOVE_SPEED = 4.4;
const JUMP_SPEED = -15;
const MAX_LIVES = 3;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const intersects = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const buildLevel = (variant: Variant): Level => {
  if (variant === 'SuperMarioBros2-v0') {
    const worldWidth = 4700;
    return {
      worldWidth,
      winX: worldWidth - 160,
      playerStartX: 80,
      playerStartY: 420,
      platforms: [
        { x: 0, y: 470, w: worldWidth, h: 70, style: 'ground' },
        { x: 220, y: 400, w: 150, h: 24, style: 'brick' },
        { x: 420, y: 340, w: 160, h: 24, style: 'brick' },
        { x: 660, y: 280, w: 170, h: 24, style: 'brick' },
        { x: 940, y: 340, w: 110, h: 130, style: 'pipe' },
        { x: 1140, y: 250, w: 160, h: 24, style: 'brick' },
        { x: 1360, y: 320, w: 130, h: 24, style: 'brick' },
        { x: 1580, y: 380, w: 120, h: 24, style: 'brick' },
        { x: 1760, y: 300, w: 180, h: 24, style: 'brick' },
        { x: 2040, y: 250, w: 180, h: 24, style: 'brick' },
        { x: 2320, y: 310, w: 200, h: 24, style: 'brick' },
        { x: 2620, y: 240, w: 180, h: 24, style: 'brick' },
        { x: 2930, y: 360, w: 120, h: 24, style: 'brick' },
        { x: 3160, y: 300, w: 130, h: 24, style: 'brick' },
        { x: 3360, y: 240, w: 180, h: 24, style: 'brick' },
        { x: 3650, y: 190, w: 150, h: 24, style: 'brick' },
        { x: 3910, y: 280, w: 180, h: 24, style: 'brick' },
        { x: 4200, y: 220, w: 180, h: 24, style: 'brick' }
      ],
      coins: [
        { x: 270, y: 360, r: 10, collected: false },
        { x: 470, y: 300, r: 10, collected: false },
        { x: 520, y: 300, r: 10, collected: false },
        { x: 720, y: 240, r: 10, collected: false },
        { x: 770, y: 240, r: 10, collected: false },
        { x: 1190, y: 210, r: 10, collected: false },
        { x: 1240, y: 210, r: 10, collected: false },
        { x: 1820, y: 260, r: 10, collected: false },
        { x: 1880, y: 260, r: 10, collected: false },
        { x: 2100, y: 210, r: 10, collected: false },
        { x: 2420, y: 270, r: 10, collected: false },
        { x: 2690, y: 200, r: 10, collected: false },
        { x: 3430, y: 200, r: 10, collected: false },
        { x: 3720, y: 150, r: 10, collected: false },
        { x: 4280, y: 180, r: 10, collected: false },
        { x: 4340, y: 180, r: 10, collected: false }
      ],
      enemies: [
        { x: 860, y: 434, w: 30, h: 36, vx: 1.4, minX: 740, maxX: 930, alive: true },
        { x: 1500, y: 434, w: 30, h: 36, vx: 1.7, minX: 1400, maxX: 1670, alive: true },
        { x: 2280, y: 274, w: 30, h: 36, vx: 1.6, minX: 2320, maxX: 2510, alive: true },
        { x: 3040, y: 434, w: 30, h: 36, vx: 1.8, minX: 2930, maxX: 3120, alive: true },
        { x: 4030, y: 244, w: 30, h: 36, vx: 1.7, minX: 3910, maxX: 4080, alive: true }
      ]
    };
  }

  const worldWidth = 4200;
  return {
    worldWidth,
    winX: worldWidth - 140,
    playerStartX: 80,
    playerStartY: 420,
    platforms: [
      { x: 0, y: 470, w: worldWidth, h: 70, style: 'ground' },
      { x: 240, y: 390, w: 170, h: 24, style: 'brick' },
      { x: 520, y: 340, w: 170, h: 24, style: 'brick' },
      { x: 760, y: 290, w: 140, h: 24, style: 'brick' },
      { x: 980, y: 250, w: 170, h: 24, style: 'brick' },
      { x: 1230, y: 330, w: 120, h: 140, style: 'pipe' },
      { x: 1450, y: 380, w: 160, h: 24, style: 'brick' },
      { x: 1710, y: 310, w: 190, h: 24, style: 'brick' },
      { x: 1980, y: 250, w: 150, h: 24, style: 'brick' },
      { x: 2230, y: 350, w: 170, h: 24, style: 'brick' },
      { x: 2480, y: 300, w: 210, h: 24, style: 'brick' },
      { x: 2830, y: 380, w: 130, h: 24, style: 'brick' },
      { x: 3070, y: 330, w: 160, h: 24, style: 'brick' },
      { x: 3370, y: 280, w: 240, h: 24, style: 'brick' },
      { x: 3700, y: 220, w: 170, h: 24, style: 'brick' }
    ],
    coins: [
      { x: 300, y: 350, r: 10, collected: false },
      { x: 360, y: 350, r: 10, collected: false },
      { x: 580, y: 300, r: 10, collected: false },
      { x: 640, y: 300, r: 10, collected: false },
      { x: 820, y: 250, r: 10, collected: false },
      { x: 1030, y: 210, r: 10, collected: false },
      { x: 1110, y: 210, r: 10, collected: false },
      { x: 1520, y: 340, r: 10, collected: false },
      { x: 1770, y: 270, r: 10, collected: false },
      { x: 1850, y: 270, r: 10, collected: false },
      { x: 2030, y: 210, r: 10, collected: false },
      { x: 2560, y: 260, r: 10, collected: false },
      { x: 2640, y: 260, r: 10, collected: false },
      { x: 3160, y: 290, r: 10, collected: false },
      { x: 3470, y: 240, r: 10, collected: false },
      { x: 3570, y: 240, r: 10, collected: false },
      { x: 3770, y: 180, r: 10, collected: false },
      { x: 3830, y: 180, r: 10, collected: false }
    ],
    enemies: [
      { x: 700, y: 434, w: 30, h: 36, vx: 1.3, minX: 620, maxX: 860, alive: true },
      { x: 1360, y: 434, w: 30, h: 36, vx: 1.5, minX: 1260, maxX: 1440, alive: true },
      { x: 2110, y: 214, w: 30, h: 36, vx: 1.6, minX: 1990, maxX: 2250, alive: true },
      { x: 2900, y: 344, w: 30, h: 36, vx: 1.8, minX: 2830, maxX: 2960, alive: true },
      { x: 3500, y: 244, w: 30, h: 36, vx: 1.6, minX: 3380, maxX: 3600, alive: true }
    ]
  };
};

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [variant, setVariant] = useState<Variant>('SuperMarioBros-v0');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [sessionId, setSessionId] = useState(0);

  const statusText = useMemo(() => {
    if (won) return `${variant}: niveau termine, lapin bleu victorieux.`;
    if (gameOver) return `${variant}: perdu, relance la partie.`;
    return `${variant} | Fleches: bouger | Espace: sauter`;
  }, [gameOver, won, variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    const keys = new Set<string>();
    const level = buildLevel(variant);
    const { platforms, coins, enemies, worldWidth, winX, playerStartX, playerStartY } = level;

    const player = {
      x: playerStartX,
      y: playerStartY,
      w: 34,
      h: 46,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      invulnerableUntil: 0
    };

    let cameraX = 0;
    let points = 0;
    let remainingLives = MAX_LIVES;
    let ended = false;

    const respawn = (): void => {
      player.x = playerStartX;
      player.y = playerStartY;
      player.vx = 0;
      player.vy = 0;
      player.onGround = false;
      player.invulnerableUntil = performance.now() + 1200;
    };

    const handleHit = (): void => {
      if (ended) return;
      const now = performance.now();
      if (now < player.invulnerableUntil) return;
      remainingLives -= 1;
      setLives(remainingLives);
      if (remainingLives <= 0) {
        ended = true;
        setGameOver(true);
        return;
      }
      respawn();
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      keys.add(event.key.toLowerCase());
      if (event.key === ' ') {
        event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      keys.delete(event.key.toLowerCase());
    };

    const drawBackground = (): void => {
      ctx.fillStyle = variant === 'SuperMarioBros2-v0' ? '#86ccff' : '#8ed2ff';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < 6; i += 1) {
        const cloudX = ((cameraX * (variant === 'SuperMarioBros2-v0' ? 0.2 : 0.15) + i * 210) % (WIDTH + 200)) - 100;
        const y = 60 + (i % 4) * 40;
        ctx.fillStyle = '#e8f7ff';
        ctx.fillRect(cloudX, y, 70, 24);
        ctx.fillRect(cloudX + 16, y - 14, 42, 20);
      }

      ctx.fillStyle = variant === 'SuperMarioBros2-v0' ? '#68b843' : '#77bc52';
      ctx.fillRect(0, 460, WIDTH, 80);
    };

    const drawPlatform = (platform: Platform): void => {
      const sx = platform.x - cameraX;
      if (sx + platform.w < -32 || sx > WIDTH + 32) return;

      if (platform.style === 'ground') {
        ctx.fillStyle = '#4f8f36';
      } else if (platform.style === 'pipe') {
        ctx.fillStyle = '#2d9f45';
      } else {
        ctx.fillStyle = '#b8713d';
      }
      ctx.fillRect(sx, platform.y, platform.w, platform.h);

      if (platform.style === 'brick') {
        ctx.strokeStyle = '#844a21';
        for (let x = 0; x < platform.w; x += 24) {
          ctx.beginPath();
          ctx.moveTo(sx + x, platform.y);
          ctx.lineTo(sx + x, platform.y + platform.h);
          ctx.stroke();
        }
      }

      if (platform.style === 'pipe') {
        ctx.fillStyle = '#36bf58';
        ctx.fillRect(sx - 10, platform.y - 18, platform.w + 20, 18);
      }
    };

    const drawCoin = (coin: Coin): void => {
      if (coin.collected) return;
      const sx = coin.x - cameraX;
      if (sx < -40 || sx > WIDTH + 40) return;
      ctx.fillStyle = '#ffd54a';
      ctx.beginPath();
      ctx.arc(sx, coin.y, coin.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffec9a';
      ctx.fillRect(sx - 2, coin.y - coin.r + 4, 4, coin.r * 2 - 8);
    };

    const drawEnemy = (enemy: Enemy): void => {
      if (!enemy.alive) return;
      const sx = enemy.x - cameraX;
      if (sx + enemy.w < -40 || sx > WIDTH + 40) return;
      ctx.fillStyle = '#6b3a1e';
      ctx.fillRect(sx, enemy.y, enemy.w, enemy.h);
      ctx.fillStyle = '#ffefdf';
      ctx.fillRect(sx + 6, enemy.y + 10, 5, 5);
      ctx.fillRect(sx + enemy.w - 11, enemy.y + 10, 5, 5);
    };

    const drawFlag = (): void => {
      const sx = winX - cameraX;
      ctx.fillStyle = '#e8f7ff';
      ctx.fillRect(sx, 170, 8, 300);
      ctx.fillStyle = '#2596ff';
      ctx.fillRect(sx + 8, 185, 56, 42);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx + 16, 197, 12, 12);
    };

    const drawPlayer = (): void => {
      const sx = player.x - cameraX;
      const flashing = performance.now() < player.invulnerableUntil && Math.floor(performance.now() / 90) % 2 === 0;
      if (flashing) return;

      ctx.fillStyle = '#2f95ff';
      ctx.fillRect(sx + 7, player.y + 15, 20, 24);
      ctx.fillRect(sx + 9, player.y + 6, 16, 14);
      ctx.fillRect(sx + 9, player.y - 12, 5, 18);
      ctx.fillRect(sx + 20, player.y - 12, 5, 18);

      ctx.fillStyle = '#9ad6ff';
      ctx.fillRect(sx + 11, player.y - 8, 2, 12);
      ctx.fillRect(sx + 22, player.y - 8, 2, 12);
      ctx.fillRect(sx + 11, player.y + 29, 12, 6);

      ctx.fillStyle = '#10294a';
      const eyeOffset = player.facing < 0 ? 0 : 4;
      ctx.fillRect(sx + 12 + eyeOffset, player.y + 10, 2, 2);
      ctx.fillRect(sx + 20 + eyeOffset, player.y + 10, 2, 2);
      ctx.fillRect(sx + 17 + eyeOffset, player.y + 14, 2, 2);
    };

    const step = (): void => {
      if (!ended) {
        const left = keys.has('arrowleft') || keys.has('q') || keys.has('a');
        const right = keys.has('arrowright') || keys.has('d');
        const jump = keys.has(' ') || keys.has('arrowup') || keys.has('w') || keys.has('z');

        if (left && !right) {
          player.vx = -MOVE_SPEED;
          player.facing = -1;
        } else if (right && !left) {
          player.vx = MOVE_SPEED;
          player.facing = 1;
        } else {
          player.vx *= 0.78;
          if (Math.abs(player.vx) < 0.1) player.vx = 0;
        }

        if (jump && player.onGround) {
          player.vy = JUMP_SPEED;
          player.onGround = false;
        }

        player.vy += GRAVITY;
        if (player.vy > 20) player.vy = 20;

        player.x += player.vx;
        player.x = clamp(player.x, 0, worldWidth - player.w);

        player.y += player.vy;
        player.onGround = false;

        for (const platform of platforms) {
          if (!intersects(player, { x: platform.x, y: platform.y, w: platform.w, h: platform.h })) continue;

          const prevBottom = player.y - player.vy + player.h;
          const prevTop = player.y - player.vy;
          const prevRight = player.x - player.vx + player.w;
          const prevLeft = player.x - player.vx;

          if (prevBottom <= platform.y + 2 && player.vy >= 0) {
            player.y = platform.y - player.h;
            player.vy = 0;
            player.onGround = true;
          } else if (prevTop >= platform.y + platform.h - 2 && player.vy < 0) {
            player.y = platform.y + platform.h;
            player.vy = 0;
          } else if (prevRight <= platform.x + 2 && player.vx > 0) {
            player.x = platform.x - player.w;
            player.vx = 0;
          } else if (prevLeft >= platform.x + platform.w - 2 && player.vx < 0) {
            player.x = platform.x + platform.w;
            player.vx = 0;
          }
        }

        if (player.y > HEIGHT + 100) {
          handleHit();
        }

        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          enemy.x += enemy.vx;
          if (enemy.x < enemy.minX || enemy.x + enemy.w > enemy.maxX) {
            enemy.vx *= -1;
            enemy.x = clamp(enemy.x, enemy.minX, enemy.maxX - enemy.w);
          }

          if (!intersects(player, enemy)) continue;

          const playerBottom = player.y + player.h;
          const enemyTop = enemy.y;
          const fallingOnEnemy = player.vy > 0 && playerBottom - enemyTop < 18;
          if (fallingOnEnemy) {
            enemy.alive = false;
            player.vy = -9;
            points += 120;
            setScore(points);
          } else {
            handleHit();
          }
        }

        for (const coin of coins) {
          if (coin.collected) continue;
          const hit = intersects(player, { x: coin.x - coin.r, y: coin.y - coin.r, w: coin.r * 2, h: coin.r * 2 });
          if (hit) {
            coin.collected = true;
            points += 25;
            setScore(points);
          }
        }

        if (player.x >= winX) {
          ended = true;
          setWon(true);
        }
      }

      cameraX = clamp(player.x - WIDTH * 0.4, 0, worldWidth - WIDTH);

      drawBackground();
      platforms.forEach(drawPlatform);
      coins.forEach(drawCoin);
      enemies.forEach(drawEnemy);
      drawFlag();
      drawPlayer();

      animationFrame = requestAnimationFrame(step);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    animationFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [sessionId, variant]);

  const restart = (): void => {
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setWon(false);
    setSessionId(value => value + 1);
  };

  const changeVariant = (next: Variant): void => {
    if (next === variant) return;
    setVariant(next);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setWon(false);
    setSessionId(value => value + 1);
  };

  const basePath = window.location.pathname.includes('/puka-pixel-adventure/') ? '/puka-pixel-adventure' : '';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '16px' }}>
      <div style={{ width: 'min(100%, 980px)', background: 'rgba(7, 26, 49, 0.65)', border: '3px solid #d9f2ff', borderRadius: 12, padding: 14 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <strong style={{ fontSize: 20, color: '#d9f2ff' }}>Super Blue Bunny Bros</strong>
          <div style={{ display: 'flex', gap: 16, fontWeight: 700 }}>
            <span>Score: {score}</span>
            <span>Vies: {lives}</span>
          </div>
        </header>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <button
            onClick={() => changeVariant('SuperMarioBros-v0')}
            style={{
              border: '2px solid #d9f2ff',
              background: variant === 'SuperMarioBros-v0' ? '#1a6ad6' : '#184f84',
              color: '#fff',
              borderRadius: 6,
              padding: '6px 12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            SuperMarioBros-v0
          </button>
          <button
            onClick={() => changeVariant('SuperMarioBros2-v0')}
            style={{
              border: '2px solid #d9f2ff',
              background: variant === 'SuperMarioBros2-v0' ? '#1a6ad6' : '#184f84',
              color: '#fff',
              borderRadius: 6,
              padding: '6px 12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            SuperMarioBros2-v0
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ width: '100%', maxWidth: WIDTH, height: 'auto', border: '3px solid #13314f', borderRadius: 8, background: '#8ed2ff', imageRendering: 'pixelated' }}
        />

        <footer style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>{statusText}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(gameOver || won) && (
              <button
                onClick={restart}
                style={{ border: '2px solid #d9f2ff', background: '#1a6ad6', color: '#fff', borderRadius: 6, padding: '6px 12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Rejouer
              </button>
            )}
            <a
              href={`${basePath}/`}
              style={{ border: '2px solid #d9f2ff', background: '#184f84', color: '#fff', borderRadius: 6, padding: '6px 12px', fontWeight: 700, textDecoration: 'none' }}
            >
              Retour menu
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default App;
