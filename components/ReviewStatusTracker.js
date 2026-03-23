export default function ReviewStatusTracker({ status, compact = false }) {
    const steps = [
      "self_submitted",
      "under_rm_review",
      "rm_reviewed",
      "under_skip_review",
      "skip_reviewed",
    ];
  
    const labels = {
      self_submitted: "Self Submitted",
      under_rm_review: "Under RM Review",
      rm_reviewed: "Reviewed by RM",
      under_skip_review: "Under Skip Review",
      skip_reviewed: "Reviewed by Skip Manager",
    };
  
    const currentIndex = steps.indexOf(status);
  
    const fillPercent =
      currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;
  
    return (
      <div
        className={`rounded-2xl border border-gray-200 bg-[#FCFCFD] ${
          compact ? "p-4" : "p-6"
        }`}
      >
        <div className="relative">
          {/* Base line */}
          <div
            className={`absolute left-0 right-0 rounded-full bg-gray-200 ${
              compact ? "top-3 h-[3px]" : "top-4 h-1"
            }`}
          />
  
          {/* Filled line */}
          <div
            className={`absolute left-0 rounded-full bg-[#F6490D] transition-all duration-700 ease-in-out ${
              compact ? "top-3 h-[3px]" : "top-4 h-1"
            }`}
            style={{ width: `${fillPercent}%` }}
          />
  
          {/* Steps */}
          <div className="relative flex items-start justify-between">
            {steps.map((step, index) => {
              const completed = currentIndex >= index;
  
              return (
                <div key={step} className="flex flex-1 flex-col items-center">
                  <div
                    className={`relative z-10 flex items-center justify-center rounded-full font-semibold transition-all duration-500 ${
                      compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"
                    } ${
                      completed
                        ? "bg-[#F6490D] text-white shadow-[0_8px_18px_rgba(246,73,13,0.28)]"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
  
                  <p
                    className={`mt-2 text-center font-medium leading-4 text-gray-600 ${
                      compact ? "text-[9px]" : "text-[11px]"
                    }`}
                  >
                    {labels[step]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }