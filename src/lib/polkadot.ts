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
  apiPromise = connect(WS_PRIMARY).catch(async (error) => {
    if (!WS_FALLBACK) throw new Error("RPC connect failed, no fallback");
    return connect(WS_FALLBACK);
  });
  return apiPromise;
}

export async function ensureExtension(): Promise<void> {
  // Dynamic import to avoid evaluating browser APIs during build
  const { web3Enable } = await import("@polkadot/extension-dapp");

  try {
    const exts = await web3Enable("EchoID");
    if (!exts.length) {
      throw new Error("Polkadot.js extension not found or not authorized");
    }
  } catch (error) {
    throw error;
  }
}

export async function signRemark(
  account: InjectedAccountWithMeta,
  hashHex: string
): Promise<{ txHash: string; blockNumber: number }> {
  await ensureExtension();
  // Dynamic import to avoid evaluating browser APIs during build
  const { web3FromAddress } = await import("@polkadot/extension-dapp");
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

export async function attest(
  account: InjectedAccountWithMeta,
  subject: string,
  attestationType: string,
  score: number,
  comment: string
): Promise<{ txHash: string }> {
  await ensureExtension();
  // Dynamic import to avoid evaluating browser APIs during build
  const { web3FromAddress } = await import("@polkadot/extension-dapp");
  const injector = await web3FromAddress(account.address);
  const api = await getApi();

  return new Promise(async (resolve, reject) => {
    try {
      const attestationTypeEnum = api.createType('AttestationType', attestationType);
      const commentBytes = new TextEncoder().encode(comment);
      const tx = api.tx.echoid.attest(subject, attestationTypeEnum, score, commentBytes);
      await tx.signAndSend(
        account.address,
        { signer: injector.signer },
        ({ status, dispatchError, txHash }) => {
          if (dispatchError) reject(new Error(dispatchError.toString()));
          if (status.isFinalized) resolve({ txHash: txHash.toHex() });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export async function getProfile(address: string): Promise<{ handle: string; bio: string; links: string[]; skills: string[]; score: number } | null> {
  const api = await getApi();
  const profile = await api.query.echoid.profiles(address);
  if ((profile as any).isSome) {
    const p = (profile as any).unwrap();
    return {
      handle: new TextDecoder().decode(p.handle),
      bio: new TextDecoder().decode(p.bio),
      links: p.links.map((l: any) => new TextDecoder().decode(l)),
      skills: p.skills.map((s: any) => new TextDecoder().decode(s)),
      score: p.score.toNumber(),
    };
  }
  return null;
}

export async function getAttestations(subject: string): Promise<Array<{ attester: string; attestation_type: string; score: number; comment: string }>> {
  const api = await getApi();
  const entries = await (api.query.echoid.attestations as any).entries();
  return entries.filter(([key]: any) => key.args[1].toString() === subject).map(([key, value]: any) => {
    const [attester] = key.args;
    const att = value.unwrap();
    return {
      attester: attester.toString(),
      attestation_type: att.attestation_type.toString(),
      score: att.score.toNumber(),
      comment: new TextDecoder().decode(att.comment),
    };
  });
}

export async function subscribeEchoidEvents(cb: (event: { type: 'AttestationMade' | 'AttestationRevoked'; data: any }) => void): Promise<() => void> {
  const api = await getApi();
  return api.rpc.chain.subscribeNewHeads(async () => {
    const events = await api.query.system.events();
    (events as any).forEach((record: any) => {
      const { event } = record;
      if (event.section === 'echoid') {
        if (event.method === 'AttestationMade') {
          cb({ type: 'AttestationMade', data: event.data.toHuman() });
        } else if (event.method === 'AttestationRevoked') {
          cb({ type: 'AttestationRevoked', data: event.data.toHuman() });
        }
      }
    });
  });
}
