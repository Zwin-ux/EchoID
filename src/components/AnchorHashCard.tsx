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
    <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🔗</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Anchor & Verify Hash</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/90 mb-2 block">Local Profile Hash</label>
          <div className="font-mono text-sm bg-black/30 p-4 rounded-lg break-all text-white/80 border border-white/10">
            {localHash ?? "—"}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={anchor}
            disabled={!account || !localHash || anchoring}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {anchoring ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Anchoring...</span>
              </div>
            ) : (
              'Anchor on Blockchain'
            )}
          </button>
        </div>

        {txInfo && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 text-green-400">✅</div>
              <span className="text-green-400 font-semibold">Transaction Successful!</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-white/70 text-sm">Transaction Hash:</span>
                <span className="font-mono text-xs text-white/80 break-all">{txInfo.txHash ?? txInfo.hash ?? JSON.stringify(txInfo)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-white/70 text-sm">Block Number:</span>
                <span className="font-mono text-xs text-white/80">{txInfo.blockNumber ?? txInfo.block ?? "-"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <label className="text-sm font-medium text-white/90 mb-3 block">Verify On-Chain Hash</label>
          <input
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all mb-4"
            placeholder="Enter hash to verify..."
          />

          <button
            onClick={verify}
            disabled={!account}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verify Hash
          </button>
        </div>

        {verifyResult && (
          <div className={`p-4 border rounded-xl ${verifyResult.matches ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-5 h-5 ${verifyResult.matches ? 'text-green-400' : 'text-red-400'}`}>
                {verifyResult.matches ? '✅' : '❌'}
              </div>
              <span className={`font-semibold ${verifyResult.matches ? 'text-green-400' : 'text-red-400'}`}>
                {verifyResult.matches ? 'Hash Verified!' : 'Hash Mismatch'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-white/70">Stored Hash:</span>
                <span className="font-mono text-xs text-white/80 break-all">{verifyResult.storedHashHex}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-white/70">On-chain Hash:</span>
                <span className="font-mono text-xs text-white/80 break-all">{verifyResult.onchainHash}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-white/70">Matches:</span>
                <span className={`font-semibold ${verifyResult.matches ? 'text-green-400' : 'text-red-400'}`}>
                  {String(verifyResult.matches)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
