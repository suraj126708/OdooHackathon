/* eslint-disable react/prop-types */
import NavBar from "../components/Navbar";
import AboutIntro from "../components/About2";
import About1 from "../components/About1";
import Testimonials from "../components/About3Testimonials";
import FAQSection from "../components/FAQsection";
import Team from "../components/Team";
import Sponsors from "../components/About4Sponsers";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <NavBar id="black" />
      <About1 />
      <AboutIntro />
      <hr />
      <Sponsors />
      <hr />
      <Testimonials />
      <hr />
      <Team />
      <hr />
      <FAQSection />
      <Footer />
    </>
  );
}
