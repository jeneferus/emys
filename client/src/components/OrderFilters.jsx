import React, { useState } from "react";

const OrderFilters = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        orderId: "",
        userName: "",
        startDate: "",
        endDate: "",
        status: "",
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        onSearch(filters); // Enviar filtros al componente principal
    };

    return (
        <div className="flex gap-4 mb-4">
            <input
                type="text"
                name="orderId"
                placeholder="Order ID"
                value={filters.orderId}
                onChange={handleChange}
            />
            <input
                type="text"
                name="userName"
                placeholder="User Name"
                value={filters.userName}
                onChange={handleChange}
            />
            <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
            />
            <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
            />
            <select
                name="status"
                value={filters.status}
                onChange={handleChange}
            >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="SHIPPED">SHIPPED</option>
            </select>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default OrderFilters;
