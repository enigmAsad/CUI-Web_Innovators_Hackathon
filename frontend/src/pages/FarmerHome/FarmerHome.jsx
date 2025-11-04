import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget.jsx";
import "./FarmerHome.scss";
import support from '../../assets/sustainable.png';
import FarmingNews from "../../components/farmingNews/FarmingNews.jsx";
import Weather from "../../components/Weather/Weather.jsx";
import ShortAdvice from "../../components/ShortAdvice/ShortAdvice.jsx";
import PriceTable from "../../components/PriceTable/PriceTable.jsx";
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';

const Home = ({ setUserRole }) => {
  const [region, setRegion] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  const handleReadMore = (postId)=>{
    navigate(`/posts/${postId}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      // Fetch farmer's saved region
      try {
        const regionResponse = await newRequest.get('/api/profile/region', { withCredentials: true });
        setRegion(regionResponse.data.region || null);
      } catch (error) {
        console.error("Error fetching region:", error);
        setRegion(null);
      }

      // Fetch blog posts from the backend
      try {
        const blogResponse = await newRequest.get('/api/posts/getPost', { withCredentials: true });
        setBlogPosts(blogResponse.data || []);
      } catch (err) {
        console.error("Error fetching blog posts", err);
        setBlogPosts([]);
      }
    };
    fetchData();
  }, []);

  // const blogPosts = [
  //   { title: "Understanding Crop Rotation", excerpt: "Discover best practices of crop rotation..." },
  //   { title: "Pest Management Strategies", excerpt: "Learn how to manage pests effectively ..." },
  //   { title: "Sustainable Farming Practices", excerpt: "Explore sustainable ways to reduce costs..." },
  //   { title: "Maximizing Your Harvest", excerpt: "Tips to ensure a bountiful harvest season..." },
  // ];

  // Helper function to clean Markdown
  const cleanMarkdown = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // Remove bold (**) or (__) and leave the text
      .replace(/(\#\#)(.*?)$/g, "") // Remove headings (##)
      .replace(/\n/g, "") // Remove new lines
      .replace(/\*/g, "") // Remove other Markdown symbols like *
      .replace(/_/g, ""); // Remove underscores
  };

  return (
    <div className="home">
      <Sidebar setUserRole={setUserRole} />
      <div className="homeContainer">
        <Navbar />
        
        {/* Region Prompt */}
        {!region && (
          <div className="region-prompt">
            <LocationOnIcon />
            <p>Set your region in <button onClick={() => navigate('/farmer/profile')}><SettingsIcon fontSize="small" /> Profile</button> to see personalized market prices and weather</p>
          </div>
        )}

        {/* Weather and Advice Section */}
        <div className="dashboard-widgets">
          {region && (
            <>
              <div className="weather-section">
                <Weather city={region} />
              </div>
              <div className="advice-section">
                <ShortAdvice city={region} />
              </div>
            </>
          )}
        </div>

        {/* Market Prices Table */}
        <div className="market-section">
          <PriceTable city={region} />
        </div>

        {/* Forum Posts Section */}
        <div className="widgetsSection">
          <div className="heading">
            <img src={support} width={30} height={30} alt="" />
            <h2 className="widgetsHeading">Community Forum - Recent Posts</h2>
          </div>
          <div className="widgetsContainer">
            {blogPosts.length > 0 ? (
              blogPosts.slice(0, 4).map((post, index) => (
                <Widget 
                  key={post._id || index} 
                  title={post.title} 
                  excerpt={post.content ? cleanMarkdown(post.content).substring(0, 100) + "..." : ""}
                  onReadMore={() => handleReadMore(post._id)}
                />
              ))
            ) : (
              <p>No posts available. <button onClick={() => navigate('/farmer/forum')}>Visit Forum</button></p>
            )}
          </div>
        </div>

        {/* Farming News */}
        <div className="news">
          <FarmingNews />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
