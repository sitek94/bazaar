
CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(2048),
    stock_quantity INTEGER NOT NULL DEFAULT 0
);

-- Mock Data
INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES
('Laptop Pro 15', 'High-performance laptop for professionals.', 1299.99, 'Electronics', 'https://via.placeholder.com/300x200.png?text=Laptop+Pro', 50),
('Wireless Mouse', 'Ergonomic wireless mouse with long battery life.', 25.50, 'Accessories', 'https://via.placeholder.com/300x200.png?text=Wireless+Mouse', 200),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard for gaming and typing.', 75.00, 'Accessories', 'https://via.placeholder.com/300x200.png?text=Mechanical+Keyboard', 100),
('4K Monitor 27"', '27-inch 4K UHD monitor with vibrant colors.', 349.99, 'Electronics', 'https://via.placeholder.com/300x200.png?text=4K+Monitor', 30),
('Coffee Maker Deluxe', 'Programmable coffee maker with thermal carafe.', 59.95, 'Appliances', 'https://via.placeholder.com/300x200.png?text=Coffee+Maker', 75),
('Smart Watch Series X', 'Latest generation smart watch with health tracking.', 199.00, 'Wearables', 'https://via.placeholder.com/300x200.png?text=Smart+Watch', 120),
('Bluetooth Headphones', 'Noise-cancelling over-ear Bluetooth headphones.', 89.99, 'Audio', 'https://via.placeholder.com/300x200.png?text=Headphones', 150),
('USB-C Hub Adapter', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.', 35.00, 'Accessories', 'https://via.placeholder.com/300x200.png?text=USB-C+Hub', 80),
('Gaming Chair Ergo', 'Ergonomic gaming chair with lumbar support.', 250.00, 'Furniture', 'https://via.placeholder.com/300x200.png?text=Gaming+Chair', 25),
('External SSD 1TB', 'Portable 1TB external solid state drive.', 110.50, 'Storage', 'https://via.placeholder.com/300x200.png?text=External+SSD', 60);
