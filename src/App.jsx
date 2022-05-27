import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

const K = ['z','x','a','b'];
const C = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].reverse();
const url = new URL(window.location.href);

const App = () => {
  const [code, setCode] = useState(null);
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [currentRow, setCurrentRow] = useState(1);
  const [currentPick, setCurrentPick] = useState(null);
  const [currentPickEle, setCurrentPickEle] = useState(null);
  const [picks, setPicks] = useState([]);
  const [status, setStatus] = useState(null);
  const [share, setShare] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [sharedGame, setSharedGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [doubles, setDoubles] = useState(false);
  const [mode, setMode] = useState();

  useEffect(() => {
    let smode = url.searchParams.get('m');
    setMode(parseInt(atob(smode), 10));
  }, []);

  useEffect(() => {
    init();
  }, [mode]);

  const genColors = () => {
    let colors = ["blue", "green", "red", "black", "white", "yellow"];

    if (mode > 6) {
      colors.push("pink");
    }

    if (mode > 7) {
      colors.push("orange");
    }
    return colors;
  };

  const init = () => {
    let scode = url.searchParams.get('g');
    
    if(!mode) return;
    let tempCode = [];
    let colors = genColors();
    if(!scode) {
      tempCode = generateCode([...colors]);
      let encoded = encode(encodeCode(tempCode, colors));
      setGameId(encoded);
    } else {
      tempCode = decodeCode(scode, [...colors]);
      setSharedGame(scode);
    }
    setCode(tempCode);
    console.log(tempCode);
    setCurrentRow(1);
    setPicks(["", "", "", ""]);
    setNextPick();
  };

  function generateCode(colors) {
    let tc = [];
    if (!doubles) {
      return shuffleArray(colors).splice(0, 4);
    }
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * colors.length);
      tc.push(colors[index]);
    }
    return tc;
  }

  function encodeCode(code, colors) {
    let buffer = [];
    let part = new Date().getUTCMilliseconds();
    for (let i = 0; i < 4; i++) {
      buffer.push(K[i] + (C[colors.indexOf(code[i])] + part));
    }
    buffer.push(part.toString(18));
    buffer = shuffleArray(buffer).reverse();
    part = new Date().getUTCMilliseconds();
    buffer.unshift(part);
    return btoa(buffer);
  }

  function decodeCode(code, colors) {
    let arr = atob(code).split(',');
    let mod = Math.min(...arr.map((e) => isNaN(parseInt(e, 18)) ? 9999 : parseInt(e, 18)));
    arr.shift();
    let secret = ['','','',''];
    arr.forEach((e) => {
      if(mod != parseInt(e, 18)) {
        let pos = K.indexOf(e[0]);
        let index = C.indexOf(e.split(e[0])[1] - mod);
        let color = colors[index * 1];
        secret[pos] = color;
      }
    });
    return secret;
  };

  useEffect(() => {
    let $row = document.getElementById(`row-${currentRow}`);
    if (!$row) return;
    if (currentRow > 1) {
      let $lastRow = document.getElementById(`row-${currentRow - 1}`);
      $lastRow.classList.remove("highlight");
    }
    $row.classList.add("highlight");
  }, [currentRow]);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function setColor(ele, row, space) {
    if (!ele) {
      return;
    }
    if (row !== currentRow) return;
    if (ele == currentPickEle) {
      ele.classList.remove("highlight");
      setCurrentPick(null);
      setCurrentPickEle(null);
      return;
    }
    ele.classList.add("highlight");
    if (currentPickEle) {
      currentPickEle.classList.remove("highlight");
    }
    setCurrentPick(space);
    setCurrentPickEle(ele);
    showColorPicker(ele);
  }

  function showColorPicker(ele) {
    let pEle = document.getElementById("color-picker");
    pEle.style.display = "block";
  }

  function pickColor(e) {
    if (currentPickEle) {
      let curPick = picks;
      let color = e.target.dataset.color;
      curPick[currentPick - 1] = color;
      setPicks(curPick);
      currentPickEle.className = "";
      currentPickEle.classList.add("code-space");
      currentPickEle.classList.add(color);
      if (picks.indexOf("") < 0) {
        let $score = document.getElementById("score-button");
        $score.classList.remove("off");
      }
      let pEle = document.getElementById("color-picker");
      setCurrentPickEle(null);
      if (currentPick && currentPick < 4) {
        let $spaces = document.querySelectorAll(
          `#row-${currentRow} .code-space`
        );
        if (picks[currentPick] == "") {
          setColor($spaces[currentPick], currentRow, currentPick + 1);
        }
      } else {
        setCurrentPick(null);
      }
    }
  }

  function gradeRow() {
    if (picks.indexOf("") >= 0) {
      return;
    }
    let tempCode = [...code];
    let reds = picks.map((pick, index) => {
      if (pick == code[index]) {
        tempCode[index] = "y";
        picks[index] = "x";
        return 2;
      }
    });

    let $score = document.getElementById("score-button");
    $score.classList.add("off");

    let whites = picks.map((pick) => {
      if (tempCode.indexOf(pick) >= 0) {
        let index = tempCode.indexOf(pick);
        tempCode[index] = "y";
        return 1;
      }
      return 0;
    });
    let res = [...reds, ...whites];
    res = res
      .filter(function (x) {
        return x !== undefined;
      })
      .sort()
      .reverse()
      .splice(0, 4);
    res.forEach((i, index) => {
      let $grade = document.getElementById(`peg-${currentRow}-${index + 1}`);
      if (i == 2) $grade.classList.add("red");
      if (i == 1) $grade.classList.add("white");
    });
    const initialValue = 0;
    const sumWithInitial = res.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );
    if (sumWithInitial >= 8) {
      let emoji = '🎉';
      if(sharedGame) {
        emoji = '✨';
      }
      if(doubles) {
        emoji = emoji + '🎉';
      }
      if(currentRow > 8) {
        emoji = emoji + '😅';
      }
      let colors = genColors();
      let encoded = sharedGame;
      let item = window.localStorage.getItem(encoded);
      if(item) {
        emoji = '🤡';
        setStatus(`You aleady won in ${item} ${emoji}`);
      } else { 
        window.localStorage.setItem(gameId, currentRow);
        setStatus(`You won in ${currentRow}! ${emoji}`);
      }
      reveal();
    } else {
      setCurrentPick(1);
      setCurrentRow(currentRow + 1);
    }
  }

  useEffect(() => {
    if (currentRow > 10) {
      setStatus("You lose 😭");
      reveal();
    } else {
      setNextPick();
    }
  }, [currentRow]);

  function setNextPick() {
    setTimeout(() => {
      if (currentRow && currentRow >= 1) {
        let $spaces = document.querySelectorAll(
          `#row-${currentRow} .code-space`
        );
        setPicks(["", "", "", ""]);
        setColor($spaces[0], currentRow, 1);
      }
    }, 10);
  }

  function newGame() {
    window.location.href = window.location.origin + window.location.pathname;
  };

  function reveal() {
    let $answerRow = document.getElementById(`answer`);
    $answerRow.classList.add("revealed");
    code.forEach((i, index) => {
      let $answer = document.getElementById(`answer-${index + 1}`);
      $answer.classList.add(i);
    });
  }

  function decode(base64) {

    // Add removed at end '='
    base64 += Array(5 - base64.length % 4).join('=');

    base64 = base64
      .replace(/\-/g, '+') // Convert '-' to '+'
      .replace(/\_/g, '/'); // Convert '_' to '/'

    return base64;

  }
  function encode(buffer) {

  return buffer.toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
  }

  if (!mode) {
    return (
      <div className="App">
        <h1>
          Mastermind <img src="favicon.png" className="icon" />
        </h1>
        <button
          className="button"
          onClick={() => {
            setMode(6);
          }}
        >
          Easy
        </button>{" "}
        <button
          className="button"
          onClick={() => {
            setMode(7);
          }}
        >
          Medium
        </button>{" "}
        <button
          className="button"
          onClick={() => {
            setMode(8);
          }}
        >
          Hard
        </button>
        <br />
        <br />
        <label title="Allow multiple of the same colors to appear in the code">
          <input
            type="checkbox"
            onChange={(e) => {
              setDoubles(e.target.checked);
            }}
          />
          Allow doubles in the code?
        </label>
        <Footer />
      </div>
    );
  }

  function shareGame() {
    url.searchParams.set('g', gameId || sharedGame);
    url.searchParams.set('m', encode(btoa(mode)));
    setShare(url.href);
    setShowShare(!showShare);
  }

  return (
    <div className="App">
      <h1>
        Mastermind <img src="favicon.png" className="icon" />
      </h1>
      {status && <h2>{status}</h2>}
      <div className="code-box">
        {rows.map((row, index) => (
          <div
            key={`mm-${index}`}
            id={`row-${row}`}
            className={`code-row ${index == 0 ? "highlight" : null}`}
          >
            <div
              onClick={(e) => {
                setColor(e.target, row, 1);
              }}
              className="code-space"
            ></div>
            <div
              onClick={(e) => {
                setColor(e.target, row, 2);
              }}
              className="code-space"
            ></div>
            <div
              onClick={(e) => {
                setColor(e.target, row, 3);
              }}
              className="code-space"
            ></div>
            <div
              onClick={(e) => {
                setColor(e.target, row, 4);
              }}
              className="code-space"
            ></div>
            <div className="grade" id={`grade-${row}`}>
              <span id={`peg-${row}-1`} className="peg" />
              <span id={`peg-${row}-2`} className="peg" />
              <span id={`peg-${row}-3`} className="peg" />
              <span id={`peg-${row}-4`} className="peg" />
            </div>
          </div>
        ))}
        <div id="answer" className="code-row answer-row">
          <div id={`answer-1`} className="code-space"></div>
          <div id={`answer-2`} className="code-space"></div>
          <div id={`answer-3`} className="code-space"></div>
          <div id={`answer-4`} className="code-space"></div>
          <div className="grade" />
        </div>

        <div id="color-picker" className="color-picker">
          <div
            data-color="blue"
            className="pick blue"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          <div
            data-color="black"
            className="pick black"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          <div
            data-color="yellow"
            className="pick yellow"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          <div
            data-color="white"
            className="pick white"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          <div
            data-color="red"
            className="pick red"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          <div
            data-color="green"
            className="pick green"
            onClick={(e) => {
              pickColor(e);
            }}
          />
          {mode > 6 && (
            <div
              data-color="pink"
              className="pick pink"
              onClick={(e) => {
                pickColor(e);
              }}
            />
          )}

          {mode > 7 && (
            <div
              data-color="orange"
              className="pick orange"
              onClick={(e) => {
                pickColor(e);
              }}
            />
          )}
        </div>
      </div>
      <button id="score-button" onClick={gradeRow} className="button off">
        Score
      </button>
      <br />
      <br />
      <button onClick={shareGame} className="button" title="share code with a friend">Share Code</button>
      {showShare && <div className="share"><a href={share}>{share}</a></div>}
      <br />
      <br />
      {sharedGame && <button className="button" onClick={newGame}>New Game</button>}
      <Footer />
    </div>
  );

};

const Footer = () => {
  return (
    <div className="footer">
      <a target="_blank" href="https://github.com/patricksimpson/mastermind">
        Github
      </a>{" "}
      |{" "}
      <a target="_blank" href="https://www.wikihow.com/Play-Mastermind">
        How to play
      </a>{" "}
      |{" "}
      <a target="_blank" href="https://www.buymeacoffee.com/patricksimpson">
        Buy me a ☕
    </a>
</div>
  );
}

export default App;
