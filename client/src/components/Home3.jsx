import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SafetyInformation = () => {
  const safetyRules = [
    {
      id: 1,
      title: "Always Wear PPE",
      description:
        "Personal protective equipment (PPE) such as helmets, gloves, and safety boots are essential for your safety.",
      imageUrl:
        "https://img.freepik.com/free-photo/industrial-man-pointing-his-mask-uniform-looking-serious-front-view_176474-38800.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid",
    },
    {
      id: 2,
      title: "Conduct Safety Drills",
      description:
        "Regular safety drills help ensure that all workers know how to respond in emergencies.",
      imageUrl:
        "https://img.freepik.com/free-vector/cave-scene-with-firerman-rescue-cartoon-style_1308-92875.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid-rr-similar",
    },
    {
      id: 3,
      title: "Inspect Equipment",
      description:
        "Regularly inspect all equipment to ensure it is in good working condition and report any defects immediately.",
      imageUrl:
        "https://img.freepik.com/premium-photo/quotminer-using-handheld-scanner-detect-minerals-undergroundquot_1280275-255098.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid-rr-similar",
    },
    {
      id: 4,
      title: "Clear Communication",
      description:
        "Maintain clear communication with your team and supervisors to ensure everyone’s safety.",
      imageUrl:
        "https://img.freepik.com/premium-photo/simple-illustration-two-people-dialogue-with-speech-bubbles-pastel-green-background-minima_1117469-25049.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid-rr-similar",
    },
    {
      id: 5,
      title: "Report Hazards",
      description:
        "If you notice any hazards, report them immediately to your supervisor.",
      imageUrl:
        "https://i.pinimg.com/236x/ca/07/f7/ca07f750eefcb153c4398306d22b714a.jpg",
    },
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Safety Practices & Protocols
        </h2>
        <p className="text-lg text-gray-700 text-center mb-4">
          The safety of our workers is our top priority. Here are essential
          practices and protocols to ensure a safe working environment in coal
          mines.
        </p>

        {/* Slider for Safety Rules */}
        <Slider {...settings} className="my-8">
          {safetyRules.map((rule) => (
            <div key={rule.id} className="relative h-96">
              <img
                src={rule.imageUrl}
                alt={rule.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 p-4 text-white text-center">
                <h3 className="text-2xl font-semibold mb-2">{rule.title}</h3>
                <p className="text-lg">{rule.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SafetyInformation;
