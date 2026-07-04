import type { FC } from "hono/jsx";

type IconProps = { class?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round" as const,
  "stroke-linejoin": "round" as const,
};

export const IconHome: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
  </svg>
);

export const IconBoard: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <path d="M8.5 4v16M15.5 4v16" />
  </svg>
);

export const IconRepo: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M6 3v14a2 2 0 0 0 2 2h11" />
    <path d="M6 3h9a2 2 0 0 1 2 2v14" />
    <circle cx="6" cy="19" r="2" />
  </svg>
);

export const IconActivity: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M3 12h4l2.5 7L14 5l2.5 7H21" />
  </svg>
);

export const IconSearch: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const IconBell: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconSun: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v1.5M12 19.5V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.5M19.5 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
  </svg>
);

export const IconMoon: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </svg>
);

export const IconPlus: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconPullRequest: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="9" r="2.2" />
    <path d="M6 8.2V15.8" />
    <path d="M18 11.2V15a2 2 0 0 1-2 2h-3" />
  </svg>
);

export const IconGitMerge: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="6" cy="18" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M6 8.2V15.8" />
    <path d="M18 15.8V12a6 6 0 0 0-6-6H9.5" />
  </svg>
);

export const IconXCircle: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="m9.5 9.5 5 5m0-5-5 5" />
  </svg>
);

export const IconCheckCircle: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.5 2.4 2.4L15.5 9.5" />
  </svg>
);

export const IconCommit: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M3 12h6M15 12h6" />
  </svg>
);

export const IconFlag: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M6 3v18" />
    <path d="M6 4h11l-2.5 3.5L17 11H6" />
  </svg>
);

export const IconChevronRight: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IconMenu: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconGithub: FC<IconProps> = ({ class: className }) => (
  <svg
    class={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

export const IconArrowRight: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconMira: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSparkle: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);

export const IconClock: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconPalette: FC<IconProps> = ({ class: className }) => (
  <svg class={className} {...base} aria-hidden="true">
    <path d="M12 3a9 8.5 0 1 0 0 17c1 0 1.5-.5 1.5-1.3 0-.4-.15-.7-.4-1-.24-.28-.4-.6-.4-1 0-.8.65-1.4 1.4-1.4H15.5A4.5 4.5 0 0 0 20 11c0-4.4-3.8-8-8-8Z" />
    <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="7.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="16.5" cy="11" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconStar: FC<IconProps> = ({ class: className }) => (
  <svg
    class={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8Z" />
  </svg>
);
