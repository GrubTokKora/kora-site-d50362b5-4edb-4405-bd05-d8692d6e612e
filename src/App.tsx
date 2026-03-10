import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Events from './components/Events';
import Contact from './components/Contact';
import Footer from './components/Footer';
import type { Event } from './components/Events';

const BUSINESS_ID = "d50362b5-4edb-4405-bd05-d8692d6e612e";

const businessDetails = {
  name: "Grotto - Pizzeria|Coffee Shop",
  address: "SF - 090, First floor, Galleria Market, Sector 28, DLF Phase IV, Gurugram, Haryana 122009, India",
  events: [
    {
      id: "c6ac08b9-89fb-4b02-a9c5-db957a843896",
      title: "Grotto's Grand Dandiya Night",
      short_description: "Join us for a vibrant night of traditional Dandiya Raas! Dance to festive beats, enjoy delicious food, and celebrate the season in style at our Langhnaj location.",
      full_description: "Get ready to twirl and dance the night away! Grotto invites you to a spectacular Dandiya Night celebration, filling our space with the vibrant energy and joyous rhythms of the festive season.\n\nImmerse yourself in the celebration as our DJ spins the best traditional Garba and Dandiya tracks. Whether you're a seasoned dancer or a beginner, grab your dandiya sticks and join the fun on the dance floor. It's all about celebrating together!\n\nFuel your dance moves with our delicious menu. Enjoy our famous wood-fired pizzas, specialty coffees, and other delightful treats available throughout the evening. It's the perfect combination of festive fun and fantastic food.\n\nDress in your festive best and bring your friends and family for an unforgettable night of music, dance, and community. Let's make this a night to remember at Grotto!",
      start_datetime: "2026-10-10T22:00:00+00:00",
      end_datetime: null,
      location_text: "Grotto - Langhnaj",
      category: "Festival",
    }
  ] as Event[]
};

function App() {
  return (
    <>
      <Header businessName={businessDetails.name} />
      <main>
        <Hero businessName={businessDetails.name} />
        <About />
        <Menu />
        <Events events={businessDetails.events} />
        <Contact address={businessDetails.address} businessId={BUSINESS_ID} />
      </main>
      <Footer businessName={businessDetails.name} />
    </>
  );
}

export default App;