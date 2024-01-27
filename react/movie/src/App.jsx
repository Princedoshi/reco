import React, { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown-select';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/movies')
      .then(response => {
        if (Array.isArray(response.data)) {
          const uniqueValuesSet = new Set(response.data);
          const uniqueOptions = Array.from(uniqueValuesSet).map(item => ({ label: item, value: item }));
          setOptions(uniqueOptions);
        } else {
          console.error("Invalid options format. Expected an array.");
        }
      })
      .catch(error => console.error('Error fetching movie options:', error));
  }, []);

  const handleChange = (values) => {
    setSelectedOption(values[0]);
  };

  const handleClick = () => {
    if (selectedOption) {
      const selectedMovie = selectedOption.value;

      // Make a request to the /recommend API endpoint with the selected movie
      axios.get(`http://127.0.0.1:5000/recommend/${encodeURIComponent(selectedMovie)}`)
        .then(response => {
          console.log("Recommendations:", response.data);
          setRecommendations(response.data.recommendations);
        })
        .catch(error => console.error('Error fetching recommendations:', error));
    }
  };

  return (
    <>
      <div className='dropdown-container'>
        <Dropdown
          options={options}
          onChange={handleChange}
          value={selectedOption}
          placeholder='Select an option'
          searchable={true}
          className='p-96'
        />
      </div>
      <button className='mt-5' onClick={handleClick}>Recommend</button>

      {/* Display recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2>Recommendations:</h2>
          <ul>
            {recommendations.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
