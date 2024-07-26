import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [colors, setColors] = useState({});

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleGenerateClick = async () => {
    const response = await fetch('http://localhost:8000/generate_palette', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });
    console.log(response)
    const data = await response.json();
    // Extract and clean the JSON string
    let jsonString = data.palette.trim();
    console.log(jsonString)
    const colors = JSON.parse(jsonString); // Parse the cleaned JSON string
    setColors(colors)
  };

  return (
    <div className="container">
    <h1 className="title">AI Color Maker</h1>
    <div className="color-blocks">
      {Object.entries(colors).map(([colorName, colorValue]) => (
        <div className="color-block" style={{ backgroundColor: colorValue }} key={colorName}>
          <div className="color-info">
            <div className="color-hex">{colorValue}</div>
            <div className="color-name">{colorName}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="center-elements">
      <div className="input-group">
        <input 
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          placeholder="Enter text" 
          className="text-box"
        />
        <button onClick={handleGenerateClick} className="button">Submit</button>
      </div>
    </div>
  </div>
  );
};

export default App;
