import VersionSwitcher from "@/components/casestudy/VersionSwitcher";

/* v1 — the storyboard mock (Option C), served as a static file. */
export default function StagingV1Page() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#EFF4F0" }}>
      <iframe
        src="/case-studies/v0-storyboard.html"
        title="Staging case study — storyboard"
        style={{ border: "none", width: "100%", height: "100%", display: "block" }}
      />
      <VersionSwitcher current="v1" />
    </div>
  );
}
