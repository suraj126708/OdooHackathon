import { FaHardHat, FaShieldAlt, FaUsers } from "react-icons/fa";

const AboutIntro = () => {
  return (
    <div className=" min-h-screen py-9">
      <div className=" mx-auto px-24">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-8">
          About Us
        </h1>

        <section className="bg-white  p-10 rounded-lg ">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Introduction
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
              Our Coal Mines Worker Management Platform is crafted to ensure the
              well-being and safety of coal mine workers by focusing on advanced
              tracking and real-time alerts, fostering a safer work environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="mb-4 text-blue-600 text-4xl">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Real-Time Safety Alerts
              </h3>
              <p className="text-gray-600">
                We provide real-time notifications to keep workers updated about
                safety conditions, ensuring timely actions.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="mb-4 text-yellow-600 text-4xl">
                <FaHardHat />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Attendance Tracking
              </h3>
              <p className="text-gray-600">
                Our system allows for efficient attendance management, enabling
                easy tracking and reporting of worker shifts.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="mb-4 text-green-600 text-4xl">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Outstanding Workers
              </h3>
              <p className="text-gray-600">
                We recognize and reward workers who excel in safety and
                punctuality, fostering a culture of excellence.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto">
              For decades, we have been committed to supporting the energy
              sector by implementing robust safety measures and innovative
              solutions. Our goal is to provide a platform where workers can
              operate in the safest possible environment with immediate access
              to vital information.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutIntro;
