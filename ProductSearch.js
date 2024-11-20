import React, { useState } from 'react';
import axios from 'axios';

const ProductSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({ flipkart: [], amazon: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:5000/scrape?search=${search}`);
            setResults(response.data);
        } catch (err) {
            setError('Error fetching product data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white min-h-screen">
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">Product Search</h1>
            <form onSubmit={handleSearch} className="mb-8 flex justify-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for products..."
                    className="border border-gray-300 rounded-l-lg p-3 w-full max-w-md focus:outline-none"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition duration-300"
                >
                    Search
                </button>
            </form>
            {loading && <p className="text-center text-blue-600 text-xl">Loading...</p>}
            {error && <p className="text-center text-red-500 text-xl">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                {/* Flipkart Results */}
                <div>
                    <h3 className="text-2xl font-semibold text-blue-500 mb-4">Flipkart Results</h3>
                    {results.flipkart.length === 0 ? (
                        <p className="text-gray-500">No results found.</p>
                    ) : (
                        results.flipkart.map((product, index) => (
                            <div key={index} className="border p-4 rounded-lg shadow-lg mb-4">
                                <h4 className="font-bold text-lg mb-2 text-blue-600">{product.product}</h4>
                                <p className="text-gray-700 mb-2">{product.price}</p>
                                <a
                                    href={product.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View on Flipkart
                                </a>
                            </div>
                        ))
                    )}
                </div>

                {/* Amazon Results */}
                <div>
                    <h3 className="text-2xl font-semibold text-blue-500 mb-4">Amazon Results</h3>
                    {results.amazon.length === 0 ? (
                        <p className="text-gray-500">No results found.</p>
                    ) : (
                        results.amazon.map((product, index) => (
                            <div key={index} className="border p-4 rounded-lg shadow-lg mb-4">
                                <h4 className="font-bold text-lg mb-2 text-blue-600">{product.product}</h4>
                                <p className="text-gray-700 mb-2">{product.price}</p>
                                <a
                                    href={product.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View on Amazon
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;
