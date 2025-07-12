const NeedOfWorkerPage = () => {
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col justify-center items-center">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Need of Worker</h1>

      {/* Content Container */}
      <div className="flex flex-row w-10/12 h-4/5 bg-white shadow-lg rounded-lg gap-5">
        {/* Left Side - Image */}
        <div className="w-1/2 h-full">
          <img
            src="https://img.freepik.com/premium-photo/yellow-dump-truck-with-large-pile-coal-background_1044943-76979.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid-rr-similar" // Replace with any image URL
            alt="Coal Mine"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Right Side - Points */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-9">
            Why Workers are the Need of India
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
            <li>Workers form the backbone of the Indian economy.</li>
            <li>
              They play a critical role in the countrys industrial and
              infrastructure development.
            </li>
            <li>
              Indias large workforce contributes to the global supply chain and
              domestic production.
            </li>
            <li>
              Skilled labor helps in technology adoption and manufacturing
              growth.
            </li>
            <li>
              The labor force is essential for sustaining industries like coal,
              steel, and agriculture.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NeedOfWorkerPage;
