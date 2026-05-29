---
title: "react.dev அறிமுகம்"
author: Dan Abramov and Rachel Nabors
date: 2023/03/16
description: இன்று React மற்றும் அதன் documentation-க்கான புதிய இல்லமான react.dev-ஐ அறிமுகப்படுத்துவதில் நாங்கள் மகிழ்ச்சியடைகிறோம். இந்த post-இல், புதிய site-ஐ உங்களுக்கு சுற்றிக் காட்ட விரும்புகிறோம்.
---

March 16, 2023 அன்று [Dan Abramov](https://bsky.app/profile/danabra.mov) and [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

இன்று React மற்றும் அதன் documentation-க்கான புதிய இல்லமான [react.dev](https://react.dev)-ஐ அறிமுகப்படுத்துவதில் நாங்கள் மகிழ்ச்சியடைகிறோம். இந்த post-இல், புதிய site-ஐ உங்களுக்கு சுற்றிக் காட்ட விரும்புகிறோம்.

</Intro>

---

## சுருக்கமாக {/*tldr*/}

* புதிய React site ([react.dev](https://react.dev)) function components மற்றும் Hooks மூலம் modern React-ஐ கற்றுக்கொடுக்கும்.
* Diagrams, illustrations, challenges, மேலும் 600-க்கும் அதிகமான புதிய interactive examples-ஐ சேர்த்துள்ளோம்.
* முந்தைய React documentation site இப்போது [legacy.reactjs.org](https://legacy.reactjs.org)-க்கு நகர்த்தப்பட்டுள்ளது.

## புதிய site, புதிய domain, புதிய homepage {/*new-site-new-domain-new-homepage*/}

முதலில், சில சிறிய நிர்வாக விஷயங்கள்.

புதிய docs launch-ஐக் கொண்டாடவும், அதைவிட முக்கியமாக பழைய மற்றும் புதிய content-ஐ தெளிவாகப் பிரிக்கவும், நாங்கள் குறுகிய [react.dev](https://react.dev) domain-க்கு நகர்ந்துள்ளோம். பழைய [reactjs.org](https://reactjs.org) domain இப்போது இங்கே redirect செய்யும்.

பழைய React docs இப்போது [legacy.reactjs.org](https://legacy.reactjs.org)-இல் archived செய்யப்பட்டுள்ளது. "Web-ஐ break" செய்வதைத் தவிர்க்க, பழைய content-க்கு உள்ள எல்லா existing links-மும் தானாக அங்கே redirect செய்யும்; ஆனால் legacy site-க்கு இனி அதிக updates கிடைக்காது.

நம்பினாலும் நம்பாவிட்டாலும், React விரைவில் பத்து வயதாகிறது. JavaScript ஆண்டுகளில் அது முழு நூற்றாண்டு போல! இன்று user interfaces உருவாக்க React ஏன் சிறந்த வழி என்று நாங்கள் நினைக்கிறோம் என்பதைப் பிரதிபலிக்க [React homepage-ஐ புதுப்பித்துள்ளோம்](https://react.dev), மேலும் modern React-based frameworks-ஐ தெளிவாகக் குறிப்பிட getting started guides-ஐ update செய்துள்ளோம்.

புதிய homepage-ஐ இன்னும் பார்க்கவில்லை என்றால், பாருங்கள்!

## Hooks உடன் modern React-ஐ முழுமையாக ஏற்றுக்கொள்வது {/*going-all-in-on-modern-react-with-hooks*/}

2018-இல் React Hooks-ஐ வெளியிட்டபோது, Hooks docs வாசகர் class components-ஐ ஏற்கனவே அறிந்தவர் என்று கருதியது. இதனால் community Hooks-ஐ மிக விரைவாக ஏற்றுக்கொண்டது; ஆனால் சில காலத்திற்குப் பிறகு பழைய docs புதிய வாசகர்களுக்கு சரியாக உதவவில்லை. புதிய வாசகர்கள் React-ஐ இரண்டு முறை கற்றுக்கொள்ள வேண்டியிருந்தது: முதலில் class components உடன், பின்னர் மீண்டும் Hooks உடன்.

**புதிய docs React-ஐ ஆரம்பத்திலிருந்தே Hooks உடன் கற்றுக்கொடுக்கும்.** Docs இரண்டு முக்கிய பிரிவுகளாகப் பிரிக்கப்பட்டுள்ளன:

* **[Learn React](/learn)** என்பது React-ஐ அடிப்படையிலிருந்து கற்றுக்கொடுக்கும் self-paced course.
* **[API Reference](/reference)** ஒவ்வொரு React API-க்கும் விவரங்களையும் usage examples-ஐயும் வழங்குகிறது.

ஒவ்வொரு பிரிவிலும் என்ன கிடைக்கும் என்பதை நெருக்கமாகப் பார்ப்போம்.

<Note>

Hook-based equivalent இன்னும் இல்லாத சில அரிதான class component use cases இன்னும் உள்ளன. Class components தொடர்ந்து support செய்யப்படுகின்றன, மேலும் புதிய site-ன் [Legacy API](/reference/react/legacy) பிரிவில் documented செய்யப்பட்டுள்ளன.

</Note>

## Quick start {/*quick-start*/}

Learn பிரிவு [Quick Start](/learn) page-இல் தொடங்குகிறது. அது React-க்கு ஒரு குறுகிய அறிமுக சுற்றுப்பயணம். Components, props, state போன்ற concepts-க்கான syntax-ஐ அறிமுகப்படுத்துகிறது; ஆனால் அவற்றை எப்படி பயன்படுத்துவது பற்றி அதிக விவரத்திற்குள் செல்லாது.

செய்து கற்றுக்கொள்வதை நீங்கள் விரும்பினால், அடுத்ததாக [Tic-Tac-Toe Tutorial](/learn/tutorial-tic-tac-toe)-ஐப் பார்க்க பரிந்துரைக்கிறோம். தினமும் பயன்படுத்தும் திறன்களை கற்றுக்கொடுக்கும் போது, React கொண்டு ஒரு சிறிய game கட்டுவதில் அது உங்களை வழிநடத்தும். நீங்கள் கட்டப் போவது இதுதான்:

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
    status = 'வெற்றியாளர்: ' + winner;
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
      description = 'நகர்வு #' + move + 'க்கு செல்';
    } else {
      description = 'Game தொடக்கத்துக்கு செல்';
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

[Thinking in React](/learn/thinking-in-react)-ஐயும் சிறப்பாகக் குறிப்பிட விரும்புகிறோம்--எங்களில் பலருக்கு React "click" ஆகச் செய்த tutorial அதுதான். **இந்த இரண்டு classic tutorials-ையும் function components மற்றும் Hooks பயன்படுத்த update செய்துள்ளோம்,** ஆகவே அவை புதியவை போலவே பயனுள்ளவை.

<Note>

மேலுள்ள example ஒரு *sandbox*. Site முழுவதும் பல sandboxes-ஐ சேர்த்துள்ளோம்--600-க்கும் அதிகம்! எந்த sandbox-யையும் edit செய்யலாம், அல்லது தனி tab-இல் திறக்க மேல் வலது மூலையில் உள்ள "Fork" அழுத்தலாம். Sandboxes React APIs-ஐ விரைவாக விளையாடிப் பார்க்கவும், உங்கள் ideas-ஐ explore செய்யவும், உங்கள் புரிதலைச் சரிபார்க்கவும் உதவுகின்றன.

</Note>

## React-ஐ படிப்படியாக கற்றுக்கொள்ளுங்கள் {/*learn-react-step-by-step*/}

உலகில் அனைவருக்கும் React-ஐ இலவசமாக, தங்கள் வேகத்தில் கற்றுக்கொள்ள சம வாய்ப்பு இருக்க வேண்டும் என்று நாங்கள் விரும்புகிறோம்.

அதனால்தான் Learn பிரிவு chapters-ஆகப் பிரிக்கப்பட்ட self-paced course போல ஒழுங்குபடுத்தப்பட்டுள்ளது. முதல் இரண்டு chapters React-ன் fundamentals-ஐ விவரிக்கின்றன. நீங்கள் React-க்கு புதியவராக இருந்தால், அல்லது நினைவில் புதுப்பிக்க விரும்பினால், இங்கிருந்து தொடங்குங்கள்:

- **[Describing the UI](/learn/describing-the-ui)** components கொண்டு தகவலை எப்படி display செய்வது என்பதை கற்றுக்கொடுக்கும்.
- **[Adding Interactivity](/learn/adding-interactivity)** user input-க்கு பதிலாக screen-ஐ எப்படி update செய்வது என்பதை கற்றுக்கொடுக்கும்.

அடுத்த இரண்டு chapters இன்னும் advanced; சிக்கலான பகுதிகளைப் பற்றிய ஆழமான புரிதலை அளிக்கும்:

- **[Managing State](/learn/managing-state)** உங்கள் app complexity-யில் வளரும்போது logic-ஐ எப்படி ஒழுங்குபடுத்துவது என்பதை கற்றுக்கொடுக்கும்.
- **[Escape Hatches](/learn/escape-hatches)** React-க்கு "வெளியே செல்ல" எப்படி முடியும், எப்போது அது மிகவும் பொருத்தமானது என்பதை கற்றுக்கொடுக்கும்.

ஒவ்வொரு chapter-மும் தொடர்புடைய பல pages-ஐ கொண்டுள்ளது. அவற்றில் பெரும்பாலானவை ஒரு குறிப்பிட்ட skill அல்லது technique-ஐ கற்றுக்கொடுக்கும்--உதாரணமாக [Writing Markup with JSX](/learn/writing-markup-with-jsx), [Updating Objects in State](/learn/updating-objects-in-state), அல்லது [Sharing State Between Components](/learn/sharing-state-between-components). சில pages ஒரு idea-வை விளக்குவதில் கவனம் செலுத்துகின்றன--[Render and Commit](/learn/render-and-commit), அல்லது [State as a Snapshot](/learn/state-as-a-snapshot) போல. மேலும் [You Might Not Need an Effect](/learn/you-might-not-need-an-effect) போன்ற சில pages, இந்த ஆண்டுகளில் நாங்கள் கற்றுக்கொண்டவற்றின் அடிப்படையில் எங்கள் பரிந்துரைகளைப் பகிர்கின்றன.

இந்த chapters-ஐ கட்டாயம் வரிசையாகப் படிக்க வேண்டியதில்லை. இதற்கெல்லாம் யாரிடம் நேரம் இருக்கிறது?! ஆனால் படிக்கலாம். Learn பிரிவில் உள்ள pages, அதற்கு முன் உள்ள pages அறிமுகப்படுத்திய concepts-ஐ மட்டுமே சார்ந்துள்ளன. அதை ஒரு புத்தகமாகப் படிக்க விரும்பினால், தாராளமாகப் படியுங்கள்!

### Challenges மூலம் உங்கள் புரிதலைச் சரிபாருங்கள் {/*check-your-understanding-with-challenges*/}

Learn பிரிவில் உள்ள பெரும்பாலான pages, உங்கள் புரிதலைச் சரிபார்க்க சில challenges உடன் முடிவடைகின்றன. உதாரணமாக, [Conditional Rendering](/learn/conditional-rendering#challenges) பற்றிய page-இலிருந்து சில challenges இங்கே உள்ளன.

அவற்றை இப்போதே solve செய்ய வேண்டியதில்லை! நீங்கள் *உண்மையிலேயே* விரும்பினால் தவிர.

<Challenges noTitle={true}>

#### முடிக்கப்படாத items-க்கு `? :` மூலம் icon காட்டுங்கள் {/*show-an-icon-for-incomplete-items-with--*/}

`isPacked` `true` அல்லாவிட்டால் ❌ render செய்ய conditional operator (`cond ? a : b`)-ஐப் பயன்படுத்துங்கள்.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&` மூலம் item importance-ஐ காட்டுங்கள் {/*show-the-item-importance-with-*/}

இந்த example-இல், ஒவ்வொரு `Item`-க்கும் numerical `importance` prop கிடைக்கிறது. Zero அல்லாத importance கொண்ட items-க்கு மட்டும் italics-இல் "_(முக்கியத்துவம்: X)_" render செய்ய `&&` operator-ஐப் பயன்படுத்துங்கள். உங்கள் item list இறுதியில் இதுபோல் இருக்க வேண்டும்:

* விண்வெளி உடை _(முக்கியத்துவம்: 9)_
* தங்க இலை கொண்ட தலைக்கவசம்
* டாமின் புகைப்படம் _(முக்கியத்துவம்: 6)_

இரண்டு labels-க்கும் இடையில் ஒரு space சேர்க்க மறக்காதீர்கள்!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="விண்வெளி உடை"
        />
        <Item
          importance={0}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          importance={6}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

இது போதுமானது:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(முக்கியத்துவம்: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="விண்வெளி உடை"
        />
        <Item
          importance={0}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          importance={6}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance` `0` ஆக இருந்தால் result ஆக `0` render ஆகாமல் இருக்க, `importance && ...` என்பதற்குப் பதிலாக `importance > 0 && ...` என்று எழுத வேண்டும் என்பதை கவனியுங்கள்!

இந்த solution-இல், name மற்றும் importance label இடையில் space insert செய்ய இரண்டு தனித்தனி conditions பயன்படுத்தப்படுகின்றன. மாற்றாக, leading space கொண்ட Fragment பயன்படுத்தலாம்: `importance > 0 && <> <i>...</i></>` அல்லது `<i>`-க்குள் உடனே space சேர்க்கலாம்:  `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

இடது கீழ் மூலையில் உள்ள "Show solution" button-ஐ கவனியுங்கள். உங்களைத் தானே சரிபார்க்க விரும்பினால் அது பயனுள்ளது!

### Diagrams மற்றும் illustrations மூலம் intuition உருவாக்குங்கள் {/*build-an-intuition-with-diagrams-and-illustrations*/}

Code மற்றும் வார்த்தைகள் மட்டும் கொண்டு ஏதாவது ஒன்றை விளக்க முடியாதபோது, intuition உருவாக உதவும் diagrams-ஐ சேர்த்துள்ளோம். உதாரணமாக, [Preserving and Resetting State](/learn/preserving-and-resetting-state)-இலிருந்து ஒரு diagram இங்கே:

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="மூன்று பகுதிகளைக் கொண்ட diagram; ஒவ்வொரு பகுதியுக்கும் இடையில் arrow transition உள்ளது. முதல் பகுதியில் 'div' என label செய்யப்பட்ட React component உள்ளது; அதற்கு 'section' என label செய்யப்பட்ட ஒரு child உள்ளது; அதற்கு 'Counter' என label செய்யப்பட்ட ஒரு child உள்ளது; அதில் value 3 கொண்ட 'count' state bubble உள்ளது. நடுப்பகுதியில் அதே 'div' parent உள்ளது, ஆனால் child components இப்போது delete செய்யப்பட்டுள்ளன; அது மஞ்சள் 'proof' image மூலம் காட்டப்படுகிறது. மூன்றாம் பகுதியில் மீண்டும் அதே 'div' parent உள்ளது; இப்போது மஞ்சளில் highlight செய்யப்பட்ட புதிய child 'div' உள்ளது; அதற்கும் மஞ்சளில் highlight செய்யப்பட்ட புதிய child 'Counter' உள்ளது; அதில் value 0 கொண்ட 'count' state bubble உள்ளது.">

`section` `div` ஆக மாறும்போது, `section` delete செய்யப்படுகிறது; புதிய `div` சேர்க்கப்படுகிறது

</Diagram>

Docs முழுவதும் சில illustrations-ஐயும் காண்பீர்கள்--[browser screen-ஐ paint செய்வது](/learn/render-and-commit#epilogue-browser-paint) பற்றிய ஒன்று இதோ:

<Illustration alt="'Card element உடன் still life' ஒன்றை paint செய்யும் browser." src="/images/docs/illustrations/i_browser-paint.png" />

இந்த depiction 100% அறிவியல் ரீதியாகத் துல்லியமானது என்று browser vendors உடன் உறுதிப்படுத்தியுள்ளோம்.

## புதிய, விரிவான API Reference {/*a-new-detailed-api-reference*/}

[API Reference](/reference/react)-இல், ஒவ்வொரு React API-க்கும் இப்போது தனிப்பட்ட page உள்ளது. இதில் எல்லா வகையான APIs-மும் அடங்கும்:

- [`useState`](/reference/react/useState) போன்ற built-in Hooks.
- [`<Suspense>`](/reference/react/Suspense) போன்ற built-in components.
- [`<input>`](/reference/react-dom/components/input) போன்ற built-in browser components.
- [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream) போன்ற framework-oriented APIs.
- [`memo`](/reference/react/memo) போன்ற பிற React APIs.

ஒவ்வொரு API page-மும் குறைந்தது இரண்டு பகுதிகளாகப் பிரிக்கப்பட்டிருப்பதை கவனிப்பீர்கள்: *Reference* மற்றும் *Usage*.

[Reference](/reference/react/useState#reference) அதன் arguments மற்றும் return values-ஐ list செய்வதன் மூலம் formal API signature-ஐ விவரிக்கிறது. அது சுருக்கமானது, ஆனால் அந்த API-க்கு பழக்கம் இல்லையெனில் கொஞ்சம் abstract ஆக உணரப்படலாம். API என்ன செய்கிறது என்பதை அது விளக்குகிறது, ஆனால் அதை எப்படி பயன்படுத்துவது என்பதை அல்ல.

[Usage](/reference/react/useState#usage) இந்த API-யை நடைமுறையில் ஏன், எப்படி பயன்படுத்துவீர்கள் என்பதை, ஒரு சக ஊழியர் அல்லது நண்பர் விளக்குவது போல காட்டுகிறது. **ஒவ்வொரு API-யும் React team நினைத்த canonical scenarios-ல் எப்படி பயன்படுத்தப்பட வேண்டும் என்பதைக் காட்டுகிறது.** Color-coded snippets, வெவ்வேறு APIs-ஐ ஒன்றாகப் பயன்படுத்தும் examples, மேலும் copy-paste செய்யக்கூடிய recipes-ஐ சேர்த்துள்ளோம்:

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### Counter (number) {/*counter-number*/}

இந்த example-இல், `count` state variable ஒரு number-ஐ வைத்திருக்கிறது. Button-ஐ click செய்தால் அது increment ஆகும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      நீங்கள் என்னை {count} முறை அழுத்தினீர்கள்
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Text field (string) {/*text-field-string*/}

இந்த example-இல், `text` state variable ஒரு string-ஐ வைத்திருக்கிறது. நீங்கள் type செய்யும்போது, `handleChange` browser input DOM element-இலிருந்து latest input value-ஐ வாசித்து, state-ஐ update செய்ய `setText`-ஐ call செய்கிறது. இதனால் current `text`-ஐ கீழே display செய்ய முடியும்.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('வணக்கம்');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>நீங்கள் type செய்தது: {text}</p>
      <button onClick={() => setText('வணக்கம்')}>
        மீட்டமை
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (boolean) {/*checkbox-boolean*/}

இந்த example-இல், `liked` state variable ஒரு boolean-ஐ வைத்திருக்கிறது. Input-ஐ click செய்தால், browser checkbox input checked ஆக உள்ளதா என்பதை வைத்து `setLiked` `liked` state variable-ஐ update செய்கிறது. Checkbox-க்கு கீழே உள்ள text-ஐ render செய்ய `liked` variable பயன்படுத்தப்படுகிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        இதை நான் விரும்பினேன்
      </label>
      <p>நீங்கள் இதை {liked ? 'விரும்பினீர்கள்' : 'விரும்பவில்லை'}.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (two variables) {/*form-two-variables*/}

ஒரே component-இல் ஒன்றுக்கு மேற்பட்ட state variables-ஐ declare செய்யலாம். ஒவ்வொரு state variable-உம் முற்றிலும் independent ஆகும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('டெய்லர்');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        வயதை அதிகரிக்கவும்
      </button>
      <p>வணக்கம், {name}. உங்கள் வயது {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

சில API pages-இல் [Troubleshooting](/reference/react/useEffect#troubleshooting) (பொதுவான problems-க்காக) மற்றும் [Alternatives](/reference/react-dom/findDOMNode#alternatives) (deprecated APIs-க்காக) ஆகியவையும் உள்ளன.

இந்த அணுகுமுறை, API reference-ஐ ஒரு argument-ஐ lookup செய்யும் வழியாக மட்டுமல்லாமல், குறிப்பிட்ட API கொண்டு நீங்கள் செய்யக்கூடிய பல்வேறு விஷயங்களையும் அது பிற APIs-உடன் எப்படி இணைகிறது என்பதையும் பார்க்கும் வழியாகவும் பயனுள்ளதாக ஆக்கும் என்று நம்புகிறோம்.

## அடுத்து என்ன? {/*whats-next*/}

எங்கள் சிறிய tour இத்துடன் முடிந்தது! புதிய website-ஐ சுற்றிப் பாருங்கள், உங்களுக்கு பிடித்தவை அல்லது பிடிக்காதவை என்ன என்பதைப் பாருங்கள், மேலும் எங்கள் [issue tracker](https://github.com/reactjs/react.dev/issues)-இல் feedback-ஐத் தொடர்ந்து அனுப்புங்கள்.

இந்த project ship ஆக நீண்ட நேரம் எடுத்தது என்பதை நாங்கள் ஏற்றுக்கொள்கிறோம். React community-க்கு உரிய உயர்ந்த quality bar-ஐ பராமரிக்க விரும்பினோம். இந்த docs-ஐ எழுதிக்கொண்டிருந்தபோதும் examples அனைத்தையும் உருவாக்கிக்கொண்டிருந்தபோதும், எங்களுடைய சில விளக்கங்களில் mistakes, React-இல் bugs, மேலும் இப்போது address செய்ய வேலை செய்து கொண்டிருக்கும் React design-இல் gaps கூட கண்டோம். புதிய documentation எதிர்காலத்தில் React தானும் இன்னும் உயர்ந்த bar-ஐ எட்ட உதவும் என்று நம்புகிறோம்.

Website-ன் content மற்றும் functionality-ஐ விரிவாக்க வேண்டும் என்ற உங்கள் பல கோரிக்கைகளை கேட்டுள்ளோம், உதாரணமாக:

- அனைத்து examples-க்கும் TypeScript version வழங்குதல்;
- Updated performance, testing, மற்றும் accessibility guides உருவாக்குதல்;
- React Server Components-ஐ support செய்யும் frameworks-இலிருந்து தனியாக document செய்தல்;
- புதிய docs-ஐ translate செய்ய எங்கள் international community-யுடன் பணிபுரிதல்;
- புதிய website-க்கு இல்லாத features-ஐ சேர்த்தல் (உதாரணமாக, இந்த blog-க்கான RSS).

இப்போது [react.dev](https://react.dev/) வெளியானதால், third-party React educational resources-ஐப் "catching up" செய்வதிலிருந்து, புதிய தகவல்களைச் சேர்ப்பதற்கும் புதிய website-ஐ மேலும் மேம்படுத்துவதற்கும் நாங்கள் கவனத்தை மாற்ற முடியும்.

React கற்றுக்கொள்ள இதைவிட நல்ல நேரம் எப்போதும் இல்லை என்று நாங்கள் நினைக்கிறோம்.

## இதில் யார் பணிபுரிந்தார்கள்? {/*who-worked-on-this*/}

React team-இல், [Rachel Nabors](https://twitter.com/rachelnabors/) project-ஐ வழிநடத்தினார் (மேலும் illustrations-ஐ வழங்கினார்), [Dan Abramov](https://bsky.app/profile/danabra.mov) curriculum-ஐ design செய்தார். Content-ன் பெரும்பகுதியை இருவரும் சேர்ந்து co-author செய்தனர்.

இவ்வளவு பெரிய project தனிமையில் நடக்காது. நன்றி சொல்ல வேண்டியவர்கள் பலர் உள்ளனர்!

[Sylwia Vargas](https://twitter.com/SylwiaVargas) எங்கள் examples-ஐ "foo/bar/baz" மற்றும் kittens-ஐத் தாண்டி, உலகம் முழுவதிலிருந்த scientists, artists, மற்றும் cities இடம்பெறும் வகையில் மாற்றினார். [Maggie Appleton](https://twitter.com/Mappletons) எங்கள் doodles-ஐ தெளிவான diagram system ஆக மாற்றினார்.

கூடுதல் writing contributions-க்காக [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), மற்றும் [Matt Carroll](https://twitter.com/mattcarrollcode) ஆகியோருக்கு நன்றி. தங்கள் ideas மற்றும் feedback-க்காக [Natalia Tepluhina](https://twitter.com/n_tepluhina) மற்றும் [Sebastian Markbåge](https://twitter.com/sebmarkbage) ஆகியோருக்கும் நன்றி தெரிவிக்க விரும்புகிறோம்.

Site design-க்காக [Dan Lebowitz](https://twitter.com/lebo)-க்கும், sandbox design-க்காக [Razvan Gradinar](https://dribbble.com/GradinarRazvan)-க்கும் நன்றி.

Development பக்கத்தில், prototype development-க்காக [Jared Palmer](https://twitter.com/jaredpalmer)-க்கு நன்றி. UI development-இல் தங்கள் support-க்காக [ThisDotLabs](https://www.thisdot.co/)-இலிருந்து [Dane Grant](https://twitter.com/danecando) மற்றும் [Dustin Goodman](https://twitter.com/dustinsgoodman)-க்கு நன்றி. Sandbox integration-இல் செய்த பணிக்காக [CodeSandbox](https://codesandbox.io/)-இலிருந்து [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), மற்றும் [Danilo Woznica](https://twitter.com/danilowoz)-க்கு நன்றி. Spot development மற்றும் design work செய்து, எங்கள் colors மற்றும் fine details-ஐ மெருகேற்றிய [Rick Hanlon](https://twitter.com/rickhanlonii)-க்கு நன்றி. Site-க்கு புதிய features சேர்த்து அதை maintain செய்ய உதவிய [Harish Kumar](https://www.strek.in/) மற்றும் [Luna Ruan](https://twitter.com/lunaruan)-க்கு நன்றி.

Alpha மற்றும் beta testing program-இல் பங்கேற்க தங்கள் நேரத்தை தன்னார்வமாக வழங்கிய அனைவருக்கும் மிகுந்த நன்றி. உங்கள் உற்சாகமும் மதிப்புமிக்க feedback-மும் இந்த docs-ஐ வடிவமைக்க எங்களுக்கு உதவின. React Conf 2021-இல் React docs-ஐப் பயன்படுத்திய அனுபவம் குறித்து talk வழங்கிய எங்கள் beta tester [Debbie O'Brien](https://twitter.com/debs_obrien)-க்கு சிறப்பு நன்றி.

இறுதியாக, இந்த முயற்சிக்கு உந்துதலாக இருந்த React community-க்கு நன்றி. நீங்கள் தான் நாங்கள் இதைச் செய்யும் காரணம்; நீங்கள் விரும்பும் எந்த user interface-ஐயும் React கொண்டு கட்ட புதிய docs உதவும் என்று நம்புகிறோம்.
