import React, { useEffect, useState } from "react";

// Update to localhost for local testing
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5198";

function App() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: "",
        inStock: true
    });

    useEffect(() => {
        fetchCars();
    }, []);

    // Fetch all cars
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

    // Create new car
    async function handleCreate(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/cars`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error(`Failed to create car: ${res.status}`);
            await fetchCars();
            resetForm();
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        }
    }

    // Update existing car
    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/cars/${editingCar.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: editingCar.id })
            });
            if (!res.ok) throw new Error(`Failed to update car: ${res.status}`);
            await fetchCars();
            resetForm();
            setEditingCar(null);
        } catch (err) {
            setError(err.message);
        }
    }

    // Delete car
    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this car?")) return;
        
        try {
            const res = await fetch(`${API_BASE}/api/cars/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error(`Failed to delete car: ${res.status}`);
            await fetchCars();
        } catch (err) {
            setError(err.message);
        }
    }

    // Start editing a car
    function startEdit(car) {
        setEditingCar(car);
        setFormData({
            make: car.make,
            model: car.model,
            year: car.year,
            price: car.price,
            inStock: car.inStock
        });
        setShowAddForm(false);
    }

    // Reset form
    function resetForm() {
        setFormData({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            price: "",
            inStock: true
        });
        setEditingCar(null);
        setShowAddForm(false);
    }

    // Handle form input changes
    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    return (
        <div className="app-container">
            <h1>🚗 Dealership Inventory Management</h1>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Add New Car Button */}
            <div className="actions">
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingCar(null);
                        resetForm();
                    }}
                >
                    {showAddForm ? "Cancel" : "➕ Add New Car"}
                </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingCar) && (
                <div className="form-container">
                    <h2>{editingCar ? "Edit Car" : "Add New Car"}</h2>
                    <form onSubmit={editingCar ? handleUpdate : handleCreate}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="make">Make *</label>
                                <input
                                    type="text"
                                    id="make"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="50"
                                    placeholder="e.g., Toyota"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="model">Model *</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="50"
                                    placeholder="e.g., Camry"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="year">Year *</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                    min="1900"
                                    max="2100"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g., 25000"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label htmlFor="inStock">
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                    />
                                    In Stock
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-success">
                                {editingCar ? "💾 Update Car" : "➕ Add Car"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cars Table */}
            {loading && <p className="loading">Loading cars…</p>}

            {!loading && cars.length === 0 && (
                <p className="no-data">No cars in inventory. Add one to get started!</p>
            )}

            {!loading && cars.length > 0 && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>In Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.id} className={editingCar?.id === car.id ? "editing" : ""}>
                                    <td>{car.id}</td>
                                    <td>{car.make}</td>
                                    <td>{car.model}</td>
                                    <td>{car.year}</td>
                                    <td>${Number(car.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>
                                        <span className={`status ${car.inStock ? "in-stock" : "out-of-stock"}`}>
                                            {car.inStock ? "✓ Yes" : "✗ No"}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="btn btn-edit"
                                            onClick={() => startEdit(car)}
                                            title="Edit car"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="btn btn-delete"
                                            onClick={() => handleDelete(car.id)}
                                            title="Delete car"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
