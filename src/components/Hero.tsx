type HeroProps = {
  businessName: string;
};

function Hero({ businessName }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1>{businessName}</h1>
        <p>Authentic Pizzas & Aromatic Coffees in the heart of Gurugram.</p>
        <a href="#menu" className="btn">View Our Menu</a>
      </div>
    </section>
  );
}

export default Hero;