"use client";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import ProfileForm from "@/components/ProfileForm";
import AnchorHashCard from "@/components/AnchorHashCard";

export default function Dashboard() {
  const [account, setAccount] = useState<any>(null);
  const [profileSnapshot, setProfileSnapshot] = useState<any>(null);

  useEffect(() => {
    /* placeholder for future */
  }, []);

  return (
    <div className="grid gap-6">
      <ConnectWallet onSelect={setAccount} />
      {account && (
        <ProfileForm address={account.address} onSaved={(snap: any) => setProfileSnapshot(snap)} />
      )}
      {account && profileSnapshot && (
        <AnchorHashCard account={account} profileSnapshot={profileSnapshot} />
      )}
    </div>
  );
}
