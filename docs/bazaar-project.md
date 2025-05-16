# Bazaar

## Project Requirements
This e-commerce project will be orchestrated using Docker Compose with the following components:
- Backend: Node.js application
- Database: PostgreSQL
- Database Admin: PgAdmin
- Cache: Redis
- Frontend: Angular

## Database

- The database will store products with the following properties: id, name, description, price, category, image_url, stock_quantity
- `init.sql` will be used to initialize the database with mock products data (used only for initial development purposes)

## Backend
The Node.js backend will expose the following endpoints:
- `GET /health` - Health check endpoint
- CRUD operations for products

## Caching
- Product listing will be cached in Redis
- Cache will be invalidated when products are modified

## Frontend
- Angular application that calls the backend to display the list of products
- Simple product listing page for now

## Docker Configuration
- Data persistence with named volumes
- Health checks for critical services

## Network Setup
- Internal network for backend services
- External network for frontend and API exposure
- Proper network segmentation for security
