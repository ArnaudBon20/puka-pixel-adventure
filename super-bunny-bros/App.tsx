import React, { useEffect, useMemo, useRef, useState } from 'react';

type Platform = { x: number; y: number; w: number; h: number; style?: 'ground' | 'brick' | 'pipe' };
type Coin = { x: number; y: number; r: number; collected: boolean };
type Enemy = { x: number; y: number; w: number; h: number; vx: number; minX: number; maxX: number; alive: boolean };
type Physics = {
  gravity: number;
  moveSpeed: number;
  jumpSpeed: number;
  drag: number;
  stompBounce: number;
  coinValue: number;
};
type LevelDefinition = {
  id: string;
  name: string;
  description: string;
  worldWidth: number;
  winX: number;
  playerStartX: number;
  playerStartY: number;
  physics: Physics;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
};

const WIDTH = 960;
const HEIGHT = 540;
const MAX_LIVES = 3;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const intersects = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const LEVELS: LevelDefinition[] = [
  {
    id: 'level-1',
    name: 'Level 1 - Ruhiger Garten',
    description: 'Einstieg mit einfachen Spruengen und langsamen Gegnern.',
    worldWidth: 3200,
    winX: 3050,
    playerStartX: 80,
    playerStartY: 420,
    physics: {
      gravity: 0.8,
      moveSpeed: 4.2,
      jumpSpeed: -15,
      drag: 0.76,
      stompBounce: -9,
      coinValue: 25
    },
    platforms: [
      { x: 0, y: 470, w: 3200, h: 70, style: 'ground' },
      { x: 230, y: 390, w: 170, h: 24, style: 'brick' },
      { x: 500, y: 340, w: 160, h: 24, style: 'brick' },
      { x: 730, y: 290, w: 140, h: 24, style: 'brick' },
      { x: 960, y: 250, w: 170, h: 24, style: 'brick' },
      { x: 1210, y: 330, w: 120, h: 140, style: 'pipe' },
      { x: 1440, y: 380, w: 160, h: 24, style: 'brick' },
      { x: 1700, y: 310, w: 190, h: 24, style: 'brick' },
      { x: 1980, y: 250, w: 170, h: 24, style: 'brick' },
      { x: 2250, y: 350, w: 180, h: 24, style: 'brick' },
      { x: 2520, y: 290, w: 220, h: 24, style: 'brick' },
      { x: 2820, y: 230, w: 170, h: 24, style: 'brick' }
    ],
    coins: [
      { x: 290, y: 350, r: 10, collected: false },
      { x: 350, y: 350, r: 10, collected: false },
      { x: 560, y: 300, r: 10, collected: false },
      { x: 620, y: 300, r: 10, collected: false },
      { x: 790, y: 250, r: 10, collected: false },
      { x: 1010, y: 210, r: 10, collected: false },
      { x: 1090, y: 210, r: 10, collected: false },
      { x: 1760, y: 270, r: 10, collected: false },
      { x: 1850, y: 270, r: 10, collected: false },
      { x: 2040, y: 210, r: 10, collected: false },
      { x: 2580, y: 250, r: 10, collected: false },
      { x: 2670, y: 250, r: 10, collected: false },
      { x: 2870, y: 190, r: 10, collected: false }
    ],
    enemies: [
      { x: 680, y: 434, w: 30, h: 36, vx: 1.2, minX: 610, maxX: 840, alive: true },
      { x: 1350, y: 434, w: 30, h: 36, vx: 1.4, minX: 1230, maxX: 1420, alive: true },
      { x: 2080, y: 214, w: 30, h: 36, vx: 1.5, minX: 1980, maxX: 2160, alive: true },
      { x: 2600, y: 254, w: 30, h: 36, vx: 1.5, minX: 2520, maxX: 2740, alive: true }
    ]
  },
  {
    id: 'level-2',
    name: 'Level 2 - Lebendiger Wald',
    description: 'Schneller, schwebendere Spruenge und laengere Abschnitte.',
    worldWidth: 4300,
    winX: 4130,
    playerStartX: 80,
    playerStartY: 420,
    physics: {
      gravity: 0.62,
      moveSpeed: 5.1,
      jumpSpeed: -13.5,
      drag: 0.86,
      stompBounce: -11,
      coinValue: 35
    },
    platforms: [
      { x: 0, y: 470, w: 4300, h: 70, style: 'ground' },
      { x: 220, y: 400, w: 150, h: 24, style: 'brick' },
      { x: 430, y: 340, w: 160, h: 24, style: 'brick' },
      { x: 680, y: 280, w: 180, h: 24, style: 'brick' },
      { x: 980, y: 340, w: 110, h: 130, style: 'pipe' },
      { x: 1180, y: 250, w: 170, h: 24, style: 'brick' },
      { x: 1430, y: 320, w: 130, h: 24, style: 'brick' },
      { x: 1660, y: 380, w: 120, h: 24, style: 'brick' },
      { x: 1880, y: 300, w: 190, h: 24, style: 'brick' },
      { x: 2170, y: 240, w: 180, h: 24, style: 'brick' },
      { x: 2450, y: 310, w: 210, h: 24, style: 'brick' },
      { x: 2780, y: 240, w: 180, h: 24, style: 'brick' },
      { x: 3090, y: 360, w: 130, h: 24, style: 'brick' },
      { x: 3340, y: 300, w: 140, h: 24, style: 'brick' },
      { x: 3550, y: 240, w: 190, h: 24, style: 'brick' },
      { x: 3840, y: 190, w: 160, h: 24, style: 'brick' }
    ],
    coins: [
      { x: 270, y: 360, r: 10, collected: false },
      { x: 490, y: 300, r: 10, collected: false },
      { x: 540, y: 300, r: 10, collected: false },
      { x: 740, y: 240, r: 10, collected: false },
      { x: 800, y: 240, r: 10, collected: false },
      { x: 1230, y: 210, r: 10, collected: false },
      { x: 1290, y: 210, r: 10, collected: false },
      { x: 1940, y: 260, r: 10, collected: false },
      { x: 2020, y: 260, r: 10, collected: false },
      { x: 2230, y: 200, r: 10, collected: false },
      { x: 2550, y: 270, r: 10, collected: false },
      { x: 2860, y: 200, r: 10, collected: false },
      { x: 3400, y: 260, r: 10, collected: false },
      { x: 3620, y: 200, r: 10, collected: false },
      { x: 3890, y: 150, r: 10, collected: false }
    ],
    enemies: [
      { x: 860, y: 434, w: 30, h: 36, vx: 1.5, minX: 730, maxX: 930, alive: true },
      { x: 1520, y: 434, w: 30, h: 36, vx: 1.8, minX: 1440, maxX: 1710, alive: true },
      { x: 2340, y: 204, w: 30, h: 36, vx: 1.8, minX: 2170, maxX: 2350, alive: true },
      { x: 3130, y: 324, w: 30, h: 36, vx: 1.9, minX: 3090, maxX: 3230, alive: true },
      { x: 3890, y: 154, w: 30, h: 36, vx: 1.9, minX: 3840, maxX: 4000, alive: true }
    ]
  },
  {
    id: 'level-3',
    name: 'Level 3 - Puka Finale',
    description: 'Finales Level: hohes Tempo und praezises Timing.',
    worldWidth: 5000,
    winX: 4820,
    playerStartX: 80,
    playerStartY: 420,
    physics: {
      gravity: 0.74,
      moveSpeed: 5.0,
      jumpSpeed: -14,
      drag: 0.8,
      stompBounce: -10.5,
      coinValue: 50
    },
    platforms: [
      { x: 0, y: 470, w: 5000, h: 70, style: 'ground' },
      { x: 230, y: 370, w: 170, h: 24, style: 'brick' },
      { x: 470, y: 300, w: 160, h: 24, style: 'brick' },
      { x: 700, y: 240, w: 140, h: 24, style: 'brick' },
      { x: 920, y: 320, w: 120, h: 150, style: 'pipe' },
      { x: 1140, y: 240, w: 170, h: 24, style: 'brick' },
      { x: 1400, y: 320, w: 170, h: 24, style: 'brick' },
      { x: 1660, y: 260, w: 190, h: 24, style: 'brick' },
      { x: 1940, y: 330, w: 140, h: 24, style: 'brick' },
      { x: 2200, y: 250, w: 170, h: 24, style: 'brick' },
      { x: 2460, y: 330, w: 180, h: 24, style: 'brick' },
      { x: 2740, y: 250, w: 200, h: 24, style: 'brick' },
      { x: 3060, y: 190, w: 170, h: 24, style: 'brick' },
      { x: 3340, y: 280, w: 220, h: 24, style: 'brick' },
      { x: 3650, y: 210, w: 180, h: 24, style: 'brick' },
      { x: 3920, y: 310, w: 150, h: 24, style: 'brick' },
      { x: 4180, y: 230, w: 180, h: 24, style: 'brick' },
      { x: 4460, y: 170, w: 190, h: 24, style: 'brick' }
    ],
    coins: [
      { x: 280, y: 330, r: 10, collected: false },
      { x: 520, y: 260, r: 10, collected: false },
      { x: 560, y: 260, r: 10, collected: false },
      { x: 760, y: 200, r: 10, collected: false },
      { x: 1200, y: 200, r: 10, collected: false },
      { x: 1450, y: 280, r: 10, collected: false },
      { x: 1750, y: 220, r: 10, collected: false },
      { x: 2280, y: 210, r: 10, collected: false },
      { x: 2550, y: 290, r: 10, collected: false },
      { x: 2860, y: 210, r: 10, collected: false },
      { x: 3140, y: 150, r: 10, collected: false },
      { x: 3430, y: 240, r: 10, collected: false },
      { x: 3730, y: 170, r: 10, collected: false },
      { x: 4250, y: 190, r: 10, collected: false },
      { x: 4520, y: 130, r: 10, collected: false },
      { x: 4580, y: 130, r: 10, collected: false }
    ],
    enemies: [
      { x: 860, y: 434, w: 30, h: 36, vx: 1.7, minX: 740, maxX: 930, alive: true },
      { x: 1580, y: 434, w: 30, h: 36, vx: 2.0, minX: 1410, maxX: 1700, alive: true },
      { x: 2360, y: 214, w: 30, h: 36, vx: 2.0, minX: 2200, maxX: 2370, alive: true },
      { x: 2960, y: 214, w: 30, h: 36, vx: 2.1, minX: 2740, maxX: 2940, alive: true },
      { x: 4040, y: 274, w: 30, h: 36, vx: 2.0, minX: 3920, maxX: 4080, alive: true },
      { x: 4520, y: 134, w: 30, h: 36, vx: 2.1, minX: 4460, maxX: 4650, alive: true }
    ]
  }
];

const cloneLevelData = (level: LevelDefinition): LevelDefinition => ({
  ...level,
  platforms: level.platforms.map(platform => ({ ...platform })),
  coins: level.coins.map(coin => ({ ...coin, collected: false })),
  enemies: level.enemies.map(enemy => ({ ...enemy, alive: true }))
});

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchInputRef = useRef({ left: false, right: false, jump: false });

  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [campaignWon, setCampaignWon] = useState(false);
  const [runId, setRunId] = useState(0);

  const level = LEVELS[levelIndex];

  const setTouchInput = (key: 'left' | 'right' | 'jump', pressed: boolean): void => {
    touchInputRef.current[key] = pressed;
  };

  const statusText = useMemo(() => {
    if (campaignWon) return 'Kampagne beendet: Alle Level geschafft.';
    if (levelWon) return `${level.name} beendet. Weiter zum naechsten Level.`;
    if (gameOver) return 'Verloren. Starte die Kampagne neu.';
    return `${level.name} | Tastatur: Pfeile + Leertaste | iPhone: Touch-Tasten`;
  }, [campaignWon, gameOver, level.name, levelWon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentLevel = cloneLevelData(level);
    const { physics, platforms, coins, enemies, worldWidth, winX, playerStartX, playerStartY } = currentLevel;

    let animationFrame = 0;
    const keys = new Set<string>();

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
    let points = score;
    let remainingLives = lives;
    let ended = false;

    const respawn = (): void => {
      player.x = playerStartX;
      player.y = playerStartY;
      player.vx = 0;
      player.vy = 0;
      player.onGround = false;
      player.invulnerableUntil = performance.now() + 1000;
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
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault();
      }
      keys.add(key);
    };

    const onKeyUp = (event: KeyboardEvent): void => {
      keys.delete(event.key.toLowerCase());
    };

    const drawBackground = (): void => {
      ctx.fillStyle = '#8ed2ff';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < 6; i += 1) {
        const cloudX = ((cameraX * 0.17 + i * 220) % (WIDTH + 220)) - 110;
        const y = 58 + (i % 4) * 38;
        ctx.fillStyle = '#e8f7ff';
        ctx.fillRect(cloudX, y, 70, 24);
        ctx.fillRect(cloudX + 16, y - 14, 42, 20);
      }

      ctx.fillStyle = '#77bc52';
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
        ctx.fillStyle = '#8d4e24';
      }
      ctx.fillRect(sx, platform.y, platform.w, platform.h);

      if (platform.style === 'brick') {
        ctx.strokeStyle = '#6a3718';
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
      ctx.fillStyle = '#42A5F5';
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
        const left = keys.has('arrowleft') || keys.has('q') || keys.has('a') || touchInputRef.current.left;
        const right = keys.has('arrowright') || keys.has('d') || touchInputRef.current.right;
        const jump = keys.has(' ') || keys.has('arrowup') || keys.has('w') || keys.has('z') || touchInputRef.current.jump;

        if (left && !right) {
          player.vx = -physics.moveSpeed;
          player.facing = -1;
        } else if (right && !left) {
          player.vx = physics.moveSpeed;
          player.facing = 1;
        } else {
          player.vx *= physics.drag;
          if (Math.abs(player.vx) < 0.1) player.vx = 0;
        }

        if (jump && player.onGround) {
          player.vy = physics.jumpSpeed;
          player.onGround = false;
        }

        player.vy += physics.gravity;
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

        if (player.y > HEIGHT + 110) {
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
            player.vy = physics.stompBounce;
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
            points += physics.coinValue;
            setScore(points);
          }
        }

        if (player.x >= winX) {
          ended = true;
          setLevelWon(true);
          if (levelIndex === LEVELS.length - 1) {
            setCampaignWon(true);
          }
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
  }, [levelIndex, runId]);

  const restartCampaign = (): void => {
    touchInputRef.current = { left: false, right: false, jump: false };
    setLevelIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setLevelWon(false);
    setCampaignWon(false);
    setRunId(value => value + 1);
  };

  const nextLevel = (): void => {
    if (levelIndex >= LEVELS.length - 1) return;
    touchInputRef.current = { left: false, right: false, jump: false };
    setLevelIndex(value => value + 1);
    setGameOver(false);
    setLevelWon(false);
    setRunId(value => value + 1);
  };

  const onControlDown = (key: 'left' | 'right' | 'jump') => (event: React.PointerEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setTouchInput(key, true);
  };

  const onControlUp = (key: 'left' | 'right' | 'jump') => (event: React.PointerEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setTouchInput(key, false);
  };

  const basePath = window.location.pathname.includes('/puka-pixel-adventure/') ? '/puka-pixel-adventure' : '';

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '16px' }}>
      <div style={{ width: 'min(100%, 980px)', background: '#2E7D32', border: '4px solid #1B5E20', borderRadius: 12, padding: 14, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', color: '#E8F5E9' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div>
            <strong style={{ fontSize: 20, color: '#FFEB3B', textShadow: '2px 2px 0 #000' }}>Puka&apos;s Party</strong>
            <div style={{ fontSize: 12, marginTop: 6 }}>{level.name}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontWeight: 700, fontSize: 12 }}>
            <span>Score: {score}</span>
            <span>Leben: {lives}</span>
            <span>Level: {levelIndex + 1}/{LEVELS.length}</span>
          </div>
        </header>

        <div style={{ marginBottom: 10, color: '#C8E6C9', fontSize: 11, lineHeight: 1.4 }}>{level.description}</div>

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{ width: '100%', maxWidth: WIDTH, height: 'auto', border: '3px solid #0D3B10', borderRadius: 8, background: '#8ed2ff', imageRendering: 'pixelated', touchAction: 'none' }}
        />

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onPointerDown={onControlDown('left')}
              onPointerUp={onControlUp('left')}
              onPointerCancel={onControlUp('left')}
              onPointerLeave={onControlUp('left')}
              style={{ border: '2px solid #1B5E20', background: '#66BB6A', color: '#fff', borderRadius: 10, padding: '10px 16px', minWidth: 60, touchAction: 'none' }}
            >
              ←
            </button>
            <button
              onPointerDown={onControlDown('right')}
              onPointerUp={onControlUp('right')}
              onPointerCancel={onControlUp('right')}
              onPointerLeave={onControlUp('right')}
              style={{ border: '2px solid #1B5E20', background: '#66BB6A', color: '#fff', borderRadius: 10, padding: '10px 16px', minWidth: 60, touchAction: 'none' }}
            >
              →
            </button>
          </div>
          <button
            onPointerDown={onControlDown('jump')}
            onPointerUp={onControlUp('jump')}
            onPointerCancel={onControlUp('jump')}
            onPointerLeave={onControlUp('jump')}
              style={{ border: '2px solid #880E4F', background: '#F06292', color: '#fff', borderRadius: 10, padding: '10px 20px', minWidth: 96, touchAction: 'none' }}
            >
            SPRUNG
          </button>
        </div>

        <footer style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11 }}>{statusText}</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {levelWon && !campaignWon && (
              <button
                onClick={nextLevel}
                style={{ border: '2px solid #1B5E20', background: '#66BB6A', color: '#fff', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
              >
                Naechstes Level
              </button>
            )}
            {(gameOver || campaignWon) && (
              <button
                onClick={restartCampaign}
                style={{ border: '2px solid #880E4F', background: '#F06292', color: '#fff', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
              >
                Kampagne neu starten
              </button>
            )}
            <a
              href={`${basePath}/`}
              style={{ border: '2px solid #263238', background: '#546E7A', color: '#fff', borderRadius: 6, padding: '6px 12px', textDecoration: 'none' }}
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
