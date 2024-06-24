import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MainComponent.css';

const items = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`);

const MainComponent = () => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setFocusedIndex(index);
  };

  const handleMouseLeave = () => {
    setFocusedIndex(null);
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="sidebar-item"
            whileHover={{ scale: 1.2 }}
            animate={{ scale: focusedIndex !== null ? 1.2 : 1 }}
          >
            {items[index]}
          </motion.div>
        ))}
      </div>
      <div className="grid">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="grid-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            initial={{ scale: 1 }}
            animate={{
              scale: focusedIndex !== null ? (focusedIndex === index ? 1.3 : 1.1) : 1,
              zIndex: focusedIndex === index ? 2 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="item-content">
              {item}
              <div className="item-index">{index + 1}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MainComponent;