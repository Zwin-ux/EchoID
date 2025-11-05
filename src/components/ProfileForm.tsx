"use client"

import React, { useEffect, useState } from "react";

type Props = {
  address: string;
  onSaved?: (profile: any) => void;
};

export default function ProfileForm({ address, onSaved }: Props) {
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [site, setSite] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setResult(null);
  }, [address]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      address,
      handle,
      bio,
      links: { github: github || null, site: site || null },
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");
      setResult(data);
      onSaved?.(data.profile ?? data);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-900 rounded-md border border-gray-800">
      <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Address</label>
          <div className="font-mono text-sm text-gray-300">{address}</div>
        </div>
        <div>
          <label className="text-sm block mb-1">Handle</label>
          <input value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <div>
          <label className="text-sm block mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 bg-gray-800 rounded" rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm block mb-1">GitHub</label>
            <input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
          </div>
          <div>
            <label className="text-sm block mb-1">Site</label>
            <input value={site} onChange={(e) => setSite(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
          </div>
        </div>
        <div>
          <label className="text-sm block mb-1">Skills (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 rounded" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {error && <div className="mt-3 text-red-400">{error}</div>}
      {result && (
        <div className="mt-3 bg-gray-800 p-3 rounded">
          <div className="text-sm">Score: <strong>{result.profile?.score ?? result.score}</strong></div>
          <div className="text-xs font-mono mt-2 break-all">PrecomputedHash: {result.precomputedHashHex ?? result.hashHex}</div>
        </div>
      )}
    </div>
  );
}
