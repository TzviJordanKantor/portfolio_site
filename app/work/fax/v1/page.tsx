"use client";

/* v1 — frozen first build. Component: FaxV1.tsx */
import FaxV1 from "@/components/casestudy/FaxV1";
import FaxVersionSwitcher from "@/components/casestudy/FaxVersionSwitcher";

export default function FaxV1Page() {
  return (
    <>
      <FaxV1 />
      <FaxVersionSwitcher current="v1" />
    </>
  );
}
