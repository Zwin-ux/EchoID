type P = {
  handle: string;
  bio?: string | null;
  links?: Record<string, string> | null;
  skills?: string[] | null;
  lastAnchorBlk?: number | null;
};

export function computeReputation(p: P): number {
  let s = 0;
  if (p.handle) s += 5;
  if (p.bio && p.bio.length >= 80) s += 5;
  s += Math.min((p.links ? Object.values(p.links).filter(Boolean).length : 0) * 2, 10);
  s += Math.min(p.skills?.length ?? 0, 10);
  if (typeof p.lastAnchorBlk === "number") s += 5;
  return s;
}
