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
  const [status, setStatus] = useState(null);

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
    if(currentPickEle) {
      currentPickEle.classList.remove('highlight');
    }
    setCurrentPick(space);
    setCurrentPickEle(e.target);
    showColorPicker(e.target);
  }

  function showColorPicker(ele) {
    let pEle = document.getElementById('color-picker');
    let top = ele.offsetTop + 42 + 'px'; 
    pEle.style.top = top;
    pEle.style.display = 'block';
  }

  function pickColor(e) {
    let curPick = picks;
    let color = e.target.dataset.color;
    curPick[currentPick - 1] = color;
    setPicks(curPick);
    currentPickEle.className = '';
    currentPickEle.classList.add('code-space');
    currentPickEle.classList.add(color);
    let pEle = document.getElementById('color-picker');
  }

  function gradeRow() {
    if(picks.indexOf('') >= 0) {
      return;
    }
    let res = picks.map((pick, index) => {
      if (pick == code[index]) return 2;
      if (code.indexOf(pick) >= 0) return 1;
      return 0;
    });
    res = res.sort().reverse();
    res.forEach((i, index) => {
      let $grade = document.getElementById(`peg-${currentRow}-${index + 1}`);
      if(i == 2) $grade.classList.add('red');
      if(i == 1) $grade.classList.add('white');
    });
   const initialValue = 0;
  const sumWithInitial = res.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
    if(sumWithInitial == 8) {
      setStatus(`You win in ${currentRow}! 🎉`);
      reveal();
    }
    setCurrentRow(currentRow + 1);
    setPicks(['', '', '', '']);              
  }

  useEffect(() => {
    if(currentRow > 10) {
      setStatus('You lose 😭');
      reveal();
    }
  }, [currentRow]);


  function reveal() {
    let $answerRow = document.getElementById(`answer`);
    $answerRow.classList.add('revealed');
    code.forEach((i, index) => {
      let $answer = document.getElementById(`answer-${index + 1}`);
      $answer.classList.add(i);
    });
  };
  
  return (
    <div className="App">
      <h1>Mastermind</h1>
      {status && <h2>{status}</h2>}
      <div className="code-box">
    {rows.map((row) => (
      <div className="code-row">
        <div onClick={(e)=> {setColor(e, row, 1);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 2);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 3);}} className="code-space"></div>
        <div onClick={(e)=> {setColor(e, row, 4);}} className="code-space"></div>
        <div className="grade" id={`grade-${row}`}>
          <span id={`peg-${row}-1`} className="peg"/>
          <span id={`peg-${row}-2`} className="peg"/>
          <span id={`peg-${row}-3`} className="peg"/>
          <span id={`peg-${row}-4`} className="peg"/>
        </div>
      </div>))
    }
      <div id="answer" className="code-row answer-row">
        <div id={`answer-1`} className="code-space"></div>
        <div id={`answer-2`} className="code-space"></div>
        <div id={`answer-3`} className="code-space"></div>
        <div id={`answer-4`} className="code-space"></div>
        <div className="grade" />
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
      <button onClick={gradeRow} className="button">Grade</button>
    </div>
  );
};

export default App;