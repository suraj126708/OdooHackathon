import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample testimonials data with photos
const testimonials = [
  {
    name: "John Doe",
    position: "Coal Mine Worker",
    quote:
      "With this platform, I feel safer knowing there are real-time updates and alerts. It’s like having a safety net every time I’m on site.",
    image:
      "https://tse1.mm.bing.net/th?id=OIP.BQ-iuJbG3XohQ4E1P-_4LgHaLF&pid=Api&P=0&h=180",
  },
  {
    name: "Jane Smith",
    position: "Safety Officer",
    quote:
      "The safety alert feature has reduced incidents significantly. Workers are better informed and more prepared.",
    image:
      "https://tse4.mm.bing.net/th?id=OIP.ygbTydWEmhPabLSdfW8LxgHaE7&pid=Api&P=0&h=180",
  },
  {
    name: "Michael Johnson",
    position: "Mining Supervisor",
    quote:
      "Attendance tracking and safety monitoring have become seamless. I can ensure everyone is accounted for and safe.",
    image:
      "https://tse1.mm.bing.net/th?id=OIP.c9HUlYN7tNYe-ylFo5xMswHaE8&pid=Api&P=0&h=180",
  },
  {
    name: "Emily Williams",
    position: "Operations Manager",
    quote:
      "This system is essential for worker safety. It’s efficient, reliable, and makes daily operations much smoother.",
    image:
      "https://tse4.mm.bing.net/th?id=OIP.CrRznRK3yNhKqZ2XUSQ61wHaJ5&pid=Api&P=0&h=180",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="py-12">
      <div className="w-4/6 mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          What Our Workers Say
        </h2>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start bg-transparent rounded-lg">
                {/* Testimonial Image */}
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                />
                {/* Testimonial Content */}
                <div className="text-center md:text-left">
                  <p className="text-xl italic text-gray-700 mb-4">
                    {testimonial.quote}
                  </p>
                  <h4 className="text-lg font-bold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
