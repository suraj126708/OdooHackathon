import { useNavigate } from "react-router-dom";

export default function Home1() {
  const navigate = useNavigate();

  const handleRegisterComplaint = () => {
    navigate("/Attendence");
  };

  return (
    <>
      <div
        id="hero-page"
        className=" w-[100%] h-[100vh] flex justify-center items-center"
      >
        <div className="text-white text-center font-serif ">
          <p className="my-2">Transparancy is the need of todays india</p>
          <h1 className="text-6xl my-2">
            Digitalise the Construction <br /> Process
          </h1>
          <button
            className="text-lg py-3 px-12 my-4 border-2 rounded-lg bg-[#006168]"
            onClick={handleRegisterComplaint}
          >
            Register Presence
          </button>
        </div>
      </div>
    </>
  );
}
