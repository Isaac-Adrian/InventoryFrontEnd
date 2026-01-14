import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://carinventory-andabycbc8ckbpba.canadacentral-01.azurewebsites.net";

function App() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE}/api/cars`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setCars(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, []);

    return (
        <div>
            <h1>Dealership Inventory</h1>

            {loading && <p>Loading cars…</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Price</th>
                            <th>In Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td>{car.id}</td>
                                <td>{car.make}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>${Number(car.price).toLocaleString()}</td>
                                <td>{car.inStock ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
