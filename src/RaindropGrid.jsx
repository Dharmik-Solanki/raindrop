import React, { useState, useEffect } from 'react';
import './RaindropGrid.css';

const RaindropGrid = () => {
  const rows = 15;
  const cols = 20;

  // State for raindrop positions and RGB color
  const [activeDrops, setActiveDrops] = useState([]);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });

  // Function to update RGB values over time
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setRgb(prev => ({
        r: (prev.r + 10) % 256,
        g: (prev.g + 15) % 256,
        b: (prev.b + 20) % 256,
      }));
    }, 200); // Change color every 200ms

    return () => clearInterval(colorInterval);
  }, []);

  // Function to update raindrop positions and generate darker drops
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDrops(prev => {
        // Generate a new drop at the top with a random position
        const newDropCol = Math.floor(Math.random() * cols);

        // Generate multiple drops with increasing darkness
        const newDrops = [];
        for (let i = 0; i < 3; i++) {
          newDrops.push({
            row: i,               // The row is incremented for each trailing drop
            col: newDropCol,
            isDark: i > 0,        // First drop is normal, others are darker
            darknessFactor: 3 - (1 + (i * 0.2)), // Adjust darkness level for each drop (0.8, 0.6, 0.4)
          });
        }

        // Move existing drops down and generate new drops
        const updatedDrops = prev
          .filter(drop => drop.row < rows - 1)  // Remove drops that fall below the grid
          .map(drop => ({ ...drop, row: drop.row + 1 }));

        // Add new drops
        return [...updatedDrops, ...newDrops];
      });
    }, 200); // Adjust speed of drops here

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          // Find if this cell is part of any active drop
          const drop = activeDrops.find(drop => drop.row === row && drop.col === col);
          if (drop) {
            // If it's the main drop, use current RGB
            // If it's a darker drop, reduce the brightness of the RGB color
            const cellStyle = drop.isDark
              ? {
                  backgroundColor: `rgb(${Math.floor(rgb.r * drop.darknessFactor)}, ${Math.floor(rgb.g * drop.darknessFactor)}, ${Math.floor(rgb.b * drop.darknessFactor)})`, // Darker color
                }
              : { backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }; // Normal drop color

            return <div key={`${row}-${col}`} className="cell" style={cellStyle} />;
          }

          return <div key={`${row}-${col}`} className="cell" />;
        })
      )}
    </div>
  );
};

export default RaindropGrid;
