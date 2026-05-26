# NEXUS — Claude Command Center

> A beautiful, dopamine-inducing mission control dashboard for managing Claude and AI agents. Built locally with Next.js, Tailwind CSS, and Framer Motion.

---

## What Is This?

NEXUS is a locally-hosted web OS for interacting with Claude and managing multiple AI agents from a single dashboard. Think NASA mission control meets a dark-mode AI cockpit. Every panel animates, every status pulses, and every message streams in real time.

It runs entirely on your machine. No cloud, no subscriptions beyond your Anthropic API key.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) |
| Icons | Lucide React |
| Language | TypeScript |
| Runtime | Node.js 24 |

---

## Features

### Visual / UI
- **Animated grid background** — subtle neon grid with a scanning beam, floating glow orbs, and radial corner gradients
- **Glass morphism panels** — every panel uses `backdrop-filter: blur` with neon cyan borders
- **Live clock** in the top bar with second precision
- **Scan line** that sweeps across the top bar on a loop
- **Smooth Framer Motion transitions** on every panel, message, and agent card
- **Custom scrollbar** styled to match the neon theme
- **Neon glow text** on headings and active states

### Chat
- Real-time **streaming responses** from Claude (chunks appear as they're generated)
- **Per-agent chat context** — each agent maintains its own independent conversation history
- Streaming cursor (`▋`) animates while Claude is thinking
- "Thinking…" spinner while waiting for the first token
- **Copy button** on each message (hover to reveal)
- **Clear chat** button to reset a conversation
- `Enter` to send, `Shift+Enter` for a newline

### Agents
- **4 pre-built agents** with different system prompts and colors:
  - **Claude** — General purpose (cyan)
  - **Code Expert** — Software engineering specialist (green)
  - **Analyst** — Structured reasoning and insights (purple)
  - **Creative** — Brainstorming and writing (amber)
- Click any agent card to switch — chat context resets for the new agent
- **Pulsing status dot** on the active agent
- Active agent gets a glowing top strip and "Active" chip
- "New Agent" card placeholder for future expansion

### Activity Feed
- Live log of every event: messages sent, responses received, agent switches, connection
- Events slide in from the left with animation
- Hover to reveal relative timestamp (`2s ago`, `5m ago`, etc.)

### Status Bar
- **API Connected** pill with animated pulse dot
- **Model** pill showing current agent's model
- **Message count** pill
- Live **clock** with monospace font

---

## Project Structure

```
claude-os/
├── app/
│   ├── globals.css              # Design tokens, animations, glass/glow utilities
│   ├── layout.tsx               # Root layout, Geist font, metadata
│   ├── page.tsx                 # Main dashboard — wires all components together
│   └── api/
│       └── chat/
│           └── route.ts         # Streaming API route → Anthropic SDK
├── components/
│   ├── background/
│   │   └── GridBackground.tsx   # Animated neon grid + orbs + scan line
│   ├── layout/
│   │   ├── Sidebar.tsx          # 64px icon nav with animated active pill
│   │   └── TopBar.tsx           # Status pills, live clock, scan accent
│   ├── ui/
│   │   └── GlassPanel.tsx       # Reusable animated glass card with title bar
│   └── dashboard/
│       ├── ChatPanel.tsx        # Full streaming chat UI per agent
│       ├── AgentGrid.tsx        # 2-column agent card grid with switcher
│       └── ActivityFeed.tsx     # Scrolling real-time event log
├── lib/
│   ├── types.ts                 # TypeScript interfaces (Agent, Message, ActivityEvent)
│   ├── utils.ts                 # cn(), formatTime(), formatRelative(), generateId()
│   └── agents.ts                # Default agent configurations
├── .env.local                   # Your Anthropic API key (never commit this)
├── .env.local.example           # Template — copy and fill in your key
└── package.json
```

---

## Setup Instructions

### 1. Prerequisites

Make sure you have Node.js installed:

```bash
node --version
```

You need **Node 18 or higher**. (This was built on Node 24.)

---

### 2. Navigate to the project

```bash
cd /home/jobi/claude/claude-os
```

---

### 3. Install dependencies (already done — skip if packages are present)

```bash
npm install
```

---

### 4. Add your Anthropic API key

Create or edit `.env.local`:

```bash
nano .env.local
```

The file should contain exactly this (replace with your real key):

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your API key from: **console.anthropic.com → API Keys → Create Key**

---

### 5. Start the development server

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.2.6 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in ~300ms
```

---

### 6. Open in your browser

On Windows (WSL2), open your browser and go to:

```
http://localhost:3000
```

The dashboard loads instantly. Chat won't work until the API key is set — everything else (UI, animations, agent switching, activity feed) is fully functional without it.

---

## How It Works

### Streaming Chat

When you send a message, the browser calls the internal API route at `/api/chat`. That route uses the Anthropic SDK to open a streaming message. As each text chunk arrives, it's encoded and flushed directly to the browser via a `ReadableStream`. The `ChatPanel` component reads the stream chunk-by-chunk and appends each piece to a React state variable, which makes the text appear to type itself in real time.

```
Browser → POST /api/chat → Anthropic SDK stream → ReadableStream → Browser reads chunks → React state updates
```

### Agent System

Agents are plain TypeScript objects stored in `lib/agents.ts`. Each one has a `name`, `model`, `systemPrompt`, `color`, and `status`. When you click an agent card in the dashboard, the `activeAgent` state updates in `page.tsx`, and the `ChatPanel` is re-mounted with a `key={activeAgent.id}` — this wipes the previous conversation and starts fresh with the new agent's system prompt and color scheme.

### Design System

All colors and animations are defined in `app/globals.css` using Tailwind 4's `@theme` block. Custom utilities like `.glass`, `.neon-cyan`, `.gradient-text`, and `.grid-bg` are defined in the same file using plain CSS. Framer Motion handles all enter/exit animations, layout transitions (the active nav pill slides with `layoutId`), and the looping background animations.

---

## Customizing Agents

Open `lib/agents.ts` to add, edit, or remove agents:

```typescript
{
  id: "my-agent",               // Unique ID (no spaces)
  name: "My Agent",             // Display name
  model: "claude-sonnet-4-6",   // Any Claude model ID
  systemPrompt: "You are...",   // Sets the AI's personality and focus
  color: "#ff6b35",             // Hex color — drives all UI accents for this agent
  icon: "sparkles",             // brain | code | chart | sparkles
  status: "idle",               // active | idle | offline
  description: "What it does",  // Short subtitle on the card
}
```

Save the file — the dev server hot-reloads instantly.

---

## Available Models

You can use any of these in the `model` field:

| Model ID | Description |
|---|---|
| `claude-sonnet-4-6` | Default — fast, smart, great balance |
| `claude-opus-4-7` | Most capable, slower |
| `claude-haiku-4-5-20251001` | Fastest, lightest |

---

## Stopping the Server

```bash
# In the terminal running the server:
Ctrl + C

# To restart:
npm run dev
```

---

## What Was Built (Session Summary)

This entire project was scaffolded and built in a single session:

1. **Scaffolded** a fresh Next.js 16 app with TypeScript and Tailwind 4 using `create-next-app`
2. **Installed** `framer-motion`, `@anthropic-ai/sdk`, `lucide-react`, `clsx`, `tailwind-merge`
3. **Rewrote `globals.css`** with a full cyber/neon design system — custom `@theme` colors, glass utilities, glow animations, grid background CSS, scrollbar styling
4. **Built `GridBackground`** — layered CSS grid pattern, radial glows, floating animated orbs, and a Framer Motion scan beam
5. **Built `Sidebar`** — 64px icon rail with animated `layoutId` active pill, slide-in tooltips, and bottom status dot
6. **Built `TopBar`** — live `setInterval` clock, three status pills with pulse animations, and a sweeping scan line
7. **Built `GlassPanel`** — reusable animated card component with colored title bar accent strip
8. **Built `ChatPanel`** — full streaming chat with `ReadableStream` reader, copy/clear actions, per-agent key remounting, and streaming cursor
9. **Built `AgentGrid`** — 2-column card grid with animated active state, status dots, and `layoutId` glow strip
10. **Built `ActivityFeed`** — `AnimatePresence` scroll log with slide-in entries and hover timestamps
11. **Wired `page.tsx`** — state management for active agent, events array, message count, and agent status toggling
12. **Created `app/api/chat/route.ts`** — Next.js route handler using Anthropic SDK's async iterator for true streaming
13. **TypeScript check passed** with zero errors

---

## Screenshots

> Screenshots below show the full dashboard layout. Take these by opening the app in your browser and pressing `Win + Shift + S` (Windows Snip) or `F12 → Device toolbar` for a full-page capture.

### Main Dashboard
![NEXUS Main Dashboard](screenshots/dashboard.png)
*The full command center — chat panel on the left, agent grid and activity feed on the right*

### Chat Streaming
![Streaming Response](screenshots/chat-streaming.png)
*Claude streaming a response in real time with the animated cursor*

### Agent Switcher
![Agent Grid](screenshots/agents.png)
*Four pre-built agents — click any card to switch context instantly*

### Activity Feed
![Activity Feed](screenshots/activity.png)
*Live event log showing messages, responses, and agent switches*

> **To add your own screenshots:**
> 1. Create a `screenshots/` folder inside `claude-os/`
> 2. Take screenshots and save them with the filenames above
> 3. They will render inline in Obsidian and GitHub

---

## Troubleshooting

### Chat sends but nothing comes back

**Cause:** API key is missing or wrong.

Check your `.env.local` file:

```bash
cat /home/jobi/claude/claude-os/.env.local
```

It should look exactly like this:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then restart the server:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

---

### Page loads but is completely blank

**Cause:** A JavaScript error is crashing the app before it renders.

Open the browser console (`F12 → Console`) and look for red errors. The most common cause is a missing dependency. Fix with:

```bash
cd /home/jobi/claude/claude-os
npm install
npm run dev
```

---

### `command not found: npm` or `node`

Node.js is not installed or not in your PATH. Install it via:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Then verify:

```bash
node --version   # should show v18 or higher
npm --version
```

---

### Port 3000 already in use

Another process is using port 3000. Either kill it or use a different port:

```bash
# Use port 3001 instead:
npm run dev -- --port 3001
```

Then open `http://localhost:3001` in your browser.

To find and kill what's using 3000:

```bash
lsof -i :3000
kill -9 <PID>
```

---

### WSL2 — page not loading in Windows browser

The dev server binds to `localhost` by default. If `http://localhost:3000` doesn't load in your Windows browser, try the WSL2 IP directly:

```bash
# Find your WSL2 IP:
hostname -I
```

Then open `http://<that-ip>:3000` in your browser.

---

### `ANTHROPIC_API_KEY` changes not taking effect

Next.js only reads `.env.local` at startup. Any time you change the file you must restart the dev server:

```bash
# Ctrl+C to stop, then:
npm run dev
```

---

### TypeScript errors after editing a file

Run the type checker to see all errors at once:

```bash
npx tsc --noEmit
```

---

## Deploying Beyond Localhost

The dev server (`npm run dev`) is for local use only. To run NEXUS on a real server, a home lab, or share it with others, use one of these options.

---

### Option 1 — Production Build (Same Machine, Faster)

Run the optimized production build instead of the dev server:

```bash
cd /home/jobi/claude/claude-os
npm run build
npm run start
```

This is ~3x faster than dev mode and uses far less memory. Still only accessible at `localhost:3000` unless you also set up a reverse proxy (see Option 3).

---

### Option 2 — Deploy to Vercel (Free, Public URL)

Vercel is made by the Next.js team and deploys in about 60 seconds.

**Steps:**

1. Push the project to a GitHub repo first:

```bash
cd /home/jobi/claude/claude-os
git init
git add .
git commit -m "Initial NEXUS build"
```

> **Important:** Make sure `.env.local` is in your `.gitignore` — it is by default. Never commit your API key.

2. Go to **vercel.com**, sign in with GitHub, click **Add New Project**, and import your repo.

3. In the Vercel dashboard under **Environment Variables**, add:

```
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. Click **Deploy**. Vercel gives you a public URL like `https://nexus-xyz.vercel.app`.

---

### Option 3 — Self-Host on a VPS (Full Control)

Run NEXUS on any Linux server (DigitalOcean, Linode, Hetzner, etc.).

**On your server:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone or upload your project, then:
cd claude-os
npm install
npm run build

# Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start with PM2 (keeps it running after logout)
npm install -g pm2
pm2 start "npm run start" --name nexus
pm2 save
pm2 startup
```

The app now runs on `http://your-server-ip:3000`.

**Add a domain + HTTPS with Nginx:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then get a free SSL cert:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option 4 — Local Network Only (Home Lab / LAN)

Make NEXUS accessible to any device on your home Wi-Fi without exposing it to the internet:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Then from any phone, tablet, or laptop on the same network, open:

```
http://<your-windows-machine-ip>:3000
```

Find your machine's local IP:

```bash
# In WSL2:
cat /etc/resolv.conf | grep nameserver
# Or in Windows: ipconfig | findstr IPv4
```

---

### Security Note for Any Public Deployment

NEXUS has no authentication built in. If you expose it to the internet, anyone who finds the URL can use your API key. Before going public, add basic auth at the Nginx level or build a login screen:

```nginx
# Quick basic auth via Nginx:
auth_basic "NEXUS";
auth_basic_user_file /etc/nginx/.htpasswd;
```

Generate a password file:

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd yourusername
```

---

## Roadmap Ideas

- **Settings panel** — change model, edit system prompt, adjust max tokens, per agent
- **Conversation history** — persist chats to localStorage or a local SQLite DB
- **Multi-chat** — multiple open chat tabs like browser tabs
- **Agent builder UI** — create new agents from the dashboard without editing code
- **Keyboard shortcuts** — `Cmd+K` command palette, `Ctrl+1-4` to switch agents
- **Dark/light theme toggle**
- **Response time metrics** — show latency per response in the activity feed
- **Token usage display** — track and display tokens used per session
