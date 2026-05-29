---
title: 'Tutorial: Tic-Tac-Toe'
---

<Intro>

இந்த tutorial-இல் நீங்கள் ஒரு சிறிய tic-tac-toe game-ஐ உருவாக்கப் போகிறீர்கள். ஏற்கனவே React தெரிந்திருக்க வேண்டும் என்று இந்த tutorial கருதவில்லை. இந்த tutorial-இல் நீங்கள் கற்றுக்கொள்ளும் techniques எந்த React app-ஐயும் உருவாக்க அடிப்படையானவை; இதை முழுமையாகப் புரிந்துகொள்வது React பற்றிய ஆழமான புரிதலை உங்களுக்கு தரும்.

</Intro>

<Note>

**செய்து கற்றுக்கொள்ள** விரும்புபவர்களுக்கும், கையால் தொட்டுப் பார்க்கக்கூடிய ஒன்றை விரைவாக உருவாக்கிப் பார்க்க விரும்புபவர்களுக்கும் இந்த tutorial வடிவமைக்கப்பட்டுள்ளது. ஒவ்வொரு concept-ஐயும் படிப்படியாக கற்றுக்கொள்ள விரும்பினால், [UI-ஐ விவரித்தல்](/learn/describing-the-ui) என்பதிலிருந்து தொடங்குங்கள்.

</Note>

இந்த tutorial பல பிரிவுகளாகப் பிரிக்கப்பட்டுள்ளது:

- [tutorial-க்கான setup](#setup-for-the-tutorial) இந்த tutorial-ஐப் பின்பற்ற **ஒரு தொடக்கப் புள்ளி** தரும்.
- [Overview](#overview) React-ன் **அடிப்படைகளை** கற்றுத்தரும்: components, props, மற்றும் state.
- [game-ஐ முடித்தல்](#completing-the-game) React development-இல் **மிகவும் பொதுவான techniques**-ஐ கற்றுத்தரும்.
- [time travel சேர்த்தல்](#adding-time-travel) React-ன் தனித்துவமான பலங்களைப் பற்றிய **ஆழமான insight** தரும்.

### நீங்கள் என்ன உருவாக்கப் போகிறீர்கள்? {/*what-are-you-building*/}

இந்த tutorial-இல், React உடன் interactive tic-tac-toe game ஒன்றை உருவாக்குவீர்கள்.

முடித்த பிறகு அது எப்படி இருக்கும் என்பதை இங்கே பார்க்கலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

இந்த code இப்போது உங்களுக்கு புரியவில்லை என்றாலோ, code syntax உங்களுக்கு பழக்கமில்லையெனிலோ கவலைப்பட வேண்டாம்! React மற்றும் அதன் syntax-ஐப் புரிந்துகொள்ள உதவுவதே இந்த tutorial-ன் நோக்கம்.

tutorial-ஐத் தொடரும் முன் மேலுள்ள tic-tac-toe game-ஐப் பார்த்து முயற்சி செய்ய பரிந்துரைக்கிறோம். நீங்கள் கவனிக்கும் அம்சங்களில் ஒன்று, game board-ன் வலப்புறத்தில் numbered list இருப்பது. இந்த list game-இல் நடந்த எல்லா நகர்வுகளின் history-யையும் தருகிறது; game முன்னேறும்போது அது update ஆகிறது.

முடிக்கப்பட்ட tic-tac-toe game-ஐ சிறிது விளையாடிப் பார்த்த பிறகு தொடர்ந்து scroll செய்யுங்கள். இந்த tutorial-இல் நேரடியான template-இலிருந்து தொடங்குவீர்கள். அடுத்த படி, game-ஐ உருவாக்கத் தொடங்க உங்களை set up செய்வது.

## tutorial-க்கான setup {/*setup-for-the-tutorial*/}

கீழே உள்ள live code editor-இல், வலது மேல் மூலையில் உள்ள **Fork**-ஐ click செய்து CodeSandbox website மூலம் editor-ஐ புதிய tab-இல் திறக்கவும். CodeSandbox உங்கள் browser-இல் code எழுதவும், நீங்கள் உருவாக்கிய app-ஐ பயனர்கள் எப்படி பார்ப்பார்கள் என்பதை preview செய்யவும் அனுமதிக்கிறது. புதிய tab-இல் காலியான square மற்றும் இந்த tutorial-க்கான starter code காட்டப்பட வேண்டும்.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

உங்கள் local development environment-ஐப் பயன்படுத்தியும் இந்த tutorial-ஐப் பின்பற்றலாம். இதைச் செய்ய, நீங்கள்:

1. [Node.js](https://nodejs.org/en/) install செய்யுங்கள்
1. முன்பு திறந்த CodeSandbox tab-இல், menu-ஐத் திறக்க இடது மேல் மூலையில் உள்ள button-ஐ அழுத்தி, அந்த menu-இல் **Download Sandbox** தேர்வு செய்து files-ன் archive-ஐ local ஆக download செய்யுங்கள்
1. archive-ஐ unzip செய்து, terminal ஒன்றைத் திறந்து unzip செய்த directory-க்கு `cd` செய்யுங்கள்
1. `npm install` மூலம் dependency-களை install செய்யுங்கள்
1. local server-ஐத் தொடங்க `npm start` ஓட்டுங்கள்; browser-இல் ஓடும் code-ஐ பார்க்க prompt-களைப் பின்பற்றுங்கள்

நீங்கள் சிக்கிக்கொண்டால், அதனால் நிறுத்த வேண்டாம்! அதற்கு பதிலாக online-இல் பின்பற்றுங்கள்; local setup-ஐ பின்னர் மீண்டும் முயற்சிக்கலாம்.

</Note>

## Overview {/*overview*/}

இப்போது setup முடிந்ததால், React-ன் overview-ஐப் பார்ப்போம்!

### starter code-ஐ inspect செய்தல் {/*inspecting-the-starter-code*/}

CodeSandbox-இல் மூன்று முக்கிய பிரிவுகளைப் பார்ப்பீர்கள்:

![starter code உடன் CodeSandbox](../images/tutorial/react-starter-code-codesandbox.png)

1. `src` folder-இல் `App.js`, `index.js`, `styles.css` போன்ற file-களின் பட்டியல் மற்றும் `public` என்ற folder உள்ள _Files_ பிரிவு
1. நீங்கள் தேர்ந்தெடுத்த file-ன் source code-ஐப் பார்ப்பதற்கான _code editor_
1. நீங்கள் எழுதிய code எப்படி காட்டப்படும் என்பதைப் பார்ப்பதற்கான _browser_ பிரிவு

_Files_ பிரிவில் `App.js` file தேர்ந்தெடுக்கப்பட்டிருக்க வேண்டும். _code editor_-இல் அந்த file-ன் உள்ளடக்கம் இதுபோல் இருக்க வேண்டும்:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_browser_ பிரிவு X கொண்ட square ஒன்றை இவ்வாறு காட்ட வேண்டும்:

![x நிரம்பிய square](../images/tutorial/x-filled-square.png)

இப்போது starter code-இல் உள்ள file-களைப் பார்ப்போம்.

#### `App.js` {/*appjs*/}

`App.js`-இல் உள்ள code ஒரு _component_-ஐ உருவாக்குகிறது. React-இல் component என்பது user interface-ன் ஒரு பகுதியை பிரதிநிதித்துவப்படுத்தும் reusable code துண்டு. உங்கள் application-இல் UI element-களை render, manage, update செய்ய component-கள் பயன்படுத்தப்படுகின்றன. என்ன நடக்கிறது என்பதைப் பார்க்க component-ஐ வரி வரியாகப் பார்ப்போம்:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

முதல் வரி `Square` என்ற function-ஐ define செய்கிறது. `export` JavaScript keyword இந்த function-ஐ இந்த file-க்கு வெளியே அணுகக்கூடியதாக ஆக்குகிறது. `default` keyword, உங்கள் code-ஐப் பயன்படுத்தும் பிற file-களுக்கு இது உங்கள் file-ன் main function என்று சொல்கிறது.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

இரண்டாவது வரி button ஒன்றை return செய்கிறது. `return` JavaScript keyword-க்கு பிறகு வரும் எதுவும் function-ஐ call செய்தவருக்கு value ஆக return செய்யப்படும் என்பதைக் குறிக்கிறது. `<button>` ஒரு *JSX element*. JSX element என்பது நீங்கள் காட்ட விரும்புவதை விவரிக்கும் JavaScript code மற்றும் HTML tag-களின் இணைப்பு. `className="square"` என்பது button-ஐ எப்படி style செய்ய வேண்டும் என்பதை CSS-க்கு சொல்லும் button property அல்லது *prop*. `X` என்பது button-க்குள் காட்டப்படும் text; `</button>` JSX element-ஐ மூடி, அதன் பின்வரும் content button-க்குள் வைக்கப்படக்கூடாது என்பதை குறிக்கிறது.

#### `styles.css` {/*stylescss*/}

CodeSandbox-ன் _Files_ பிரிவில் `styles.css` என குறிக்கப்பட்ட file-ஐ click செய்யுங்கள். இந்த file உங்கள் React app-க்கான style-களை define செய்கிறது. முதல் இரண்டு _CSS selector_-கள் (`*` மற்றும் `body`) உங்கள் app-ன் பெரிய பகுதிகளின் style-ஐ define செய்கின்றன; `.square` selector, `className` property `square` ஆக அமைக்கப்பட்டுள்ள எந்த component-ன் style-ஐ define செய்கிறது. உங்கள் code-இல், அது `App.js` file-இல் உள்ள Square component-ன் button-க்கு match ஆகும்.

#### `index.js` {/*indexjs*/}

CodeSandbox-ன் _Files_ பிரிவில் `index.js` என குறிக்கப்பட்ட file-ஐ click செய்யுங்கள். tutorial-இன் போது இந்த file-ஐ நீங்கள் edit செய்யமாட்டீர்கள்; ஆனால் இது `App.js` file-இல் நீங்கள் உருவாக்கிய component மற்றும் web browser இடையிலான பாலமாகும்.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1-5 வரிகள் தேவையான எல்லா பகுதிகளையும் ஒன்றாக கொண்டு வருகின்றன:

* React
* web browser-களுடன் பேச React-ன் library (React DOM)
* உங்கள் component-களுக்கான style-கள்
* `App.js`-இல் நீங்கள் உருவாக்கிய component

file-ன் மீதமுள்ள பகுதி எல்லா பகுதிகளையும் ஒன்றிணைத்து, final product-ஐ `public` folder-இல் உள்ள `index.html`-க்குள் inject செய்கிறது.

### board-ஐ உருவாக்குதல் {/*building-the-board*/}

`App.js`-க்கு திரும்புவோம். tutorial-ன் மீதமுள்ள பகுதியை பெரும்பாலும் இங்குதான் செய்வீர்கள்.

தற்போது board ஒரே ஒரு square மட்டுமே; ஆனால் உங்களுக்கு ஒன்பது தேவை! இரண்டு square-களை உருவாக்க square-ஐ copy-paste செய்து இப்படிச் செய்ய முயற்சித்தால்:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

இந்த error கிடைக்கும்:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

React component-கள் இரண்டு button-கள் போன்ற பல adjacent JSX element-களை அல்ல, ஒரே ஒரு JSX element-ஐ return செய்ய வேண்டும். இதைச் சரிசெய்ய, பல adjacent JSX element-களை wrap செய்ய *Fragment*-களை (`<>` மற்றும் `</>`) இவ்வாறு பயன்படுத்தலாம்:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

இப்போது நீங்கள் இதைப் பார்க்க வேண்டும்:

![x நிரம்பிய இரண்டு square-கள்](../images/tutorial/two-x-filled-squares.png)

அருமை! இப்போது ஒன்பது square-களைச் சேர்க்க சில முறை copy-paste செய்தால் போதும், பின்னர்...

![ஒரே வரியில் x நிரம்பிய ஒன்பது square-கள்](../images/tutorial/nine-x-filled-squares.png)

ஓஹோ! square-கள் எல்லாம் ஒரே வரியில் உள்ளன; நமக்குத் தேவையான board போல grid-இல் இல்லை. இதைச் சரிசெய்ய, உங்கள் square-களை `div`-கள் மூலம் row-களாக group செய்து சில CSS class-களைச் சேர்க்க வேண்டும். இதையே செய்யும்போது, ஒவ்வொரு square எங்கே காட்டப்படுகிறது என்பதை உறுதிசெய்ய ஒவ்வொன்றுக்கும் எண் கொடுப்பீர்கள்.

`App.js` file-இல், `Square` component-ஐ இதுபோல் update செய்யுங்கள்:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css`-இல் define செய்யப்பட்ட CSS, `board-row` என்ற `className` கொண்ட div-களை style செய்கிறது. styled `div`-களுடன் component-களை row-களாக group செய்துவிட்டதால், உங்கள் tic-tac-toe board தயாராகிறது:

![1 முதல் 9 வரை எண்களால் நிரம்பிய tic-tac-toe board](../images/tutorial/number-filled-board.png)

ஆனால் இப்போது ஒரு பிரச்சினை உள்ளது. `Square` என்று பெயரிடப்பட்ட உங்கள் component இப்போது உண்மையில் square அல்ல. பெயரை `Board` என மாற்றி அதைச் சரிசெய்வோம்:

```js {1}
export default function Board() {
  //...
}
```

இந்த கட்டத்தில் உங்கள் code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Psssst... type செய்ய நிறைய இருக்கிறது! இந்தப் பக்கத்திலிருந்து code-ஐ copy-paste செய்வது சரிதான். ஆனால் சிறிய challenge எடுக்க விரும்பினால், குறைந்தது ஒருமுறை கைமுறையாக type செய்த code-ஐ மட்டுமே copy செய்ய பரிந்துரைக்கிறோம்.

</Note>

### props மூலம் data-வை pass செய்தல் {/*passing-data-through-props*/}

அடுத்து, பயனர் square-ஐ click செய்தால் அதன் value-ஐ காலியாக இருப்பதிலிருந்து "X" ஆக மாற்ற விரும்புவீர்கள். இதுவரை board-ஐ உருவாக்கிய விதத்தில், square-ஐ update செய்யும் code-ஐ ஒன்பது முறை (ஒவ்வொரு square-க்கும் ஒருமுறை) copy-paste செய்ய வேண்டியிருக்கும்! copy-paste செய்வதற்கு பதிலாக, React-ன் component architecture messy, duplicated code-ஐத் தவிர்க்க reusable component உருவாக்க அனுமதிக்கிறது.

முதலில், உங்கள் `Board` component-இலிருந்து முதல் square-ஐ define செய்யும் வரியை (`<button className="square">1</button>`) புதிய `Square` component-க்குள் copy செய்யப் போகிறீர்கள்:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

பிறகு JSX syntax-ஐப் பயன்படுத்தி அந்த `Square` component-ஐ render செய்ய Board component-ஐ update செய்வீர்கள்:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

browser `div`-களுக்கு மாறாக, உங்கள் சொந்த component-கள் `Board` மற்றும் `Square` capital letter-ஆல் தொடங்க வேண்டும் என்பதை கவனியுங்கள்.

பார்ப்போம்:

![one-filled board](../images/tutorial/board-filled-with-ones.png)

ஓஹோ! முன்பு இருந்த numbered square-களை இழந்துவிட்டீர்கள். இப்போது ஒவ்வொரு square-மும் "1" என்று காட்டுகிறது. இதைச் சரிசெய்ய, ஒவ்வொரு square-க்கும் இருக்க வேண்டிய value-ஐ parent component (`Board`) இலிருந்து அதன் child (`Square`) க்கு pass செய்ய *props* பயன்படுத்துவீர்கள்.

`Board`-இலிருந்து pass செய்யப்போகும் `value` prop-ஐ read செய்ய `Square` component-ஐ update செய்யுங்கள்:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` என்பது Square component-க்கு `value` என்ற prop pass செய்யலாம் என்பதைக் குறிக்கிறது.

இப்போது ஒவ்வொரு square-க்குள்ளும் `1`-க்கு பதிலாக அந்த `value`-ஐ காட்ட விரும்புகிறீர்கள். இப்படிச் செய்து பாருங்கள்:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

அச்சச்சோ, இது நீங்கள் விரும்பியது அல்ல:

![value-filled board](../images/tutorial/board-filled-with-value.png)

உங்கள் component-இலிருந்து `value` என்ற JavaScript variable-ஐ render செய்ய விரும்பினீர்கள்; "value" என்ற வார்த்தையை அல்ல. JSX-இலிருந்து "JavaScript-க்குள் செல்ல" curly brace-கள் தேவை. JSX-இல் `value` சுற்றி curly brace-களை இவ்வாறு சேருங்கள்:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

இப்போது காலியான board ஒன்றைப் பார்க்க வேண்டும்:

![empty board](../images/tutorial/empty-board.png)

ஏனெனில் `Board` component, அது render செய்யும் ஒவ்வொரு `Square` component-க்கும் இன்னும் `value` prop-ஐ pass செய்யவில்லை. இதைச் சரிசெய்ய, `Board` component render செய்யும் ஒவ்வொரு `Square` component-க்கும் `value` prop-ஐச் சேர்ப்பீர்கள்:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

இப்போது மீண்டும் எண்களைக் கொண்ட grid-ஐப் பார்க்க வேண்டும்:

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

உங்கள் updated code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### interactive component ஒன்றை உருவாக்குதல் {/*making-an-interactive-component*/}

`Square` component-ஐ click செய்தால் அதில் `X` நிரம்புமாறு செய்வோம். `Square`-க்குள் `handleClick` என்ற function-ஐ declare செய்யுங்கள். பிறகு, `Square` return செய்யும் button JSX element-ன் props-க்கு `onClick` சேருங்கள்:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('click செய்யப்பட்டது!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

இப்போது square-ஐ click செய்தால், CodeSandbox-இல் _Browser_ பிரிவின் கீழே உள்ள _Console_ tab-இல் `"click செய்யப்பட்டது!"` என்று log காண வேண்டும். square-ஐ ஒன்றுக்கு மேற்பட்ட முறை click செய்தால் `"click செய்யப்பட்டது!"` மீண்டும் log ஆகும். ஒரே message உடன் மீண்டும் மீண்டும் வரும் console log-கள் console-இல் மேலும் பல வரிகளை உருவாக்காது. அதற்கு பதிலாக, உங்கள் முதல் `"click செய்யப்பட்டது!"` log-க்கு அருகில் அதிகரிக்கும் counter ஒன்றைப் பார்ப்பீர்கள்.

<Note>

உங்கள் local development environment-ஐப் பயன்படுத்தி இந்த tutorial-ஐப் பின்பற்றினால், browser-ன் Console-ஐத் திறக்க வேண்டும். உதாரணமாக, Chrome browser பயன்படுத்தினால், **Shift + Ctrl + J** (Windows/Linux) அல்லது **Option + ⌘ + J** (macOS) keyboard shortcut மூலம் Console-ஐப் பார்க்கலாம்.

</Note>

அடுத்த படியாக, Square component தன்னை click செய்ததை "நினைவில்" வைத்து, "X" mark-ஆல் நிரம்ப வேண்டும். விஷயங்களை "நினைவில்" வைக்க component-கள் *state*-ஐப் பயன்படுத்துகின்றன.

React `useState` என்ற சிறப்பு function ஒன்றை வழங்குகிறது; component-இலிருந்து அதை call செய்து அது விஷயங்களை "நினைவில்" வைத்துக்கொள்ளச் செய்யலாம். `Square`-ன் தற்போதைய value-ஐ state-இல் சேமித்து, `Square` click செய்யப்படும் போது அதை மாற்றுவோம்.

file-ன் மேல் பகுதியில் `useState`-ஐ import செய்யுங்கள். `Square` component-இலிருந்து `value` prop-ஐ நீக்குங்கள். அதற்கு பதிலாக, `Square` தொடக்கத்தில் `useState`-ஐ call செய்யும் புதிய வரி ஒன்றைச் சேர்க்குங்கள். அது `value` என்ற state variable-ஐ return செய்யட்டும்:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` மதிப்பைச் சேமிக்கிறது; `setValue` மதிப்பை மாற்ற பயன்படுத்தக்கூடிய function. `useState`-க்கு pass செய்யப்பட்ட `null`, இந்த state variable-க்கான initial value ஆக பயன்படுத்தப்படுகிறது; எனவே இங்கே `value` ஆரம்பத்தில் `null` ஆக இருக்கும்.

`Square` component இனி props ஏற்காததால், Board component உருவாக்கும் ஒன்பது Square component-களிலிருந்தும் `value` prop-ஐ நீக்குவீர்கள்:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

இப்போது click செய்தால் "X" காட்டும் வகையில் `Square`-ஐ மாற்றுவீர்கள். `console.log("click செய்யப்பட்டது!");` event handler-ஐ `setValue('X');`-ஆல் மாற்றுங்கள். இப்போது உங்கள் `Square` component இதுபோல் இருக்கும்:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

`onClick` handler-இலிருந்து இந்த `set` function-ஐ call செய்வதன் மூலம், அதன் `<button>` click செய்யப்படும் போதெல்லாம் அந்த `Square`-ஐ re-render செய்ய React-க்கு சொல்லுகிறீர்கள். update-க்குப் பிறகு, `Square`-ன் `value` `'X'` ஆக இருக்கும், எனவே game board-இல் "X" காணப்படும். ஏதாவது Square-ஐ click செய்யுங்கள்; "X" தோன்ற வேண்டும்:

![board-இல் x-களைச் சேர்த்தல்](../images/tutorial/tictac-adding-x-s.gif)

ஒவ்வொரு Square-க்கும் தனித்தனி state உள்ளது: ஒவ்வொரு Square-இல் சேமிக்கப்படும் `value`, மற்றவற்றிலிருந்து முற்றிலும் independent. ஒரு component-இல் `set` function-ஐ call செய்தால், அதன் உள்ளே உள்ள child component-களையும் React தானாக update செய்கிறது.

மேலுள்ள மாற்றங்களைச் செய்த பிறகு, உங்கள் code இதுபோல் இருக்கும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Developer Tools {/*react-developer-tools*/}

React DevTools உங்கள் React component-களின் props மற்றும் state-ஐச் சரிபார்க்க அனுமதிக்கிறது. CodeSandbox-இல் _browser_ பிரிவின் கீழே React DevTools tab-ஐக் காணலாம்:

![CodeSandbox-இல் React DevTools](../images/tutorial/codesandbox-devtools.png)

screen-இல் குறிப்பிட்ட component-ஐ inspect செய்ய, React DevTools-ன் இடது மேல் மூலையில் உள்ள button-ஐப் பயன்படுத்துங்கள்:

![React DevTools மூலம் page-இல் component-களைத் தேர்ந்தெடுத்தல்](../images/tutorial/devtools-select.gif)

<Note>

local development-க்கு, React DevTools [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), மற்றும் [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) browser extension ஆக கிடைக்கிறது. அதை install செய்தால், React பயன்படுத்தும் site-களுக்காக உங்கள் browser Developer Tools-இல் *Components* tab தோன்றும்.

</Note>

## game-ஐ முடித்தல் {/*completing-the-game*/}

இந்த கட்டத்தில், உங்கள் tic-tac-toe game-க்கான அனைத்து அடிப்படை building block-களும் உள்ளன. முழுமையான game-க்கு, board-இல் மாறி மாறி "X" மற்றும் "O" வைக்க வேண்டும்; மேலும் வெற்றியாளரைத் தீர்மானிக்கும் வழி வேண்டும்.

### state-ஐ மேலே தூக்குதல் {/*lifting-state-up*/}

தற்போது, ஒவ்வொரு `Square` component-மும் game state-ன் ஒரு பகுதியை பராமரிக்கிறது. tic-tac-toe game-இல் வெற்றியாளரைச் சரிபார்க்க, `Board` எப்படியோ ஒன்பது `Square` component-களின் state-ஐ அறிந்திருக்க வேண்டும்.

அதை எப்படி அணுகுவீர்கள்? முதலில், `Board` ஒவ்வொரு `Square`-யிடமும் அதன் state-ஐ "கேட்க" வேண்டும் என்று நினைக்கலாம். React-இல் இந்த அணுகுமுறை தொழில்நுட்ப ரீதியாக சாத்தியமானதாயினும், code புரிந்துகொள்ள கடினமாகி, bug-களுக்கு எளிதில் உட்பட்டு, refactor செய்ய கடினமாக இருப்பதால் அதைத் தவிர்க்க பரிந்துரைக்கிறோம். அதற்கு பதிலாக, game state-ஐ ஒவ்வொரு `Square`-இலும் வைத்திருப்பதற்குப் பதிலாக parent `Board` component-இல் சேமிப்பதே சிறந்த அணுகுமுறை. ஒவ்வொரு Square-க்கும் எண் pass செய்தது போல, prop pass செய்வதன் மூலம் `Board` component ஒவ்வொரு `Square`-க்கும் என்ன காட்ட வேண்டும் என்று சொல்லலாம்.

**பல children-இலிருந்து data சேகரிக்க, அல்லது இரண்டு child component-கள் ஒன்றுடன் ஒன்று தொடர்புகொள்ள வேண்டும் என்றால், shared state-ஐ அவற்றின் parent component-இல் declare செய்யுங்கள். parent component அந்த state-ஐ props மூலம் children-க்கு மீண்டும் pass செய்யலாம். இது child component-களை ஒன்றுக்கொன்றும் parent-உடும் sync-இல் வைத்திருக்கும்.**

React component-கள் refactor செய்யப்படும் போது state-ஐ parent component-க்கு lift செய்வது பொதுவானது.

இந்த வாய்ப்பைப் பயன்படுத்தி அதை முயற்சி செய்வோம். ஒன்பது square-களுக்கு பொருந்தும் 9 null-கள் கொண்ட array-ஐ default ஆகக் கொண்ட `squares` என்ற state variable-ஐ declare செய்ய `Board` component-ஐ edit செய்யுங்கள்:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` ஒன்பது element-கள் கொண்ட array ஒன்றை உருவாக்கி, அவற்றை ஒவ்வொன்றாக `null` ஆக அமைக்கிறது. அதைச் சுற்றியுள்ள `useState()` call, ஆரம்பத்தில் அந்த array-ஆக அமைக்கப்படும் `squares` state variable-ஐ declare செய்கிறது. array-இல் உள்ள ஒவ்வொரு entry-யும் ஒரு square-ன் value-க்கு பொருந்தும். பின்னர் board-ஐ நிரப்பும்போது, `squares` array இதுபோல் இருக்கும்:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

இப்போது உங்கள் `Board` component, அது render செய்யும் ஒவ்வொரு `Square`-க்கும் `value` prop-ஐ கீழே pass செய்ய வேண்டும்:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

அடுத்து, Board component-இலிருந்து `value` prop-ஐப் பெற `Square` component-ஐ edit செய்வீர்கள். இதற்காக Square component-ன் சொந்த stateful `value` tracking-ஐயும் button-ன் `onClick` prop-ஐயும் நீக்க வேண்டும்:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

இந்த கட்டத்தில் காலியான tic-tac-toe board-ஐப் பார்க்க வேண்டும்:

![empty board](../images/tutorial/empty-board.png)

மேலும் உங்கள் code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

இப்போது ஒவ்வொரு Square-க்கும் `value` prop கிடைக்கும்; அது `'X'`, `'O'`, அல்லது காலியான square-களுக்கு `null` ஆக இருக்கும்.

அடுத்து, ஒரு `Square` click செய்யப்படும் போது என்ன நடக்கிறது என்பதை மாற்ற வேண்டும். எந்த square-கள் நிரம்பியுள்ளன என்பதை இப்போது `Board` component பராமரிக்கிறது. `Square` மூலம் `Board`-ன் state-ஐ update செய்யும் வழி ஒன்றை உருவாக்க வேண்டும். state அதை define செய்யும் component-க்கு private ஆனதால், `Square`-இலிருந்து `Board`-ன் state-ஐ நேரடியாக update செய்ய முடியாது.

அதற்கு பதிலாக, `Board` component-இலிருந்து `Square` component-க்கு function ஒன்றை pass செய்வீர்கள்; square click செய்யப்படும் போது `Square` அந்த function-ஐ call செய்யும். `Square` component click செய்யப்படும் போது call செய்யும் function-இலிருந்து தொடங்குவீர்கள். அந்த function-ஐ `onSquareClick` என்று அழைப்பீர்கள்:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

அடுத்து, `Square` component-ன் props-க்கு `onSquareClick` function-ஐச் சேர்ப்பீர்கள்:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

இப்போது `onSquareClick` prop-ஐ `Board` component-இல் `handleClick` என்று பெயரிடப் போகும் function-க்கு connect செய்வீர்கள். `onSquareClick`-ஐ `handleClick`-க்கு connect செய்ய, முதல் `Square` component-ன் `onSquareClick` prop-க்கு function ஒன்றை pass செய்வீர்கள்:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

கடைசியாக, உங்கள் board-ன் state-ஐ வைத்திருக்கும் `squares` array-ஐ update செய்ய Board component-க்குள் `handleClick` function-ஐ define செய்வீர்கள்:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` function JavaScript `slice()` Array method மூலம் `squares` array-ன் copy (`nextSquares`) ஒன்றை உருவாக்குகிறது. பிறகு, முதல் (`[0]` index) square-க்கு `X` சேர்க்க `nextSquares` array-ஐ `handleClick` update செய்கிறது.

`setSquares` function-ஐ call செய்வது, component-ன் state மாறிவிட்டது என்பதை React-க்கு தெரிவிக்கிறது. இது `squares` state-ஐப் பயன்படுத்தும் component-களையும் (`Board`), அதன் child component-களையும் (board-ஐ உருவாக்கும் `Square` component-கள்) re-render செய்ய trigger செய்யும்.

<Note>

JavaScript [closure-களை](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) support செய்கிறது; அதாவது inner function (உதா. `handleClick`) outer function-இல் (உதா. `Board`) define செய்யப்பட்ட variable-களையும் function-களையும் அணுக முடியும். `handleClick` function `squares` state-ஐ read செய்து `setSquares` method-ஐ call செய்ய முடியும், ஏனெனில் இரண்டும் `Board` function-க்குள் define செய்யப்பட்டுள்ளன.

</Note>

இப்போது board-க்கு X-களைச் சேர்க்கலாம்... ஆனால் மேலே இடதுபுற square-க்கு மட்டும். உங்கள் `handleClick` function மேல் இடதுபுற square (`0`) index-ஐ update செய்ய hardcode செய்யப்பட்டுள்ளது. எந்த square-யையும் update செய்ய முடியும் வகையில் `handleClick`-ஐ update செய்வோம். update செய்ய வேண்டிய square-ன் index-ஐ எடுக்க `handleClick` function-க்கு `i` என்ற argument சேர்க்கவும்:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

அடுத்து, அந்த `i`-யை `handleClick`-க்கு pass செய்ய வேண்டும். square-ன் `onSquareClick` prop-ஐ நேரடியாக JSX-இல் `handleClick(0)` ஆக அமைக்க முயற்சிக்கலாம்; ஆனால் அது வேலை செய்யாது:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

இது ஏன் வேலை செய்யாது என்பதைப் பார்ப்போம். `handleClick(0)` call board component rendering-ன் ஒரு பகுதியாகிவிடும். `handleClick(0)` `setSquares`-ஐ call செய்து board component-ன் state-ஐ மாற்றுவதால், முழு board component மீண்டும் re-render ஆகும். ஆனால் இது `handleClick(0)`-ஐ மீண்டும் ஓட்டும்; இதனால் infinite loop ஏற்படும்:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

இந்த பிரச்சினை முன்பு ஏன் நடக்கவில்லை?

நீங்கள் `onSquareClick={handleClick}` pass செய்தபோது, `handleClick` function-ஐ prop ஆக கீழே pass செய்தீர்கள். அதை call செய்யவில்லை! ஆனால் இப்போது அந்த function-ஐ உடனே *call* செய்கிறீர்கள்--`handleClick(0)`-இல் உள்ள parenthesis-களை கவனியுங்கள்--அதனால் அது மிக விரைவாக ஓடுகிறது. பயனர் click செய்யும் வரை `handleClick`-ஐ call செய்ய *வேண்டாம்*!

`handleClick(0)`-ஐ call செய்யும் `handleFirstSquareClick` போன்ற function, `handleClick(1)`-ஐ call செய்யும் `handleSecondSquareClick` போன்ற function என உருவாக்கி இதைச் சரிசெய்யலாம். இந்த function-களை `onSquareClick={handleFirstSquareClick}` போன்ற props ஆக கீழே pass செய்வீர்கள் (call செய்வதில்லை). இது infinite loop-ஐத் தீர்க்கும்.

ஆனால், ஒன்பது வேறு function-களை define செய்து ஒவ்வொன்றுக்கும் பெயர் கொடுப்பது மிகவும் verbose. அதற்கு பதிலாக இதைச் செய்வோம்:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

புதிய `() =>` syntax-ஐ கவனியுங்கள். இங்கே, `() => handleClick(0)` என்பது *arrow function*; function-களை define செய்யும் குறுகிய வழி. square click செய்யப்படும் போது, `=>` "arrow"-க்கு பின் உள்ள code ஓடி, `handleClick(0)`-ஐ call செய்யும்.

இப்போது, pass செய்யும் arrow function-களிலிருந்து `handleClick`-ஐ call செய்ய மற்ற எட்டு square-களையும் update செய்ய வேண்டும். `handleClick`-ன் ஒவ்வொரு call-க்கும் argument சரியான square-ன் index-க்கு பொருந்துவதை உறுதிசெய்யுங்கள்:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

இப்போது board-இல் எந்த square-யையும் click செய்து மீண்டும் X-களைச் சேர்க்கலாம்:

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

ஆனால் இந்த முறை state management அனைத்தும் `Board` component மூலம் கையாளப்படுகிறது!

உங்கள் code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

இப்போது state handling `Board` component-இல் இருப்பதால், parent `Board` component child `Square` component-களுக்கு அவை சரியாகக் காட்டப்பட props pass செய்கிறது. `Square`-ஐ click செய்யும்போது, child `Square` component இப்போது board state-ஐ update செய்ய parent `Board` component-யிடம் கேட்கிறது. `Board`-ன் state மாறும்போது, `Board` component மற்றும் ஒவ்வொரு child `Square`-மும் தானாக re-render ஆகும். எல்லா square-களின் state-ஐ `Board` component-இல் வைத்திருப்பது, பின்னர் வெற்றியாளரைத் தீர்மானிக்க அனுமதிக்கும்.

பயனர் உங்கள் board-இன் மேல் இடது square-ஐ click செய்து அதில் `X` சேர்க்கும்போது என்ன நடக்கிறது என்பதை recap செய்வோம்:

1. மேல் இடது square-ஐ click செய்வது, `Square`-இலிருந்து `button` அதன் `onClick` prop ஆக பெற்ற function-ஐ ஓட்டுகிறது. `Square` component அந்த function-ஐ `Board`-இலிருந்து அதன் `onSquareClick` prop ஆகப் பெற்றது. `Board` component அந்த function-ஐ நேரடியாக JSX-இல் define செய்தது. அது `0` என்ற argument உடன் `handleClick`-ஐ call செய்கிறது.
1. `handleClick` argument-ஐ (`0`) பயன்படுத்தி `squares` array-ன் முதல் element-ஐ `null`-இலிருந்து `X` ஆக update செய்கிறது.
1. `Board` component-ன் `squares` state update ஆனதால், `Board` மற்றும் அதன் எல்லா children-களும் re-render ஆகின்றன. இதனால் index `0` கொண்ட `Square` component-ன் `value` prop `null`-இலிருந்து `X` ஆக மாறுகிறது.

இறுதியில், click செய்த பிறகு மேல் இடது square காலியாக இருந்ததிலிருந்து `X` கொண்டதாக மாறியிருப்பதை பயனர் காண்கிறார்.

<Note>

DOM `<button>` element-ன் `onClick` attribute React-க்கு சிறப்பு அர்த்தம் கொண்டது, ஏனெனில் அது built-in component. Square போன்ற custom component-களில் பெயரிடுவது உங்கள் விருப்பம். `Square`-ன் `onSquareClick` prop-க்கும் `Board`-ன் `handleClick` function-க்கும் எந்தப் பெயரையும் கொடுக்கலாம்; code அதேபோல் வேலை செய்யும். React-இல் event-களை பிரதிநிதித்துவப்படுத்தும் props-க்கு `onSomething` பெயர்களையும், அந்த event-களை handle செய்யும் function definition-களுக்கு `handleSomething`-ஐயும் பயன்படுத்துவது மரபு.

</Note>

### immutability ஏன் முக்கியம் {/*why-immutability-is-important*/}

`handleClick`-இல், existing array-ஐ modify செய்வதற்கு பதிலாக `squares` array-ன் copy ஒன்றை உருவாக்க `.slice()` call செய்வதை கவனியுங்கள். ஏன் என்பதை விளக்க, immutability மற்றும் அதை கற்றுக்கொள்வது ஏன் முக்கியம் என்பதைப் பற்றி பேச வேண்டும்.

data-வை மாற்ற பொதுவாக இரண்டு அணுகுமுறைகள் உள்ளன. முதல் அணுகுமுறை data-வின் value-களை நேரடியாக மாற்றி data-வை _mutate_ செய்வது. இரண்டாவது அணுகுமுறை, விரும்பிய மாற்றங்களைக் கொண்ட புதிய copy-ஆல் data-வை மாற்றுவது. `squares` array-ஐ mutate செய்தால் அது எப்படி இருக்கும்:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

`squares` array-ஐ mutate செய்யாமல் data-வை மாற்றினால் அது எப்படி இருக்கும்:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

முடிவு ஒன்றுதான்; ஆனால் நேரடியாக mutate செய்யாமல் (அடிப்படை data-வை மாற்றாமல்) இருப்பதால் பல நன்மைகள் கிடைக்கும்.

Immutability சிக்கலான feature-களை implement செய்வதை மிகவும் உதவுகிறது. இந்த tutorial-இல் பின்னர், game history-யை review செய்து கடந்த நகர்வுகளுக்கு "jump back" செய்ய அனுமதிக்கும் "time travel" feature-ஐ implement செய்வீர்கள். இந்த functionality game-களுக்கே மட்டும் அல்ல; குறிப்பிட்ட action-களை undo மற்றும் redo செய்யும் திறன் app-களில் பொதுவான தேவையாகும். direct data mutation-ஐத் தவிர்ப்பது data-வின் முந்தைய version-களை intact ஆக வைத்திருந்து பின்னர் மீண்டும் பயன்படுத்த உதவும்.

Immutability-க்கு இன்னொரு நன்மையும் உள்ளது. இயல்பாக, parent component-ன் state மாறும்போது எல்லா child component-களும் தானாக re-render ஆகும். மாற்றத்தால் பாதிக்கப்படாத child component-களும் இதில் அடங்கும். re-rendering தனியாக பயனருக்கு தெரியாது என்றாலும் (அதைத் தவிர்க்க நீங்கள் actively முயற்சிக்க வேண்டியதில்லை!), performance காரணங்களுக்காக தெளிவாக பாதிக்கப்படாத tree-ன் ஒரு பகுதி re-render ஆகாமல் skip செய்ய விரும்பலாம். data மாறியதா இல்லையா என்பதை component-கள் compare செய்வதை immutability மிகவும் cheap ஆக்குகிறது. component-ஐ எப்போது re-render செய்ய வேண்டும் என்பதை React எப்படி தேர்வு செய்கிறது என்பதை [the `memo` API reference](/reference/react/memo)-இல் மேலும் அறியலாம்.

### மாறிமாறி விளையாடுதல் {/*taking-turns*/}

இந்த tic-tac-toe game-இல் பெரிய குறையை இப்போது சரிசெய்ய நேரம்: board-இல் "O"களை குறிக்க முடியவில்லை.

முதல் நகர்வை இயல்பாக "X" ஆக அமைப்பீர்கள். இதைப் பின்தொடர Board component-க்கு இன்னொரு state பகுதியைச் சேர்ப்போம்:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

ஒவ்வொரு முறை வீரர் நகரும்போது, அடுத்து எந்த வீரர் செல்ல வேண்டும் என்பதைத் தீர்மானிக்க `xIsNext` (boolean) flip செய்யப்படும்; game state சேமிக்கப்படும். `xIsNext` மதிப்பை flip செய்ய `Board`-ன் `handleClick` function-ஐ update செய்வீர்கள்:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

இப்போது, வேறு square-களை click செய்தால், அவை தேவையானபடி `X` மற்றும் `O` இடையே மாறி மாறி வருவதாக இருக்கும்!

ஆனால் காத்திருங்கள், ஒரு பிரச்சினை உள்ளது. அதே square-ஐ பல முறை click செய்து பாருங்கள்:

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X`-ஐ `O` overwrite செய்கிறது! இது game-க்கு மிகவும் சுவாரஸ்யமான twist சேர்த்தாலும், இப்போது original rules-ஐப் பின்பற்றுவோம்.

ஒரு square-ஐ `X` அல்லது `O` என குறிக்கும் முன், அந்த square-ல் ஏற்கனவே `X` அல்லது `O` value உள்ளதா என்று சரிபார்க்கவில்லை. இதை *early return* செய்வதன் மூலம் சரிசெய்யலாம். square-ல் ஏற்கனவே `X` அல்லது `O` உள்ளதா என்று சரிபார்ப்பீர்கள். square ஏற்கனவே நிரம்பியிருந்தால், board state-ஐ update செய்ய முயற்சிக்கும் முன்பே `handleClick` function-இல் `return` செய்வீர்கள்.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

இப்போது காலியான square-களில் மட்டுமே `X` அல்லது `O` சேர்க்க முடியும்! இந்த கட்டத்தில் உங்கள் code இவ்வாறு இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### வெற்றியாளரை அறிவித்தல் {/*declaring-a-winner*/}

இப்போது வீரர்கள் மாறி மாறி விளையாட முடியும்; game வென்றுவிட்டது, மேலும் turn எதுவும் இல்லை என்பதை காட்ட விரும்புவீர்கள். இதைச் செய்ய, 9 square-களின் array-ஐ எடுத்துக்கொண்டு வெற்றியாளரைச் சரிபார்த்து, பொருத்தமானபடி `'X'`, `'O'`, அல்லது `null` return செய்யும் `calculateWinner` என்ற helper function-ஐச் சேர்ப்பீர்கள். `calculateWinner` function பற்றி அதிகம் கவலைப்பட வேண்டாம்; அது React-க்கு குறிப்பிட்டதல்ல:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

`calculateWinner`-ஐ `Board`-க்கு முன் define செய்கிறீர்களா அல்லது பின் define செய்கிறீர்களா என்பது முக்கியமில்லை. உங்கள் component-களை edit செய்யும் ஒவ்வொரு முறையும் அதைத் தாண்டி scroll செய்ய வேண்டாமென அதை இறுதியில் வைப்போம்.

</Note>

ஒரு வீரர் வென்றாரா என்பதைச் சரிபார்க்க, `Board` component-ன் `handleClick` function-இல் `calculateWinner(squares)`-ஐ call செய்வீர்கள். பயனர் ஏற்கனவே `X` அல்லது `O` உள்ள square-ஐ click செய்தாரா என்று சரிபார்ப்பதுடன் இதையும் ஒரே நேரத்தில் செய்யலாம். இரு சூழல்களிலும் early return செய்ய விரும்புகிறோம்:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

game முடிந்ததை வீரர்கள் அறிய, "வெற்றி பெற்றவர்: X" அல்லது "வெற்றி பெற்றவர்: O" போன்ற text-ஐக் காட்டலாம். அதற்காக `Board` component-க்கு `status` section ஒன்றைச் சேர்ப்பீர்கள். game முடிந்திருந்தால் status வெற்றியாளரை காட்டும்; game தொடர்ந்துகொண்டிருந்தால் அடுத்து எந்த வீரரின் turn என்று காட்டும்:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "வெற்றி பெற்றவர்: " + winner;
  } else {
    status = "அடுத்த வீரர்: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

வாழ்த்துகள்! இப்போது உங்களிடம் வேலை செய்யும் tic-tac-toe game உள்ளது. அதோடு React-ன் அடிப்படைகளையும் இப்போது கற்றுக்கொண்டீர்கள். எனவே இங்கே உண்மையான வெற்றியாளர் _நீங்கள்தான்_. code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## time travel சேர்த்தல் {/*adding-time-travel*/}

இறுதி exercise ஆக, game-இல் முந்தைய நகர்வுகளுக்கு "காலத்தில் பின்செல்ல" முடியுமாறு செய்வோம்.

### நகர்வுகளின் history-யை சேமித்தல் {/*storing-a-history-of-moves*/}

`squares` array-ஐ mutate செய்திருந்தால், time travel implement செய்வது மிகவும் கடினமாக இருக்கும்.

ஆனால் ஒவ்வொரு move-க்குப் பிறகும் `squares` array-ன் புதிய copy-ஐ உருவாக்க `slice()`-ஐப் பயன்படுத்தி, அதை immutable ஆக நடத்தினீர்கள். இதனால் `squares` array-ன் முந்தைய ஒவ்வொரு version-ஐயும் சேமித்து, ஏற்கனவே நடந்த turn-களுக்கிடையே navigate செய்ய முடியும்.

முந்தைய `squares` array-களை `history` என்ற மற்றொரு array-இல் சேமிப்பீர்கள்; அதை புதிய state variable ஆக சேமிப்பீர்கள். `history` array முதல் move-இலிருந்து கடைசி move வரை எல்லா board state-களையும் பிரதிநிதித்துவப்படுத்துகிறது; அது இதுபோன்ற shape கொண்டது:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### state-ஐ மீண்டும் மேலே தூக்குதல் {/*lifting-state-up-again*/}

இப்போது முந்தைய move-களின் பட்டியலைக் காட்ட `Game` என்ற புதிய top-level component எழுதுவீர்கள். முழு game history-யையும் கொண்ட `history` state-ஐ அங்கே வைப்பீர்கள்.

`history` state-ஐ `Game` component-இல் வைப்பது, அதன் child `Board` component-இலிருந்து `squares` state-ஐ நீக்க அனுமதிக்கும். `Square` component-இலிருந்து `Board` component-க்கு "state-ஐ மேலே தூக்கியது" போலவே, இப்போது `Board`-இலிருந்து top-level `Game` component-க்கு அதை lift செய்வீர்கள். இதனால் `Board`-ன் data மீது `Game` component-க்கு முழு control கிடைக்கும்; மேலும் `history`-இலிருந்து முந்தைய turn-களை render செய்ய `Board`-க்கு சொல்ல முடியும்.

முதலில், `export default` உடன் `Game` component ஒன்றைச் சேர்க்குங்கள். அது `Board` component-யையும் சில markup-ஐயும் render செய்யட்டும்:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

`function Board() {` declaration-க்கு முன் இருந்த `export default` keyword-களை நீக்கி, அவற்றை `function Game() {` declaration-க்கு முன் சேர்க்கிறீர்கள் என்பதை கவனியுங்கள். இது உங்கள் `index.js` file-க்கு `Board` component-க்கு பதிலாக `Game` component-ஐ top-level component ஆக பயன்படுத்த சொல்லுகிறது. `Game` component return செய்யும் கூடுதல் `div`-கள், பின்னர் board-க்கு சேர்க்கப் போகும் game தகவல்களுக்கு இடம் செய்கின்றன.

அடுத்து எந்த வீரர் என்பதையும் move history-யையும் track செய்ய `Game` component-க்கு சில state சேர்க்கவும்:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]` என்பது ஒரே item கொண்ட array; அந்த item தானே 9 `null`-கள் கொண்ட array என்பதை கவனியுங்கள்.

தற்போதைய move-க்கான square-களை render செய்ய, `history`-இலிருந்து கடைசி squares array-ஐ read செய்ய விரும்புவீர்கள். இதற்கு `useState` தேவையில்லை; rendering-இன் போது இதை கணக்கிட போதுமான தகவல் உங்களிடம் ஏற்கனவே உள்ளது:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

அடுத்து, game-ஐ update செய்ய `Board` component call செய்யும் `handlePlay` function-ஐ `Game` component-க்குள் உருவாக்குங்கள். `xIsNext`, `currentSquares`, மற்றும் `handlePlay`-ஐ `Board` component-க்கு props ஆக pass செய்யுங்கள்:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

`Board` component அது பெறும் props மூலம் முழுமையாக controlled ஆகட்டும். `Board` component மூன்று props எடுக்குமாறு மாற்றுங்கள்: `xIsNext`, `squares`, மற்றும் வீரர் move செய்தபோது updated squares array உடன் `Board` call செய்யக்கூடிய புதிய `onPlay` function. அடுத்து, `useState`-ஐ call செய்யும் `Board` function-ன் முதல் இரண்டு வரிகளை நீக்குங்கள்:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

இப்போது பயனர் square-ஐ click செய்தபோது `Game` component `Board`-ஐ update செய்ய முடியும் வகையில், `Board` component-இன் `handleClick`-இல் உள்ள `setSquares` மற்றும் `setXIsNext` call-களை உங்கள் புதிய `onPlay` function-க்கு செய்யும் ஒரே call-ஆல் மாற்றுங்கள்:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

`Board` component, `Game` component pass செய்யும் props மூலம் முழுமையாக controlled ஆகிறது. game மீண்டும் வேலை செய்ய `Game` component-இல் `handlePlay` function-ஐ implement செய்ய வேண்டும்.

`handlePlay` call செய்யப்பட்டால் அது என்ன செய்ய வேண்டும்? Board முன்பு updated array உடன் `setSquares`-ஐ call செய்ததை நினைவில் கொள்ளுங்கள்; இப்போது அது updated `squares` array-ஐ `onPlay`-க்கு pass செய்கிறது.

re-render trigger செய்ய `handlePlay` function `Game`-ன் state-ஐ update செய்ய வேண்டும்; ஆனால் call செய்யக்கூடிய `setSquares` function இனி இல்லை--இந்த தகவலை சேமிக்க இப்போது `history` state variable-ஐப் பயன்படுத்துகிறீர்கள். updated `squares` array-ஐ புதிய history entry ஆக append செய்து `history`-ஐ update செய்ய விரும்புவீர்கள். Board முன்பு செய்தது போல `xIsNext`-ஐயும் toggle செய்ய வேண்டும்:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

இங்கே, `[...history, nextSquares]` என்பது `history`-இல் உள்ள எல்லா item-களையும் தொடர்ந்து `nextSquares`-ஐக் கொண்ட புதிய array ஒன்றை உருவாக்குகிறது. (`...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)-ஐ "`history`-இல் உள்ள எல்லா item-களையும் enumerate செய்" என்று படிக்கலாம்.)

உதாரணமாக, `history` `[[null,null,null], ["X",null,null]]` ஆகவும் `nextSquares` `["X",null,"O"]` ஆகவும் இருந்தால், புதிய `[...history, nextSquares]` array `[[null,null,null], ["X",null,null], ["X",null,"O"]]` ஆக இருக்கும்.

இந்த கட்டத்தில், state-ஐ `Game` component-இல் வாழுமாறு நகர்த்திவிட்டீர்கள்; refactor-க்கு முன்பு இருந்தது போல UI முழுமையாக வேலை செய்ய வேண்டும். இந்த கட்டத்தில் code இவ்வாறு இருக்க வேண்டும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### முந்தைய move-களை காட்டுதல் {/*showing-the-past-moves*/}

tic-tac-toe game-ன் history-யை நீங்கள் record செய்கிறீர்கள் என்பதால், இப்போது வீரருக்கு முந்தைய move-களின் பட்டியலைக் காட்டலாம்.

`<button>` போன்ற React element-கள் சாதாரண JavaScript object-கள்; அவற்றை உங்கள் application-இல் pass செய்யலாம். React-இல் பல item-களை render செய்ய, React element-களின் array-ஐப் பயன்படுத்தலாம்.

state-இல் ஏற்கனவே `history` move-களின் array உள்ளது, எனவே இப்போது அதை React element-களின் array-ஆக transform செய்ய வேண்டும். JavaScript-இல் ஒரு array-ஐ மற்றொரு array-ஆக transform செய்ய, [array `map` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)-ஐப் பயன்படுத்தலாம்:

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

உங்கள் move `history`-யை screen-இல் உள்ள button-களை பிரதிநிதித்துவப்படுத்தும் React element-களாக transform செய்ய `map`-ஐப் பயன்படுத்தி, முந்தைய move-களுக்கு "jump" செய்ய button பட்டியலைக் காட்டுவீர்கள். Game component-இல் `history` மீது `map` செய்வோம்:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

உங்கள் code எப்படி இருக்க வேண்டும் என்பதை கீழே பார்க்கலாம். developer tools console-இல் இதுபோன்ற error ஒன்றைக் காண வேண்டும் என்பதை கவனியுங்கள்:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

இந்த error-ஐ அடுத்த பிரிவில் சரிசெய்வீர்கள்.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

`map`-க்கு pass செய்த function-க்குள் `history` array வழியாக iterate செய்யும்போது, `squares` argument `history`-ன் ஒவ்வொரு element வழியாகவும், `move` argument ஒவ்வொரு array index வழியாகவும் செல்கிறது: `0`, `1`, `2`, …. (பெரும்பாலான சூழல்களில் actual array element-கள் தேவைப்படும்; ஆனால் move பட்டியலை render செய்ய index-கள் மட்டுமே தேவை.)

tic-tac-toe game history-யின் ஒவ்வொரு move-க்கும், button `<button>` கொண்ட list item `<li>` ஒன்றை உருவாக்குகிறீர்கள். அந்த button-க்கு `jumpTo` என்ற function-ஐ call செய்யும் `onClick` handler உள்ளது (அதை இன்னும் implement செய்யவில்லை).

இப்போது game-இல் நடந்த move-களின் பட்டியலையும் developer tools console-இல் ஒரு error-யையும் பார்க்க வேண்டும். "key" error என்ன அர்த்தம் என்பதைக் பேசுவோம்.

### key ஒன்றைத் தேர்வு செய்தல் {/*picking-a-key*/}

list ஒன்றை render செய்யும்போது, render செய்யப்பட்ட ஒவ்வொரு list item பற்றிய சில தகவல்களை React சேமிக்கிறது. list-ஐ update செய்யும்போது, என்ன மாறியுள்ளது என்பதை React தீர்மானிக்க வேண்டும். நீங்கள் list item-களைச் சேர்த்திருக்கலாம், நீக்கியிருக்கலாம், re-arrange செய்திருக்கலாம், அல்லது update செய்திருக்கலாம்.

இதிலிருந்து transition ஆகிறது என்று நினைத்துப் பாருங்கள்:

```html
<li>Alexa: 7 task-கள் மீதம்</li>
<li>Ben: 5 task-கள் மீதம்</li>
```

இதற்கு:

```html
<li>Ben: 9 task-கள் மீதம்</li>
<li>Claudia: 8 task-கள் மீதம்</li>
<li>Alexa: 5 task-கள் மீதம்</li>
```

updated count-களுக்கு கூடுதலாக, இதைப் படிக்கும் மனிதர் நீங்கள் Alexa மற்றும் Ben-ன் ordering-ஐ swap செய்து, Alexa மற்றும் Ben இடையே Claudia-வை insert செய்தீர்கள் என்று கூறலாம். ஆனால் React ஒரு computer program; நீங்கள் நினைத்தது என்ன என்று அதற்கு தெரியாது. எனவே ஒவ்வொரு list item-ஐ அதன் sibling-களிலிருந்து வேறுபடுத்த ஒவ்வொரு list item-க்கும் _key_ property குறிப்பிட வேண்டும். உங்கள் data database-இலிருந்து வந்திருந்தால், Alexa, Ben, மற்றும் Claudia-வின் database ID-களை key-களாகப் பயன்படுத்தலாம்.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} task-கள் மீதம்
</li>
```

list re-render செய்யப்படும் போது, React ஒவ்வொரு list item-ன் key-யையும் எடுத்து, matching key-க்காக முந்தைய list-ன் item-களை தேடுகிறது. தற்போதைய list-இல் முன்பு இல்லாத key இருந்தால், React component ஒன்றை உருவாக்குகிறது. முந்தைய list-இல் இருந்த key தற்போதைய list-இல் இல்லாவிட்டால், React முந்தைய component-ஐ destroy செய்கிறது. இரண்டு key-கள் match ஆனால், தொடர்புடைய component நகர்த்தப்படுகிறது.

Key-கள் ஒவ்வொரு component-ன் identity பற்றி React-க்கு தெரிவிக்கின்றன; இதனால் re-render-களுக்கிடையே state-ஐ React பராமரிக்க முடியும். component-ன் key மாறினால், component destroy செய்யப்பட்டு புதிய state உடன் மீண்டும் உருவாக்கப்படும்.

`key` என்பது React-இல் சிறப்பு மற்றும் reserved property. element உருவாக்கப்படும் போது, React `key` property-யை extract செய்து, returned element-இல் நேரடியாக key-யைச் சேமிக்கிறது. `key` props ஆக pass செய்யப்படுவது போல தோன்றினாலும், எந்த component-களை update செய்ய வேண்டும் என்பதைத் தீர்மானிக்க React தானாக `key`-ஐப் பயன்படுத்துகிறது. parent குறிப்பிட்ட `key` என்ன என்று ஒரு component கேட்க வழியில்லை.

**dynamic list-களை உருவாக்கும் போதெல்லாம் சரியான key-களை assign செய்வது வலுவாக பரிந்துரைக்கப்படுகிறது.** பொருத்தமான key இல்லையெனில், அது கிடைக்குமாறு உங்கள் data-வை restructure செய்வதை கருதலாம்.

key குறிப்பிடப்படாவிட்டால், React error report செய்து, default ஆக array index-ஐ key ஆகப் பயன்படுத்தும். list item-களை re-order செய்யும்போது அல்லது list item-களை insert/remove செய்யும்போது array index-ஐ key ஆகப் பயன்படுத்துவது பிரச்சினை தரும். `key={i}`-ஐ வெளிப்படையாக pass செய்வது error-ஐ அமைதிப்படுத்தும்; ஆனால் array index-களுக்கே உள்ள அதே பிரச்சினைகள் இதற்கும் உண்டு, பெரும்பாலான சூழல்களில் இது பரிந்துரைக்கப்படாது.

Key-கள் global ஆக unique ஆக வேண்டியதில்லை; component-களுக்கும் அவற்றின் sibling-களுக்கும் இடையே unique இருந்தால் போதும்.

### time travel-ஐ implement செய்தல் {/*implementing-time-travel*/}

tic-tac-toe game history-யில், ஒவ்வொரு முந்தைய move-க்கும் அதனுடன் தொடர்புடைய unique ID உள்ளது: அது move-ன் sequential number. Move-கள் ஒருபோதும் re-order, delete, அல்லது நடுவில் insert செய்யப்படாது, எனவே move index-ஐ key ஆகப் பயன்படுத்துவது safe.

`Game` function-இல், `<li key={move}>` என key-ஐச் சேர்க்கலாம்; rendered game-ஐ reload செய்தால், React-ன் "key" error மறைய வேண்டும்:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

`jumpTo`-ஐ implement செய்ய முன், பயனர் தற்போது எந்த step-ஐப் பார்க்கிறார் என்பதை `Game` component track செய்ய வேண்டும். இதைச் செய்ய, default `0` உடன் `currentMove` என்ற புதிய state variable-ஐ define செய்யுங்கள்:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

அடுத்து, அந்த `currentMove`-ஐ update செய்ய `Game`-க்குள் உள்ள `jumpTo` function-ஐ update செய்யுங்கள். `currentMove` மாற்றப்படும் number even ஆக இருந்தால், `xIsNext`-ஐ `true` ஆக அமைப்பீர்கள்.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

square ஒன்றை click செய்யும்போது call செய்யப்படும் `Game`-ன் `handlePlay` function-இல் இப்போது இரண்டு மாற்றங்களைச் செய்வீர்கள்.

- நீங்கள் "காலத்தில் பின்சென்று" அந்த புள்ளியிலிருந்து புதிய move செய்தால், அந்த புள்ளிவரை உள்ள history-யை மட்டுமே வைத்திருக்க விரும்புகிறீர்கள். `history`-யில் உள்ள எல்லா item-களுக்குப் பிறகு (`...` spread syntax) `nextSquares`-ஐச் சேர்ப்பதற்கு பதிலாக, `history.slice(0, currentMove + 1)`-இல் உள்ள எல்லா item-களுக்குப் பிறகு அதைச் சேர்ப்பீர்கள்; இதனால் பழைய history-யின் அந்த பகுதியை மட்டுமே வைத்திருப்பீர்கள்.
- ஒவ்வொரு move செய்யப்பட்ட போதும், latest history entry-ஐச் சுட்டுமாறு `currentMove`-ஐ update செய்ய வேண்டும்.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

இறுதியாக, எப்போதும் final move-ஐ render செய்வதற்கு பதிலாக, தற்போது தேர்ந்தெடுக்கப்பட்ட move-ஐ render செய்ய `Game` component-ஐ மாற்றுவீர்கள்:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

game history-யில் எந்த step-ஐயாவது click செய்தால், அந்த step நடந்த பிறகு board எப்படி இருந்தது என்பதை காட்ட tic-tac-toe board உடனடியாக update ஆக வேண்டும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### இறுதி cleanup {/*final-cleanup*/}

code-ஐ மிகவும் நெருக்கமாகப் பார்த்தால், `currentMove` even ஆக இருக்கும் போது `xIsNext === true`, மற்றும் `currentMove` odd ஆக இருக்கும் போது `xIsNext === false` என்பதை கவனிக்கலாம். வேறு வார்த்தைகளில், `currentMove`-ன் மதிப்பு தெரிந்தால், `xIsNext` என்ன இருக்க வேண்டும் என்பதை எப்போதும் கணக்கிடலாம்.

இரண்டையும் state-இல் சேமிக்க எந்த காரணமும் இல்லை. உண்மையில், redundant state-ஐ எப்போதும் தவிர்க்க முயலுங்கள். state-இல் சேமிப்பதை தெளிவுப்படுத்துவது bug-களை குறைத்து, code-ஐப் புரிந்துகொள்வதை உதவும். `xIsNext`-ஐ தனி state variable ஆக சேமிக்காமல், `currentMove` அடிப்படையில் கணக்கிடுமாறு `Game`-ஐ மாற்றுங்கள்:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

`xIsNext` state declaration அல்லது `setXIsNext` call-கள் இனி தேவையில்லை. இப்போது component-களை code செய்யும்போது தவறு செய்தாலும், `xIsNext` `currentMove`-உடன் sync இழக்கும் வாய்ப்பு இல்லை.

### முடிவுரை {/*wrapping-up*/}

வாழ்த்துகள்! நீங்கள் இத்தகைய tic-tac-toe game ஒன்றை உருவாக்கியுள்ளீர்கள்:

- tic-tac-toe விளையாட அனுமதிக்கிறது,
- ஒரு வீரர் game-ஐ வென்றதை காட்டுகிறது,
- game முன்னேறும் போது game history-யைச் சேமிக்கிறது,
- வீரர்கள் game history-யை review செய்து game board-ன் முந்தைய version-களைப் பார்க்க அனுமதிக்கிறது.

நல்ல வேலை! React எப்படி வேலை செய்கிறது என்பது பற்றி இப்போது உங்களுக்கு நல்ல பிடி கிடைத்திருக்கும் என நம்புகிறோம்.

இறுதி முடிவைப் இங்கே பாருங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'வெற்றி பெற்றவர்: ' + winner;
  } else {
    status = 'அடுத்த வீரர்: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'நகர்வு #' + move + '-க்கு செல்';
    } else {
      description = 'game தொடக்கத்துக்கு செல்';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

உங்களிடம் கூடுதல் நேரம் இருந்தாலோ, புதிய React திறன்களைப் பயிற்சி செய்ய விரும்பினாலோ, tic-tac-toe game-க்கு செய்யக்கூடிய சில மேம்பாட்டு யோசனைகள் இங்கே; சிரமம் அதிகரிக்கும் வரிசையில் பட்டியலிடப்பட்டுள்ளன:

1. தற்போதைய move-க்கு மட்டும், button-க்கு பதிலாக "நீங்கள் நகர்வு #... இல் உள்ளீர்கள்" என்று காட்டுங்கள்.
1. square-களை hardcode செய்வதற்கு பதிலாக இரண்டு loop-களைப் பயன்படுத்த `Board`-ஐ rewrite செய்யுங்கள்.
1. move-களை ascending அல்லது descending order-இல் sort செய்ய அனுமதிக்கும் toggle button ஒன்றைச் சேருங்கள்.
1. யாராவது வென்றால், வெற்றிக்கு காரணமான மூன்று square-களை highlight செய்யுங்கள் (யாரும் வெல்லாவிட்டால், முடிவு draw என்று message காட்டுங்கள்).
1. move history list-இல் ஒவ்வொரு move-க்கான location-ஐ (row, col) format-இல் காட்டுங்கள்.

இந்த tutorial முழுவதும், elements, components, props, மற்றும் state உட்பட பல React concept-களைத் தொட்டுள்ளீர்கள். game உருவாக்கும்போது இந்த concept-கள் எப்படி வேலை செய்கின்றன என்பதை பார்த்துள்ளீர்கள்; app-ன் UI உருவாக்கும்போது இதே React concept-கள் எப்படி வேலை செய்கின்றன என்பதைப் பார்க்க [React-இல் சிந்தித்தல்](/learn/thinking-in-react)-ஐப் பாருங்கள்.
