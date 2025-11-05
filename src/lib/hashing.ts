import { createHash } from "crypto";

function sortKeys(v: any): any {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object" && v.constructor === Object) {
    return Object.keys(v).sort().reduce((acc: any, k) => {
      acc[k] = sortKeys(v[k]);
      return acc;
    }, {});
  }
  return v;
}

export function stableStringify(obj: unknown): string {
  return JSON.stringify(sortKeys(obj));
}

export function sha256Hex(input: string): string {
  return "0x" + createHash("sha256").update(input).digest("hex");
}
