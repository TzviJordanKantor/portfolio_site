"use client";

/* v2 — first build ("nobody asked for it"). Component: StagingV1.tsx (frozen). */
import StagingFirstBuild from "@/components/casestudy/StagingV1";
import VersionSwitcher from "@/components/casestudy/VersionSwitcher";

export default function StagingV2Page() {
  return (
    <>
      <StagingFirstBuild />
      <VersionSwitcher current="v2" />
    </>
  );
}
