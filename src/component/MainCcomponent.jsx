
import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import './MainComponent.scss';

const items = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);
const baseMargin = 10;
const debounceTime = 600;
// Debounce function
// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       func.apply(this, args);
//     }, wait);
//   };
// };

// const debounce = (func, delay) => {
//   let timer;
//   return function () {
//     const context = this;
//     const args = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(context, args);
//     }, delay);
//   };
// };

// const debounce = (func, delay) => {
//   let timer;
//   let lastExecuted = 0;
//   return function () {
//     const context = this;
//     const args = arguments;
//     const now = new Date().getTime();
//     const elapsed = now - lastExecuted;

//     clearTimeout(timer);

//     if (elapsed > delay) {
//       lastExecuted = now;
//       func.apply(context, args);
//     } else {
//       timer = setTimeout(() => {
//         lastExecuted = new Date().getTime();
//         func.apply(context, args);
//       }, delay - elapsed);
//     }
//   };
// };

const debounce = (func, delay) => {
  let timer;
  let lastExecuted = 0;
  let lastRowIndex = null;

  return function () {
    const context = this;
    const args = arguments;
    const now = new Date().getTime();
    const elapsed = now - lastExecuted;
    const rowIndex = args[0]; // 假設第一個參數是行索引

    clearTimeout(timer);

    if (lastRowIndex !== null && rowIndex === lastRowIndex) {
      // 同一行內的移動
      if (elapsed < delay) {
        lastExecuted = now;
        func.apply(context, args);
      } else {
        timer = setTimeout(() => {
          lastExecuted = new Date().getTime();
          func.apply(context, args);
        }, delay - elapsed);
      }
    } else {
      // 不同行的移動
      lastExecuted = now;
      func.apply(context, args);
    }

    lastRowIndex = rowIndex;
  };
};
const MainComponent = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [gridParentHovered, setGridParentHovered] = useState(false);

  
  const lastHoveredRowIndexRef = useRef(null);
  const actionTimerRef = useRef(null);
  const firstEnterTimeRef = useRef(0);
  const lastLeaveTimeRef = useRef(0);

  const handleMouseEnter_1 = (index) => {
    setHoveredIndex(index);

    // 獲取所有的 grid items
    const gridItems = document.querySelectorAll('.grid-item');

    // 設定各種倍數
    const scaleMultiplierHovered = 1.6;
    const scaleMultiplierOther = 1.3;
    // const scaleMarginMultiplierHovered = .3;

    // 計算每行的 margin 值
    gridItems.forEach((item, idx) => {
      
        const focusedItemRow = Math.floor(index / 4);
      const row = Math.floor(idx / 4); // 假設每行有 4 個 item
      setHoveredRowIndex(row);
      // const scaleMultiplier = idx === index ? scaleMultiplierHovered : scaleMultiplierOther;
      const scaleMultiplier = row === focusedItemRow ? scaleMultiplierHovered : scaleMultiplierOther;
      let scaleMarginMultiplier;

      let newMargin = baseMargin * scaleMarginMultiplier;
      

      // item.style.transform = `scale(${scaleMultiplier})`;


    // if ( idx !== index && row === focusedItemRow) {
    //   item.classList.remove('hovered');

    //   console.log(idx);
    //     item.classList.add('hovered-row');
    //     console.log(item.classList.toString());
    //     item.classList.remove('non-hovered-row');
    //   } else {
    //     newMargin = baseMargin * 1.2;
    //     item.classList.add('non-hovered-row');
    //     item.classList.remove('hovered-row');
    //   }
    });
  };

  const getStyle = (idx) => {
    let styleClass = "";

    const focusedItemRow = Math.floor(hoveredIndex / 4);
    const row = Math.floor(idx / 4); // 假設每行有 4 個 item

    console.log(idx, row, focusedItemRow);

     if (hoveredIndex == null) {
      return "";
     }
    if (  row === focusedItemRow) {


     styleClass +=  'hovered-row';

      } else {

        styleClass += 'non-hovered-row'
      }

      return styleClass;
  }

  const handleMouseLeave_1 = () => {
    setHoveredIndex(null);
    setHoveredRowIndex(null);
    // 還原所有 grid items 的 margin 和 scale
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item) => {
      item.classList.remove('hovered');
      item.classList.remove('non-hovered');

    //   item.style.margin = baseMargin + 'px'; // 還原預設 margin
      // item.style.transform = 'scale(1)'; // 還原預設 scale
      // item.classList.remove('non-hovered-row');
      // item.classList.remove('hovered-row');
    });
  };

  const handleMouseEnter_2= useCallback(
    debounce((index) => {

      setHoveredIndex(index);
      const focusedItemRow = Math.floor(index / 4);
    setHoveredRowIndex(focusedItemRow);


    }, 600, 2000), // 200 毫秒的延遲時間，可以根據需要調整
    []
  );

  const handleMouseLeave_3 = useCallback(
    debounce(() => {
      setHoveredIndex(null);
      setHoveredRowIndex(null);
    }, 600, 2000), // 200 毫秒的延遲時間，可以根據需要調整
    []
  );

  const handleMouseEnter_3 = (index) => {
   
    const focusedItemRow = Math.floor(index / 4);

    // 如果上次和当前的行索引相同，则立即执行动作
    if (lastHoveredRowIndexRef.current === focusedItemRow) {
      setHoveredIndex(index);
      setHoveredRowIndex(focusedItemRow);
    }

    // 记录当前行索引
    lastHoveredRowIndexRef.current = focusedItemRow;

    // 在 debounceTime内避免重复执行
    clearTimeout(actionTimerRef.current);
    actionTimerRef.current = setTimeout(() => {
      clearTimeout(actionTimerRef.current);
    }, debounceTime);
  };

  
  const handleMouseEnter_4 = (index) => {
   
    const focusedItemRow = Math.floor(index / 4);

    // 如果上次和当前的行索引相同，则立即执行动作
    if (lastHoveredRowIndexRef.current !== focusedItemRow) {
      setHoveredIndex(index);
      setHoveredRowIndex(focusedItemRow);
    clearTimeout(actionTimerRef.current);

    }

    // 记录当前行索引
    lastHoveredRowIndexRef.current = focusedItemRow;

    // 在 debounceTime内避免重复执行
    actionTimerRef.current = setTimeout(() => {
      clearTimeout(actionTimerRef.current);
    }, debounceTime);
  };

// ---------------------------

const handleMouseEnter = (index) => {
  const focusedItemRow = Math.floor(index / 4);
  const now = Date.now();

  if (lastHoveredRowIndexRef.current !== focusedItemRow) {
    clearTimeout(actionTimerRef.current);
    setHoveredIndex(index);
    setHoveredRowIndex(focusedItemRow);
    firstEnterTimeRef.current = now;
    lastHoveredRowIndexRef.current = focusedItemRow;
  } else {
    if (now - firstEnterTimeRef.current > debounceTime) {
      clearTimeout(actionTimerRef.current);
      setHoveredIndex(index);
      setHoveredRowIndex(focusedItemRow);
      firstEnterTimeRef.current = now;
      lastHoveredRowIndexRef.current = focusedItemRow;
    }
  }

  actionTimerRef.current = setTimeout(() => {
    clearTimeout(actionTimerRef.current);
  }, debounceTime);
};

const handleMouseLeave = () => {
  const now = Date.now();

  if (now - lastLeaveTimeRef.current > debounceTime) {
    clearTimeout(actionTimerRef.current);
    setHoveredIndex(null);
    setHoveredRowIndex(null);
    lastLeaveTimeRef.current = now;
  }

  actionTimerRef.current = setTimeout(() => {
    clearTimeout(actionTimerRef.current);
  }, debounceTime);
};

const handleGridMouseEnter = () => {
  setGridParentHovered(true);
}
const handleGridMouseLeave = () => {
  setHoveredIndex(null);
  setHoveredRowIndex(null);
  setGridParentHovered(false);

};

// ----------------


  return (
    <div className="main-container">
      <div className="sidebar">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="sidebar-item"
            whileHover={{ scale: 1.2 }}
            animate={{ scale: hoveredIndex !== null ? 1.2 : 1 }}
          >
            {items[index]}
          </motion.div>
        ))}
      </div>

      {/* 不要 flicker 的關鍵就是 hoveredRowIndex 設的高度值*/}
      {/* <div className="grid" style={{ gridTemplateRows: `repeat(4, ${hoveredRowIndex !== null ? '200px' : 'auto'})` }}> */}

      {/* <div className="grid" style={{ gridTemplateRows: `repeat(4, ${hoveredRowIndex !== null ? (index) => index === hoveredRowIndex ? '200px' : 'auto' : 'auto'})` }}>         */}
      <div className={`grid ${gridParentHovered ? 'grid-parent-hovered' : ''}`} 
       onMouseEnter={handleGridMouseEnter}
      onMouseLeave={handleGridMouseLeave}>        

        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`grid-item ${hoveredIndex === index ? 'hovered' : ''} ${getStyle(index)}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="item-content">
              {item}
              <div className="item-index">{index + 1}</div>
              <div className="subtitle">123</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MainComponent;


// ------------------

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import './MainComponent.css';

// const items = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`);

// const MainComponent = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   const handleMouseEnter = (index) => {
//     setHoveredIndex(index);

//     // 獲取所有的 grid items
//     const gridItems = document.querySelectorAll('.grid-item');

//     // 設定各種倍數
//     const baseMargin = 20;
//     const scaleMultiplierHovered = 1.3;
//     const scaleMultiplierOther = 1.1;

//     // 計算每行的 margin 值
//     gridItems.forEach((item, idx) => {
//       const row = Math.floor(idx / 4); // 假設每行有 4 個 item
//       const scaleMultiplier = idx === index ? scaleMultiplierHovered : scaleMultiplierOther;
//       const newMargin = baseMargin * scaleMultiplier;
      
//       // 設置 margin 和 scale
//       item.style.margin = `${newMargin}px`;
//       item.style.transform = `scale(${scaleMultiplier})`;
//     });
//   };

//   const handleMouseLeave = () => {
//     setHoveredIndex(null);

//     // 還原所有 grid items 的 margin 和 scale
//     const gridItems = document.querySelectorAll('.grid-item');
//     gridItems.forEach((item) => {
//       item.style.margin = '20px'; // 還原預設 margin
//       item.style.transform = 'scale(1)'; // 還原預設 scale
//     });
//   };

//   return (
//     <div className="main-container">
//       <div className="sidebar">
//         {[0, 1, 2].map((index) => (
//           <motion.div
//             key={index}
//             className="sidebar-item"
//             whileHover={{ scale: 1.2 }}
//             animate={{ scale: hoveredIndex !== null ? 1.2 : 1 }}
//           >
//             {items[index]}
//           </motion.div>
//         ))}
//       </div>
//       <div className="grid">
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             className={`grid-item ${hoveredIndex === index ? 'hovered' : ''}`}
//             onMouseEnter={() => handleMouseEnter(index)}
//             onMouseLeave={handleMouseLeave}
//           >
//             <div className="item-content">
//               {item}
//               <div className="item-index">{index + 1}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MainComponent;


// ------------------------------
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import './MainComponent.css';

// const items = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`);

// const MainComponent = () => {
//   const [focusedIndex, setFocusedIndex] = useState(null);

//   const handleMouseEnter = (index) => {
//     setFocusedIndex(index);
//     // 修改：當 hover 到某個 grid item 時，跟它位於同一 row 的所有 grid-items 的上下 margin 也要增加
//     const gridItems = document.querySelectorAll('.grid-item');
//     const focusedItemRow = Math.floor(index / 4); // 假設每行有 4 個 item
//     gridItems.forEach((item, idx) => {
//       const row = Math.floor(idx / 4);
//       const scaleMultiplier = row === focusedItemRow ? 1.3 : 1.1; // 計算要增加的倍數
//       item.style.margin = `${20 * scaleMultiplier}px`; // 增加 margin
//     });
//   };

//   const handleMouseLeave = () => {
//     setFocusedIndex(null);
//     // 還原所有 grid items 的 margin
//     const gridItems = document.querySelectorAll('.grid-item');
//     gridItems.forEach((item) => {
//       item.style.margin = '20px'; // 還原預設 margin
//     });
//   };

//   return (
//     <div className="main-container">
//       <div className="sidebar">
//         {[0, 1, 2].map((index) => (
//           <motion.div
//             key={index}
//             className="sidebar-item"
//             whileHover={{ scale: 1.2 }}
//             animate={{ scale: focusedIndex !== null ? 1.2 : 1 }}
//           >
//             {items[index]}
//           </motion.div>
//         ))}
//       </div>
//       <div className="grid">
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             className={`grid-item ${focusedIndex === index ? 'focused' : ''}`}
//             onMouseEnter={() => handleMouseEnter(index)}
//             onMouseLeave={handleMouseLeave}
//           >
//             <div className="item-content">
//               {item}
//               <div className="item-index">{index + 1}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MainComponent;