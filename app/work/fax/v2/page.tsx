"use client";

/* v2 — current build. Component: FaxCaseStudy.tsx (also rendered by canonical /work/fax). */
import FaxCaseStudy from "@/components/casestudy/FaxCaseStudy";
import FaxVersionSwitcher from "@/components/casestudy/FaxVersionSwitcher";

export default function FaxV2Page() {
  return (
    <>
      <FaxCaseStudy />
      <FaxVersionSwitcher current="v2" />
    </>
  );
}
