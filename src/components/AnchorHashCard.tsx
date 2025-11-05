"use client"

import React, { useMemo, useState } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { sha256Hex, stableStringify } from "../lib/hashing";
import { signRemark } from "../lib/polkadot";

type Props = {
  account?: InjectedAccountWithMeta | null;
  profileSnapshot?: any;
};

export default function AnchorHashCard({ account, profileSnapshot }: Props) {
  const localHash = useMemo(() => {
    if (!profileSnapshot) return null;
    try {
      return sha256Hex(stableStringify(profileSnapshot));
    } catch (err) {
      return null;
    }
  }, [profileSnapshot]);

  const [anchoring, setAnchoring] = useState(false);
  const [txInfo, setTxInfo] = useState<any>(null);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);

  async function anchor() {
    if (!account || !localHash) return;
    setAnchoring(true);
    try {
      const res = await signRemark(account, localHash);
      // res should include txHash and blockNumber
      setTxInfo(res);
      // POST to API anchor route
      await fetch("/api/anchor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account.address,
          txHash: res.txHash,
          blockNumber: res.blockNumber,
          profileSnapshot,
        }),
      });
    } catch (err) {
      console.error(err);
      setTxInfo({ error: String(err) });
    } finally {
      setAnchoring(false);
    }
  }

  async function verify() {
    if (!account) return;
    try {
      const q = new URLSearchParams({ onchainHash: verifyInput });
      const res = await fetch(`/api/verify/${encodeURIComponent(account.address)}?${q.toString()}`);
      const data = await res.json();
      setVerifyResult(data);
    } catch (err) {
      setVerifyResult({ error: String(err) });
    }
  }

  return (
    <div className="p-4 bg-gray-900 rounded-md border border-gray-800">
      <h3 className="text-lg font-semibold mb-2">Anchor / Verify</h3>
      <div className="text-sm mb-2">Local hash:</div>
      <div className="font-mono text-xs break-all bg-gray-800 p-2 rounded">{localHash ?? "—"}</div>

      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 bg-purple-600 rounded" onClick={anchor} disabled={!account || !localHash || anchoring}>
          {anchoring ? "Anchoring…" : "Anchor on-chain"}
        </button>
      </div>

      {txInfo && (
        <div className="mt-3 bg-gray-800 p-2 rounded text-sm font-mono break-all">
          <div>Tx: {txInfo.txHash ?? txInfo.hash ?? JSON.stringify(txInfo)}</div>
          <div>Block: {txInfo.blockNumber ?? txInfo.block ?? "-"}</div>
        </div>
      )}

      <div className="mt-4">
        <label className="text-sm block mb-1">On-chain hash (demo input)</label>
        <input value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} className="w-full p-2 bg-gray-800 rounded" />
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-2 bg-emerald-600 rounded" onClick={verify} disabled={!account}>
            Verify
          </button>
        </div>
      </div>

      {verifyResult && (
        <div className="mt-3 p-2 bg-gray-800 rounded text-sm">
          <div>storedHashHex: <span className="font-mono">{verifyResult.storedHashHex}</span></div>
          <div>onchainHash: <span className="font-mono">{verifyResult.onchainHash}</span></div>
          <div>matches: <strong>{String(verifyResult.matches)}</strong></div>
        </div>
      )}
    </div>
  );
}
