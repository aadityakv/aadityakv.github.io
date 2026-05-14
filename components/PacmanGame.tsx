"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAZE_TEMPLATE = [
  "###################",
  "#........#........#",
  "#o##.###.#.###.##o#",
  "#.................#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "#......G.#........#",
  "####.###.#.###.####",
  "#....#...#...#....#",
  "#.##.#.#####.#.##.#",
  "#.................#",
  "#o##.###.#.###.##o#",
  "#........P........#",
  "###################",
];

const COLS = 19;
const ROWS = 15;
const CELL = 22;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

const PACMAN_SPEED = 5.5;
const GHOST_SPEED = 4.4;
const SCARED_SPEED = 2.6;
const SCARED_DURATION = 6500;
const PELLET_SCORE = 10;
const POWER_SCORE = 50;
const GHOST_SCORE = 200;
const READY_MS = 1400;

type Dir = "up" | "down" | "left" | "right" | null;
type Status = "ready" | "playing" | "won" | "lost";

type Entity = {
  col: number;
  row: number;
  dir: Dir;
  nextDir: Dir;
  progress: number;
};

type Ghost = Entity & {
  color: string;
  scared: number;
  spawn: { col: number; row: number };
  personality: "chase" | "ambush" | "random";
  releaseAt: number;
  eaten: boolean;
};

type Floater = { x: number; y: number; text: string; ttl: number; color: string };

type GameState = {
  grid: string[][];
  pacman: Entity;
  pacmanSpawn: { col: number; row: number };
  pacmanMouth: number;
  ghosts: Ghost[];
  pelletsRemaining: number;
  score: number;
  lives: number;
  status: Status;
  readyUntil: number;
  paused: boolean;
  floaters: Floater[];
  ghostsEatenThisPower: number;
};

const ALL_DIRS: Dir[] = ["up", "down", "left", "right"];

function oppositeDir(d: Dir): Dir {
  if (d === "up") return "down";
  if (d === "down") return "up";
  if (d === "left") return "right";
  if (d === "right") return "left";
  return null;
}

function dirVec(d: Dir) {
  if (d === "up") return { dx: 0, dy: -1 };
  if (d === "down") return { dx: 0, dy: 1 };
  if (d === "left") return { dx: -1, dy: 0 };
  if (d === "right") return { dx: 1, dy: 0 };
  return { dx: 0, dy: 0 };
}

function dirAngle(d: Dir): number {
  if (d === "right") return 0;
  if (d === "down") return Math.PI / 2;
  if (d === "left") return Math.PI;
  if (d === "up") return -Math.PI / 2;
  return 0;
}

function parseMaze() {
  const grid: string[][] = [];
  let pacmanStart = { col: 9, row: 13 };
  let ghostStart = { col: 9, row: 7 };
  let pelletCount = 0;
  for (let r = 0; r < MAZE_TEMPLATE.length; r++) {
    const row: string[] = [];
    for (let c = 0; c < MAZE_TEMPLATE[r].length; c++) {
      const ch = MAZE_TEMPLATE[r][c];
      if (ch === "P") {
        pacmanStart = { col: c, row: r };
        row.push(" ");
      } else if (ch === "G") {
        ghostStart = { col: c, row: r };
        row.push(" ");
      } else {
        row.push(ch);
        if (ch === "." || ch === "o") pelletCount++;
      }
    }
    grid.push(row);
  }
  return { grid, pacmanStart, ghostStart, pelletCount };
}

function isWall(grid: string[][], col: number, row: number) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true;
  return grid[row][col] === "#";
}

function canEnter(grid: string[][], col: number, row: number, dir: Dir) {
  if (!dir) return false;
  const { dx, dy } = dirVec(dir);
  return !isWall(grid, col + dx, row + dy);
}

function renderPos(e: Entity) {
  const { dx, dy } = dirVec(e.dir);
  return {
    x: (e.col + 0.5 + dx * e.progress) * CELL,
    y: (e.row + 0.5 + dy * e.progress) * CELL,
  };
}

function tryReverse(e: Entity) {
  if (e.dir && e.nextDir && e.nextDir === oppositeDir(e.dir) && e.progress > 0 && e.progress < 1) {
    const { dx, dy } = dirVec(e.dir);
    e.col += dx;
    e.row += dy;
    e.dir = e.nextDir;
    e.progress = 1 - e.progress;
    e.nextDir = null;
  }
}

function chooseGhostDir(g: Ghost, target: { col: number; row: number }, grid: string[][]): Dir {
  const back = oppositeDir(g.dir);
  let candidates: Dir[] = ALL_DIRS.filter(
    (d) => canEnter(grid, g.col, g.row, d) && d !== back,
  );
  if (candidates.length === 0) {
    return back;
  }
  if (g.scared > 0 || g.personality === "random") {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  let best: Dir = candidates[0];
  let bestDist = Infinity;
  const tieOrder: Dir[] = ["up", "left", "down", "right"];
  for (const d of tieOrder) {
    if (!candidates.includes(d)) continue;
    const v = dirVec(d);
    const nc = g.col + v.dx;
    const nr = g.row + v.dy;
    const dx = nc - target.col;
    const dy = nr - target.row;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  return best;
}

function resetEntity(e: Entity, col: number, row: number, dir: Dir = null) {
  e.col = col;
  e.row = row;
  e.dir = dir;
  e.nextDir = null;
  e.progress = 0;
}

function newGameState(): GameState {
  const { grid, pacmanStart, ghostStart, pelletCount } = parseMaze();
  const ghosts: Ghost[] = [
    {
      col: ghostStart.col,
      row: ghostStart.row,
      dir: "left",
      nextDir: null,
      progress: 0,
      color: "#ef4444",
      scared: 0,
      spawn: { ...ghostStart },
      personality: "chase",
      releaseAt: 0,
      eaten: false,
    },
    {
      col: ghostStart.col,
      row: ghostStart.row,
      dir: "right",
      nextDir: null,
      progress: 0,
      color: "#ec4899",
      scared: 0,
      spawn: { ...ghostStart },
      personality: "ambush",
      releaseAt: 2200,
      eaten: false,
    },
    {
      col: ghostStart.col,
      row: ghostStart.row,
      dir: "left",
      nextDir: null,
      progress: 0,
      color: "#22d3ee",
      scared: 0,
      spawn: { ...ghostStart },
      personality: "random",
      releaseAt: 5000,
      eaten: false,
    },
  ];
  return {
    grid,
    pacman: {
      col: pacmanStart.col,
      row: pacmanStart.row,
      dir: null,
      nextDir: null,
      progress: 0,
    },
    pacmanSpawn: { ...pacmanStart },
    pacmanMouth: 0,
    ghosts,
    pelletsRemaining: pelletCount,
    score: 0,
    lives: 3,
    status: "ready",
    readyUntil: READY_MS,
    paused: false,
    floaters: [],
    ghostsEatenThisPower: 0,
  };
}

function resetPositions(s: GameState) {
  resetEntity(s.pacman, s.pacmanSpawn.col, s.pacmanSpawn.row);
  for (const g of s.ghosts) {
    resetEntity(g, g.spawn.col, g.spawn.row, g.personality === "ambush" ? "right" : "left");
    g.scared = 0;
    g.eaten = false;
  }
  s.readyUntil = READY_MS;
  s.status = "ready";
  s.ghostsEatenThisPower = 0;
}

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const lastFrameRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<Status>("ready");
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const syncReact = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    setScore((prev) => (prev === s.score ? prev : s.score));
    setLives((prev) => (prev === s.lives ? prev : s.lives));
    setStatus((prev) => (prev === s.status ? prev : s.status));
  }, []);

  const start = useCallback(() => {
    stateRef.current = newGameState();
    elapsedRef.current = 0;
    setPaused(false);
    syncReact();
  }, [syncReact]);

  useEffect(() => {
    start();
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("pacman_high") : null;
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, [start]);

  useEffect(() => {
    if (status === "lost" || status === "won") {
      const s = stateRef.current;
      if (!s) return;
      if (s.score > highScore) {
        setHighScore(s.score);
        try {
          window.localStorage.setItem("pacman_high", String(s.score));
        } catch {}
      }
    }
  }, [status, highScore]);

  const setDir = useCallback((d: Dir) => {
    const s = stateRef.current;
    if (!s) return;
    if (s.status !== "playing" && s.status !== "ready") return;
    s.pacman.nextDir = d;
    if (!s.pacman.dir && d && canEnter(s.grid, s.pacman.col, s.pacman.row, d)) {
      s.pacman.dir = d;
      s.pacman.nextDir = null;
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      let dir: Dir = null;
      if (k === "ArrowUp" || k === "w" || k === "W") dir = "up";
      else if (k === "ArrowDown" || k === "s" || k === "S") dir = "down";
      else if (k === "ArrowLeft" || k === "a" || k === "A") dir = "left";
      else if (k === "ArrowRight" || k === "d" || k === "D") dir = "right";
      else if (k === " " || k === "p" || k === "P") {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      } else if (k === "r" || k === "R") {
        start();
        return;
      }
      if (dir) {
        e.preventDefault();
        setDir(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir, start]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const advance = (e: Entity, speed: number, dt: number, grid: string[][], onArrive?: () => Dir | undefined, isPacman = false) => {
      tryReverse(e);
      // If we're at a cell center and current dir leads into a wall, stop and let nextDir/AI re-pick.
      if (e.dir && e.progress === 0 && !canEnter(grid, e.col, e.row, e.dir)) {
        e.dir = null;
      }
      if (!e.dir) {
        if (e.nextDir && canEnter(grid, e.col, e.row, e.nextDir)) {
          e.dir = e.nextDir;
          e.nextDir = null;
          e.progress = 0;
        } else if (onArrive) {
          const ai = onArrive();
          if (ai && canEnter(grid, e.col, e.row, ai)) {
            e.dir = ai;
            e.progress = 0;
          } else {
            return;
          }
        } else {
          return;
        }
      }
      let remaining = speed * dt;
      let safety = 8;
      while (remaining > 0 && e.dir && safety-- > 0) {
        const toBoundary = 1 - e.progress;
        if (remaining < toBoundary) {
          e.progress += remaining;
          remaining = 0;
        } else {
          remaining -= toBoundary;
          const { dx, dy } = dirVec(e.dir);
          e.col += dx;
          e.row += dy;
          e.progress = 0;
          if (isPacman) {
            const s = stateRef.current!;
            const cell = s.grid[e.row][e.col];
            if (cell === ".") {
              s.grid[e.row][e.col] = " ";
              s.score += PELLET_SCORE;
              s.pelletsRemaining -= 1;
            } else if (cell === "o") {
              s.grid[e.row][e.col] = " ";
              s.score += POWER_SCORE;
              s.pelletsRemaining -= 1;
              s.ghostsEatenThisPower = 0;
              for (const g of s.ghosts) {
                if (!g.eaten) {
                  g.scared = SCARED_DURATION;
                }
              }
            }
            if (s.pelletsRemaining <= 0) {
              s.status = "won";
            }
          }
          // AI choice for ghosts
          const aiChoice = onArrive?.();
          if (aiChoice !== undefined && aiChoice !== null) {
            e.dir = aiChoice;
          } else if (e.nextDir && canEnter(grid, e.col, e.row, e.nextDir)) {
            e.dir = e.nextDir;
            e.nextDir = null;
          } else if (!canEnter(grid, e.col, e.row, e.dir)) {
            e.dir = null;
            remaining = 0;
          }
        }
      }
    };

    const checkCollision = () => {
      const s = stateRef.current!;
      const p = renderPos(s.pacman);
      for (const g of s.ghosts) {
        if (g.eaten) continue;
        const gp = renderPos(g);
        const dx = p.x - gp.x;
        const dy = p.y - gp.y;
        if (dx * dx + dy * dy < (CELL * 0.55) ** 2) {
          if (g.scared > 0) {
            g.eaten = true;
            g.scared = 0;
            s.ghostsEatenThisPower += 1;
            const pts = GHOST_SCORE * Math.pow(2, s.ghostsEatenThisPower - 1);
            s.score += pts;
            s.floaters.push({ x: gp.x, y: gp.y, text: `+${pts}`, ttl: 800, color: "#f1bf85" });
          } else {
            s.lives -= 1;
            if (s.lives <= 0) {
              s.status = "lost";
            } else {
              resetPositions(s);
            }
            return;
          }
        }
      }
    };

    const loop = (t: number) => {
      const last = lastFrameRef.current || t;
      const dtMs = Math.min(t - last, 50);
      lastFrameRef.current = t;
      const s = stateRef.current;
      if (!s) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = dtMs / 1000;
      if (!paused && s.status !== "lost" && s.status !== "won") {
        elapsedRef.current += dtMs;
        if (s.status === "ready") {
          s.readyUntil -= dtMs;
          if (s.readyUntil <= 0) {
            s.status = "playing";
          }
        }
        if (s.status === "playing") {
          // Pacman
          advance(s.pacman, PACMAN_SPEED, dt, s.grid, undefined, true);
          s.pacmanMouth += dt * 10;

          // Ghosts
          for (const g of s.ghosts) {
            if (g.eaten) {
              // Respawn at home; AI will pick a legal direction.
              resetEntity(g, g.spawn.col, g.spawn.row, null);
              g.eaten = false;
              g.releaseAt = elapsedRef.current + 2500;
              continue;
            }
            if (elapsedRef.current < g.releaseAt) continue;
            const speed = g.scared > 0 ? SCARED_SPEED : GHOST_SPEED;
            advance(g, speed, dt, s.grid, () => {
              const target =
                g.personality === "ambush"
                  ? {
                      col:
                        s.pacman.col + dirVec(s.pacman.dir).dx * 4,
                      row:
                        s.pacman.row + dirVec(s.pacman.dir).dy * 4,
                    }
                  : { col: s.pacman.col, row: s.pacman.row };
              return chooseGhostDir(g, target, s.grid);
            });
            if (g.scared > 0) {
              g.scared = Math.max(0, g.scared - dtMs);
            }
          }

          // Floaters
          for (const f of s.floaters) f.ttl -= dtMs;
          s.floaters = s.floaters.filter((f) => f.ttl > 0);

          checkCollision();
        }
      }

      draw(ctx, s, paused);
      syncReact();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = 0;
    };
  }, [paused, syncReact]);

  // Touch swipe controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) < 20) return;
      if (ax > ay) {
        setDir(dx > 0 ? "right" : "left");
      } else {
        setDir(dy > 0 ? "down" : "up");
      }
      touchStartRef.current = null;
    };
    canvas.addEventListener("touchstart", onStart, { passive: true });
    canvas.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, [setDir]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-md items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
        <span>
          Score <span className="ml-2 text-ink">{score.toString().padStart(4, "0")}</span>
        </span>
        <span>
          Hi <span className="ml-2 text-ink">{Math.max(highScore, score).toString().padStart(4, "0")}</span>
        </span>
        <span className="flex items-center gap-1">
          Lives
          <span className="ml-1 inline-flex gap-1">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span
                key={i}
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full bg-accent"
              />
            ))}
          </span>
        </span>
      </div>

      <div className="relative rounded border border-rule bg-paper p-2 shadow-[0_0_0_1px_rgba(35,35,42,0.6)]">
        <canvas
          ref={canvasRef}
          className="block touch-none select-none"
          tabIndex={0}
          aria-label="Pacman game canvas"
        />
        {(status === "lost" || status === "won" || paused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/80 backdrop-blur-[1px]">
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                {status === "won" ? "Cleared" : status === "lost" ? "Game over" : "Paused"}
              </p>
              <p className="mt-1 font-serif text-3xl italic text-accent-soft">
                {status === "won" ? "Nice." : status === "lost" ? "Try again." : "Take a breath."}
              </p>
              <button
                onClick={() => {
                  if (paused) {
                    setPaused(false);
                  } else {
                    start();
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 border border-rule px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim transition-colors hover:border-accent-soft hover:text-ink"
              >
                {paused ? "Resume" : "Play again"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        <span className="hidden sm:inline">Arrows / WASD · Space to pause · R to restart</span>
        <span className="sm:hidden">Swipe to move · tap buttons</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="border border-rule px-2 py-1 text-ink-dim transition-colors hover:border-accent-soft hover:text-ink"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={start}
            className="border border-rule px-2 py-1 text-ink-dim transition-colors hover:border-accent-soft hover:text-ink"
          >
            Restart
          </button>
        </div>
      </div>

      {/* On-screen dpad for touch */}
      <div className="grid grid-cols-3 gap-1 sm:hidden" aria-hidden>
        <span />
        <DpadButton label="↑" onPress={() => setDir("up")} />
        <span />
        <DpadButton label="←" onPress={() => setDir("left")} />
        <span />
        <DpadButton label="→" onPress={() => setDir("right")} />
        <span />
        <DpadButton label="↓" onPress={() => setDir("down")} />
        <span />
      </div>
    </div>
  );
}

function DpadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className="flex h-11 w-11 items-center justify-center border border-rule font-mono text-base text-ink-dim active:border-accent-soft active:text-accent"
    >
      {label}
    </button>
  );
}

function draw(ctx: CanvasRenderingContext2D, s: GameState, paused: boolean) {
  ctx.fillStyle = "#0a0a0b";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Walls
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = s.grid[r][c];
      const x = c * CELL;
      const y = r * CELL;
      if (cell === "#") {
        drawWall(ctx, s.grid, c, r, x, y);
      } else if (cell === ".") {
        ctx.fillStyle = "#ece8df";
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === "o") {
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 220);
        ctx.fillStyle = "#f1bf85";
        ctx.globalAlpha = 0.6 + 0.4 * pulse;
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Pacman
  const p = renderPos(s.pacman);
  const angle = dirAngle(s.pacman.dir);
  const open = Math.abs(Math.sin(s.pacmanMouth)) * 0.45 + 0.05;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  ctx.fillStyle = "#e89a4a";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, CELL * 0.42, open * Math.PI, (2 - open) * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Ghosts
  for (const g of s.ghosts) {
    if (g.eaten) continue;
    const gp = renderPos(g);
    drawGhost(ctx, gp.x, gp.y, g);
  }

  // Floaters
  for (const f of s.floaters) {
    ctx.fillStyle = f.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, f.ttl / 800));
    ctx.font = "bold 11px ui-monospace, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(f.text, f.x, f.y - (800 - f.ttl) * 0.02);
    ctx.globalAlpha = 1;
  }

  // Ready overlay
  if (s.status === "ready" && !paused) {
    ctx.fillStyle = "#f1bf85";
    ctx.font = "italic 22px 'Instrument Serif', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("ready", WIDTH / 2, HEIGHT / 2 + 28);
  }
}

function drawWall(
  ctx: CanvasRenderingContext2D,
  grid: string[][],
  c: number,
  r: number,
  x: number,
  y: number,
) {
  const wallColor = "#1f3a8a";
  const lineColor = "#3b5bd9";
  ctx.fillStyle = wallColor;
  ctx.fillRect(x, y, CELL, CELL);

  // Inner outline: draw a thin stroke along the maze edges
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  const inset = 3;
  const sides: Array<[number, number, number, number]> = [];
  // Top edge if cell above is not a wall
  if (!isWall(grid, c, r - 1)) {
    sides.push([x + inset, y + inset, x + CELL - inset, y + inset]);
  }
  if (!isWall(grid, c, r + 1)) {
    sides.push([x + inset, y + CELL - inset, x + CELL - inset, y + CELL - inset]);
  }
  if (!isWall(grid, c - 1, r)) {
    sides.push([x + inset, y + inset, x + inset, y + CELL - inset]);
  }
  if (!isWall(grid, c + 1, r)) {
    sides.push([x + CELL - inset, y + inset, x + CELL - inset, y + CELL - inset]);
  }
  ctx.beginPath();
  for (const [x1, y1, x2, y2] of sides) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

function drawGhost(ctx: CanvasRenderingContext2D, x: number, y: number, g: Ghost) {
  const radius = CELL * 0.42;
  const scared = g.scared > 0;
  const flashing = scared && g.scared < 1500 && Math.floor(g.scared / 200) % 2 === 0;
  const body = scared ? (flashing ? "#ece8df" : "#3b5bd9") : g.color;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y - 1, radius, Math.PI, 0);
  ctx.lineTo(x + radius, y + radius - 1);
  const wiggle = 3;
  const steps = 4;
  for (let i = 0; i < steps; i++) {
    const px = x + radius - (i + 1) * ((radius * 2) / steps);
    const py = y + radius - 1 - (i % 2 === 0 ? wiggle : 0);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x - radius, y - 1);
  ctx.closePath();
  ctx.fill();

  // Eyes
  if (scared) {
    ctx.fillStyle = flashing ? "#1f3a8a" : "#ece8df";
    ctx.fillRect(x - 4, y - 3, 2, 3);
    ctx.fillRect(x + 2, y - 3, 2, 3);
    ctx.strokeStyle = flashing ? "#1f3a8a" : "#ece8df";
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 4);
    ctx.lineTo(x - 2, y + 2);
    ctx.lineTo(x + 1, y + 4);
    ctx.lineTo(x + 4, y + 2);
    ctx.lineTo(x + 6, y + 4);
    ctx.stroke();
  } else {
    const lookX = g.dir === "left" ? -1.5 : g.dir === "right" ? 1.5 : 0;
    const lookY = g.dir === "up" ? -1.5 : g.dir === "down" ? 1.5 : 0;
    ctx.fillStyle = "#ece8df";
    ctx.beginPath();
    ctx.arc(x - 3.5, y - 2, 3, 0, Math.PI * 2);
    ctx.arc(x + 3.5, y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0a0a0b";
    ctx.beginPath();
    ctx.arc(x - 3.5 + lookX, y - 2 + lookY, 1.4, 0, Math.PI * 2);
    ctx.arc(x + 3.5 + lookX, y - 2 + lookY, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}
