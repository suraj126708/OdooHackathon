/* eslint-disable react/prop-types */
const WorkerOfTheMonth = ({ user }) => {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center my-5 text-gray-800">
      <h1 className="text-4xl font-bold text-black mb-6">
        Worker of the Month
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 md:w-2/3 lg:w-1/2">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://th.bing.com/th/id/OIP.X9sowrbjWHhmIqQsuC8YJQHaHa?w=188&h=188&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt={user.worker[0].name}
            className="rounded-full h-40 w-40 mb-6 object-cover shadow-md"
          />

          {/* Worker Info */}
          <h2 className="text-3xl font-bold mb-2">
            {user.worker[0].name.toUpperCase()}
          </h2>
          <h3 className="text-xl text-gray-600 mb-4">
            {user.worker[0].workerID < 10000
              ? "common worker"
              : "Senior Worker"}
          </h3>

          {/* Worker Stats */}
          <div className="bg-blue-100 p-4 rounded-md w-full mb-6">
            <p className="text-lg">
              <strong>Attendance:</strong> {user.attendancePercentage}
            </p>
            <p className="text-lg">
              <strong>Safety Compliance:</strong> {"Excellent"}
            </p>
          </div>
          <p className="text-gray-700 text-lg">
            {user.worker[0].name} has been outstanding in his attendance and
            safety compliance. He has followed all safety protocols and
            encouraged others to do the same.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerOfTheMonth;
