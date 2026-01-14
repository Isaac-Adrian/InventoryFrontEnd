# Development notes

This file contains local development instructions for the Inventory frontend used in the lab.

1. Start the backend API in the `InventoryApi` folder:

   dotnet run --urls "http://localhost:5000"

2. In the `InventoryFrontEnd` folder, install dependencies and run the dev server:

   npm install
   npm run dev

3. The frontend reads the API base URL from `VITE_API_BASE_URL` (set in `.env.development`). The default is `http://localhost:5000`.

4. Open the dev server URL (usually `http://localhost:5173`) and you should see the table populated from `GET /api/cars`.

Notes
- The frontend is currently read-only and intended to be expanded with CRUD operations in later labs.
