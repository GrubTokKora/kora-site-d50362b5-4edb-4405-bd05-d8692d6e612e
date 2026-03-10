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
      id: "196432ec-1455-41b5-831d-c428a8491e26",
      title: "Dandiya Raas Celebration at Grotto",
      short_description: "Join us for a vibrant afternoon of traditional Dandiya Raas! Dance to festive beats and enjoy our signature pizzas and coffee in a lively atmosphere.",
      full_description: "Celebrate with us at Grotto's Dandiya Raas event! Immerse yourself in the joyous and energetic tradition of this beautiful folk dance. Whether you're a seasoned dancer or a first-timer, everyone is invited to join in the fun.\n\nWe'll have lively, traditional music to get you moving and create an unforgettable festive atmosphere. Don't have your own dandiya sticks? No problem! We'll have some available for you to use.\n\nFuel your dancing with our delicious wood-fired pizzas, specialty coffees, and other treats from our menu. It's the perfect way to spend an afternoon filled with culture, community, and great food.\n\nGather your friends and family and come dressed in your festive best. Let's make it a day to remember at Grotto!",
      start_datetime: "2027-02-14T12:00:00+00:00",
      end_datetime: null,
      location_text: "Grotto - Pizzeria|Coffee Shop",
      category: "Cultural Celebration",
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