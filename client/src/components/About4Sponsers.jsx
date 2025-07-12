// Sample sponsors data with logos
const sponsors = [
  {
    id: 1,
    logo: "https://1000logos.net/wp-content/uploads/2017/08/Detroit-Lions-Logo-tumb.png",
    alt: "Sponsor 1",
  }, // Replace with actual logo URLs
  {
    id: 2,
    logo: "https://1000logos.net/wp-content/uploads/2019/06/Buffalo-Bills-logo.jpg",
    alt: "Sponsor 2",
  },
  {
    id: 3,
    logo: "https://1000logos.net/wp-content/uploads/2016/12/Starbucks-logo-tumb.jpg",
    alt: "Sponsor 3",
  },
  {
    id: 4,
    logo: "https://1000logos.net/wp-content/uploads/2018/04/mercedes-logo-sm.png",
    alt: "Sponsor 4",
  },
  {
    id: 5,
    logo: "https://1000logos.net/wp-content/uploads/2018/02/Timberland-Logo-tumb.png",
    alt: "Sponsor 5",
  },
  {
    id: 6,
    logo: "https://1000logos.net/wp-content/uploads/2019/06/Real-Madrid-Logo.jpg",
    alt: "Sponsor 6",
  },
  {
    id: 7,
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Batman-Logo-tumb.png",
    alt: "Sponsor 7",
  },
];

const Sponsors = () => {
  return (
    <div className=" py-14 w-full overflow-hidden">
      <div className=" mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-14">
          Our Esteemed Sponsors
        </h2>

        <div className="relative w-full overflow-hidden">
          <div className="flex space-x-8 animate-scroll whitespace-nowrap">
            {sponsors.concat(sponsors).map((sponsor, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  src={sponsor.logo}
                  alt={sponsor.alt}
                  className="w-40 h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
