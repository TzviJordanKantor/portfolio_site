"use client";

/* v3 — voice pass ("Making a dev feature speak WordPress"). Component: StagingV2.tsx (frozen). */
import StagingVoicePass from "@/components/casestudy/StagingV2";
import VersionSwitcher from "@/components/casestudy/VersionSwitcher";

export default function StagingV3Page() {
  return (
    <>
      <StagingVoicePass />
      <VersionSwitcher current="v3" />
    </>
  );
}
