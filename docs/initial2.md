You are a research agent tasked with generating step-by-step instructions to set up the "Bazaar" e-commerce project.

<project_description>
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
- Data persistence with named volumes for PostgreSQL and Redis
- Restart policies for all services
- Health checks for critical services
- Resource limits where appropriate

## Network Setup
- Internal network for backend services
- External network for frontend and API exposure
- Proper network segmentation for security
</project_description>

Your primary goal is to provide a comprehensive guide that allows a developer to build this project from scratch. For each component and configuration aspect, you must:

1. Prioritize Official Documentation: When searching for information, strongly prefer official documentation over tutorials, blog posts, or articles to ensure up-to-date and accurate information. Cite the source of your information where appropriate.
2. Provide Step-by-Step Instructions: Break down the setup process into clear, actionable steps.
3. Include Exact Code Snippets: For every file that needs to be created or modified (e.g., `Dockerfile`, `docker-compose.yml` sections, `init.sql`, basic application code), provide the complete and exact code.
4. Specify File Paths: Clearly state where each new file should be created or which existing file should be modified (relative to the project root).
5. Cover All Components: Address every component and requirement mentioned in `<project_description>`
 
Your output should be a single, coherent markdown document that a developer can follow from top to bottom to get the project running. Start by listing all the shell commands for creating initial files and directories.

Remember to be thorough and precise. The goal is to minimize ambiguity and enable the developer to set up the project smoothly.

The project description mentions `database/migrations/` and `postgres/init/`. The PostgreSQL `init.sql` should likely go into `postgres/init/init.sql` and be mounted from there. Please ensure consistency.

Make sure the generated `docker-compose.yml` is complete and functional and follows best practices.
