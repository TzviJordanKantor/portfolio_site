"use client";

/* Original — the frozen first draft, preserved for comparison.
   Component: CyberArkOriginal.tsx. Superseded as canonical by V1 on 2026-09-11. */
import CyberArkOriginal from "@/components/casestudy/CyberArkOriginal";
import CyberArkVersionSwitcher from "@/components/casestudy/CyberArkVersionSwitcher";

export default function CyberArkOriginalPage() {
  return (
    <>
      <CyberArkOriginal />
      <CyberArkVersionSwitcher current="original" />
    </>
  );
}
