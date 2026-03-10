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
      id: "e0e09690-caeb-450b-b6d7-1cc519403287",
      title: "Grotto's Birthday Bash!",
      short_description: "It's our birthday, and you're invited! Join us at Grotto in Kalol for a special celebration with treats on us.",
      full_description: "We're celebrating another fantastic year, and we couldn't have done it without you! Come and join the Grotto family for our official birthday party at our Kalol location.\n\nTo thank our wonderful community for all the support, we're offering a special treat. Enjoy a complimentary dessert with any pizza purchase all evening long as our way of saying thank you.\n\nExpect a festive atmosphere, great music, and the delicious food and coffee you know and love. It's the perfect opportunity to gather with friends and family and share in the celebration.\n\nMark your calendars and don't miss out on the fun. We can't wait to celebrate with you!",
      start_datetime: "2025-03-12T18:00:00+00:00",
      end_datetime: null,
      location_text: "Grotto - Kalol",
      category: "Celebration",
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