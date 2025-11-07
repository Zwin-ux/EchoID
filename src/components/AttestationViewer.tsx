"use client";

import React, { useEffect, useState } from "react";
import { getProfile, getAttestations, subscribeEchoidEvents } from "../lib/polkadot";

type Props = {
  address: string;
};

export default function AttestationViewer({ address }: Props) {
  const [profile, setProfile] = useState<{ handle: string; bio: string; links: string[]; skills: string[]; score: number } | null>(null);
  const [attestations, setAttestations] = useState<Array<{ attester: string; attestation_type: string; score: number; comment: string }>>([]);
  const [events, setEvents] = useState<Array<{ type: string; data: any }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const p = await getProfile(address);
        setProfile(p);
        const atts = await getAttestations(address);
        setAttestations(atts);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    subscribeEchoidEvents((event) => {
      setEvents((prev) => [event, ...prev.slice(0, 9)]); // keep last 10
    }).then((unsubscribe) => {
      return unsubscribe;
    });
  }, [address]);

  if (loading) {
    return (
      <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="ml-3 text-white/70">Loading verification data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Verification Panel</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-white/90 mb-2 block">Wallet Address</label>
          <div className="font-mono text-sm bg-black/30 p-3 rounded-lg break-all text-white/80 border border-white/10">
            {address}
          </div>
        </div>

        {profile ? (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 text-green-400">✅</div>
              <span className="text-green-400 font-semibold">Profile Found</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-white/70 text-sm">Handle:</span>
                <div className="font-medium text-white mt-1">{profile.handle || 'Not set'}</div>
              </div>
              <div>
                <span className="text-white/70 text-sm">Trust Score:</span>
                <div className="font-medium text-green-400 mt-1">{profile.score}/100</div>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-4">
                <span className="text-white/70 text-sm">Bio:</span>
                <div className="text-white mt-1">{profile.bio}</div>
              </div>
            )}

            {profile.links && profile.links.length > 0 && (
              <div className="mt-4">
                <span className="text-white/70 text-sm">Links:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.links.map((link, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/10 rounded text-sm text-white/80">
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <span className="text-white/70 text-sm">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-yellow-400">⚠️</div>
              <span className="text-yellow-400 font-medium">No profile found for this address</span>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-lg font-medium text-white mb-4">Attestations</h4>
          {attestations.length > 0 ? (
            <div className="space-y-3">
              {attestations.map((att, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">✓</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{att.attestation_type}</div>
                        <div className="text-sm text-green-400 font-semibold">Score: {att.score}/100</div>
                      </div>
                    </div>
                  </div>

                  {att.comment && (
                    <div className="mb-3">
                      <span className="text-white/70 text-sm">Comment:</span>
                      <div className="text-white mt-1">{att.comment}</div>
                    </div>
                  )}

                  <div>
                    <span className="text-white/70 text-sm">Attester:</span>
                    <div className="font-mono text-xs text-white/80 break-all mt-1">{att.attester}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <div className="text-white/50">No attestations found</div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-medium text-white mb-4">Live Events</h4>
          {events.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {events.map((ev, idx) => (
                <div key={idx} className="p-3 bg-black/30 border border-white/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-medium text-sm">{ev.type}</span>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="font-mono text-xs text-white/80">{JSON.stringify(ev.data)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <div className="text-white/50">No recent events</div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify({ profile, attestations }, null, 2))}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Copy JSON Data
          </button>
        </div>
      </div>
    </div>
  );
}