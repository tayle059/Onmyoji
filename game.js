const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const starters = [
  {
    id: "kagewolf",
    name: "Kagewolf",
    title: "Bleak Fang",
    color: "#7f6bff",
    attack: 18,
    trapBonus: 8,
  },
  {
    id: "emberoni",
    name: "Ember Oni",
    title: "Ash Drinker",
    color: "#d74474",
    attack: 14,
    trapBonus: 14,
  },
  {
    id: "mirecrow",
    name: "Mirecrow",
    title: "Rot Oracle",
    color: "#5ed6a9",
    attack: 16,
    trapBonus: 10,
  },
];

const state = {
  selectedStarter: null,
  enemy: {
    name: "Abyss Wraith",
    hp: 100,
    maxHp: 100,
    color: "#8a6cff",
  },
  charms: 0,
  message: "Choose a starter demon before entering combat.",
  blink: 0,
};

const starterChoices = document.getElementById("starterChoices");
const charmsEl = document.getElementById("charms");
const allyNameEl = document.getElementById("allyName");
const enemyNameEl = document.getElementById("enemyName");
const enemyHpEl = document.getElementById("enemyHp");
const logEl = document.getElementById("log");

document.getElementById("attackBtn").addEventListener("click", shadowStrike);
document.getElementById("trapBtn").addEventListener("click", trapEnemy);
document.getElementById("resetBtn").addEventListener("click", resetHunt);

function createStarterButtons() {
  starters.forEach((starter) => {
    const btn = document.createElement("button");
    btn.textContent = `${starter.name} — ${starter.title}`;
    btn.addEventListener("click", () => {
      state.selectedStarter = starter;
      state.message = `${starter.name} joins your hunt. Dark pact awakened.`;
      updateUI();
      createStarterButtons();
    });

    if (state.selectedStarter?.id === starter.id) {
      btn.classList.add("active");
    }

    starterChoices.appendChild(btn);
  });
}

function shadowStrike() {
  if (!state.selectedStarter) {
    state.message = "You need a demon ally to channel a Shadow Strike.";
    updateUI();
    return;
  }

  if (state.enemy.hp <= 0) {
    state.message = "Enemy has fallen. Seal it with a charm.";
    updateUI();
    return;
  }

  const base = state.selectedStarter.attack;
  const variance = Math.floor(Math.random() * 7);
  const damage = base + variance;
  state.enemy.hp = Math.max(0, state.enemy.hp - damage);
  state.blink = 8;
  state.message = `${state.selectedStarter.name} tears for ${damage} damage.`;
  updateUI();
}

function trapEnemy() {
  if (!state.selectedStarter) {
    state.message = "No pact active. Pick one of the three starter demons.";
    updateUI();
    return;
  }

  if (state.enemy.hp > 0) {
    state.message = "Enemy still resisting. Weaken it before sealing.";
    updateUI();
    return;
  }

  const chance = 40 + state.selectedStarter.trapBonus + Math.floor(Math.random() * 30);
  if (chance >= 70) {
    state.charms += 1;
    state.message = `${state.enemy.name} is bound into an inked charm. Your grimoire grows darker.`;
    summonNewEnemy();
  } else {
    state.enemy.hp = 18;
    state.message = "The charm burned and the demon broke free at low HP!";
  }

  updateUI();
}

function summonNewEnemy() {
  const enemies = [
    { name: "Ruin Seraph", hp: 120, color: "#d74474" },
    { name: "Hollow Jorogumo", hp: 110, color: "#5ed6a9" },
    { name: "Abyss Wraith", hp: 100, color: "#8a6cff" },
  ];
  const next = enemies[Math.floor(Math.random() * enemies.length)];
  state.enemy = { ...next, maxHp: next.hp };
}

function resetHunt() {
  state.enemy = {
    name: "Abyss Wraith",
    hp: 100,
    maxHp: 100,
    color: "#8a6cff",
  };
  state.charms = 0;
  state.message = "Night resets. The curse begins anew.";
  updateUI();
}

function updateUI() {
  starterChoices.innerHTML = "";
  createStarterButtons();
  charmsEl.textContent = state.charms;
  allyNameEl.textContent = state.selectedStarter?.name ?? "None";
  enemyNameEl.textContent = state.enemy.name;
  enemyHpEl.textContent = state.enemy.hp;
  logEl.textContent = state.message;
}

function isoTile(x, y, z = 0) {
  return {
    x: 460 + (x - y) * 24,
    y: 180 + (x + y) * 12 - z,
  };
}

function drawDiamond(px, py, w, h, fill, stroke = "#140f1e") {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.moveTo(px, py - h / 2);
  ctx.lineTo(px + w / 2, py);
  ctx.lineTo(px, py + h / 2);
  ctx.lineTo(px - w / 2, py);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawWorld() {
  ctx.fillStyle = "#08070c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < 12; y += 1) {
    for (let x = 0; x < 12; x += 1) {
      const p = isoTile(x, y);
      const shade = (x + y) % 2 === 0 ? "#1c1726" : "#241b30";
      drawDiamond(p.x, p.y, 48, 24, shade);

      if (Math.random() < 0.015) {
        ctx.fillStyle = "#41395a";
        ctx.fillRect(p.x - 1, p.y - 6, 2, 2);
      }
    }
  }

  drawShrine();
  drawShaman();
  drawAlly();
  drawEnemy();
}

function drawShrine() {
  const p = isoTile(5, 5);
  drawDiamond(p.x, p.y - 4, 72, 36, "#31203f");
  ctx.fillStyle = "#5b375f";
  ctx.fillRect(p.x - 8, p.y - 36, 16, 26);
  ctx.fillStyle = "#d9b3cf";
  ctx.fillRect(p.x - 10, p.y - 40, 20, 4);
}

function drawShaman() {
  const p = isoTile(4.2, 6.1, 20);
  ctx.fillStyle = "#111216";
  ctx.fillRect(p.x - 5, p.y - 12, 10, 12);
  ctx.fillStyle = "#d74474";
  ctx.fillRect(p.x - 2, p.y - 11, 4, 7);
  ctx.fillStyle = "#f2d5c5";
  ctx.fillRect(p.x - 3, p.y - 16, 6, 4);
  ctx.fillStyle = "#ede8f8";
  ctx.fillRect(p.x + 6, p.y - 10, 6, 3);
}

function drawAlly() {
  if (!state.selectedStarter) {
    return;
  }

  const p = isoTile(3.2, 5.2, 10);
  ctx.fillStyle = state.selectedStarter.color;
  ctx.fillRect(p.x - 7, p.y - 8, 14, 8);
  ctx.fillStyle = "#1b1324";
  ctx.fillRect(p.x - 4, p.y - 6, 2, 2);
}

function drawEnemy() {
  const p = isoTile(7.4, 4.6, 14);
  const pulse = state.blink > 0 ? "#fff1f6" : state.enemy.color;
  ctx.fillStyle = pulse;
  ctx.fillRect(p.x - 8, p.y - 10, 16, 11);
  ctx.fillStyle = "#180e25";
  ctx.fillRect(p.x - 5, p.y - 7, 2, 2);
  ctx.fillRect(p.x + 3, p.y - 7, 2, 2);

  const hpPct = state.enemy.hp / state.enemy.maxHp;
  ctx.fillStyle = "#2f1f44";
  ctx.fillRect(p.x - 28, p.y - 22, 56, 5);
  ctx.fillStyle = "#d74474";
  ctx.fillRect(p.x - 28, p.y - 22, Math.max(0, 56 * hpPct), 5);

  if (state.blink > 0) {
    state.blink -= 1;
  }
}

function frame() {
  drawWorld();
  requestAnimationFrame(frame);
}

updateUI();
frame();
