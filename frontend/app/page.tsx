import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Intro from "./components/intro";
import Overview from "./components/overview";
import Experience from "./components/experience";
import Facilitators from "./components/facilitators";
import Register from "./components/register";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Overview />
        <Experience />
        <Facilitators />
        <Register />
      </main>
      <Footer />
    </>
  );
}