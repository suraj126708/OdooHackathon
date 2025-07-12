/* eslint-disable react/prop-types */
import NavBar from "../components/Navbar";
import MapboxMap from "../components/MApbox";
import Footer from "../components/Footer";

export default function LocateUser() {
  return (
    <>
      <NavBar id="black" />
      <div className="mt-32">
        <h1 className="font-semibold font-serif mt-5 text-center text-4xl ml-6">
          Location Of Employees
        </h1>
        <MapboxMap />
      </div>
      <Footer />
    </>
  );
}
