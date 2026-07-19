const paths = {
  fishing: <><path d="M5 5v14"/><path d="M5 6c8-3 13 1 13 7"/><path d="M18 13v3"/><circle cx="18" cy="18" r="2"/></>,
  'fly-fishing': <><path d="M4 19 15 5"/><path d="M14 5c5 1 6 5 5 8"/><path d="M19 13c-3-2-6-1-7 2 2 2 5 2 7 0"/><path d="m12 15-2 2m2-2-1-3"/></>,
  inventory: <><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/></>,
  shop: <><path d="m12 3 8 5-8 5-8-5 8-5Z"/><path d="m4 12 8 5 8-5"/><path d="m4 16 8 5 8-5"/></>,
  collection: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16M4 9h16"/></>,
  trips: <><path d="M4 7h16v12H4z"/><path d="M9 7V5h6v2M4 11h16M10 11v2h4v-2"/></>,
  keepsake: <><circle cx="12" cy="10" r="6"/><path d="m8 15-1 7 5-3 5 3-1-7"/><path d="m12 7 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L9 9.3 11 9l1-2Z"/></>,
  share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
  fish: <><path d="M4 12c4-5 10-5 14 0-4 5-10 5-14 0Z"/><path d="m18 12 3-3v6l-3-3Z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
}

export default function Icon({ name, size = 24, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
