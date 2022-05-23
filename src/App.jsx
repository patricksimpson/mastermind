import React, { useState, useEffect } from 'react'; 

import logo from './logo.svg';
import './App.css';

const App = () => {
  const [code, setCode] = useState(null);
  const rows = [1,2,3,4,5,6,7,8,9,10];

  const [currentRow, setCurrentRow] = useState(1);
  const [currentPick, setCurrentPick] = useState(null);
  const [currentPickEle, setCurrentPickEle] = useState(null);
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    const colors = ['blue', 'green', 'red', 'black', 'white', 'yellow'];
    let tempCode = shuffleArray(colors).splice(0, 4);
    setCode(tempCode);
    setCurrentRow(1);
    setPicks(['', '', '', '']);              
  }, []);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  function setColor(e, row, space) {
    e.target.classList.add('highlight');
    setCurrentPick(space);
    setCurrentPickEle(e.target);
    showColorPicker(e.target);
  }

  function showColorPicker(ele) {
    let pEle = document.getElementById('color-picker');
    let top = ele.offsetTop + 42 + 'px'; 
    let left = ele.offsetLeft - 50 + 'px'; 
    pEle.style.top = top;
    pEle.style.left = left;
    pEle.style.display = 'block';
  }

  function pickColor(e) {
    let curPick = picks;
    let color = e.target.dataset.color;
    curPick[currentPick - 1] = color;
    setPicks(curPick);
    currentPickEle.classList.remove('highlight');
    currentPickEle.classList.add(color);
    let pEle = document.getElementById('color-picker');
    pEle.style.display = 'none';
  }


  return (
    <div className="App">
      <h1>Mastermind</h1>
      <div className="code-box">
    {rows.map((row) => (
      <div className="code-row">
        <div onClick={(e)=> {setColor(e, row, 1);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 2);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 3);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 4);}} className="code-space"></div>
      </div>))
             }
      </div>
      <div id="color-picker" className="color-picker">
        <div data-color="blue" className="pick blue" onClick={(e)=> { pickColor(e); }} />
        <div data-color="black" className="pick black" onClick={(e)=> { pickColor(e); }}/>
        <div data-color="yellow" className="pick yellow" onClick={(e)=> { pickColor(e); }}/>
        <div data-color="white" className="pick white" onClick={(e)=> { pickColor(e); }}/>
        <div data-color="red" className="pick red" onClick={(e)=> { pickColor(e); }}/>
        <div data-color="green"className="pick green" onClick={(e)=> { pickColor(e); }}/>
      </div>
    </div>
  );
};

export default App;
