const menuData = {
  pizzas: [
    { name: 'Margherita', description: 'Classic with San Marzano tomatoes, fresh mozzarella, basil, and a drizzle of olive oil.', price: '₹450' },
    { name: 'Pepperoni', description: 'A crowd favorite with spicy pepperoni, mozzarella, and our signature tomato sauce.', price: '₹550' },
    { name: 'Verdure', description: 'A garden on a pizza with bell peppers, zucchini, olives, onions, and mozzarella.', price: '₹500' },
    { name: 'Quattro Formaggi', description: 'A cheese lover\'s dream with mozzarella, gorgonzola, parmesan, and ricotta.', price: '₹600' },
  ],
  coffees: [
    { name: 'Espresso', description: 'A rich and aromatic shot of pure coffee.', price: '₹150' },
    { name: 'Cappuccino', description: 'Espresso with steamed milk foam, a timeless classic.', price: '₹200' },
    { name: 'Americano', description: 'Espresso shots topped with hot water.', price: '₹180' },
    { name: 'Latte', description: 'A milky coffee made with espresso and steamed milk.', price: '₹220' },
  ],
};

function Menu() {
  return (
    <section id="menu" className="menu">
      <div className="container">
        <h2>Our Menu</h2>
        <div className="menu-grid">
          <div className="menu-category">
            <h3>Pizzas</h3>
            <ul>
              {menuData.pizzas.map(item => (
                <li key={item.name} className="menu-item">
                  <div className="menu-item-header">
                    <h4>{item.name}</h4>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-category">
            <h3>Coffee</h3>
            <ul>
              {menuData.coffees.map(item => (
                <li key={item.name} className="menu-item">
                  <div className="menu-item-header">
                    <h4>{item.name}</h4>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Menu;