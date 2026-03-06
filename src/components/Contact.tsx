import Newsletter from './Newsletter';

type ContactProps = {
  address: string;
  businessId: string;
};

function Contact({ address, businessId }: ContactProps) {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Get In Touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Visit Us</h3>
            <p>{address}</p>
            <h3>Hours</h3>
            <p>
              Monday - Sunday<br />
              11:00 AM - 11:00 PM
            </p>
            <h3>Call Us</h3>
            <p>+91 123 456 7890</p>
          </div>
          <div className="contact-form">
            <h3>Join Our Newsletter</h3>
            <p>Get updates on special offers and events.</p>
            <Newsletter businessId={businessId} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;