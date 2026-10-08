import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X as CloseIcon,
  Mail,
  Wallet as WalletIcon,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Loader2,
  Calendar,
  Share2,
  Sun,
  Moon,
  ShoppingBag,
  Copy,
  Check,
  Shield,
  FileText,
} from "lucide-react";

/* ============================================================
   CONFIG — replace these with real project values before launch
   ============================================================ */
const CONFIG = {
  projectName: "BASHMONS",
  openSeaUrl: "https://opensea.io/collection/bashmons",
  contractAddress: "0x0000000000000000000000000000000000dEaD", // TODO: real BASHMONS contract
  social: {
    discord: "https://discord.gg/bashmons",
    telegram: "https://t.me/bashmons",
    x: "https://x.com/bashmons",
    instagram: "https://instagram.com/bashmons",
  },
};

/* ============================================================
   THEME TOKENS
   ============================================================ */
const THEME = {
  light: {
    bg: "#FFFFFF",
    bgSubtle: "#F7F8F9",
    bgRaised: "#FFFFFF",
    text: "#12151A",
    textSecondary: "#5B6270",
    textFaint: "#8A909C",
    border: "#E7E9EC",
    borderStrong: "#D6D9DE",
    focus: "#2563EB",
    overlay: "rgba(10,12,16,0.45)",
  },
  dark: {
    bg: "#0A0C0F",
    bgSubtle: "#121519",
    bgRaised: "#151920",
    text: "#F4F5F6",
    textSecondary: "#9AA1AC",
    textFaint: "#666D78",
    border: "#232830",
    borderStrong: "#2E353F",
    focus: "#60A5FA",
    overlay: "rgba(0,0,0,0.6)",
  },
};

const BRAND = {
  green: "#17A673",
  blue: "#2563EB",
  purple: "#8B7CF0",
  gradient: "linear-gradient(90deg, #17A673 0%, #2563EB 100%)",
};

const RARITY_STYLES = {
  Legendary: { fg: "#B8860B", bg: "rgba(212,160,23,0.12)", label: "Legendary" },
  Epic: { fg: BRAND.purple, bg: "rgba(139,124,240,0.12)", label: "Epic" },
  Rare: { fg: BRAND.blue, bg: "rgba(37,99,235,0.12)", label: "Rare" },
  Common: { fg: "#6B7280", bg: "rgba(107,114,128,0.12)", label: "Common" },
};

/* ============================================================
   DEMO DATA
   In production, replace with real API calls:
   - NFTs: fetch from an indexer (Alchemy/Moralis/OpenSea API)
     filtered by the connected wallet + CONFIG.contractAddress
   - Points/Rank: fetch from your backend, keyed by user id
   ============================================================ */
const DEMO_NFTS = [
  { id: "001", name: "Alpha #001", rarity: "Legendary" },
  { id: "024", name: "Alpha #024", rarity: "Epic" },
  { id: "108", name: "Alpha #108", rarity: "Rare" },
  { id: "241", name: "Alpha #241", rarity: "Common" },
];

const INITIAL_TASKS = [
  {
    id: "connect-x",
    title: "Connect with X",
    description: "Connect your X account",
    reward: 100,
    icon: "x",
    completed: false,
  },
  {
    id: "connect-discord",
    title: "Connect with Discord",
    description: "Link your Discord account",
    reward: 100,
    icon: "discord",
    completed: false,
  },
  {
    id: "daily-login",
    title: "Daily Login",
    description: "Claim your daily points",
    reward: 50,
    icon: "calendar",
    completed: false,
  },
  {
    id: "connect-email",
    title: "Connect with Email",
    description: "Verify your email address",
    reward: 100,
    icon: "mail",
    completed: false,
  },
  {
    id: "post-x",
    title: "Post on X (Twitter)",
    description: "Share the project on X",
    reward: 150,
    icon: "share",
    completed: false,
  },
];

/* ============================================================
   SMALL BRAND / SOCIAL ICONS (outline, minimal weight)
   ============================================================ */
const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };

function DiscordIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path
        d="M19.27 5.33A17.27 17.27 0 0 0 15.06 4l-.2.4a12.5 12.5 0 0 1 3.66 1.4 13.9 13.9 0 0 0-13.04 0 12.5 12.5 0 0 1 3.66-1.4l-.2-.4A17.27 17.27 0 0 0 4.73 5.33C2.6 8.5 2 11.6 2.3 14.66a17.4 17.4 0 0 0 5.3 2.68l.65-1.06a11.2 11.2 0 0 1-1.77-.85c.15-.11.29-.22.43-.34a12.4 12.4 0 0 0 10.18 0c.14.12.28.23.43.34a11.2 11.2 0 0 1-1.77.85l.65 1.06a17.4 17.4 0 0 0 5.3-2.68c.36-3.54-.55-6.6-2.53-9.33ZM9.68 13.4c-.83 0-1.5-.76-1.5-1.7s.65-1.7 1.5-1.7 1.52.77 1.5 1.7c0 .94-.65 1.7-1.5 1.7Zm4.7 0c-.83 0-1.5-.76-1.5-1.7s.65-1.7 1.5-1.7 1.51.77 1.5 1.7c0 .94-.65 1.7-1.5 1.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path
        d="M21 4.5 3.5 11.3c-.9.35-.9 1.63.02 1.95l4.2 1.44 1.62 5.1c.24.76 1.2.98 1.76.4l2.4-2.5 4.4 3.24c.7.5 1.7.13 1.9-.72L23 5.6c.2-.9-.7-1.6-1.5-1.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.2 14.4 18 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <path
        d="m4 4 6.6 8.6L4.4 20H6.9l5.1-5.8 4 5.8H20l-6.9-9L19.2 4H16.8l-4.6 5.3L8.4 4H4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { key: "discord", label: "Discord", href: CONFIG.social.discord, Icon: DiscordIcon },
  { key: "telegram", label: "Telegram", href: CONFIG.social.telegram, Icon: TelegramIcon },
  { key: "x", label: "X", href: CONFIG.social.x, Icon: XIcon },
  { key: "instagram", label: "Instagram", href: CONFIG.social.instagram, Icon: InstagramIcon },
];

const TASK_ICONS = {
  x: XIcon,
  discord: DiscordIcon,
  calendar: Calendar,
  mail: Mail,
  share: Share2,
};

/* ============================================================
   WALLET HOOK — uses window.ethereum (EIP-1193) directly.
   No SDK required; works with any injected EVM wallet
   (MetaMask, Rabby, Coinbase Wallet, etc).
   ============================================================ */
function useWallet() {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eth = typeof window !== "undefined" ? window.ethereum : null;
    if (!eth) return;
    const handleAccountsChanged = (accounts) => {
      setAddress(accounts && accounts.length ? accounts[0] : null);
    };
    eth.on?.("accountsChanged", handleAccountsChanged);
    // Restore an already-authorized connection without prompting
    eth
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts && accounts.length) setAddress(accounts[0]);
      })
      .catch(() => {});
    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const eth = typeof window !== "undefined" ? window.ethereum : null;
    if (!eth) {
      setError("No EVM wallet found. Install MetaMask or another wallet extension.");
      return;
    }
    try {
      setConnecting(true);
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setAddress(accounts && accounts.length ? accounts[0] : null);
    } catch (e) {
      setError(e?.message || "Wallet connection was rejected.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // EIP-1193 has no universal "disconnect" — we just clear local state
    setAddress(null);
  }, []);

  return { address, connecting, error, connect, disconnect };
}

function shortenAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ============================================================
   PRIMITIVES
   ============================================================ */
function Button({ variant = "primary", size = "md", icon: Icon, children, style, ...rest }) {
  const sizes = {
    sm: { padding: "7px 12px", fontSize: 13 },
    md: { padding: "10px 18px", fontSize: 14 },
    lg: { padding: "13px 22px", fontSize: 15 },
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.15s ease, transform 0.1s ease, background-color 0.15s ease",
    border: "1px solid transparent",
    ...sizes[size],
  };
  const variants = {
    primary: { background: BRAND.gradient, color: "#fff" },
    secondary: {}, // filled via theme in parent context (see CTAButton wrapper below)
    ghost: { background: "transparent" },
    outline: { background: "transparent" },
  };
  return (
    <button
      {...rest}
      className="bashmons-btn"
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function Eyebrow({ children, t }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: t.textFaint,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function PageTitle({ eyebrow, title, t }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <Eyebrow t={t}>{eyebrow}</Eyebrow>
      <h1
        className="bashmons-page-title"
        style={{ fontWeight: 700, margin: 0, color: t.text, letterSpacing: "-0.01em" }}
      >
        {title}
      </h1>
    </div>
  );
}

function Card({ t, style, children, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        background: t.bgRaised,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV_ITEMS = [
  { key: "profile", label: "Profile" },
  { key: "collection", label: "Collection" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "tasks", label: "Tasks" },
];

function Logo({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        aria-hidden="true"
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: BRAND.gradient,
          flexShrink: 0,
        }}
      />
      <span style={{ fontWeight: 800, fontSize: 17, color: t.text, letterSpacing: "-0.01em" }}>
        {CONFIG.projectName}
      </span>
    </div>
  );
}

function ThemeToggle({ theme, setTheme, t, compact }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="bashmons-focusable"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: compact ? 38 : "100%",
        padding: compact ? 0 : "9px 12px",
        height: 38,
        borderRadius: 10,
        border: `1px solid ${t.border}`,
        background: t.bgSubtle,
        color: t.text,
        cursor: "pointer",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {!compact && <span style={{ fontSize: 13, fontWeight: 600 }}>{isDark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}

function SocialRow({ t, size = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {SOCIAL_LINKS.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="bashmons-focusable"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 8,
            color: t.textSecondary,
            border: `1px solid ${t.border}`,
          }}
        >
          <Icon width={size} height={size} />
        </a>
      ))}
    </div>
  );
}

function LegalLinks({ t, onOpenLegal }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button
        onClick={() => onOpenLegal("privacy")}
        className="bashmons-linklike bashmons-focusable"
        style={{ color: t.textSecondary, fontSize: 13, textAlign: "left" }}
      >
        Privacy Policy
      </button>
      <button
        onClick={() => onOpenLegal("terms")}
        className="bashmons-linklike bashmons-focusable"
        style={{ color: t.textSecondary, fontSize: 13, textAlign: "left" }}
      >
        Terms of Service
      </button>
    </div>
  );
}

function SidebarNav({ t, theme, setTheme, page, setPage, onOpenLegal }) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        borderRight: `1px solid ${t.border}`,
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "0 4px", marginBottom: 36 }}>
        <Logo t={t} />
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }} aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              aria-current={active ? "page" : undefined}
              className="bashmons-focusable"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 9,
                fontSize: 14.5,
                fontWeight: active ? 700 : 500,
                color: active ? t.text : t.textSecondary,
                background: active ? t.bgSubtle : "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {item.label}
              {active && (
                <span
                  aria-hidden="true"
                  style={{ width: 6, height: 6, borderRadius: 99, background: BRAND.gradient }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
          <SocialRow t={t} />
        </div>
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
          <LegalLinks t={t} onOpenLegal={onOpenLegal} />
        </div>
      </div>
    </aside>
  );
}

function TopBar({ t, page, onMenuOpen }) {
  const current = NAV_ITEMS.find((n) => n.key === page);
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: `1px solid ${t.border}`,
        position: "sticky",
        top: 0,
        background: t.bg,
        zIndex: 20,
      }}
    >
      <Logo t={t} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="bashmons-topbar-label" style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>
          {current?.label}
        </span>
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          className="bashmons-focusable"
          style={{
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            border: `1px solid ${t.border}`,
            background: t.bgSubtle,
            color: t.text,
          }}
        >
          <Menu size={19} />
        </button>
      </div>
    </header>
  );
}

function MobileDrawer({ t, theme, setTheme, page, setPage, open, onClose, onOpenLegal }) {
  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: t.overlay,
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "82%",
          maxWidth: 320,
          background: t.bg,
          borderRight: `1px solid ${t.border}`,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.22s ease",
          display: "flex",
          flexDirection: "column",
          padding: "20px 18px",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <Logo t={t} />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="bashmons-focusable"
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.bgSubtle,
              color: t.text,
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            <CloseIcon size={17} />
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }} aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key);
                  onClose();
                }}
                aria-current={active ? "page" : undefined}
                className="bashmons-focusable"
                style={{
                  padding: "12px 12px",
                  borderRadius: 9,
                  fontSize: 15.5,
                  fontWeight: active ? 700 : 500,
                  color: active ? t.text : t.textSecondary,
                  background: active ? t.bgSubtle : "transparent",
                  border: "none",
                  textAlign: "left",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 18, marginBottom: 18 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} t={t} />
        </div>

        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 18, marginBottom: 18 }}>
          <SocialRow t={t} />
        </div>

        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 18, marginTop: "auto" }}>
          <LegalLinks
            t={t}
            onOpenLegal={(kind) => {
              onOpenLegal(kind);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE PAGE
   ============================================================ */
function AccountRow({ t, icon: Icon, label, value, onConnect, connectLabel = "Connect" }) {
  const connected = Boolean(value);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: `1px solid ${t.border}`,
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span style={{ color: t.textSecondary, flexShrink: 0, display: "flex" }}>
          <Icon size={17} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: t.textFaint, fontWeight: 600 }}>{label}</div>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: t.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {connected ? value : ""}
          </div>
        </div>
      </div>
      {!connected && (
        <Button variant="outline" size="sm" onClick={onConnect} style={{ borderColor: t.border, color: t.text, flexShrink: 0 }}>
          {connectLabel}
        </Button>
      )}
      {connected && <CheckCircle2 size={18} color={BRAND.green} style={{ flexShrink: 0 }} />}
    </div>
  );
}

function ProfilePage({ t, wallet, accounts, onConnectAccount, points, rank, onOpenLegal }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!wallet.address) return;
    navigator.clipboard?.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="bashmons-profile-header">
        <div>
          <Eyebrow t={t}>Welcome back</Eyebrow>
          <h1 className="bashmons-profile-name" style={{ fontWeight: 700, margin: 0, color: t.text, letterSpacing: "-0.01em" }}>
            {wallet.address ? "AlphaUser" : "Guest"}
          </h1>
        </div>

        {wallet.address ? (
          <Button
            variant="outline"
            size="md"
            icon={LogOut}
            onClick={wallet.disconnect}
            style={{ borderColor: t.border, color: t.text }}
          >
            {shortenAddress(wallet.address)}
          </Button>
        ) : (
          <Button variant="primary" size="md" icon={WalletIcon} onClick={wallet.connect} disabled={wallet.connecting}>
            {wallet.connecting ? "Connecting…" : "Connect Wallet"}
          </Button>
        )}
      </div>

      {wallet.error && (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            color: "#B91C1C",
            background: "rgba(185,28,28,0.08)",
            border: "1px solid rgba(185,28,28,0.2)",
          }}
        >
          {wallet.error}
        </div>
      )}

      <Card t={t} style={{ overflow: "hidden", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 16px", borderBottom: `1px solid ${t.border}` }}>
          <div
            aria-hidden="true"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: BRAND.gradient,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
              {wallet.address ? "AlphaUser" : "Not signed in"}
            </div>
            <div style={{ fontSize: 13, color: t.textSecondary }}>
              {wallet.address ? "Member of BASHMONS" : "Connect a wallet to get started"}
            </div>
          </div>
          {wallet.address && (
            <button
              onClick={copyAddress}
              aria-label="Copy wallet address"
              className="bashmons-focusable"
              style={{
                marginLeft: "auto",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.textSecondary,
                flexShrink: 0,
              }}
            >
              {copied ? <Check size={15} color={BRAND.green} /> : <Copy size={15} />}
            </button>
          )}
        </div>

        <AccountRow t={t} icon={Mail} label="Email" value={accounts.email} onConnect={() => onConnectAccount("email")} />
        <AccountRow
          t={t}
          icon={WalletIcon}
          label="Wallet Address"
          value={wallet.address ? shortenAddress(wallet.address) : null}
          onConnect={wallet.connect}
        />
        <AccountRow t={t} icon={DiscordIcon} label="Discord" value={accounts.discord} onConnect={() => onConnectAccount("discord")} />
        <div style={{ borderBottom: "none" }}>
          <AccountRow t={t} icon={XIcon} label="X (Twitter)" value={accounts.x} onConnect={() => onConnectAccount("x")} />
        </div>
      </Card>

      <div className="bashmons-stats-grid">
        <Card t={t} style={{ padding: "18px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.textFaint, marginBottom: 6 }}>Points</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.text }}>{points.toLocaleString()}</div>
        </Card>
        <Card t={t} style={{ padding: "18px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.textFaint, marginBottom: 6 }}>Rank</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.text }}>{rank}</div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   COLLECTION PAGE
   ============================================================ */
function NFTCard({ t, nft }) {
  const rarity = RARITY_STYLES[nft.rarity] || RARITY_STYLES.Common;
  return (
    <Card t={t} style={{ overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          background: `linear-gradient(155deg, ${BRAND.green}22, ${BRAND.blue}22)`,
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "46%",
            aspectRatio: "1 / 1",
            borderRadius: 16,
            background: BRAND.gradient,
            opacity: 0.85,
          }}
        />
      </div>
      <div style={{ padding: "13px 14px" }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text, marginBottom: 6 }}>{nft.name}</div>
        <span
          style={{
            display: "inline-block",
            fontSize: 11.5,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 99,
            color: rarity.fg,
            background: rarity.bg,
          }}
        >
          {rarity.label}
        </span>
      </div>
    </Card>
  );
}

function CollectionPage({ t, wallet, nfts, loadingNfts }) {
  return (
    <div>
      <PageTitle eyebrow="Your assets" title="Collection" t={t} />

      {!wallet.address && (
        <Card t={t} style={{ padding: "40px 20px", textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 14.5, color: t.textSecondary, margin: "0 0 16px" }}>
            Connect your wallet to view the BASHMONS you own.
          </p>
          <Button variant="primary" icon={WalletIcon} onClick={wallet.connect}>
            Connect Wallet
          </Button>
        </Card>
      )}

      {wallet.address && (
        <>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.textSecondary, marginBottom: 14 }}>
            My NFTs {nfts.length > 0 && `(${nfts.length})`}
          </div>

          {loadingNfts ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.textSecondary, fontSize: 14, padding: "24px 0" }}>
              <Loader2 size={16} className="bashmons-spin" /> Loading your NFTs…
            </div>
          ) : nfts.length === 0 ? (
            <Card t={t} style={{ padding: "32px 20px", textAlign: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: t.textSecondary, margin: 0 }}>
                No BASHMONS found in this wallet yet.
              </p>
            </Card>
          ) : (
            <div className="bashmons-nft-grid">
              {nfts.map((nft) => (
                <NFTCard key={nft.id} t={t} nft={nft} />
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <a href={CONFIG.openSeaUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <Button variant="primary" size="lg" icon={ShoppingBag}>
            Buy NFTs on OpenSea
            <ExternalLink size={14} />
          </Button>
        </a>
      </div>
    </div>
  );
}

/* ============================================================
   LEADERBOARD PAGE
   ============================================================ */
function LeaderboardPage({ t }) {
  return (
    <div>
      <PageTitle eyebrow="Top players" title="Leaderboard" t={t} />
      <Card
        t={t}
        style={{
          padding: "64px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "transparent",
            backgroundImage: BRAND.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            marginBottom: 4,
          }}
        >
          COMING SOON
        </div>
        <p style={{ fontSize: 14.5, color: t.textSecondary, maxWidth: 360, margin: 0 }}>
          Points-based rankings will be enabled in a future update.
        </p>
      </Card>
    </div>
  );
}

/* ============================================================
   TASKS PAGE
   ============================================================ */
function TaskRow({ t, task, onAction }) {
  const Icon = TASK_ICONS[task.icon] || Calendar;
  return (
    <div className="bashmons-task-row" style={{ borderBottom: `1px solid ${t.border}` }}>
      <div
        aria-hidden="true"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: t.bgSubtle,
          border: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.textSecondary,
          flexShrink: 0,
        }}
      >
        <Icon size={17} />
      </div>

      <div className="bashmons-task-row-body">
        <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>{task.title}</div>
        <div style={{ fontSize: 13, color: t.textSecondary }}>{task.description}</div>
      </div>

      <div className="bashmons-task-row-actions">
        <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.green, flexShrink: 0 }}>+{task.reward}</div>

        {task.completed ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: BRAND.green,
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={16} /> Completed
          </span>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onAction(task)} style={{ borderColor: t.border, color: t.text, flexShrink: 0 }}>
            Start
          </Button>
        )}
      </div>
    </div>
  );
}

function TasksPage({ t, tasks, onAction }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <PageTitle eyebrow="Earn points" title="Tasks" t={t} />
      <Card t={t} style={{ overflow: "hidden" }}>
        {tasks.map((task) => (
          <TaskRow key={task.id} t={t} task={task} onAction={onAction} />
        ))}
      </Card>
      <p style={{ fontSize: 12.5, color: t.textFaint, marginTop: 14 }}>
        Task completion is verified before points are awarded.
      </p>
    </div>
  );
}

/* ============================================================
   LEGAL MODAL
   ============================================================ */
function LegalModal({ t, kind, onClose }) {
  if (!kind) return null;
  const isPrivacy = kind === "privacy";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: t.overlay }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isPrivacy ? "Privacy Policy" : "Terms of Service"}
        style={{
          position: "relative",
          background: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          maxWidth: 480,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          {isPrivacy ? <Shield size={18} color={t.text} /> : <FileText size={18} color={t.text} />}
          <h2 style={{ fontSize: 17, fontWeight: 700, color: t.text, margin: 0 }}>
            {isPrivacy ? "Privacy Policy" : "Terms of Service"}
          </h2>
        </div>
        <p style={{ fontSize: 13.5, color: t.textSecondary, lineHeight: 1.6 }}>
          This is placeholder legal text for the BASHMONS demo interface. Replace this section with your
          project's actual {isPrivacy ? "privacy policy" : "terms of service"} before launch.
        </p>
        <Button variant="outline" size="sm" onClick={onClose} style={{ borderColor: t.border, color: t.text, marginTop: 10 }}>
          Close
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(null);

  const wallet = useWallet();

  const [accounts, setAccounts] = useState({ email: null, discord: null, x: null });
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [nfts, setNfts] = useState([]);
  const [loadingNfts, setLoadingNfts] = useState(false);

  const t = THEME[theme];

  // Fetch owned NFTs when wallet connects.
  // DEMO: simulates a network call and returns sample data.
  // Replace with a real indexer call filtered by wallet + CONFIG.contractAddress.
  useEffect(() => {
    if (!wallet.address) {
      setNfts([]);
      return;
    }
    setLoadingNfts(true);
    const timeout = setTimeout(() => {
      setNfts(DEMO_NFTS);
      setLoadingNfts(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [wallet.address]);

  // Stub OAuth / verification connectors.
  // TODO: replace with real X OAuth, Discord OAuth, and email verification flows.
  const handleConnectAccount = (kind) => {
    window.open(
      kind === "email" ? "mailto:" : CONFIG.social[kind] || "#",
      "_blank",
      "noopener,noreferrer"
    );
  };

  // TODO: task completion must be verified server-side before UI reflects it
  // and before points are credited to the user's account.
  const handleTaskAction = (task) => {
    if (task.id === "connect-x" || task.id === "post-x") {
      window.open(CONFIG.social.x, "_blank", "noopener,noreferrer");
    } else if (task.id === "connect-discord") {
      window.open(CONFIG.social.discord, "_blank", "noopener,noreferrer");
    } else if (task.id === "connect-email") {
      handleConnectAccount("email");
    }
  };

  const points = 1250;
  const rank = "#128";

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .bashmons-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .bashmons-linklike { background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
        .bashmons-focusable:focus-visible {
          outline: 2px solid ${BRAND.blue};
          outline-offset: 2px;
        }
        .bashmons-spin { animation: bashmons-spin 1s linear infinite; }
        @keyframes bashmons-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; width: 100%; max-width: 100%; overflow-x: hidden; }
        img, svg { max-width: 100%; }

        /* ---------- Fluid, resolution-aware sizing ---------- */
        .bashmons-main-container {
          padding: clamp(20px, 5vw, 32px) clamp(16px, 4vw, 20px) 64px;
        }
        .bashmons-page-title {
          font-size: clamp(22px, 5.5vw, 30px);
        }
        .bashmons-profile-name {
          font-size: clamp(21px, 5.5vw, 28px);
        }

        /* ---------- Stats grid (Points / Rank) ---------- */
        .bashmons-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 380px) {
          .bashmons-stats-grid { grid-template-columns: 1fr; }
        }

        /* ---------- NFT grid ---------- */
        .bashmons-nft-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 480px) {
          .bashmons-nft-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 340px) {
          .bashmons-nft-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
        }

        /* ---------- Task row ---------- */
        .bashmons-task-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          flex-wrap: wrap;
        }
        .bashmons-task-row-body { min-width: 0; flex: 1 1 160px; }
        .bashmons-task-row-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
          flex-shrink: 0;
        }
        @media (max-width: 420px) {
          .bashmons-task-row-actions {
            margin-left: 52px;
            width: calc(100% - 52px);
            justify-content: space-between;
          }
        }

        /* ---------- Profile header ---------- */
        .bashmons-profile-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 460px) {
          .bashmons-profile-header .bashmons-btn { width: 100%; }
        }

        /* ---------- Top bar ---------- */
        @media (max-width: 380px) {
          .bashmons-topbar-label { display: none; }
        }
      `}</style>

      {/* Desktop sidebar — hidden on mobile, visible from 768px up */}
      <div className="bashmons-desktop-nav">
        <SidebarNav
          t={t}
          theme={theme}
          setTheme={setTheme}
          page={page}
          setPage={setPage}
          onOpenLegal={setLegalOpen}
        />
      </div>

      {/* Content column: mobile topbar stacks ABOVE main (not beside it) */}
      <div className="bashmons-content-column">
        <div className="bashmons-mobile-nav">
          <TopBar t={t} page={page} onMenuOpen={() => setDrawerOpen(true)} />
          <MobileDrawer
            t={t}
            theme={theme}
            setTheme={setTheme}
            page={page}
            setPage={setPage}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpenLegal={setLegalOpen}
          />
        </div>

        <main style={{ flex: 1, minWidth: 0, width: "100%" }}>
          <div className="bashmons-main-container" style={{ maxWidth: 920, margin: "0 auto", width: "100%" }}>
            {page === "profile" && (
              <ProfilePage
                t={t}
                wallet={wallet}
                accounts={accounts}
                onConnectAccount={handleConnectAccount}
                points={points}
                rank={rank}
                onOpenLegal={setLegalOpen}
              />
            )}
            {page === "collection" && <CollectionPage t={t} wallet={wallet} nfts={nfts} loadingNfts={loadingNfts} />}
            {page === "leaderboard" && <LeaderboardPage t={t} />}
            {page === "tasks" && <TasksPage t={t} tasks={tasks} onAction={handleTaskAction} />}
          </div>
        </main>
      </div>

      <LegalModal t={t} kind={legalOpen} onClose={() => setLegalOpen(null)} />

      <style>{`
        /* ---------- Mobile-first nav visibility (no inline-style fights) ---------- */
        .bashmons-desktop-nav { display: none; }
        .bashmons-mobile-nav { display: block; }
        .bashmons-content-column {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
          flex: 1;
        }
        @media (min-width: 768px) {
          .bashmons-desktop-nav { display: block; }
          .bashmons-mobile-nav { display: none; }
        }
      `}</style>
    </div>
  );
}
