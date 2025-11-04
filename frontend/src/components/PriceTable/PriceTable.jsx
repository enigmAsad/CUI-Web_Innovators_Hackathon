import React, { useState, useEffect } from 'react';
import './PriceTable.scss';
import newRequest from '../../utils/newRequest';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpaIcon from '@mui/icons-material/Spa';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

const PriceTable = ({ city }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [city]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const endpoint = city ? `/api/market/items?city=${encodeURIComponent(city)}` : '/api/market/items';
      const { data } = await newRequest.get(endpoint);
      setItems(data);
    } catch (err) {
      toast.error('Failed to load market items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewTrend = (itemId) => {
    navigate(`/farmer/trends/${itemId}`);
  };

  if (loading) {
    return (
      <div className="price-table-container">
        <div className="loading-spinner">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="price-table-container">
      <div className="table-header">
        <h2>Market Prices {city && `- ${city}`}</h2>
        <div className="table-filters">
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="vegetable">Vegetables</option>
            <option value="fruit">Fruits</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Unit</th>
              {city && <th>Latest Price</th>}
              {city && <th>Last Updated</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={city ? 6 : 4} className="no-data">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item._id}>
                  <td className="item-name">{item.name}</td>
                  <td>
                    <span className={`category-badge ${item.category}`}>
                      {item.category === 'vegetable' ? <SpaIcon fontSize="small" /> : <LocalFloristIcon fontSize="small" />}
                      <span>{item.category}</span>
                    </span>
                  </td>
                  <td>{item.unit || 'kg'}</td>
                  {city && (
                    <td className="price">
                      {item.latestPrice !== null && item.latestPrice !== undefined
                        ? `PKR ${item.latestPrice.toFixed(2)}`
                        : '—'}
                    </td>
                  )}
                  {city && (
                    <td className="date">
                      {item.lastUpdated
                        ? new Date(item.lastUpdated).toLocaleDateString()
                        : '—'}
                    </td>
                  )}
                  <td>
                    <button
                      className="trend-btn"
                      onClick={() => handleViewTrend(item._id)}
                      disabled={!city}
                    >
                      <TrendingUpIcon fontSize="small" /> View Trend
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;

