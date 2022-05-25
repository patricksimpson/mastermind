import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [code, setCode] = useState(null);
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [currentRow, setCurrentRow] = useState(1);
  const [currentPick, setCurrentPick] = useState(null);
  const [currentPickEle, setCurrentPickEle] = useState(null);
  const [picks, setPicks] = useState([]);
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState();

  useEffect(() => {
    init();
  }, [mode]);

  const init = () => {
    let colors = ["blue", "green", "red", "black", "white", "yellow"];

    if (mode > 6) {
      colors.push("pink");
    }

    if (mode > 7) {
      colors.push("orange");
    }

    let tempCode = shuffleArray(colors).splice(0, 4);
    setCode(tempCode);
    setCurrentRow(1);
    setPicks(["", "", "", ""]);
    setNextPick();
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
    if (row !== currentRow) return;
    if (ele == currentPickEle) return;
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
    // let top = ele.offsetTop + 42 + "px";
    // pEle.style.top = top;
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
        setColor($spaces[currentPick], currentRow, currentPick + 1);
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
        tempCode[index] = "";
        return 2;
      }
    });

    let $score = document.getElementById("score-button");
    $score.classList.add("off");

    let whites = picks.map((pick) => {
      if (tempCode.indexOf(pick) >= 0) {
        let index = tempCode.indexOf(pick);
        tempCode[index] = "";
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
      setStatus(`You won in ${currentRow}! 🎉`);
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

  function reveal() {
    let $answerRow = document.getElementById(`answer`);
    $answerRow.classList.add("revealed");
    code.forEach((i, index) => {
      let $answer = document.getElementById(`answer-${index + 1}`);
      $answer.classList.add(i);
    });
  }

  if (!mode) {
    return (
      <div className="App">
        <h1>Mastermind</h1>
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
        <br />
        <a href="https://github.com/patricksimpson/mastermind">Github</a> |{" "}
        <a href="https://www.wikihow.com/Play-Mastermind">How to play</a> |{" "}
        <a href="https://www.buymeacoffee.com/patricksimpson">Buy me a ☕</a>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Mastermind</h1>
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
      <br />
      <a target="_blank" href="https://github.com/patricksimpson/mastermind">
        Github
      </a>{" "}
      |{" "}
      <a target="_blank" href="https://www.wikihow.com/Play-Mastermind">
        How to play
      </a>
      |{" "}
      <a target="_blank" href="https://www.buymeacoffee.com/patricksimpson">
        Buy me a ☕
      </a>
    </div>
  );
};

export default App;
