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
      "id": "287656ee-0577-498d-b19a-fc5a6ced84a8",
      "title": "Live Music Night at Grotto",
      "short_description": "Experience an unforgettable evening of live music at Grotto! Enjoy our delicious pizzas and specialty coffees while soaking in the soulful tunes of local artists.",
      "full_description": "Join us at Grotto for a magical evening filled with soulful melodies and great vibes. We're turning our space into Vadodara's coziest live music venue, featuring talented local artists performing a mix of acoustic covers and original songs.\n\nWhat's a great night without great food? Pair the beautiful music with our authentic, handcrafted pizzas, or sip on one of our expertly crafted coffees. Our full menu will be available, offering the perfect bites and beverages to complement the acoustic atmosphere.\n\nWhether you're looking for a perfect date night, a relaxing evening with friends, or simply a place to unwind and enjoy good music, Grotto is the place to be. Mark your calendars and get ready for an experience that delights all the senses.",
      "start_datetime": "2024-06-11T21:00:00+00:00",
      "end_datetime": null,
      "location_text": "Grotto, Vadodara",
      "category": "live music"
    },
    {
      "id": "169f54f6-8835-4bed-ad86-876d0208d9b3",
      "title": "Grotto's Christmas Music Night",
      "short_description": "Celebrate the magic of the season with us at Grotto! Enjoy an enchanting evening of live Christmas music, delicious food, and festive cheer.",
      "full_description": "Join us for a very special Christmas Music Night at Grotto in Baroda. We're decking the halls and filling the air with the sounds of the season to create a truly magical holiday experience for you and your loved ones.\n\nOur featured local artists will be performing a beautiful selection of classic Christmas carols and contemporary holiday favorites. Let the festive melodies be the soundtrack to your evening as you relax in our cozy, cheerful atmosphere.\n\nOf course, no visit to Grotto is complete without our signature pizzas and aromatic coffee. We'll also have some special holiday treats on the menu to make the night even sweeter.\n\nGather your friends and family and come celebrate with us. It's the perfect way to wrap up your Christmas Day!",
      "start_datetime": "2024-12-25T21:00:00+00:00",
      "end_datetime": null,
      "location_text": "Grotto - Baroda",
      "category": "Live Music"
    },
    {
      "id": "dd44863d-dbb9-4a89-bff5-73d543e958b5",
      "title": "Grotto's New Year's Eve Celebration",
      "short_description": "Ring in the new year with us at Grotto! Enjoy an unforgettable night of delicious pizza, specialty coffee, and festive vibes as we count down to midnight.",
      "full_description": "End the year on a high note and welcome the next one with style at Grotto! We're transforming our Gandhinagar location into the ultimate New Year's Eve destination for food lovers and friends.\n\nGet ready for an evening filled with our signature wood-fired pizzas, aromatic coffees, and a special festive menu crafted just for the occasion. We'll have live music to keep the energy high and the atmosphere sparkling as we approach the midnight countdown.\n\nGather your loved ones and make your last meal of the year a memorable one. Let's raise a cup of coffee (or a slice of pizza!) to new beginnings together. See you there!",
      "start_datetime": "2024-12-31T15:30:00+00:00",
      "end_datetime": null,
      "location_text": "gandhinagar",
      "category": "holiday",
      "ticket_url": "https://kysz.tech"
    },
    {
      "id": "5af350c2-dc07-4647-8862-721d14da8d3c",
      "title": "Mithai Day Celebration at Grotto",
      "short_description": "Celebrate the sweetness of Mithai Day with a unique twist at Grotto! Join us for an evening where traditional Indian sweets meet our signature pizzas and specialty coffees.",
      "full_description": "Get ready for a delightful fusion of flavors at Grotto's Mithai Day Celebration! We're bringing the rich, festive tradition of Indian sweets to our cozy pizzeria and coffee shop for one special night.\n\nIndulge in a curated selection of classic mithai, perfectly complementing our artisanal menu. Discover unique pairings as you enjoy your favorite pizza followed by a delicious sweet treat, or sip on a specially crafted coffee that enhances the festive flavors.\n\nThis event is a celebration of community, culture, and culinary creativity. It's the perfect opportunity to gather with friends and family, share a unique meal, and make sweet memories.\n\nCome and experience a modern twist on a beloved tradition. We look forward to celebrating with you at our Mahesana location!",
      "start_datetime": "2025-03-11T20:00:00+00:00",
      "end_datetime": null,
      "location_text": "Grotto - Mahesana",
      "category": "Tasting"
    },
    {
      "id": "e0e09690-caeb-450b-b6d7-1cc519403287",
      "title": "Grotto's Birthday Bash!",
      "short_description": "It's our birthday, and you're invited! Join us at Grotto in Kalol for a special celebration with treats on us.",
      "full_description": "We're celebrating another fantastic year, and we couldn't have done it without you! Come and join the Grotto family for our official birthday party at our Kalol location.\n\nTo thank our wonderful community for all the support, we're offering a special treat. Enjoy a complimentary dessert with any pizza purchase all evening long as our way of saying thank you.\n\nExpect a festive atmosphere, great music, and the delicious food and coffee you know and love. It's the perfect opportunity to gather with friends and family and share in the celebration.\n\nMark your calendars and don't miss out on the fun. We can't wait to celebrate with you!",
      "start_datetime": "2025-03-12T18:00:00+00:00",
      "end_datetime": null,
      "location_text": "Grotto - Kalol",
      "category": "Celebration"
    },
    {
      "id": "b0453482-d16f-4f76-9658-ad7b6d55e2f8",
      "title": "Live Music Afternoon at Grotto",
      "short_description": "Join us at our Gandhinagar location for a relaxing afternoon of soulful live music. Enjoy our signature pizzas and handcrafted coffees accompanied by the sounds of talented local artists.",
      "full_description": "Escape the everyday and immerse yourself in the soothing sounds of live music at Grotto. We're transforming our Gandhinagar space into a cozy stage for talented local artists to share their passion.\n\nSettle in with your favorite handcrafted coffee or a delicious, hot-from-the-oven pizza. Let the acoustic melodies provide the perfect soundtrack to your afternoon, whether you're catching up with friends, on a casual date, or simply enjoying some solo time.\n\nNo tickets are required, just bring your love for good food, great coffee, and beautiful music. We can't wait to share this special afternoon with you!",
      "start_datetime": "2026-03-10T10:21:00+00:00",
      "end_datetime": null,
      "location_text": "gandhinagar",
      "category": "live music"
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
      <VoiceAgentWidget />
    </>
  );
}

export default App;