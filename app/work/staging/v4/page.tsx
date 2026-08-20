"use client";

/* v4 — current build. Component: StagingCaseStudy.tsx (also rendered by canonical /work/staging). */
import StagingCaseStudy from "@/components/casestudy/StagingCaseStudy";
import VersionSwitcher from "@/components/casestudy/VersionSwitcher";

export default function StagingV4Page() {
  return (
    <>
      <StagingCaseStudy />
      <VersionSwitcher current="v4" />
    </>
  );
}
