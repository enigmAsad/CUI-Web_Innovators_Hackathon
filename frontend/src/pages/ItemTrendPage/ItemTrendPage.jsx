import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import TrendChart from '../../components/TrendChart/TrendChart';
import newRequest from '../../utils/newRequest';
import { toast } from 'react-toastify';
import './ItemTrendPage.scss';

const ItemTrendPage = ({ setUserRole }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [city, setCity] = useState('');
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    // Fetch farmer's saved region
    const fetchRegion = async () => {
      try {
        const { data } = await newRequest.get('/api/profile/region', { withCredentials: true });
        const savedRegion = data.region || '';
        setRegion(savedRegion);
        setCity(savedRegion);
        if (savedRegion) {
          fetchTrend(savedRegion);
        }
      } catch (err) {
        console.error('Failed to load region', err);
      }
    };
    fetchRegion();
  }, [itemId]);

  const fetchTrend = async (selectedCity) => {
    if (!selectedCity) {
      toast.error('Please enter a city');
      return;
    }
    try {
      setLoading(true);
      const { data } = await newRequest.get(`/api/market/items/${itemId}/trend?city=${encodeURIComponent(selectedCity)}`);
      setItem(data.item);
      setTrendData(data.data);
    } catch (err) {
      toast.error('Failed to load trend data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = () => {
    if (city) {
      fetchTrend(city);
    }
  };

  return (
    <div className="item-trend-page">
      <Sidebar setUserRole={setUserRole} />
      <div className="trendContainer">
        <Navbar />
        <div className="trend-content">
          <div className="trend-header">
            <button className="back-btn" onClick={() => navigate('/farmer_home')}>
              ← Back to Dashboard
            </button>
            {item && (
              <h1 className="trend-title">{item.name} Price Trend</h1>
            )}
          </div>

          <div className="city-selector">
            <label htmlFor="city-input">City:</label>
            <input
              id="city-input"
              type="text"
              placeholder="Enter city (e.g., Lahore)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCityChange()}
            />
            <button onClick={handleCityChange} disabled={!city || loading}>
              {loading ? 'Loading...' : 'Load Trend'}
            </button>
          </div>

          {loading && <div className="loading-spinner">Fetching trend data...</div>}

          {!loading && trendData.length > 0 && item && (
            <TrendChart 
              data={trendData} 
              itemName={item.name} 
              city={city} 
            />
          )}

          {!loading && trendData.length === 0 && city && (
            <div className="no-data">
              <p>No trend data available for {city}. Try another city or ask admin to add prices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemTrendPage;

