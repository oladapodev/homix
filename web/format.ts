export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const bracketCategory = /^\[([^\]]{1,32})\]\s*:?\s*/;
const wordCategory = /^([A-Za-z][A-Za-z /-]{1,26}):\s+/;

export function parseTitleCategory(title: string): {
  category: string | null;
  rest: string;
} {
  const bracket = title.match(bracketCategory);
  if (bracket?.[1]) {
    return {
      category: bracket[1].trim(),
      rest: title.slice(bracket[0].length),
    };
  }
  const word = title.match(wordCategory);
  if (word?.[1]) {
    return { category: word[1].trim(), rest: title.slice(word[0].length) };
  }
  return { category: null, rest: title };
}

const commitTagPattern = /^(\w+)(\([\w./-]+\))?!?:\s*/;

export function parseCommitTag(message: string): {
  tag: string | null;
  scope: string | null;
  rest: string;
} {
  const match = message.match(commitTagPattern);
  if (!match?.[1]) return { tag: null, scope: null, rest: message };
  return {
    tag: match[1].toLowerCase(),
    scope: match[2] ? match[2].slice(1, -1) : null,
    rest: message.slice(match[0].length),
  };
}
