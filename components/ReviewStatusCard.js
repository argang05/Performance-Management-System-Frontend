import ReviewStatusTracker from "./ReviewStatusTracker"

export default function ReviewStatusCard({ status }) {

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">

      <h2 className="text-lg font-semibold">
        Review Progress
      </h2>

      <p className="text-sm text-gray-500">
        {status.employee_name} • {status.department}
      </p>

      <ReviewStatusTracker status={status.status} />

      <div className="mt-6">

        <h3 className="text-sm font-semibold">
          Recommend Peer
        </h3>

        <input
          placeholder="Search employee name..."
          className="mt-2 w-full border rounded-lg p-2"
        />

        <button className="mt-3 px-4 py-2 bg-[#F6490D] text-white rounded-lg">
          Send Peer Review Request
        </button>

      </div>

    </div>
  )
}