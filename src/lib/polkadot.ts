"use client";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const WS_PRIMARY = process.env.NEXT_PUBLIC_POLKADOT_WS!;
const WS_FALLBACK = process.env.NEXT_PUBLIC_POLKADOT_WS_FALLBACK;

let apiPromise: Promise<ApiPromise> | null = null;

export async function getApi(): Promise<ApiPromise> {
  if (apiPromise) return apiPromise;
  async function connect(url: string) {
    const provider = new WsProvider(url);
    return ApiPromise.create({ provider });
  }
  apiPromise = connect(WS_PRIMARY).catch(async () => {
    if (!WS_FALLBACK) throw new Error("RPC connect failed, no fallback");
    return connect(WS_FALLBACK);
  });
  return apiPromise;
}

export async function ensureExtension(): Promise<void> {
  const exts = await web3Enable("EchoID");
  if (!exts.length) throw new Error("Polkadot.js extension not found or not authorized");
}

export async function signRemark(
  account: InjectedAccountWithMeta,
  hashHex: string
): Promise<{ txHash: string; blockNumber: number }> {
  await ensureExtension();
  const injector = await web3FromAddress(account.address);
  const api = await getApi();

  return new Promise(async (resolve, reject) => {
    try {
      const tx = api.tx.system.remark(hashHex);
      await tx.signAndSend(
        account.address,
        { signer: injector.signer },
        async ({ status, dispatchError, txHash }) => {
          if (dispatchError) return reject(new Error(dispatchError.toString()));
          if (status.isInBlock || status.isFinalized) {
            // Quick way to fetch current block number
            const hdr = await api.rpc.chain.getHeader();
            resolve({ txHash: txHash.toHex(), blockNumber: hdr.number.toNumber() });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
