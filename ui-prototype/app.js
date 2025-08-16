// UI PROTOTYPE - SPA for Blink Mobile UI
// All state is in-memory, no backend.

const AVATAR_COLORS = [
  "#2E7CF6", "#34D399", "#F87171", "#8CA0B3", "#F59E42", "#A78BFA"
];
const NAMES = [
  "Ethan", "Liam", "Ava", "Mia", "Noah", "Olivia", "Sophia", "Lucas"
];
const CHANNELS = [
  { name: "Crypto Alpha", followers: 3200, growth: 18, avatar: "CA" },
  { name: "Farcaster News", followers: 14500, growth: 22, avatar: "FN" },
  { name: "DeFi Club", followers: 5640, growth: 12, avatar: "DC" },
  { name: "NFT Lounge", followers: 9900, growth: 16, avatar: "NL" },
  { name: "SportsCast", followers: 8100, growth: 28, avatar: "SC" },
];
const CREATOR_LIST = [
  { name: "Ethan", followers: 24500, avatar: "E" },
  { name: "Ava", followers: 18200, avatar: "A" },
  { name: "Liam", followers: 10700, avatar: "L" },
  { name: "Mia", followers: 9100, avatar: "M" },
  { name: "Olivia", followers: 8700, avatar: "O" },
];
const PROFILE_HISTORY = [
  { title: "Ethan vs. Liam", status: "Won", amount: 50 },
  { title: "SportsCast", status: "Lost", amount: -30 },
  { title: "NFT Lounge", status: "Won", amount: 44 },
  { title: "Channel Wars", status: "Lost", amount: -12 },
];
const BETS_OPEN = [
  { title: "Channel Wars", subtitle: "vs. NFT Lounge", avatar: "CW", action: "Bet" },
  { title: "Ethan vs. Liam", subtitle: "Creator Duel", avatar: "EL", action: "Bet" },
  { title: "Ava's Poll", subtitle: "Poll: Will ETH hit 4k?", avatar: "A", action: "Bet" },
];
const BETS_COMPLETED = [
  { title: "Farcaster News", subtitle: "Channel Growth", avatar: "FN", action: "View", status: "Won", amount: 20 },
  { title: "DeFi Club", subtitle: "Engagement Battle", avatar: "DC", action: "View", status: "Lost", amount: -10 },
];
const POLL_BETS = [
  {
    question: "Will ETH flip BTC in 2025?",
    handle: "@eth_bull",
    percent: 60,
    leftOdds: 1.5,
    rightOdds: 2.2,
    time: "3h 15m",
  },
  {
    question: "Will Farcaster hit 1m users by EOY?",
    handle: "@growthcaster",
    percent: 35,
    leftOdds: 1.9,
    rightOdds: 1.8,
    time: "1d 2h",
  }
];

// ROUTER
let routeHistory = [];
function navigate(hash, replace = false) {
  if (replace) window.location.replace(hash);
  else window.location.hash = hash;
}
window.onhashchange = render;
window.addEventListener("DOMContentLoaded", () => {
  render();
  // Remember last tab
  if (!location.hash) navigate("#home", true);
});

// ICONS
const ICONS = {
  home: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12L12 5l8 7"/><path d="M19 10v7a2 2 0 0 1-2 2h-2m-6 0H7a2 2 0 0 1-2-2v-7" /></svg>`,
  chart: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="6" height="8"/><rect x="9" y="8" width="6" height="12"/><rect x="15" y="4" width="6" height="16"/></svg>`,
  dollar: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M17 7H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7" /></svg>`,
  user: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" /></svg>`,
  back: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 19l-7-7 7-7"/></svg>`,
  search: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="7"/><path d="M16 16l-3-3"/></svg>`,
  plus: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6v12M6 12h12"/></svg>`,
};

// ASSET
function renderAvatar(avatar, size = 40) {
  if (!avatar) avatar = "?";
  const color = AVATAR_COLORS[avatar.charCodeAt(0) % AVATAR_COLORS.length];
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${color};">${avatar
    .toString()
    .substr(0, 2)
    .toUpperCase()}</div>`;
}

// HELPERS
function formatAmount(amount) {
  if (typeof amount === "number")
    return (amount > 0
      ? `<span class="text-success">+$${amount}</span>`
      : `<span class="text-danger">-$${Math.abs(amount)}</span>`);
  return "";
}

// Top Bar
function TopBar({ title, back, action }) {
  return `<div class="topbar">
    ${
      back
        ? `<button class="back-btn" aria-label="Back" onclick="window.history.back()">${ICONS.back}</button>`
        : `<span style="width:40px;display:inline-block"></span>`
    }
    <div class="title">${title}</div>
    <div class="topbar-action">${action || ""}</div>
  </div>`;
}

// Tab Bar
function TabBar(active) {
  const tabs = [
    { key: "home", label: "Home", icon: ICONS.home },
    { key: "markets", label: "Markets", icon: ICONS.chart },
    { key: "bets", label: "Bets", icon: ICONS.dollar },
    { key: "profile", label: "Profile", icon: ICONS.user },
  ];
  return `<nav class="tabbar" role="tablist">
    ${tabs
      .map(
        (tab) => `<div class="tab${tab.key === active ? " active" : ""}" aria-label="${tab.label}" onclick="navigate('#${tab.key}')">
        <span class="icon">${tab.icon}</span>
        <span>${tab.label}</span>
        ${tab.key === active ? `<span class="dot"></span>` : ""}
      </div>`
      )
      .join("")}
  </nav>`;
}

// Segmented control
function Segmented({ options, active, onSelect }) {
  return `<div class="segmented" role="tablist">
    ${options
      .map(
        (opt, i) =>
          `<div class="segment${i === active ? " active" : ""}" aria-label="${opt}" onclick="${onSelect}(${i})">${opt}</div>`
      )
      .join("")}
  </div>`;
}

// Progress bar
function renderProgressBar(percent) {
  return `<div class="progress"><div class="progress-bar" style="width:${percent}%;"></div></div>`;
}

// --- SCREENS ---
function render() {
  const hash = location.hash.replace(/^#/, "") || "home";
  let html = "";
  let tabKey = hash.split("-")[0];
  routeHistory.push(hash);

  if (hash === "home") {
    html = TopBar({ title: "Blink", back: false }) +
      `<div style="padding:36px 18px 90px 18px;text-align:center;">
        <h2 style="font-size:2rem;font-weight:700;">Welcome to Blink</h2>
        <p style="color:var(--text-secondary);font-size:1.08rem;margin:14px 0 40px 0;">Bet on creators, channels, and viral moments.</p>
        <button class="full-btn" style="margin-top:32px;">Get Started</button>
      </div>`;
  }

  // Profile
  else if (hash === "profile") {
    html = TopBar({ title: "Profile", back: false });
    html += `<div style="padding:22px 18px 90px 18px;">${renderProfile()}</div>`;
  }

  // Bets tab
  else if (hash === "bets") {
    html = TopBar({ title: "Bets", back: false, action: `<button class="pill-btn" aria-label="Add Bet" onclick="navigate('#bets-polls')">${ICONS.plus}</button>` });
    html += renderBetsScreen();
  }
  else if (hash === "bets-polls") {
    html = TopBar({ title: "Bets", back: true, action: `<button class="pill-btn" aria-label="Add Bet">${ICONS.plus}</button>` });
    html += renderBetsPollsScreen();
  }

  // Markets tab
  else if (hash === "markets") {
    html = TopBar({
      title: "Creator Bets",
      back: false,
      action: `<button class="pill-btn" aria-label="Farcaster Bets" onclick="navigate('#markets-farcaster')">Farcaster</button>`,
    });
    html += renderMarketsScreen();
  }
  else if (hash === "markets-farcaster") {
    html = TopBar({ title: "Farcaster Bets", back: true });
    html += renderMarketsFarcasterScreen();
  }

  // fallback
  else {
    html = TopBar({ title: "Blink", back: false }) +
      `<div style="padding:36px 16px 90px 16px;text-align:center;">
        <h2 style="font-size:2rem;font-weight:700;">Not Found</h2>
        <p style="color:var(--text-secondary);font-size:1.08rem;margin:14px 0 40px 0;">The page you requested does not exist.</p>
      </div>`;
    tabKey = "home";
  }

  html += TabBar(tabKey);
  document.getElementById("app-root").innerHTML = `<div class="app-container">${html}</div>`;
}

// --- SCREEN RENDERERS ---

function renderProfile() {
  return `
    <img src="assets/avatars/avatar1.svg" class="profile-avatar" alt="Profile Avatar" />
    <div style="text-align:center;">
      <div class="bold" style="font-size:1.2rem;">Ava Lane</div>
      <div class="text-secondary" style="margin-top:2px;">@avalane</div>
      <div class="text-secondary" style="margin-top:2px;">Joined Jan 2024</div>
    </div>
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-value">23</div>
        <div class="stat-label">Bets</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">14</div>
        <div class="stat-label">Wins</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">9</div>
        <div class="stat-label">Losses</div>
      </div>
    </div>
    <div class="bold" style="font-size:1.08rem;margin-bottom:6px;">Betting History</div>
    <ul class="list">
      ${PROFILE_HISTORY.map(
        (h) => `
        <li class="list-item">
          ${renderAvatar(h.title.charAt(0))}
          <div class="list-main">
            <div class="list-title">${h.title}</div>
            <div class="list-sub">${h.status}</div>
          </div>
          <div class="list-accessory">${formatAmount(h.amount)}</div>
        </li>
      `
      ).join("")}
    </ul>
  `;
}

function renderBetsScreen() {
  let seg = window.betsSeg || 0;
  const setSeg = (i) => {
    window.betsSeg = i; render();
  };
  return `
    ${Segmented({
      options: ["Open", "Completed"],
      active: seg,
      onSelect: "window.betsSetSeg",
    })}
    <ul class="list" style="margin-top:2px;">
      ${(seg === 0 ? BETS_OPEN : BETS_COMPLETED)
        .map(
          (b) => `
        <li class="list-item">
          ${renderAvatar(b.avatar)}
          <div class="list-main">
            <div class="list-title">${b.title}</div>
            <div class="list-sub">${b.subtitle || b.status || ""}</div>
          </div>
          <div class="list-accessory">
            <button class="pill-btn" style="min-width:64px;">${b.action || "Bet"}</button>
          </div>
        </li>
      `
        )
        .join("")}
    </ul>
    <script>window.betsSetSeg = ${setSeg.toString()};</script>
  `;
}

function renderBetsPollsScreen() {
  return POLL_BETS.map(poll => `
    <div class="card" style="margin-bottom:24px;">
      <div class="bold" style="font-size:1.05rem;">${poll.question}</div>
      <div class="text-secondary" style="font-size:0.93rem;">Poll by ${poll.handle}</div>
      ${renderProgressBar(poll.percent)}
      <div style="display:flex;justify-content:space-between;margin:12px 0 7px 0;">
        <span class="bold">Yes</span>
        <span class="text-secondary" style="font-size:0.96rem;">${poll.leftOdds}x</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span class="bold">No</span>
        <span class="text-secondary" style="font-size:0.96rem;">${poll.rightOdds}x</span>
      </div>
      <div class="text-secondary" style="font-size:0.92rem;margin-bottom:8px;">${poll.percent}% voted • ${poll.time} left</div>
      <button class="full-btn">Place Bet</button>
    </div>
  `).join("");
}

function renderMarketsScreen() {
  let seg = window.marketsSeg || 0;
  const setSeg = (i) => {
    window.marketsSeg = i; render();
  };
  return `
    <div class="search-bar">
      <span class="search-icon">${ICONS.search}</span>
      <input type="text" placeholder="Search creators..." style="flex:1;" disabled />
    </div>
    ${Segmented({
      options: ["Trending", "Popular", "New"],
      active: seg,
      onSelect: "window.marketsSetSeg",
    })}
    <ul class="list" style="margin-top:2px;">
      ${CREATOR_LIST.map((c) => `
        <li class="list-item">
          ${renderAvatar(c.avatar)}
          <div class="list-main">
            <div class="list-title">${c.name}</div>
            <div class="list-sub">${c.followers.toLocaleString()} followers</div>
          </div>
          <div class="list-accessory">
            <button class="pill-btn">Bet</button>
          </div>
        </li>
      `).join("")}
    </ul>
    <script>window.marketsSetSeg = ${setSeg.toString()};</script>
  `;
}

function renderMarketsFarcasterScreen() {
  let seg = window.farcasterSeg || 0;
  const setSeg = (i) => {
    window.farcasterSeg = i; render();
  };
  return `
    <div style="margin-bottom:6px;">
      <div class="bold" style="font-size:1.12rem;">Channel Growth Bets</div>
      <div class="text-secondary" style="font-size:0.97rem;">
        Bet on which Farcaster channels will grow fastest this week.
      </div>
    </div>
    ${Segmented({
      options: ["Followers", "Engagement", "Other"],
      active: seg,
      onSelect: "window.farcasterSetSeg",
    })}
    <ul class="list" style="margin-top:2px;">
      ${CHANNELS.map((c) => `
        <li class="list-item">
          ${renderAvatar(c.avatar)}
          <div class="list-main">
            <div class="list-title">${c.name}</div>
            <div class="list-sub">${c.followers.toLocaleString()} followers</div>
          </div>
          <div class="list-accessory bold text-success">+${c.growth}%</div>
        </li>
      `).join("")}
    </ul>
    <div class="time-tiles">
      <div class="time-tile"><div class="tile-value">3</div><div class="tile-label">Days</div></div>
      <div class="time-tile"><div class="tile-value">11</div><div class="tile-label">Hours</div></div>
      <div class="time-tile"><div class="tile-value">22</div><div class="tile-label">Min</div></div>
      <div class="time-tile"><div class="tile-value">42</div><div class="tile-label">Sec</div></div>
      <div class="time-tile"><div class="tile-value">1</div><div class="tile-label">Bonus</div></div>
    </div>
    <button class="full-btn">Place Bet</button>
    <script>window.farcasterSetSeg = ${setSeg.toString()};</script>
  `;
}