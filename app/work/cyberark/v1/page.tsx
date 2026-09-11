"use client";

/* v1 — the narrative rebuild. Component: CyberArkV1.tsx.
   Not canonical: /work/cyberark still renders the frozen Original. */
import CyberArkV1 from "@/components/casestudy/CyberArkV1";
import CyberArkVersionSwitcher from "@/components/casestudy/CyberArkVersionSwitcher";

export default function CyberArkV1Page() {
  return (
    <>
      <CyberArkV1 />
      <CyberArkVersionSwitcher current="v1" />
    </>
  );
}
