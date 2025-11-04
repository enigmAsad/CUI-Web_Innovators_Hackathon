import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import newRequest from '../../utils/newRequest';
import { toast } from 'react-toastify';
import './ProfilePage.scss';
import SaveIcon from '@mui/icons-material/Save';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ProfilePage = ({ setUserRole }) => {
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegion();
  }, []);

  const fetchRegion = async () => {
    try {
      setLoading(true);
      const { data } = await newRequest.get('/api/profile/region', { withCredentials: true });
      setRegion(data.region || '');
    } catch (err) {
      console.error('Failed to load region:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRegion = async (e) => {
    e.preventDefault();
    if (!region.trim()) {
      toast.error('Please enter a region/city');
      return;
    }
    try {
      setSaving(true);
      const { data } = await newRequest.put('/api/profile/region', { region: region.trim() }, { withCredentials: true });
      toast.success('Region saved successfully!');
      setRegion(data.region);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save region');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar setUserRole={setUserRole} />
      <div className="profileContainer">
        <Navbar />
        <div className="profile-content">
          <div className="profile-header">
            <h1 className="profile-title">Farmer Profile Settings</h1>
            <button className="back-btn" onClick={() => navigate('/farmer_home')}>
              ← Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading profile...</div>
          ) : (
            <form className="profile-form" onSubmit={handleSaveRegion}>
              <div className="form-section">
                <h2 className="section-title">Region/City Preference</h2>
                <p className="section-description">
                  Set your region to get personalized market prices, weather, and farming advice.
                </p>
                
                <div className="form-group">
                  <label htmlFor="region-input">Your Region/City</label>
                  <input
                    id="region-input"
                    type="text"
                    placeholder="e.g., Lahore, Islamabad, Karachi"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    maxLength={50}
                    required
                  />
                  <small className="form-hint">
                    This will be used to fetch local market prices and weather data.
                  </small>
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                  <SaveIcon fontSize="small" /> {saving ? 'Saving...' : 'Save Region'}
                </button>
              </div>

              <div className="info-section">
                <h3>Why set your region?</h3>
                <ul>
                  <li><ShowChartIcon fontSize="small" /> Get market prices for your local area</li>
                  <li><WbSunnyIcon fontSize="small" /> Receive weather updates for your region</li>
                  <li><NewspaperIcon fontSize="small" /> Get farming advice tailored to your location</li>
                  <li><TrendingUpIcon fontSize="small" /> View price trends specific to your city</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
