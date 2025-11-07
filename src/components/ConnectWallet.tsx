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
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const retryConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const accs = await web3Accounts();
      setAccounts(accs);
      setAuthorized(true);
      setError(null);
      if (accs.length === 1) {
        setSelected(accs[0]);
        onSelect?.(accs[0]);
      }
    } catch (accountError: any) {
      if (accountError.message?.includes('pending authorization') ||
          accountError.message?.includes('authorization')) {
        setAuthorized(false);
        setError('Please authorize EchoID in your Polkadot.js extension to continue.');
      } else {
        setError(`Failed to load accounts: ${accountError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        setLoading(true);
        setError(null);

        // Enable Polkadot.js extension
        const extensions = await web3Enable((process.env.NEXT_PUBLIC_APP_NAME as string) || "EchoID");
        if (!mounted) return;

        const hasExtension = extensions && extensions.length > 0;
        setEnabled(hasExtension);

        if (!hasExtension) {
          setLoading(false);
          return;
        }

        // Try to get accounts - this may fail if user hasn't authorized
        try {
          const accs = await web3Accounts();
          if (!mounted) return;

          setAccounts(accs);
          setAuthorized(true);

          // Auto-select if only one account
          if (accs.length === 1) {
            setSelected(accs[0]);
            onSelect?.(accs[0]);
            // Save address to localStorage for quest system
            localStorage.setItem("selectedAddress", accs[0].address);
          }
        } catch (accountError: any) {
          // This happens when user hasn't authorized the app yet
          if (accountError.message?.includes('pending authorization') ||
              accountError.message?.includes('authorization')) {
            setAuthorized(false);
            setError('Please authorize EchoID in your Polkadot.js extension to continue.');
          } else {
            setError(`Failed to load accounts: ${accountError.message}`);
          }
        }
      } catch (err: any) {
        console.error("web3 init error", err);
        setError(`Failed to initialize wallet connection: ${err.message}`);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [onSelect]);

  return (
    <div className="p-6 bg-carnival-canvas/70 backdrop-blur-sm border-2 border-carnival-twist/30 rounded-xl space-y-6 relative overflow-hidden">
      {/* Awning stripe at top */}
      <div className="absolute top-0 left-0 right-0 h-3 awning-stripes opacity-40" />

      {/* Corner decoration lights */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-carnival-ticket animate-lights-glow opacity-60" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-carnival-marquee animate-lights-glow opacity-60" style={{ animationDelay: '0.5s' }} />

      <div className="flex items-center space-x-3 pt-2">
        <div className="w-8 h-8 bg-gradient-to-r from-carnival-marquee to-carnival-candy rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">👛</span>
        </div>
        <h3 className="text-xl font-semibold carnival-text drop-shadow-lg">Ticket Booth</h3>
      </div>

      {loading && (
        <div className="p-8 bg-carnival-night/30 border-2 border-carnival-twist/20 rounded-xl text-center">
          <div className="w-8 h-8 border-2 border-carnival-twist/30 border-t-carnival-twist rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white/70">Setting up your ticket...</div>
        </div>
      )}

      {!loading && !enabled && (
        <div className="p-4 bg-carnival-ticket/10 border-2 border-carnival-ticket/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-carnival-ticket animate-lights-glow">⚠️</div>
            <span className="text-carnival-ticket font-medium">Ticket Scanner Not Found</span>
          </div>
          <p className="text-white/70 text-sm mt-2">
            Please install the Polkadot.js browser extension to enter the carnival.
          </p>
          <a
            href="https://polkadot.js.org/extension/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-carnival-ticket to-carnival-twist hover:from-carnival-ticket/80 hover:to-carnival-twist/80 rounded-lg font-medium text-carnival-ink text-sm transition-all duration-200 shadow-lg"
          >
            Install Extension
          </a>
        </div>
      )}

      {!loading && enabled && error && (
        <div className="p-4 bg-carnival-marquee/10 border-2 border-carnival-marquee/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-carnival-marquee animate-lights-glow">🔐</div>
            <span className="text-carnival-marquee font-medium">Entry Pass Needed</span>
          </div>
          <p className="text-white/70 text-sm mt-2">
            {error}
          </p>
          <div className="mt-3 p-3 bg-carnival-night/50 rounded-lg border border-carnival-twist/20">
            <div className="text-xs text-white/60">
              <strong className="text-carnival-ticket">Steps to get your pass:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Click the Polkadot.js extension icon in your browser</li>
                <li>Find "EchoID" in the pending authorizations</li>
                <li>Click "Yes, allow this application access"</li>
                <li>Click "Retry Connection" below</li>
              </ol>
            </div>
          </div>
          <button
            onClick={retryConnection}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80 rounded-lg font-medium text-white text-sm transition-all duration-200 shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && enabled && !error && accounts.length === 0 && authorized && (
        <div className="p-8 bg-carnival-night/30 border-2 border-carnival-twist/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-carnival-twist/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl animate-lights-glow">🔄</span>
          </div>
          <div className="text-white/70">No Tickets Found</div>
          <div className="text-white/50 text-sm mt-1">Make sure your wallet is unlocked and has accounts</div>
        </div>
      )}

      {!loading && enabled && !error && accounts.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-carnival-ticket font-semibold mb-4">
            Choose your carnival ticket:
          </div>
          {accounts.map((a) => (
            <div
              key={a.address}
              className={`p-4 border-2 rounded-xl transition-all duration-200 relative ${
                selected?.address === a.address
                  ? 'bg-carnival-mint/10 border-carnival-mint/40 shadow-lg shadow-carnival-mint/20'
                  : 'bg-carnival-night/30 border-carnival-twist/20 hover:bg-carnival-night/50 hover:border-carnival-twist/40'
              }`}
            >
              {/* Ticket perforations for selected */}
              {selected?.address === a.address && (
                <>
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-canvas rounded-full" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-canvas rounded-full" />
                </>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${selected?.address === a.address ? 'bg-carnival-mint animate-lights-glow' : 'bg-carnival-twist/40'}`}></div>
                    <div>
                      <div className="font-medium text-white">{a.meta.name || 'Unnamed Account'}</div>
                      <div className="font-mono text-xs text-white/60 break-all">{a.address}</div>
                      <div className="text-xs text-carnival-twist mt-1">Source: {a.meta.source}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(a.address)}
                    className="px-3 py-2 bg-carnival-violet/20 hover:bg-carnival-violet/30 border border-carnival-violet/40 rounded-lg text-white text-sm transition-all duration-200"
                    title="Copy address"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => {
                      setSelected(a);
                      onSelect?.(a);
                      // Save address to localStorage for quest system
                      localStorage.setItem("selectedAddress", a.address);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg ${
                      selected?.address === a.address
                        ? 'bg-gradient-to-r from-carnival-mint to-carnival-mint/80 hover:from-carnival-mint/90 hover:to-carnival-mint/70 text-carnival-ink'
                        : 'bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80 text-white'
                    }`}
                  >
                    {selected?.address === a.address ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
