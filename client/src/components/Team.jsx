// import Aditya from "../assets/images/Aditya.jpg";

const Team = () => {
  const teamMembers = [
    {
      name: "hariom Hinge",
      position: "Developer",
      description:
        "Develops and maintains the platform's functionality for worker tracking and safety.",
      imageUrl:
        "https://tse4.mm.bing.net/th?id=OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH&pid=Api&P=0&h=180",
    },

    {
      name: "Ayush Domble",
      position: "Founder",
      description:
        "Initiated the project to enhance coal mine worker safety and tracking.",
      imageUrl:
        "https://tse4.mm.bing.net/th?id=OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH&pid=Api&P=0&h=180",
    },
  ];

  return (
    <>
      {" "}
      <div className="max-w-7xl mt-14 mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-center  text-6xl font-extrabold text-black mb-20">
          Meet Our Team
        </h2>
        <div className="flex justify-between items-center space-x-9">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <img
                className="w-40 h-40 rounded-full object-cover"
                src={member.imageUrl}
                alt={member.name}
              />
              <div className="text-center">
                <h3 className="text-xl font-medium text-black">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-800">{member.position}</p>
                <p className="mt-2 text-sm text-slate-800">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Team;
