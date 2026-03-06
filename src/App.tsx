import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Contact from './components/Contact';
import Footer from './components/Footer';

const BUSINESS_ID = "d50362b5-4edb-4405-bd05-d8692d6e612e";

const businessDetails = {
  name: "Grotto - Pizzeria|Coffee Shop",
  address: "SF - 090, First floor, Galleria Market, Sector 28, DLF Phase IV, Gurugram, Haryana 122009, India",
};

function App() {
  return (
    <>
      <Header businessName={businessDetails.name} />
      <main>
        <Hero businessName={businessDetails.name} />
        <About />
        <Menu />
        <Contact address={businessDetails.address} businessId={BUSINESS_ID} />
      </main>
      <Footer businessName={businessDetails.name} />
    </>
  );
}

export default App;