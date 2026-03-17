"use client";

import ClaireButton from "./ClaireButton";

interface InlineClaireCardProps {
  heading: string;
  description: string;
}

export default function InlineClaireCard({ heading, description }: InlineClaireCardProps) {
  return (
    <div className="mt-12 rounded-xl border border-mint/30 bg-mint/5 p-8 text-center">
      <h3 className="text-lg font-bold text-white">{heading}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
      <div className="mt-4">
        <ClaireButton label="Speak with Claire" />
      </div>
    </div>
  );
}
