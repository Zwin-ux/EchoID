"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Link2, Loader2, Sparkles } from "lucide-react";
import { TicketButton } from "@/components/ui/ticket-button";
import { useAvatarStore } from "@/state/useAvatarStore";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import type { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";

type ConnectionStage = "idle" | "enabling" | "selecting" | "ready" | "error";

export interface PolkadotConnectProps {
  onConnected?: (account: InjectedAccountWithMeta) => void;
  className?: string;
}

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(199, 125, 255, 0.0)",
      "0 0 32px rgba(199, 125, 255, 0.35)",
      "0 0 0px rgba(199, 125, 255, 0.0)",
    ],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const PolkadotConnect = ({ onConnected, className }: PolkadotConnectProps) => {
  const [extensions, setExtensions] = useState<InjectedExtension[]>([]);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [stage, setStage] = useState<ConnectionStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const setWallet = useAvatarStore((state) => state.setWallet);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.address === selectedAddress) ?? null,
    [accounts, selectedAddress],
  );

  useEffect(() => {
    async function bootstrap() {
      try {
        setStage("enabling");
        setError(null);
        const enabled = await web3Enable("Bonelli ID");
        setExtensions(enabled);

        if (!enabled.length) {
          setStage("error");
          setError("Polkadot.js extension not detected. Install to continue.");
          return;
        }

        const injectedAccounts = await web3Accounts();
        setAccounts(injectedAccounts);

        if (!injectedAccounts.length) {
          setStage("error");
          setError("Unlock your Polkadot account in the extension to connect.");
          return;
        }

        setStage("selecting");

        if (injectedAccounts.length === 1) {
          const [onlyAccount] = injectedAccounts;
          handleSelectAccount(onlyAccount);
        }
      } catch (e) {
        console.error("Polkadot connect error", e);
        setStage("error");
        setError("Unable to connect to extension. Retry after refreshing the page.");
      }
    }

    bootstrap();
  }, []);

  const handleSelectAccount = async (account: InjectedAccountWithMeta) => {
    setSelectedAddress(account.address);
    setStage("ready");
    setWallet({ address: account.address, signer: account });
    onConnected?.(account);
  };

  return (
    <motion.section
      variants={glowVariants}
      animate="animate"
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0F]/60 p-6 backdrop-blur-xl ${className ?? ""}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(199,125,255,0.25)_0%,rgba(10,10,15,0)_55%),radial-gradient(circle_at_80%_0%,rgba(0,209,255,0.18)_0%,rgba(10,10,15,0)_55%)]" />
      <div className="relative flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#00D1FF]/70">
        <Sparkles className="h-4 w-4" />
        Identity Ticket Booth
      </div>

      <div className="relative mt-4 flex flex-col gap-2 text-left">
        <h2 className="font-heading text-2xl font-semibold text-white">Connect your Polkadot wallet</h2>
        <p className="font-body text-sm text-white/65">
          Bonelli ID never holds your keys. Approve the extension prompt to enter the avatar midway.
        </p>
      </div>

      <div className="relative mt-6 space-y-4">
        {stage === "enabling" && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-[#C77DFF]" />
            <div>
              <p className="font-body text-sm text-white/80">Waiting for Polkadot.js extension...</p>
              <p className="font-body text-xs text-white/55">Authorize Bonelli ID to access your accounts.</p>
            </div>
          </div>
        )}

        {stage === "error" && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-red-200">
              <AlertTriangle className="h-4 w-4" />
              Connection needed
            </div>
            <p className="font-body mt-2 text-xs text-red-100/80">{error}</p>
            {!extensions.length && (
              <a
                href="https://polkadot.js.org/extension/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs text-[#00D1FF] underline"
              >
                Install Polkadot.js extension
              </a>
            )}
          </div>
        )}

        {stage === "selecting" && (
          <div className="space-y-3">
            {accounts.map((account) => {
              const isActive = selectedAddress === account.address;
              return (
                <button
                  key={account.address}
                  type="button"
                  onClick={() => handleSelectAccount(account)}
                  className={`group w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-[#00D1FF]/60 bg-[#00D1FF]/10"
                      : "border-white/10 bg-white/5 hover:border-[#C77DFF]/40 hover:bg-[#C77DFF]/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading text-base text-white">
                        {account.meta.name || "Polkadot Account"}
                      </p>
                      <p className="font-body mt-1 text-xs text-white/60 break-all">{account.address}</p>
                      <p className="font-body mt-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                        Source: {account.meta.source}
                      </p>
                    </div>
                    {isActive && <Check className="h-5 w-5 text-[#00D1FF]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {stage === "ready" && selectedAccount && (
          <div className="rounded-2xl border border-[#00D1FF]/50 bg-[#00D1FF]/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C77DFF_0%,#00D1FF_100%)] text-white">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-sm text-white">Wallet connected</p>
                <p className="font-body text-xs text-white/65 break-all">{selectedAccount.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        <TicketButton
          variant="primary"
          size="md"
          onClick={async () => {
            if (stage === "ready" && selectedAccount) {
              onConnected?.(selectedAccount);
              return;
            }
            setStage("enabling");
            setError(null);
            try {
              const enabled = await web3Enable("Bonelli ID");
              setExtensions(enabled);
              if (!enabled.length) {
                setStage("error");
                setError("Extension not detected.");
                return;
              }
              const injectedAccounts = await web3Accounts();
              setAccounts(injectedAccounts);
              if (injectedAccounts.length === 1) {
                handleSelectAccount(injectedAccounts[0]);
              } else {
                setStage("selecting");
              }
            } catch (retryErr) {
              console.error("retry connect error", retryErr);
              setStage("error");
              setError("Extension authorization failed. Check the Polkadot.js popup.");
            }
          }}
        >
          {stage === "ready" ? "Continue" : "Connect Polkadot"}
        </TicketButton>

        {stage === "ready" && (
          <span className="font-body text-xs text-[#00D1FF]/80">Your signer is cached for the avatar builder.</span>
        )}
      </div>
    </motion.section>
  );
};

export default PolkadotConnect;
