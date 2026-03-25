import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Events from './components/Events';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VoiceAgentWidget from './components/VoiceAgentWidget';
import type { Event } from './components/Events';

const BUSINESS_ID = "d50362b5-4edb-4405-bd05-d8692d6e612e";

const businessDetails = {
  name: "Grotto - Pizzeria|Coffee Shop",
  address: "SF - 090, First floor, Galleria Market, Sector 28, DLF Phase IV, Gurugram, Haryana 122009, India",
  events: [
    {
      id: "1251e65d-c0c7-4efb-96ed-74f670120d50",
      title: "A Special Night at Grotto",
      short_description: "Join us at Grotto in Kalol for a truly special night! Experience an unforgettable evening with our finest pizzas, aromatic coffees, and a magical ambiance.",
      full_description: "Mark your calendars for an evening of delight at Grotto! We're transforming our Kalol location into a haven of culinary excellence and cozy vibes for one special night only.\n\nIndulge in our signature wood-fired pizzas, crafted with the freshest ingredients, or sip on our expertly brewed coffees and specialty drinks. Our chefs are preparing some exclusive menu items just for this event, promising a treat for your taste buds.\n\nWhether you're looking for a romantic dinner, a memorable night out with friends, or simply a chance to unwind, our special night offers the perfect setting. Enjoy the warm, inviting atmosphere that makes Grotto a beloved spot in Kalol.\n\nReservations are highly recommended as space is limited. We can't wait to welcome you!",
      start_datetime: "2026-04-13T19:00:00+00:00",
      end_datetime: null,
      location_text: "Grotto, Kalol",
      category: "Dining",
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
      <VoiceAgentWidget businessId={BUSINESS_ID} />
    </>
  );
}

export default App;