// Lightweight inline icon set — stroke-based, inherits currentColor.
const paths = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9.5',
  circle:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 14.5a4 4 0 0 1 7 0M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  calendar:
    'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
  grow: 'M12 21V8M12 8c0-3 2-5 5-5 0 3-2 5-5 5Zm0 4c0-2.5-1.7-4-4-4 0 2.5 1.7 4 4 4Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0',
  search: 'm21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  check: 'M5 12.5 10 17 19 7',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
  heart: 'M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z',
  comment: 'M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21 11a2 2 0 1 1 0 4Z',
  gauge: 'M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM13.5 10.5 17 7M5 18a8 8 0 1 1 14 0',
  users: 'M16 20a5 5 0 0 0-8 0M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 11a3 3 0 0 0 0-6M21 20a5 5 0 0 0-3-4.6',
  briefcase:
    'M4 8h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18',
  book: 'M4 5a2 2 0 0 1 2-2h10v16H6a2 2 0 0 0-2 2V5ZM16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-2',
  trophy:
    'M8 4h8v4a4 4 0 0 1-8 0V4ZM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M10 14v2h4v-2M9 20h6',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  edit: 'M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 6.5l3 3',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21M12 3c-2.5 2.5-3.5 6-3.5 9s1 6.5 3.5 9',
  menu: 'M4 7h16M4 12h16M4 17h16',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  trendingUp: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  groups: 'M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0',
  handshake: 'M8 13l2.5 2.5a1.5 1.5 0 0 0 2.1 0l3.4-3.4 3 3M3 8l4-2 5 4M21 8l-4-2-3 2M3 8v6l3 2M21 8v6l-3 2',
  tune: 'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5M14 4v4M6 10v4M11 16v4',
  account: 'M5 21V5a2 2 0 0 1 2-2h7l5 5v13a0 0 0 0 1 0 0M5 21h14M9 8h2M9 12h6M9 16h6',
  gavel: 'm14 13-7 7-2-2 7-7M11 6l5 5M9 8l7-7 3 3-7 7M14 16l4 4',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z',
  bookmark: 'M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z',
  flag: 'M5 21V4M5 4h12l-2 4 2 4H5',
  bridge: 'M3 9c4 0 4 3 9 3s5-3 9-3M3 9V6M21 9V6M5 12v7M19 12v7M12 12v7',
}

export default function Icon({ name, size = 22, className = '', strokeWidth = 1.6, ...rest }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
