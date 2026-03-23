export default function DashboardCard({ title, description, status = "Work In Progress" }) {
    return (
      <div className="group rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#111827]">{title}</h3>
          <span className="rounded-full bg-[#FFF1EC] px-3 py-1 text-xs font-semibold text-[#F6490D]">
            {status}
          </span>
        </div>
  
        <p className="mb-8 text-base leading-7 text-gray-600">{description}</p>
  
        <div className="inline-flex items-center font-semibold text-[#F6490D] transition group-hover:translate-x-1">
          Open Module →
        </div>
      </div>
    );
  }