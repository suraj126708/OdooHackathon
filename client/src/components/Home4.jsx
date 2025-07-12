import "../App.css";

const SafetyAlertsPage = () => {
  return (
    <div className="w-full flex flex-col my-4 bg-gray-100 text-gray-800">
      {/* Notification Panel */}
      <div className="relative flex justify-center items-center bg-red-600 text-white py-6 overflow-hidden">
        <div className="absolute w-full h-full flex items-center">
          <div
            className="scrolling-alert whitespace-nowrap"
            style={{
              animation: "scroll 15s linear infinite",
              display: "inline-block",
            }}
          >
            <span className="mx-6">
              ⚠️ Gas leak detected in Zone B! Immediate evacuation required.
            </span>
            <span className="mx-6">
              ⚠️ Equipment failure in section C. Maintenance crew en route.
            </span>
            <span className="mx-6">
              ⚠️ High carbon monoxide levels in mining shaft. Wear safety gear!
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-grow p-6">
        {/* Recent Safety Concerns */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Recent Safety Concerns
          </h2>
          <ul className="list-disc pl-6">
            <li className="mb-2">
              ⚠️ <strong>October 10, 2024</strong> - Gas leak detected in Zone
              B. Immediate evacuation carried out.
            </li>
            <li className="mb-2">
              ⚠️ <strong>October 8, 2024</strong> - High carbon monoxide levels
              in the mining shaft. Safety gear distributed.
            </li>
            <li className="mb-2">
              ⚠️ <strong>October 5, 2024</strong> - Equipment failure reported
              in Section C. Maintenance work ongoing.
            </li>
          </ul>
        </div>

        {/* Safety Protocols */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Safety Protocols
          </h2>
          <p>
            Ensure all workers are aware of the evacuation routes and safety
            procedures in case of an emergency. Always wear appropriate safety
            gear in high-risk areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyAlertsPage;
