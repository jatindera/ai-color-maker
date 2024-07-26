import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [gradient, setGradient] = useState('');
  const [colorValues, setColorValues] = useState({});
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
    const colorValues = Object.values(colors);
    setColorValues(colorValues)
    const gradient = colorValues.map((color, index) => `${color} ${(index + 1) * (100 / colorValues.length)}%`).join(', ');
    // Set the new gradient state
    setGradient(`linear-gradient(90deg, ${gradient})`);

  };

  useEffect(() => {
    // Apply the new background gradient to the CSS variable
    if (gradient) {
      document.documentElement.style.setProperty('--dynamic-background', gradient);
    }
  }, [gradient]);

  
  return (
    
    
    <div className="App">
    <header className="App-header">
      <h1>Color Palette</h1>
      <div className="input-container">
        <input type="text" placeholder="Enter some text..." value={input} onChange={handleInputChange} />
        <button onClick={handleGenerateClick}>Generate</button>
      </div>        
    </header>
  </div>

  );
}

export default App;
