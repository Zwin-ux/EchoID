import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">EchoID</h1>
      <p className="text-white/80">
        Create a profile, anchor a cryptographic hash on Polkadot Westend, and verify integrity.
      </p>
      <Link
        href="/dashboard"
        className="inline-block rounded-lg bg-white text-black px-4 py-2 font-medium"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
