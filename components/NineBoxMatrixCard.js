"use client";

const BOX_META = {
  "Top Talent": {
    title: "Top Talent",
    description:
      "High performance and high potential. Strong candidate for accelerated growth and succession planning.",
  },
  "Future Leader": {
    title: "Future Leader",
    description:
      "Strong performer with growing leadership readiness and scope for larger responsibilities.",
  },
  "Star": {
    title: "Star",
    description:
      "High current performance with lower future stretch potential. A dependable top contributor.",
  },
  "High Potential": {
    title: "High Potential",
    description:
      "Potential is strong, while performance still has room to become more consistent and impactful.",
  },
  "Growth": {
    title: "Growth",
    description:
      "Moderate performance and moderate potential. Can grow further with structured support.",
  },
  "Core": {
    title: "Core",
    description: "Stable and dependable contributor in the current role.",
  },
  "Misaligned": {
    title: "Misaligned",
    description:
      "Potential indicators are strong, but current performance suggests role-fit or execution gaps.",
  },
  "Inconsistent": {
    title: "Inconsistent",
    description:
      "Mixed signals on both performance delivery and future readiness; needs coaching.",
  },
  "Risk": {
    title: "Risk",
    description:
      "Low performance and low potential. Requires immediate intervention and support.",
  },
};

const GRID = [
  ["Star", "Future Leader", "Top Talent"],
  ["Core", "Growth", "High Potential"],
  ["Risk", "Inconsistent", "Misaligned"],
];

function AxisPill({ label }) {
  return (
    <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 shadow-sm">
      {label}
    </div>
  );
}

export default function NineBoxMatrixCard({ data }) {
  if (!data) return null;

  const meta = BOX_META[data.box_label] || {
    title: data.box_label || "9-Box Placement",
    description: data.box_description || "Placement description not available.",
  };

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
            9-Box Matrix
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Talent placement using PPI as performance axis and Potential Score as future-readiness axis.
          </p>
        </div>

        <div className="rounded-full bg-[#FFF1EC] px-4 py-2 text-sm font-semibold text-[#F6490D]">
          {data.box_label || "—"}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-[#111827]">
              9-Box Placement Grid
            </div>
            <div className="text-xs text-gray-500">
              Coordinate: ({data.ppi_score ?? "—"}, {data.potential_score ?? "—"})
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex min-h-[426px] flex-col items-center justify-around py-3">
              <AxisPill label="High" />
              <AxisPill label="Medium" />
              <AxisPill label="Low" />
            </div>

            <div className="flex-1">
            <div className="mt-3 text-center">
                <span className="text-sm font-medium text-[#111827]">
                  Potential Score (Y-axis)
                </span>
              </div>
              {/* <div className="mb-2 flex items-center justify-between px-2">
                <AxisPill label="Low" />
                <AxisPill label="Medium" />
                <AxisPill label="High" />
              </div> */}

              <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white">
                <div className="grid grid-cols-3 grid-rows-3">
                  {GRID.flat().map((label, index) => {
                    const isActive = label === data.box_label;

                    return (
                      <div
                        key={`${label}-${index}`}
                        className={[
                          "flex min-h-[142px] flex-col justify-between border border-gray-200 p-4",
                          isActive ? "bg-[#FFF7F4]" : "bg-[#FCFCFD]",
                        ].join(" ")}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#111827]">
                              {label}
                            </p>

                            {isActive && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F6490D] shadow-[0_6px_16px_rgba(246,73,13,0.35)]">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>

                          <p className="mt-3 text-xs leading-6 text-gray-500">
                            {BOX_META[label]?.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              

              <div className="mt-4 flex items-center justify-between px-2">
                <AxisPill label="Low" />
                <AxisPill label="Medium" />
                <AxisPill label="High" />
              </div>

              <div className="mt-2 text-center">
                <span className="text-sm font-medium text-[#111827]">
                  Performance Score (X-axis)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Employee
            </p>
            <p className="mt-2 text-base font-semibold text-[#111827]">
              {data.employee_name || "—"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {data.employee_number || "—"} • {data.review_cycle || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#FCFCFD] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Score Coordinates
            </p>
            <div className="mt-3 space-y-2 text-sm text-[#111827]">
              <p>
                PPI Score:{" "}
                <span className="font-semibold">{data.ppi_score ?? "—"}</span>
              </p>
              <p>
                Potential Score:{" "}
                <span className="font-semibold">{data.potential_score ?? "—"}</span>
              </p>
              <p>
                Performance Bucket:{" "}
                <span className="font-semibold capitalize">
                  {data.performance_bucket ?? "—"}
                </span>
              </p>
              <p>
                Potential Bucket:{" "}
                <span className="font-semibold capitalize">
                  {data.potential_bucket ?? "—"}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F6490D]/15 bg-[#FFF7F4] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Placement Summary
            </p>
            <p className="mt-2 text-lg font-semibold text-[#111827]">
              {meta.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.box_description || meta.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}