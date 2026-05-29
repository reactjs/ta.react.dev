---
title: "React 19 Upgrade Guide"
author: Ricky Hanlon
date: 2024/04/25
description: React 19-இல் சேர்க்கப்பட்ட improvements சில breaking changes-ஐ தேவைப்படுத்துகின்றன, ஆனால் upgrade முடிந்தவரை smooth ஆக இருக்க நாங்கள் வேலை செய்துள்ளோம்; இந்த changes பெரும்பாலான apps-ஐ பாதிக்காது என்று எதிர்பார்க்கிறோம். இந்த post-இல், apps மற்றும் libraries-ஐ React 19-க்கு upgrade செய்வதற்கான steps-ஐ உங்களுக்கு வழிகாட்டுகிறோம்.
---

April 25, 2024 அன்று [Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

React 19-இல் சேர்க்கப்பட்ட improvements சில breaking changes-ஐ தேவைப்படுத்துகின்றன, ஆனால் upgrade முடிந்தவரை smooth ஆக இருக்க நாங்கள் வேலை செய்துள்ளோம்; இந்த changes பெரும்பாலான apps-ஐ பாதிக்காது என்று எதிர்பார்க்கிறோம்.

</Intro>

<Note>

#### React 18.3-வும் வெளியிடப்பட்டுள்ளது {/*react-18-3*/}

React 19-க்கு upgrade செய்வதை மேம்படுத்த, 18.2-க்கு identical ஆக இருந்தாலும் deprecated APIs மற்றும் React 19-க்கு தேவையான பிற changes குறித்து warnings சேர்க்கும் `react@18.3` release ஒன்றை வெளியிட்டுள்ளோம்.

React 19-க்கு upgrade செய்வதற்கு முன் ஏதேனும் issues உள்ளனவா கண்டறிய உதவ, முதலில் React 18.3-க்கு upgrade செய்ய பரிந்துரைக்கிறோம்.

18.3-இல் உள்ள changes list-க்கு [Release Notes](https://github.com/facebook/react/blob/main/CHANGELOG.md#1830-april-25-2024)-ஐ பார்க்கவும்.

</Note>

இந்த post-இல், React 19-க்கு upgrade செய்வதற்கான steps-ஐ வழிகாட்டுகிறோம்:

- [நிறுவுதல்](#installing)
- [Codemods](#codemods)
- [Breaking changes (முறிக்கும் மாற்றங்கள்)](#breaking-changes)
- [புதிய deprecations](#new-deprecations)
- [கவனிக்கத்தக்க changes](#notable-changes)
- [TypeScript changes](#typescript-changes)
- [Changelog](#changelog)

React 19-ஐ test செய்ய உதவ விரும்பினால், இந்த upgrade guide-இல் உள்ள steps-ஐப் பின்பற்றி நீங்கள் சந்திக்கும் [issues-ஐ report](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D) செய்யுங்கள். React 19-இல் சேர்க்கப்பட்ட புதிய features list-க்கு [React 19 release post](/blog/2024/12/05/react-19)-ஐ பார்க்கவும்.

---
## நிறுவுதல் {/*installing*/}

<Note>

#### New JSX Transform இப்போது required {/*new-jsx-transform-is-now-required*/}

Bundle size-ஐ மேம்படுத்தவும் React import செய்யாமல் JSX பயன்படுத்தவும் 2020-இல் [new JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)-ஐ அறிமுகப்படுத்தினோம். React 19-இல், ref-ஐ prop ஆக பயன்படுத்துதல் மற்றும் JSX speed improvements போன்ற கூடுதல் improvements சேர்க்கிறோம்; அவற்றுக்கு new transform தேவைப்படுகிறது.

New transform enabled ஆகவில்லை என்றால், இந்த warning-ஐ காண்பீர்கள்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


Transform ஏற்கனவே பெரும்பாலான environments-இல் enabled ஆக இருப்பதால், பெரும்பாலான apps பாதிக்கப்படாது என்று எதிர்பார்க்கிறோம். Manual upgrade instructions-க்கு [announcement post](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)-ஐ பார்க்கவும்.

</Note>


React மற்றும் React DOM-ன் latest version-ஐ install செய்ய:

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

அல்லது Yarn பயன்படுத்தினால்:

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

TypeScript பயன்படுத்தினால், types-ஐயும் update செய்ய வேண்டும்.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

அல்லது Yarn பயன்படுத்தினால்:
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

மிகவும் பொதுவான replacements-க்காக codemod ஒன்றையும் சேர்த்துள்ளோம். கீழே [TypeScript changes](#typescript-changes)-ஐ பார்க்கவும்.

## Codemods {/*codemods*/}

Upgrade-க்கு உதவ, [codemod.com](https://codemod.com) team-உடன் இணைந்து, React 19-இல் உள்ள பல புதிய APIs மற்றும் patterns-க்கு உங்கள் code-ஐ தானாக update செய்யும் codemods-ஐ வெளியிட்டுள்ளோம்.

அனைத்து codemods-மும் [`react-codemod` repo](https://github.com/reactjs/react-codemod)-இல் கிடைக்கின்றன; Codemod team codemods maintain செய்வதில் இணைந்துள்ளது. இந்த codemods-ஐ run செய்ய, `react-codemod`-க்கு பதிலாக `codemod` command-ஐப் பயன்படுத்த பரிந்துரைக்கிறோம், ஏனெனில் அது வேகமாக run ஆகும், complex code migrations-ஐ சிறப்பாக handle செய்யும், மேலும் TypeScript-க்கு நல்ல support வழங்கும்.


<Note>

#### React 19 codemods அனைத்தையும் run செய்யுங்கள் {/*run-all-react-19-codemods*/}

இந்த guide-இல் list செய்யப்பட்ட அனைத்து codemods-ஐயும் React 19 `codemod` recipe மூலம் run செய்யுங்கள்:

```bash
npx codemod@latest react/19/migration-recipe
```

இது `react-codemod`-இலிருந்து பின்வரும் codemods-ஐ run செய்யும்:
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types)

இதில் TypeScript changes அடங்காது. கீழே [TypeScript changes](#typescript-changes)-ஐ பார்க்கவும்.

</Note>

Codemod உடன் வரும் changes-க்கு கீழே command சேர்க்கப்பட்டுள்ளது.

கிடைக்கும் அனைத்து codemods list-க்கு [`react-codemod` repo](https://github.com/reactjs/react-codemod)-ஐ பார்க்கவும்.

## Breaking changes (முறிக்கும் மாற்றங்கள்) {/*breaking-changes*/}

### Render-இல் உள்ள errors மீண்டும் throw செய்யப்படாது {/*errors-in-render-are-not-re-thrown*/}

React-ன் முந்தைய versions-இல், render போது throw செய்யப்பட்ட errors catch செய்து rethrow செய்யப்பட்டன. DEV-இல், `console.error`-க்கும் log செய்ததால் duplicate error logs உருவானது.

React 19-இல், re-throw செய்யாமல் duplication-ஐ குறைக்க [errors handle செய்யும் முறை மேம்படுத்தப்பட்டுள்ளது](/blog/2024/04/25/react-19#error-handling):

- **Uncaught Errors**: Error Boundary-யால் catch செய்யப்படாத errors `window.reportError`-க்கு report செய்யப்படும்.
- **Caught Errors**: Error Boundary-யால் catch செய்யப்பட்ட errors `console.error`-க்கு report செய்யப்படும்.

இந்த change பெரும்பாலான apps-ஐ பாதிக்காது. ஆனால் உங்கள் production error reporting errors re-thrown ஆகும் என்பதையே சார்ந்திருந்தால், உங்கள் error handling-ஐ update செய்ய வேண்டியிருக்கலாம். இதற்கு support வழங்க, custom error handling-க்காக `createRoot` மற்றும் `hydrateRoot`-க்கு புதிய methods சேர்த்துள்ளோம்:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

மேலும் தகவலுக்கு, [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) மற்றும் [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) docs-ஐ பார்க்கவும்.


### Deprecated React APIs நீக்கப்பட்டவை {/*removed-deprecated-react-apis*/}

#### நீக்கப்பட்டது: functions-க்கான `propTypes` மற்றும் `defaultProps` {/*removed-proptypes-and-defaultprops*/}
`PropTypes` [ஏப்ரல் 2017 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings)-இல் deprecated செய்யப்பட்டது.

React 19-இல், React package-இலிருந்து `propType` checks-ஐ நீக்குகிறோம்; அவற்றைப் பயன்படுத்தினால் அமைதியாக ignore செய்யப்படும். நீங்கள் `propTypes` பயன்படுத்தினால், TypeScript அல்லது வேறு type-checking solution-க்கு migrate செய்ய பரிந்துரைக்கிறோம்.

Function components-இலிருந்து `defaultProps`-ஐயும் ES6 default parameters-க்கு மாற்றாக நீக்குகிறோம். ES6 alternative இல்லாததால் class components தொடர்ந்து `defaultProps`-ஐ support செய்யும்.

```js
// Before
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'வணக்கம், உலகமே!',
};
```
```ts
// After
interface Props {
  text?: string;
}
function Heading({text = 'வணக்கம், உலகமே!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

`propTypes`-ஐ TypeScript-க்கு codemod செய்ய:

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### நீக்கப்பட்டது: `contextTypes` மற்றும் `getChildContext` பயன்படுத்தும் Legacy Context {/*removed-removing-legacy-context*/}

Legacy Context [அக்டோபர் 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html)-இல் deprecated செய்யப்பட்டது.

Legacy Context class components-இல் `contextTypes` மற்றும் `getChildContext` APIs மூலம் மட்டுமே கிடைத்தது; தவறவிட நேரடியான subtle bugs காரணமாக அது `contextType`-ஆல் replace செய்யப்பட்டது. React 19-இல், React-ஐ கொஞ்சம் சிறியதாகவும் வேகமானதாகவும் ஆக்க Legacy Context-ஐ நீக்குகிறோம்.

Class components-இல் இன்னும் Legacy Context பயன்படுத்தினால், புதிய `contextType` API-க்கு migrate செய்ய வேண்டும்:

```js {5-11,19-21}
// Before
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// After
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### நீக்கப்பட்டது: string refs {/*removed-string-refs*/}
String refs [மார்ச் 2018 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html)-இல் deprecated செய்யப்பட்டது.

[பல குறைகள்](https://github.com/facebook/react/issues/1373) காரணமாக ref callbacks-ஆல் replace செய்யப்படுவதற்கு முன் class components string refs-ஐ support செய்தன. React 19-இல், React-ஐ நேரடியாகவும் புரிந்துகொள்ள திறமையாகவும் ஆக்க string refs-ஐ நீக்குகிறோம்.

Class components-இல் இன்னும் string refs பயன்படுத்தினால், ref callbacks-க்கு migrate செய்ய வேண்டும்:

```js {4,8}
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// After
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

String refs-ஐ `ref` callbacks ஆக codemod செய்ய:

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### நீக்கப்பட்டது: Module pattern factories {/*removed-module-pattern-factories*/}
Module pattern factories [ஆகஸ்ட் 2019 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories)-இல் deprecated செய்யப்பட்டது.

இந்த pattern அரிதாகவே பயன்படுத்தப்பட்டது; இதை support செய்வதால் React தேவைக்கு மேலாக கொஞ்சம் பெரியதும் மெதுவானதும் ஆகிறது. React 19-இல், module pattern factories-க்கு support நீக்கப்படுகிறது; நீங்கள் regular functions-க்கு migrate செய்ய வேண்டும்:

```js
// Before
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// After
function FactoryComponent() {
  return <div />;
}
```

#### நீக்கப்பட்டது: `React.createFactory` {/*removed-createfactory*/}
`createFactory` [பிப்ரவரி 2020 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory)-இல் deprecated செய்யப்பட்டது.

JSX-க்கு பரந்த support கிடைக்கும் முன் `createFactory` பயன்படுத்துவது பொதுவாக இருந்தது, ஆனால் இன்று அது அரிதாகப் பயன்படுத்தப்படுகிறது மற்றும் JSX-ஆல் replace செய்யலாம். React 19-இல், `createFactory`-ஐ நீக்குகிறோம்; நீங்கள் JSX-க்கு migrate செய்ய வேண்டும்:

```js
// Before
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// After
const button = <button />;
```

#### நீக்கப்பட்டது: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

React 18-இல், `react-test-renderer/shallow`-ஐ [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer)-ஐ re-export செய்ய update செய்தோம். React 19-இல், package-ஐ நேரடியாக install செய்வதை முன்னுரிமை அளிக்க `react-test-render/shallow`-ஐ நீக்குகிறோம்:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Shallow rendering-ஐ மறுபரிசீலனை செய்யுங்கள் {/*please-reconsider-shallow-rendering*/}

Shallow rendering React internals-ஐச் சார்ந்தது; அது future upgrades-இலிருந்து உங்களைத் தடுக்கலாம். உங்கள் tests-ஐ [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) அல்லது [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro)-க்கு migrate செய்ய பரிந்துரைக்கிறோம்.

</Note>

### Deprecated React DOM APIs நீக்கப்பட்டவை {/*removed-deprecated-react-dom-apis*/}

#### நீக்கப்பட்டது: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

`act`-ஐ `react-dom/test-utils`-இலிருந்து `react` package-க்கு நகர்த்தியுள்ளோம்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

இந்த warning-ஐ fix செய்ய, `react`-இலிருந்து `act` import செய்யலாம்:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

மற்ற எல்லா `test-utils` functions-மும் நீக்கப்பட்டுள்ளன. இந்த utilities பொதுவானவை அல்ல; மேலும் உங்கள் components மற்றும் React-ன் low level implementation details-ஐ சாருவது இப்போது சாத்தியமாகிவிட்டது. React 19-இல், இந்த functions call செய்யப்பட்டால் error தரும்; அவற்றின் exports future version-இல் remove செய்யப்படும்.

Alternatives-க்கு [warning page](https://react.dev/warnings/react-dom-test-utils)-ஐ பார்க்கவும்.

<Note>

`ReactDOMTestUtils.act`-ஐ `React.act` ஆக codemod செய்ய:

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### நீக்கப்பட்டது: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` [மார்ச் 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)-இல் deprecated செய்யப்பட்டது. React 19-இல், `ReactDOM.render`-ஐ நீக்குகிறோம்; [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot) பயன்படுத்த migrate செய்ய வேண்டும்:

```js
// Before
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

`ReactDOM.render`-ஐ `ReactDOMClient.createRoot` ஆக codemod செய்ய:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### நீக்கப்பட்டது: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` [மார்ச் 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)-இல் deprecated செய்யப்பட்டது. React 19-இல், `ReactDOM.hydrate`-ஐ நீக்குகிறோம்; [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) பயன்படுத்த migrate செய்ய வேண்டும்,

```js
// Before
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

`ReactDOM.hydrate`-ஐ `ReactDOMClient.hydrateRoot` ஆக codemod செய்ய:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### நீக்கப்பட்டது: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` [மார்ச் 2022 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)-இல் deprecated செய்யப்பட்டது. React 19-இல், `root.unmount()` பயன்படுத்த migrate செய்ய வேண்டும்.


```js
// Before
unmountComponentAtNode(document.getElementById('root'));

// After
root.unmount();
```

மேலும் அறிய [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) மற்றும் [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount)-க்கான `root.unmount()`-ஐ பார்க்கவும்.

<Note>

`unmountComponentAtNode`-ஐ `root.unmount` ஆக codemod செய்ய:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### நீக்கப்பட்டது: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` [அக்டோபர் 2018 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode)-இல் deprecated செய்யப்பட்டது.

`findDOMNode` slow ஆக execute ஆன, refactoring-க்கு fragile ஆன, முதல் child-ஐ மட்டுமே return செய்த, abstraction levels-ஐ உடைத்த legacy escape hatch என்பதால் அதை நீக்குகிறோம் (மேலும் [இங்கே](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) பார்க்கவும்). `ReactDOM.findDOMNode`-ஐ [DOM refs](/learn/manipulating-the-dom-with-refs)-ஆல் replace செய்யலாம்:

```js
// Before
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="வணக்கம்" />;
}
```

```js
// After
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="வணக்கம்" />
}
```

## புதிய deprecations {/*new-deprecations*/}

### Deprecated: `element.ref` {/*deprecated-element-ref*/}

React 19 [`ref`-ஐ prop ஆக](/blog/2024/04/25/react-19#ref-as-a-prop) support செய்கிறது, எனவே `element.ref`-க்கு பதிலாக `element.props.ref` பயன்படுத்தும்படி `element.ref`-ஐ deprecate செய்கிறோம்.

`element.ref` access செய்தால் warning வரும்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Accessing element.ref is no longer supported. ref is now a regular prop. It will be removed from the JSX Element type in a future release.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Deprecated: `react-test-renderer` {/*deprecated-react-test-renderer*/}

Users பயன்படுத்தும் environment-க்கு match ஆகாத சொந்த renderer environment-ஐ implement செய்வதால், implementation details-ஐ test செய்ய ஊக்குவிப்பதால், மேலும் React internals introspection-ஐ சார்வதால் `react-test-renderer`-ஐ deprecate செய்கிறோம்.

[React Testing Library](https://testing-library.com) போன்ற மேலும் viable testing strategies கிடைக்கும் முன் test renderer உருவாக்கப்பட்டது; இப்போது அதற்கு பதிலாக modern testing library பயன்படுத்த பரிந்துரைக்கிறோம்.

React 19-இல், `react-test-renderer` deprecation warning log செய்து, concurrent rendering-க்கு மாறியுள்ளது. Modern மற்றும் நன்றாக support செய்யப்படும் testing experience-க்காக உங்கள் tests-ஐ [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) அல்லது [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro)-க்கு migrate செய்ய பரிந்துரைக்கிறோம்.

## கவனிக்கத்தக்க changes {/*notable-changes*/}

### StrictMode changes {/*strict-mode-improvements*/}

React 19 Strict Mode-க்கு பல fixes மற்றும் improvements-ஐ உள்ளடக்குகிறது.

Development-இல் Strict Mode-இல் double rendering நடக்கும் போது, இரண்டாவது render போது `useMemo` மற்றும் `useCallback` முதல் render-இலிருந்து memoized results-ஐ reuse செய்யும். ஏற்கனவே Strict Mode compatible ஆன components behavior-இல் வேறுபாடு கவனிக்கக்கூடாது.

எல்லா Strict Mode behaviors போலவே, இந்த features development போது உங்கள் components-இல் bugs-ஐ proactively surface செய்ய வடிவமைக்கப்பட்டுள்ளன; production-க்கு ship செய்வதற்கு முன் அவற்றை fix செய்ய முடியும். உதாரணமாக, development போது, mounted component Suspense fallback-ஆல் replace செய்யப்படும்போது என்ன நடக்கும் என்பதை simulate செய்ய Strict Mode initial mount-இல் ref callback functions-ஐ double-invoke செய்யும்.

### Suspense improvements {/*improvements-to-suspense*/}

React 19-இல், ஒரு component suspend செய்தால், முழு sibling tree render ஆக காத்திருக்காமல், nearest Suspense boundary-ன் fallback-ஐ React உடனே commit செய்யும். Fallback commit ஆன பிறகு, tree-ன் மீதியிலுள்ள lazy requests-ஐ "pre-warm" செய்ய suspended siblings-க்கு மற்றொரு render-ஐ React schedule செய்கிறது:

<Diagram name="prerender" height={162} width={1270} alt="Accordion என label செய்யப்பட்ட parent மற்றும் Panel என label செய்யப்பட்ட இரண்டு children கொண்ட மூன்று components tree-ஐ காட்டும் diagram. இரு Panel components-மும் false value கொண்ட isActive-ஐ கொண்டுள்ளன.">

முன்பு, ஒரு component suspend செய்தால், suspended siblings render செய்யப்பட்டு பின்னர் fallback commit செய்யப்பட்டது.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="முந்தைய diagram-இதே, ஆனால் முதல் child Panel component-ன் isActive click-ஐ குறிக்கும் வகையில் highlight செய்யப்பட்டுள்ளது; isActive value true ஆக set செய்யப்பட்டுள்ளது. இரண்டாவது Panel component இன்னும் false value கொண்டுள்ளது." >

React 19-இல், ஒரு component suspend செய்தால், fallback commit செய்யப்பட்டு பின்னர் suspended siblings render செய்யப்படுகின்றன.

</Diagram>

இந்த change, suspended tree-இல் lazy requests-ஐ இன்னும் warm செய்துகொண்டே Suspense fallbacks வேகமாக display ஆகும் என்பதைக் குறிக்கிறது.

### UMD builds நீக்கப்பட்டவை {/*umd-builds-removed*/}

Build step இல்லாமல் React-ஐ load செய்ய convenient வழியாக UMD முன்பு பரவலாக பயன்படுத்தப்பட்டது. இப்போது HTML documents-இல் modules-ஐ scripts ஆக load செய்ய modern alternatives உள்ளன. React 19 முதல், testing மற்றும் release process complexity-ஐ குறைக்க React இனி UMD builds produce செய்யாது.

Script tag உடன் React 19-ஐ load செய்ய, [esm.sh](https://esm.sh/) போன்ற ESM-based CDN பயன்படுத்த பரிந்துரைக்கிறோம்.

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### React internals-ஐ சார்ந்த libraries upgrades-ஐ block செய்யலாம் {/*libraries-depending-on-react-internals-may-block-upgrades*/}

இந்த release React internals-இல் changes-ஐ கொண்டுள்ளது; `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` போன்ற internals பயன்படுத்த வேண்டாம் என்ற எங்கள் வேண்டுகோளை ignore செய்யும் libraries-ஐ இவை பாதிக்கலாம். React 19 improvements-ஐ land செய்ய இந்த changes தேவையானவை; எங்கள் guidelines-ஐப் பின்பற்றும் libraries-ஐ அவை break செய்யாது.

எங்கள் [Versioning Policy](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change)-ன் அடிப்படையில், இந்த updates breaking changes ஆக list செய்யப்படவில்லை; அவற்றை எப்படி upgrade செய்வது என்பது பற்றிய docs-ஐ சேர்ப்பதில்லை. Internals-ஐ சார்ந்த எந்த code-யையும் remove செய்வதே பரிந்துரை.

Internals பயன்படுத்துவதன் impact-ஐ பிரதிபலிக்க, `SECRET_INTERNALS` suffix-ஐ இதுபோல் rename செய்துள்ளோம்:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

எதிர்காலத்தில், usage-ஐத் தடுக்கவும் users upgrade செய்ய முடியாமல் block ஆகாமல் இருப்பதையும் உறுதி செய்யவும், React internals access செய்வதை இன்னும் கடுமையாக block செய்வோம்.

## TypeScript changes {/*typescript-changes*/}

### Deprecated TypeScript types நீக்கப்பட்டவை {/*removed-deprecated-typescript-types*/}

React 19-இல் removed APIs அடிப்படையில் TypeScript types-ஐ சுத்தப்படுத்தியுள்ளோம். நீக்கப்பட்டவற்றில் சில types மிகவும் பொருத்தமான packages-க்கு நகர்த்தப்பட்டுள்ளன; மற்றவை React-ன் behavior-ஐ describe செய்ய இனி தேவையில்லை.

<Note>
Type தொடர்புடைய பெரும்பாலான breaking changes-ஐ migrate செய்ய [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)-ஐ வெளியிட்டுள்ளோம்:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

`element.props`-க்கு unsound access அதிகமாக இருந்தால், இந்த கூடுதல் codemod-ஐ run செய்யலாம்:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Supported replacements list-க்கு [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)-ஐ பாருங்கள். ஒரு codemod missing என்று நினைத்தால், அதை [missing React 19 codemods list](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement)-இல் track செய்யலாம்.


### `ref` cleanups required {/*ref-cleanup-required*/}

_இந்த change, [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return) எனும் `react-19` codemod preset-இல் சேர்க்கப்பட்டுள்ளது._

Ref cleanup functions அறிமுகப்படுத்தப்பட்டதால், ref callback-இலிருந்து வேறு எதையும் return செய்வது இப்போது TypeScript-ஆல் rejected செய்யப்படும். Fix பொதுவாக implicit returns பயன்படுத்துவதை நிறுத்துவது:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Original code `HTMLDivElement`-ன் instance-ஐ return செய்தது; இது cleanup function ஆக இருக்க வேண்டுமா இல்லையா என்பதை TypeScript அறிய முடியாது.

### `useRef`-க்கு argument தேவை {/*useref-requires-argument*/}

_இந்த change, [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults) எனும் `react-19` codemod preset-இல் சேர்க்கப்பட்டுள்ளது._

TypeScript மற்றும் React எப்படி வேலை செய்கின்றன என்பதில் `useRef` ஒரு நீண்டகால குறையாக இருந்தது. `useRef` இப்போது argument தேவைப்படுமாறு types-ஐ மாற்றியுள்ளோம். இது அதன் type signature-ஐ குறிப்பிடத்தக்க அளவு உதவுகிறது. இப்போது அது `createContext` போலவே நடக்கும்.

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

இதன் பொருள் இப்போது அனைத்து refs-மும் mutable. `null` கொண்டு initialize செய்ததால் ref-ஐ mutate செய்ய முடியாத issue இனி வராது:

```ts
const ref = useRef<number>(null);

// Cannot assign to 'current' because it is a read-only property
ref.current = 1;
```

`MutableRef` இப்போது deprecated; அதற்கு பதிலாக `useRef` எப்போதும் return செய்யும் ஒரே `RefObject` type பயன்படுத்தப்படுகிறது:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` இன்னும் `useRef<T>(null)`-க்கு convenience overload வைத்துள்ளது; அது தானாக `RefObject<T | null>` return செய்யும். `useRef`-க்கு required argument காரணமாக migration நேரடியாக இருக்க, `useRef(undefined)`-க்கான convenience overload சேர்க்கப்பட்டது; அது தானாக `RefObject<T | undefined>` return செய்யும்.

இந்த change பற்றிய முந்தைய விவாதங்களுக்கு [[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772)-ஐ பார்க்கவும்.

### `ReactElement` TypeScript type-இல் changes {/*changes-to-the-reactelement-typescript-type*/}

_இந்த change [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props) codemod-இல் சேர்க்கப்பட்டுள்ளது._

Element `ReactElement` ஆக typed செய்யப்பட்டிருந்தால், React elements-ன் `props` இப்போது `any`-க்கு பதிலாக `unknown` ஆக default ஆகிறது. `ReactElement`-க்கு type argument pass செய்தால் இது உங்களைப் பாதிக்காது:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

ஆனால் default-ஐ சார்ந்திருந்தால், இப்போது `unknown`-ஐ handle செய்ய வேண்டும்:

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

Element props-க்கு unsound access-ஐ சார்ந்துள்ள legacy code அதிகமாக இருந்தாலே இது தேவையாக இருக்கும். Element introspection ஒரு escape hatch ஆக மட்டுமே உள்ளது; explicit `any` மூலம் உங்கள் props access unsound என்பதை explicit ஆக்க வேண்டும்.

### TypeScript-இல் JSX namespace {/*the-jsx-namespace-in-typescript*/}
இந்த change, [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx) எனும் `react-19` codemod preset-இல் சேர்க்கப்பட்டுள்ளது.

எங்கள் types-இலிருந்து global `JSX` namespace-ஐ நீக்கி `React.JSX`-ஐ பயன்படுத்த வேண்டும் என்பது நீண்டகால request. இது global types pollution-ஐத் தடுக்க உதவும்; JSX-ஐ leverage செய்யும் வெவ்வேறு UI libraries இடையிலான conflicts-ஐ அதனால் தடுக்கலாம்.

இப்போது JSX namespace-ன் module augmentation-ஐ `declare module "...."`-க்குள் wrap செய்ய வேண்டும்:

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

உங்கள் `tsconfig.json`-ன் `compilerOptions`-இல் குறிப்பிட்ட JSX runtime-ஐப் பொறுத்து exact module specifier மாறும்:

- `"jsx": "react-jsx"` என்றால் அது `react/jsx-runtime`.
- `"jsx": "react-jsxdev"` என்றால் அது `react/jsx-dev-runtime`.
- `"jsx": "react"` மற்றும் `"jsx": "preserve"` என்றால் அது `react`.

### மேம்பட்ட `useReducer` typings {/*better-usereducer-typings*/}

[@mfp22](https://github.com/mfp22)-க்கு நன்றி, `useReducer` இப்போது மேம்பட்ட type inference கொண்டுள்ளது.

ஆனால் இதற்கு breaking change தேவைப்பட்டது: `useReducer` முழு reducer type-ஐ type parameter ஆக accept செய்யாது; அதற்கு பதிலாக எதுவும் தேவையில்லை (contextual typing-ஐ சாரலாம்) அல்லது state மற்றும் action type இரண்டும் தேவைப்படும்.

புதிய best practice, `useReducer`-க்கு type arguments pass செய்யாததே.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
State மற்றும் action-ஐ explicit ஆக type செய்யக்கூடிய edge cases-இல் இது வேலை செய்யாமல் இருக்கலாம்; அப்போது `Action`-ஐ tuple-இல் pass செய்யலாம்:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Reducer-ஐ inline ஆக define செய்தால், function parameters-ஐ annotate செய்ய ஊக்குவிக்கிறோம்:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Reducer-ஐ `useReducer` call-க்கு வெளியே நகர்த்தினாலும் நீங்கள் செய்ய வேண்டியது இதுவே:

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### பிற breaking changes {/*other-breaking-changes*/}

- **react-dom**: `src` மற்றும் `href`-இல் javascript URLs-க்கு error [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: `onRecoverableError`-இலிருந்து `errorInfo.digest` remove செய்யப்பட்டது [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: `unstable_flushControlled` remove செய்யப்பட்டது [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: `unstable_createEventHandle` remove செய்யப்பட்டது [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_renderSubtreeIntoContainer` remove செய்யப்பட்டது [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_runWithPriority` remove செய்யப்பட்டது [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: `react-is`-இலிருந்து deprecated methods remove செய்யப்பட்டது [28224](https://github.com/facebook/react/pull/28224)

### பிற notable changes {/*other-notable-changes*/}

- **react**: Batch sync, default மற்றும் continuous lanes [#25700](https://github.com/facebook/react/pull/25700)
- **react**: Suspended component-ன் siblings-ஐ prerender செய்ய வேண்டாம் [#26380](https://github.com/facebook/react/pull/26380)
- **react**: Render phase updates காரணமான infinite update loops detect செய்யப்பட்டது [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Popstate-இல் transitions இப்போது synchronous [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: SSR போது layout effect warning remove செய்யப்பட்டது [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Warn செய்து src/href-க்கு empty string set செய்யாது (anchor tags தவிர) [#28124](https://github.com/facebook/react/pull/28124)

Changes-ன் முழு list-க்கு [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024)-ஐ பார்க்கவும்.

---

இந்த post-ஐ review மற்றும் edit செய்த [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits), மற்றும் [Sebastian Silbermann](https://twitter.com/sebsilbermann) ஆகியோருக்கு நன்றி.
