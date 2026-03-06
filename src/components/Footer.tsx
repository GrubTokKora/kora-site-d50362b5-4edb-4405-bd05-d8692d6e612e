type FooterProps = {
  businessName: string;
};

function Footer({ businessName }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} {businessName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;