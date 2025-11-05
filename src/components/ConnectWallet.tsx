"use client"

import React, { useEffect, useState } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

type Props = {
  onSelect?: (account: InjectedAccountWithMeta) => void;
};

export default function ConnectWallet({ onSelect }: Props) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selected, setSelected] = useState<InjectedAccountWithMeta | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const ext = await web3Enable((process.env.NEXT_PUBLIC_APP_NAME as string) || "EchoID");
        if (!mounted) return;
        setEnabled(ext && ext.length > 0);
        const accs = await web3Accounts();
        if (!mounted) return;
        setAccounts(accs);
        if (accs.length === 1) {
          setSelected(accs[0]);
          onSelect?.(accs[0]);
        }
      } catch (err) {
        console.error("web3 init error", err);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [onSelect]);

  return (
    <div className="p-4 bg-gray-900 rounded-md border border-gray-800">
      <h3 className="text-lg font-semibold mb-2">Connect wallet</h3>
      {!enabled && (
        <div className="text-sm text-yellow-300">Polkadot extension not detected. Please install Polkadot.js extension.</div>
      )}
      <div className="mt-2">
        {accounts.length === 0 && <div className="text-sm text-gray-400">No accounts found</div>}
        <ul className="space-y-2">
          {accounts.map((a) => (
            <li key={a.address} className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <div>
                <div className="font-mono text-sm">{a.address}</div>
                <div className="text-xs text-gray-400">{a.meta.name || a.meta.source}</div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className={`px-2 py-1 rounded text-sm ${selected?.address === a.address ? 'bg-green-600' : 'bg-gray-700'}`}
                  onClick={() => {
                    setSelected(a);
                    onSelect?.(a);
                  }}
                >
                  Select
                </button>
                <button
                  className="px-2 py-1 rounded bg-gray-700 text-sm"
                  onClick={() => navigator.clipboard.writeText(a.address)}
                >
                  Copy
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
