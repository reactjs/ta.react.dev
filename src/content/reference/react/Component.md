---
title: Component
---

<Pitfall>

Components-ஐ classes-க்கு பதிலாக functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#alternatives)

</Pitfall>

<Intro>

`Component` என்பது [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) ஆக define செய்யப்பட்ட React components-க்கான base class. Class components இன்னும் React மூலம் supported; ஆனால் புதிய code-இல் அவற்றை use செய்ய பரிந்துரைக்கவில்லை.

```js
class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `Component` {/*component*/}

React component ஒன்றை class ஆக define செய்ய, built-in `Component` class-ஐ extend செய்து [`render` method](#render) define செய்யுங்கள்:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}
```

`render` method மட்டுமே required; மற்ற methods optional.

[மேலும் examples கீழே பார்க்கவும்.](#usage)

---

### `context` {/*context*/}

Class component-ன் [context](/learn/passing-data-deeply-with-context) `this.context` ஆக கிடைக்கும். [`static contextType`](#static-contexttype) பயன்படுத்தி *எந்த* context-ஐ receive செய்ய வேண்டும் என்பதை specify செய்தால் மட்டுமே அது கிடைக்கும்.

Class component ஒரே நேரத்தில் ஒரு context மட்டும் read செய்ய முடியும்.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Class components-இல் `this.context` read செய்வது function components-இல் [`useContext`](/reference/react/useContext) call செய்வதற்கு equivalent.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Class component-க்கு pass செய்யப்பட்ட props `this.props` ஆக கிடைக்கும்.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Class components-இல் `this.props` read செய்வது function components-இல் [props declare செய்வதற்கு](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) equivalent.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

Class component-ன் state `this.state` ஆக கிடைக்கும். `state` field object ஆக இருக்க வேண்டும். State-ஐ நேரடியாக mutate செய்ய வேண்டாம். State-ஐ மாற்ற விரும்பினால், புதிய state உடன் `setState` call செய்யுங்கள்.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        வயதை அதிகரி
        </button>
        <p>உங்கள் வயது {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Class components-இல் `state` define செய்வது function components-இல் [`useState`](/reference/react/useState) call செய்வதற்கு equivalent.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) உங்கள் class component *mount* ஆகும் முன் (screen-க்கு add ஆகும் முன்) run ஆகும். React-இல் constructor பொதுவாக இரண்டு purposes-க்காக மட்டுமே use செய்யப்படும். அது state declare செய்யவும், உங்கள் class methods-ஐ class instance-க்கு [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) செய்யவும் அனுமதிக்கிறது:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Modern JavaScript syntax use செய்தால், constructors அரிதாகவே தேவைப்படும். அதற்கு பதிலாக, modern browsers மற்றும் [Babel](https://babeljs.io/) போன்ற tools இரண்டாலும் supported ஆன [public class field syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) பயன்படுத்தி மேலுள்ள code-ஐ rewrite செய்யலாம்:

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Constructor-இல் side effects அல்லது subscriptions இருக்கக்கூடாது.

#### Parameters {/*constructor-parameters*/}

* `props`: Component-ன் initial props.

#### Returns {/*constructor-returns*/}

`constructor` எதையும் return செய்யக்கூடாது.

#### Caveats {/*constructor-caveats*/}

* Constructor-இல் side effects அல்லது subscriptions எதையும் run செய்ய வேண்டாம். அதற்கு [`componentDidMount`](#componentdidmount) use செய்யுங்கள்.

* Constructor-க்குள், வேறு எந்த statement-க்கும் முன் `super(props)` call செய்ய வேண்டும். அதை செய்யாவிட்டால், constructor run ஆகும் போது `this.props` `undefined` ஆக இருக்கும்; இது குழப்பத்தையும் bugs-ஐயும் ஏற்படுத்தலாம்.

* [`this.state`](#state)-ஐ நேரடியாக assign செய்யக்கூடிய ஒரே இடம் constructor. மற்ற எல்லா methods-இலும் அதற்கு பதிலாக [`this.setState()`](#setstate) use செய்ய வேண்டும். Constructor-இல் `setState` call செய்ய வேண்டாம்.

* [Server rendering](/reference/react-dom/server) use செய்தால், constructor server-இலும் run ஆகும்; அதன் பிறகு [`render`](#render) method run ஆகும். ஆனால் `componentDidMount` அல்லது `componentWillUnmount` போன்ற lifecycle methods server-இல் run ஆகாது.

* [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், development-இல் React `constructor`-ஐ இருமுறை call செய்து, பின்னர் instances-இல் ஒன்றை throw away செய்யும். `constructor`-இலிருந்து move செய்ய வேண்டிய accidental side effects-ஐ கவனிக்க இது உதவும்.

<Note>

Function components-இல் `constructor`-க்கு exact equivalent இல்லை. Function component-இல் state declare செய்ய [`useState`](/reference/react/useState) call செய்யுங்கள். Initial state-ஐ மீண்டும் calculate செய்வதை தவிர்க்க, [`useState`-க்கு function pass செய்யுங்கள்.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

நீங்கள் `componentDidCatch` define செய்தால், rendering போது எந்த child component (தொலைவில் உள்ள children உட்பட) error throw செய்தாலும் React அதை call செய்யும். Production-இல் அந்த error-ஐ error reporting service-க்கு log செய்ய இது அனுமதிக்கிறது.

பொதுவாக, error-க்கு response ஆக state update செய்து user-க்கு error message display செய்ய அனுமதிக்கும் [`static getDerivedStateFromError`](#static-getderivedstatefromerror) உடன் இது சேர்த்து use செய்யப்படுகிறது. இந்த methods கொண்ட component *Error Boundary* என்று அழைக்கப்படுகிறது.

[ஒரு example பார்க்கவும்.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*componentdidcatch-parameters*/}

* `error`: Throw செய்யப்பட்ட error. நடைமுறையில், இது பொதுவாக [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance ஆக இருக்கும்; ஆனால் இது guaranteed அல்ல, ஏனெனில் JavaScript strings அல்லது `null` உட்பட எந்த value-யையும் [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) செய்ய அனுமதிக்கிறது.

* `info`: Error பற்றிய additional information கொண்ட object. அதன் `componentStack` field-இல் throw செய்த component மற்றும் அதன் parent components அனைத்தின் names மற்றும் source locations கொண்ட stack trace இருக்கும். Production-இல் component names minified ஆகும். Production error reporting set up செய்தால், regular JavaScript error stacks போலவே sourcemaps பயன்படுத்தி component stack-ஐ decode செய்யலாம்.

#### Returns {/*componentdidcatch-returns*/}

`componentDidCatch` எதையும் return செய்யக்கூடாது.

#### Caveats {/*componentdidcatch-caveats*/}

* கடந்த காலத்தில், UI-ஐ update செய்து fallback error message display செய்ய `componentDidCatch`-க்குள் `setState` call செய்வது பொதுவாக இருந்தது. [`static getDerivedStateFromError`](#static-getderivedstatefromerror) define செய்வதற்கு ஆதரவாக இது deprecated.

* React-ன் production மற்றும் development builds `componentDidCatch` errors handle செய்வதில் சிறிது வேறுபடும். Development-இல், errors `window`-க்கு bubble up ஆகும்; அதாவது `window.onerror` அல்லது `window.addEventListener('error', callback)` எதுவாக இருந்தாலும் `componentDidCatch` catch செய்த errors-ஐ intercept செய்யும். Production-இல், errors bubble up ஆகாது; அதாவது ancestor error handler `componentDidCatch` explicit ஆக catch செய்யாத errors-ஐ மட்டுமே receive செய்யும்.

<Note>

Function components-இல் `componentDidCatch`-க்கு இன்னும் direct equivalent இல்லை. Class components create செய்வதைத் தவிர்க்க விரும்பினால், மேலுள்ளதைப் போன்ற single `ErrorBoundary` component எழுதிவிட்டு உங்கள் app முழுவதும் use செய்யுங்கள். மாற்றாக, அதை உங்களுக்காக செய்யும் [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package-ஐ use செய்யலாம்.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

நீங்கள் `componentDidMount` method define செய்தால், உங்கள் component screen-க்கு add *(mounted)* ஆகும்போது React அதை call செய்யும். Data fetching தொடங்க, subscriptions set up செய்ய, அல்லது DOM nodes manipulate செய்ய இது பொதுவான இடம்.

`componentDidMount` implement செய்தால், bugs தவிர்க்க பொதுவாக மற்ற lifecycle methods-யும் implement செய்ய வேண்டும். உதாரணமாக, `componentDidMount` சில state அல்லது props read செய்தால், அவற்றின் changes handle செய்ய [`componentDidUpdate`](#componentdidupdate)-ஐயும், `componentDidMount` செய்ததை clean up செய்ய [`componentWillUnmount`](#componentwillunmount)-ஐயும் implement செய்ய வேண்டும்.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[மேலும் examples பார்க்கவும்.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentdidmount-parameters*/}

`componentDidMount` எந்த parameters-யும் எடுக்காது.

#### Returns {/*componentdidmount-returns*/}

`componentDidMount` எதையும் return செய்யக்கூடாது.

#### Caveats {/*componentdidmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், development-இல் React `componentDidMount`-ஐ call செய்து, உடனே [`componentWillUnmount`](#componentwillunmount)-ஐ call செய்து, பின்னர் `componentDidMount`-ஐ மீண்டும் call செய்யும். `componentWillUnmount` implement செய்ய மறந்தீர்களா அல்லது அதன் logic `componentDidMount` செய்வதை முழுமையாக "mirror" செய்யவில்லையா என்பதை கவனிக்க இது உதவும்.

- [`componentDidMount`](#componentdidmount)-இல் உடனே [`setState`](#setstate) call செய்யலாம் என்றாலும், முடிந்தவரை அதை தவிர்ப்பது சிறந்தது. அது கூடுதல் rendering trigger செய்யும்; ஆனால் browser screen update செய்வதற்கு முன் அது நடக்கும். இதனால் இந்த case-இல் [`render`](#render) இருமுறை call செய்யப்பட்டாலும், user intermediate state-ஐ பார்க்கமாட்டார். இந்த pattern பெரும்பாலும் performance issues ஏற்படுத்துவதால் கவனமாக use செய்யுங்கள். பெரும்பாலான cases-இல், initial state-ஐ அதற்கு பதிலாக [`constructor`](#constructor)-இல் assign செய்ய முடியும். ஆனால் size அல்லது position-ஐ சார்ந்த ஏதாவது render செய்வதற்கு முன் DOM node-ஐ measure செய்ய வேண்டிய modals மற்றும் tooltips போன்ற cases-இல் இது தேவைப்படலாம்.

<Note>

பல use cases-க்கு, class components-இல் `componentDidMount`, `componentDidUpdate`, மற்றும் `componentWillUnmount` மூன்றையும் சேர்த்து define செய்வது function components-இல் [`useEffect`](/reference/react/useEffect) call செய்வதற்கு equivalent. Browser paint-க்கு முன் code run ஆகுவது முக்கியமான அரிதான cases-இல், [`useLayoutEffect`](/reference/react/useLayoutEffect) இன்னும் நெருக்கமான match.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

நீங்கள் `componentDidUpdate` method define செய்தால், உங்கள் component updated props அல்லது state உடன் re-render ஆன உடனே React அதை call செய்யும். இந்த method initial render-க்கு call செய்யப்படாது.

Update-க்கு பிறகு DOM manipulate செய்ய இதை use செய்யலாம். Current props-ஐ previous props உடன் compare செய்கிறவரை network requests செய்யவும் இது பொதுவான இடம் (எ.கா. props மாறவில்லை என்றால் network request தேவையில்லாமல் இருக்கலாம்). பொதுவாக, இதை [`componentDidMount`](#componentdidmount) மற்றும் [`componentWillUnmount`](#componentwillunmount) உடன் சேர்த்து use செய்வீர்கள்:

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[மேலும் examples பார்க்கவும்.](#adding-lifecycle-methods-to-a-class-component)


#### Parameters {/*componentdidupdate-parameters*/}

* `prevProps`: Update-க்கு முந்தைய props. என்ன மாறியது என்பதை தீர்மானிக்க `prevProps`-ஐ [`this.props`](#props) உடன் compare செய்யுங்கள்.

* `prevState`: Update-க்கு முந்தைய state. என்ன மாறியது என்பதை தீர்மானிக்க `prevState`-ஐ [`this.state`](#state) உடன் compare செய்யுங்கள்.

* `snapshot`: நீங்கள் [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) implement செய்திருந்தால், அந்த method-இலிருந்து return செய்த value `snapshot`-இல் இருக்கும். இல்லையெனில் அது `undefined` ஆக இருக்கும்.

#### Returns {/*componentdidupdate-returns*/}

`componentDidUpdate` எதையும் return செய்யக்கூடாது.

#### Caveats {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) defined ஆகி `false` return செய்தால் `componentDidUpdate` call செய்யப்படாது.

- `componentDidUpdate`-க்குள் உள்ள logic பொதுவாக `this.props`-ஐ `prevProps` உடனும், `this.state`-ஐ `prevState` உடனும் compare செய்யும் conditions-இல் wrap செய்யப்பட வேண்டும். இல்லையெனில் infinite loops உருவாகும் risk உள்ளது.

- `componentDidUpdate`-இல் உடனே [`setState`](#setstate) call செய்யலாம் என்றாலும், முடிந்தவரை அதை தவிர்ப்பது சிறந்தது. அது கூடுதல் rendering trigger செய்யும்; ஆனால் browser screen update செய்வதற்கு முன் அது நடக்கும். இதனால் இந்த case-இல் [`render`](#render) இருமுறை call செய்யப்பட்டாலும், user intermediate state-ஐ பார்க்கமாட்டார். இந்த pattern பெரும்பாலும் performance issues ஏற்படுத்தும்; ஆனால் size அல்லது position-ஐ சார்ந்த ஏதாவது render செய்வதற்கு முன் DOM node-ஐ measure செய்ய வேண்டிய modals மற்றும் tooltips போன்ற அரிதான cases-இல் இது தேவைப்படலாம்.

<Note>

பல use cases-க்கு, class components-இல் `componentDidMount`, `componentDidUpdate`, மற்றும் `componentWillUnmount` மூன்றையும் சேர்த்து define செய்வது function components-இல் [`useEffect`](/reference/react/useEffect) call செய்வதற்கு equivalent. Browser paint-க்கு முன் code run ஆகுவது முக்கியமான அரிதான cases-இல், [`useLayoutEffect`](/reference/react/useLayoutEffect) இன்னும் நெருக்கமான match.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

இந்த API `componentWillMount` இலிருந்து [`UNSAFE_componentWillMount`](#unsafe_componentwillmount) ஆக rename செய்யப்பட்டுள்ளது. பழைய பெயர் deprecated. React-ன் எதிர்கால major version ஒன்றில் புதிய பெயர் மட்டும் வேலை செய்யும்.

உங்கள் components-ஐ automatic ஆக update செய்ய [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) run செய்யுங்கள்.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

இந்த API `componentWillReceiveProps` இலிருந்து [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) ஆக rename செய்யப்பட்டுள்ளது. பழைய பெயர் deprecated. React-ன் எதிர்கால major version ஒன்றில் புதிய பெயர் மட்டும் வேலை செய்யும்.

உங்கள் components-ஐ automatic ஆக update செய்ய [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) run செய்யுங்கள்.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

இந்த API `componentWillUpdate` இலிருந்து [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) ஆக rename செய்யப்பட்டுள்ளது. பழைய பெயர் deprecated. React-ன் எதிர்கால major version ஒன்றில் புதிய பெயர் மட்டும் வேலை செய்யும்.

உங்கள் components-ஐ automatic ஆக update செய்ய [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) run செய்யுங்கள்.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

நீங்கள் `componentWillUnmount` method define செய்தால், உங்கள் component screen-இலிருந்து remove *(unmounted)* ஆகும் முன் React அதை call செய்யும். Data fetching cancel செய்ய அல்லது subscriptions remove செய்ய இது பொதுவான இடம்.

`componentWillUnmount`-க்குள் உள்ள logic [`componentDidMount`](#componentdidmount)-க்குள் உள்ள logic-ஐ "mirror" செய்ய வேண்டும். உதாரணமாக, `componentDidMount` subscription ஒன்றை set up செய்தால், `componentWillUnmount` அந்த subscription-ஐ clean up செய்ய வேண்டும். உங்கள் `componentWillUnmount` cleanup logic சில props அல்லது state read செய்தால், பழைய props மற்றும் state-க்கு corresponding ஆன resources-ஐ (subscriptions போன்றவை) clean up செய்ய பொதுவாக [`componentDidUpdate`](#componentdidupdate)-ஐயும் implement செய்ய வேண்டும்.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[மேலும் examples பார்க்கவும்.](#adding-lifecycle-methods-to-a-class-component)

#### Parameters {/*componentwillunmount-parameters*/}

`componentWillUnmount` எந்த parameters-யும் எடுக்காது.

#### Returns {/*componentwillunmount-returns*/}

`componentWillUnmount` எதையும் return செய்யக்கூடாது.

#### Caveats {/*componentwillunmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், development-இல் React [`componentDidMount`](#componentdidmount)-ஐ call செய்து, உடனே `componentWillUnmount`-ஐ call செய்து, பின்னர் `componentDidMount`-ஐ மீண்டும் call செய்யும். `componentWillUnmount` implement செய்ய மறந்தீர்களா அல்லது அதன் logic `componentDidMount` செய்வதை முழுமையாக "mirror" செய்யவில்லையா என்பதை கவனிக்க இது உதவும்.

<Note>

பல use cases-க்கு, class components-இல் `componentDidMount`, `componentDidUpdate`, மற்றும் `componentWillUnmount` மூன்றையும் சேர்த்து define செய்வது function components-இல் [`useEffect`](/reference/react/useEffect) call செய்வதற்கு equivalent. Browser paint-க்கு முன் code run ஆகுவது முக்கியமான அரிதான cases-இல், [`useLayoutEffect`](/reference/react/useLayoutEffect) இன்னும் நெருக்கமான match.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Component-ஐ re-render செய்ய force செய்கிறது.

பொதுவாக, இது தேவையில்லை. உங்கள் component-ன் [`render`](#render) method [`this.props`](#props), [`this.state`](#state), அல்லது [`this.context`](#context)-இலிருந்து மட்டும் read செய்தால், உங்கள் component அல்லது அதன் parents ஒன்றுக்குள் [`setState`](#setstate) call செய்யும் போது அது automatic ஆக re-render ஆகும். ஆனால் உங்கள் component-ன் `render` method external data source-இலிருந்து நேரடியாக read செய்தால், அந்த data source மாறும்போது user interface update செய்ய React-க்கு சொல்ல வேண்டும். அதையே `forceUpdate` செய்ய அனுமதிக்கிறது.

`forceUpdate` use செய்வதை எல்லாம் தவிர்க்க முயற்சிக்கவும்; `render`-இல் `this.props` மற்றும் `this.state`-இலிருந்து மட்டும் read செய்யுங்கள்.

#### Parameters {/*forceupdate-parameters*/}

* **optional** `callback`: Specify செய்தால், update committed ஆன பிறகு நீங்கள் provided செய்த `callback`-ஐ React call செய்யும்.

#### Returns {/*forceupdate-returns*/}

`forceUpdate` எதையும் return செய்யாது.

#### Caveats {/*forceupdate-caveats*/}

- நீங்கள் `forceUpdate` call செய்தால், [`shouldComponentUpdate`](#shouldcomponentupdate) call செய்யாமல் React re-render செய்யும்.

<Note>

External data source ஒன்றை read செய்து, அதன் changes-க்கு response ஆக `forceUpdate` மூலம் class components re-render செய்ய force செய்வதை function components-இல் [`useSyncExternalStore`](/reference/react/useSyncExternalStore) supersede செய்துள்ளது.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

நீங்கள் `getSnapshotBeforeUpdate` implement செய்தால், React DOM update செய்வதற்கு உடனடியாக முன் React அதை call செய்யும். DOM மாறக்கூடும் முன் அதிலிருந்து சில information-ஐ (எ.கா. scroll position) capture செய்ய இது உங்கள் component-க்கு உதவும். இந்த lifecycle method return செய்யும் எந்த value-யும் [`componentDidUpdate`](#componentdidupdate)-க்கு parameter ஆக pass செய்யப்படும்.

உதாரணமாக, updates போது தனது scroll position-ஐ preserve செய்ய வேண்டிய chat thread போன்ற UI-இல் இதை use செய்யலாம்:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

மேலுள்ள example-இல், `scrollHeight` property-ஐ `getSnapshotBeforeUpdate`-இல் நேரடியாக read செய்வது முக்கியம். அதை [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), அல்லது [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)-இல் read செய்வது safe அல்ல; ஏனெனில் இந்த methods call செய்யப்படுவதற்கும் React DOM update செய்வதற்கும் இடையில் time gap இருக்கலாம்.

#### Parameters {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Update-க்கு முந்தைய props. என்ன மாறியது என்பதை தீர்மானிக்க `prevProps`-ஐ [`this.props`](#props) உடன் compare செய்யுங்கள்.

* `prevState`: Update-க்கு முந்தைய state. என்ன மாறியது என்பதை தீர்மானிக்க `prevState`-ஐ [`this.state`](#state) உடன் compare செய்யுங்கள்.

#### Returns {/*getsnapshotbeforeupdate-returns*/}

நீங்கள் விரும்பும் எந்த type-இலும் snapshot value ஒன்றை அல்லது `null`-ஐ return செய்ய வேண்டும். நீங்கள் return செய்த value [`componentDidUpdate`](#componentdidupdate)-க்கு மூன்றாவது argument ஆக pass செய்யப்படும்.

#### Caveats {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) defined ஆகி `false` return செய்தால் `getSnapshotBeforeUpdate` call செய்யப்படாது.

<Note>

தற்போது function components-க்கு `getSnapshotBeforeUpdate` equivalent இல்லை. இந்த use case மிகவும் uncommon; ஆனால் அது தேவைப்பட்டால் இப்போது class component எழுத வேண்டும்.

</Note>

---

### `render()` {/*render*/}

Class component-இல் required ஆன ஒரே method `render` method.

Screen-இல் என்ன தோன்ற வேண்டும் என்பதை `render` method specify செய்ய வேண்டும், உதாரணமாக:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}
```

React எந்த தருணத்திலும் `render` call செய்யலாம்; எனவே அது குறிப்பிட்ட நேரத்தில் run ஆகும் என்று assume செய்யக்கூடாது. பொதுவாக, `render` method [JSX](/learn/writing-markup-with-jsx) பகுதியை return செய்ய வேண்டும்; ஆனால் strings போன்ற சில [மற்ற return types](#render-returns) supported. Returned JSX-ஐ calculate செய்ய, `render` method [`this.props`](#props), [`this.state`](#state), மற்றும் [`this.context`](#context)-ஐ read செய்யலாம்.

`render` method-ஐ pure function ஆக எழுத வேண்டும்; அதாவது props, state, மற்றும் context ஒரே மாதிரி இருந்தால் அது அதே result-ஐ return செய்ய வேண்டும். அதில் subscriptions set up செய்வது போன்ற side effects இருக்கக்கூடாது; browser APIs உடன் interact செய்யக்கூடாது. Side effects event handlers-இலோ அல்லது [`componentDidMount`](#componentdidmount) போன்ற methods-இலோ நடக்க வேண்டும்.

#### Parameters {/*render-parameters*/}

`render` எந்த parameters-யும் எடுக்காது.

#### Returns {/*render-returns*/}

`render` எந்த valid React node-ஐயும் return செய்யலாம். இதில் `<div />` போன்ற React elements, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, மற்றும் `false`), மற்றும் React nodes arrays அடங்கும்.

#### Caveats {/*render-caveats*/}

- `render` props, state, மற்றும் context-ன் pure function ஆக எழுதப்பட வேண்டும். அதில் side effects இருக்கக்கூடாது.

- [`shouldComponentUpdate`](#shouldcomponentupdate) defined ஆகி `false` return செய்தால் `render` call செய்யப்படாது.

- [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், development-இல் React `render`-ஐ இருமுறை call செய்து, பின்னர் results-இல் ஒன்றை throw away செய்யும். `render` method-இலிருந்து move செய்ய வேண்டிய accidental side effects-ஐ கவனிக்க இது உதவும்.

- `render` call மற்றும் பின்னர் வரும் `componentDidMount` அல்லது `componentDidUpdate` call இடையே one-to-one correspondence இல்லை. பயனுள்ளதாக இருந்தால் சில `render` call results-ஐ React discard செய்யலாம்.

---

### `setState(nextState, callback?)` {/*setstate*/}

உங்கள் React component-ன் state update செய்ய `setState` call செய்யுங்கள்.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>வணக்கம், {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` component state-க்கு changes-ஐ enqueue செய்கிறது. இந்த component மற்றும் அதன் children புதிய state உடன் re-render ஆக வேண்டும் என்று அது React-க்கு சொல்கிறது. Interactions-க்கு response ஆக user interface update செய்யும் முக்கியமான வழி இதுதான்.

<Pitfall>

`setState` call செய்வது ஏற்கனவே executing ஆகிக் கொண்டிருக்கும் code-இல் current state-ஐ மாற்றாது:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // இன்னும் "Taylor" தான்!
}
```

அது *அடுத்த* render முதல் `this.state` என்ன return செய்யும் என்பதை மட்டும் பாதிக்கும்.

</Pitfall>

`setState`-க்கு function ஒன்றையும் pass செய்யலாம். Previous state அடிப்படையில் state update செய்ய இது அனுமதிக்கிறது:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

இதை செய்ய வேண்டிய கட்டாயம் இல்லை; ஆனால் அதே event நேரத்தில் state-ஐ பல முறை update செய்ய விரும்பினால் இது பயனுள்ளதாக இருக்கும்.

#### Parameters {/*setstate-parameters*/}

* `nextState`: Object அல்லது function.
  * `nextState` ஆக object pass செய்தால், அது `this.state`-க்குள் shallowly merged செய்யப்படும்.
  * `nextState` ஆக function pass செய்தால், அது _updater function_ ஆக treat செய்யப்படும். அது pure ஆக இருக்க வேண்டும், pending state மற்றும் props-ஐ arguments ஆக எடுக்க வேண்டும், மேலும் `this.state`-க்குள் shallowly merge செய்யப்படும் object-ஐ return செய்ய வேண்டும். React உங்கள் updater function-ஐ queue-இல் வைத்து component-ஐ re-render செய்யும். அடுத்த render போது, queued updaters அனைத்தையும் previous state-க்கு apply செய்து next state-ஐ React calculate செய்யும்.

* **optional** `callback`: Specify செய்தால், update committed ஆன பிறகு நீங்கள் provided செய்த `callback`-ஐ React call செய்யும்.

#### Returns {/*setstate-returns*/}

`setState` எதையும் return செய்யாது.

#### Caveats {/*setstate-caveats*/}

- `setState`-ஐ component update செய்யும் immediate command ஆக அல்ல, ஒரு *request* ஆக நினைக்கவும். பல components ஒரு event-க்கு response ஆக தங்கள் state-ஐ update செய்தால், React அவற்றின் updates-ஐ batch செய்து event முடிவில் single pass-இல் ஒன்றாக re-render செய்யும். குறிப்பிட்ட state update synchronously apply ஆக force செய்ய வேண்டிய அரிதான case-இல், அதை [`flushSync`](/reference/react-dom/flushSync)-இல் wrap செய்யலாம்; ஆனால் இது performance-ஐ பாதிக்கலாம்.

- `setState` `this.state`-ஐ உடனடியாக update செய்யாது. அதனால் `setState` call செய்த உடனே `this.state` read செய்வது potential pitfall. அதற்கு பதிலாக [`componentDidUpdate`](#componentdidupdate) அல்லது setState `callback` argument use செய்யுங்கள்; இவை இரண்டும் update applied ஆன பிறகு fire ஆகும் என்று guaranteed. Previous state அடிப்படையில் state set செய்ய வேண்டுமெனில், மேலே விவரிக்கப்பட்டபடி `nextState`-க்கு function pass செய்யலாம்.

<Note>

Class components-இல் `setState` call செய்வது function components-இல் [`set` function](/reference/react/useState#setstate) call செய்வதைப் போன்றது.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

நீங்கள் `shouldComponentUpdate` define செய்தால், re-render skip செய்யலாமா என்பதை தீர்மானிக்க React அதை call செய்யும்.

அதை கைமுறையாக எழுத வேண்டும் என்று உறுதியாக இருந்தால், `this.props`-ஐ `nextProps` உடனும் `this.state`-ஐ `nextState` உடனும் compare செய்து update skip செய்யலாம் என்று React-க்கு சொல்ல `false` return செய்யலாம்.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

புதிய props அல்லது state receive செய்யப்படும் போது render செய்வதற்கு முன் React `shouldComponentUpdate` call செய்கிறது. Default `true`. Initial render-க்கோ அல்லது [`forceUpdate`](#forceupdate) use செய்யப்படும் போதோ இந்த method call செய்யப்படாது.

#### Parameters {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Component render ஆகவிருக்கும் next props. என்ன மாறியது என்பதை தீர்மானிக்க `nextProps`-ஐ [`this.props`](#props) உடன் compare செய்யுங்கள்.
- `nextState`: Component render ஆகவிருக்கும் next state. என்ன மாறியது என்பதை தீர்மானிக்க `nextState`-ஐ [`this.state`](#props) உடன் compare செய்யுங்கள்.
- `nextContext`: Component render ஆகவிருக்கும் next context. என்ன மாறியது என்பதை தீர்மானிக்க `nextContext`-ஐ [`this.context`](#context) உடன் compare செய்யுங்கள். [`static contextType`](#static-contexttype) specify செய்தால் மட்டுமே கிடைக்கும்.

#### Returns {/*shouldcomponentupdate-returns*/}

Component re-render ஆக வேண்டும் என்றால் `true` return செய்யுங்கள். அதுவே default behavior.

Re-rendering skip செய்யலாம் என்று React-க்கு சொல்ல `false` return செய்யுங்கள்.

#### Caveats {/*shouldcomponentupdate-caveats*/}

- இந்த method performance optimization-க்காக *மட்டுமே* உள்ளது. இது இல்லாமல் உங்கள் component break ஆனால், முதலில் அதையே fix செய்யுங்கள்.

- `shouldComponentUpdate`-ஐ கைமுறையாக எழுதுவதற்கு பதிலாக [`PureComponent`](/reference/react/PureComponent) use செய்வதை consider செய்யுங்கள். `PureComponent` props மற்றும் state-ஐ shallowly compare செய்கிறது; தேவையான update ஒன்றை skip செய்யும் வாய்ப்பை குறைக்கிறது.

- `shouldComponentUpdate`-இல் deep equality checks செய்வதையோ `JSON.stringify` use செய்வதையோ பரிந்துரைக்கவில்லை. அது performance-ஐ unpredictable ஆக்கி, ஒவ்வொரு prop மற்றும் state-ன் data structure-ஐ depend செய்ய வைக்கிறது. Best case-இல், உங்கள் application-க்கு multi-second stalls அறிமுகப்படுத்தும் risk; worst case-இல் அதை crash செய்யும் risk.

- `false` return செய்வது child components-ன் *அவற்றின்* state மாறும்போது re-render ஆகுவதைத் தடுக்காது.

- `false` return செய்வது component re-render ஆகாது என்று *guarantee* செய்யாது. React return value-ஐ hint ஆக use செய்யும்; ஆனால் மற்ற காரணங்களுக்காக பொருத்தமானதாக இருந்தால் உங்கள் component-ஐ இன்னும் re-render செய்ய தேர்வு செய்யலாம்.

<Note>

Class components-ஐ `shouldComponentUpdate` மூலம் optimize செய்வது function components-ஐ [`memo`](/reference/react/memo) மூலம் optimize செய்வதைப் போன்றது. Function components [`useMemo`](/reference/react/useMemo) மூலம் இன்னும் granular optimization வழங்குகின்றன.

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

நீங்கள் `UNSAFE_componentWillMount` define செய்தால், [`constructor`](#constructor)-க்கு உடனடியாக பிறகு React அதை call செய்யும். இது historical reasons-க்காக மட்டுமே உள்ளது; புதிய code-இல் use செய்யக்கூடாது. அதற்கு பதிலாக alternatives-இல் ஒன்றை use செய்யுங்கள்:

- To initialize state, declare [`state`](#state) as a class field or set `this.state` inside the [`constructor`.](#constructor)
- Side effect run செய்ய அல்லது subscription set up செய்ய வேண்டுமெனில், அந்த logic-ஐ [`componentDidMount`](#componentdidmount)-க்கு move செய்யுங்கள்.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` does not take any parameters.

#### Returns {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` should not return anything.

#### Caveats {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- பெயர் அப்படியாக இருந்தாலும், உங்கள் app [`Suspense`](/reference/react/Suspense) போன்ற modern React features use செய்தால் component *நிச்சயம்* mount ஆகும் என்று `UNSAFE_componentWillMount` guarantee செய்யாது. Render attempt suspend ஆனால் (உதாரணமாக, சில child component-ன் code இன்னும் load ஆகாததால்), React in-progress tree-ஐ throw away செய்து அடுத்த attempt போது component-ஐ scratch-இலிருந்து construct செய்ய முயலும். அதனால்தான் இந்த method "unsafe". Mounting-ஐ rely செய்யும் code (subscription சேர்ப்பது போன்றது) [`componentDidMount`](#componentdidmount)-க்கு செல்ல வேண்டும்.

- [Server rendering](/reference/react-dom/server) போது run ஆகும் ஒரே lifecycle method `UNSAFE_componentWillMount`. நடைமுறை purposes அனைத்துக்கும் இது [`constructor`](#constructor)-க்கு identical; எனவே இத்தகைய logic-க்கு அதற்கு பதிலாக `constructor` use செய்ய வேண்டும்.

<Note>

Class component-இல் state initialize செய்ய `UNSAFE_componentWillMount`-க்குள் [`setState`](#setstate) call செய்வது, function component-இல் அந்த state-ஐ [`useState`](/reference/react/useState)-க்கு initial state ஆக pass செய்வதற்கு equivalent.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

நீங்கள் `UNSAFE_componentWillReceiveProps` define செய்தால், component புதிய props receive செய்யும் போது React அதை call செய்யும். இது historical reasons-க்காக மட்டுமே உள்ளது; புதிய code-இல் use செய்யக்கூடாது. அதற்கு பதிலாக alternatives-இல் ஒன்றை use செய்யுங்கள்:

- Prop changes-க்கு response ஆக **side effect run செய்ய** வேண்டுமெனில் (உதாரணமாக data fetch செய்தல், animation run செய்தல், அல்லது subscription reinitialize செய்தல்), அந்த logic-ஐ [`componentDidUpdate`](#componentdidupdate)-க்கு move செய்யுங்கள்.
- Prop மாறும்போது மட்டும் **சில data மீண்டும் compute ஆகாமல் தவிர்க்க** வேண்டுமெனில், அதற்கு பதிலாக [memoization helper](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) use செய்யுங்கள்.
- Prop மாறும்போது **சில state-ஐ "reset" செய்ய** வேண்டுமெனில், component-ஐ [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ஆக்கவோ அல்லது [key உடன் fully uncontrolled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) ஆக்கவோ consider செய்யுங்கள்.
- Prop மாறும்போது **சில state-ஐ "adjust" செய்ய** வேண்டுமெனில், rendering போது props மட்டும் கொண்டு தேவையான information அனைத்தையும் compute செய்ய முடியுமா என்று check செய்யுங்கள். முடியாவிட்டால், அதற்கு பதிலாக [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) use செய்யுங்கள்.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parameters {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Component தனது parent component-இலிருந்து receive செய்யவிருக்கும் next props. என்ன மாறியது என்பதை தீர்மானிக்க `nextProps`-ஐ [`this.props`](#props) உடன் compare செய்யுங்கள்.
- `nextContext`: Component closest provider-இலிருந்து receive செய்யவிருக்கும் next context. என்ன மாறியது என்பதை தீர்மானிக்க `nextContext`-ஐ [`this.context`](#context) உடன் compare செய்யுங்கள். [`static contextType`](#static-contexttype) specify செய்தால் மட்டுமே கிடைக்கும்.

#### Returns {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` should not return anything.

#### Caveats {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- பெயர் அப்படியாக இருந்தாலும், உங்கள் app [`Suspense`](/reference/react/Suspense) போன்ற modern React features use செய்தால் component அந்த props-ஐ *நிச்சயம்* receive செய்யும் என்று `UNSAFE_componentWillReceiveProps` guarantee செய்யாது. Render attempt suspend ஆனால் (உதாரணமாக, சில child component-ன் code இன்னும் load ஆகாததால்), React in-progress tree-ஐ throw away செய்து அடுத்த attempt போது component-ஐ scratch-இலிருந்து construct செய்ய முயலும். அடுத்த render attempt நேரத்திற்குள் props வேறுபட்டிருக்கலாம். அதனால்தான் இந்த method "unsafe". Committed updates-க்கு மட்டும் run ஆக வேண்டிய code (subscription reset செய்வது போன்றது) [`componentDidUpdate`](#componentdidupdate)-க்கு செல்ல வேண்டும்.

- `UNSAFE_componentWillReceiveProps` என்பது component last time-ஐ விட *different* props receive செய்தது என்று அர்த்தமல்ல. ஏதாவது மாறியதா என்று check செய்ய `nextProps` மற்றும் `this.props`-ஐ நீங்களே compare செய்ய வேண்டும்.

- Mounting போது initial props உடன் React `UNSAFE_componentWillReceiveProps` call செய்யாது. Component-ன் சில props update ஆகப் போகும் போது மட்டுமே இந்த method-ஐ call செய்யும். உதாரணமாக, [`setState`](#setstate) call செய்வது பொதுவாக அதே component-க்குள் `UNSAFE_componentWillReceiveProps` trigger செய்யாது.

<Note>

Class component-இல் state-ஐ "adjust" செய்ய `UNSAFE_componentWillReceiveProps`-க்குள் [`setState`](#setstate) call செய்வது, function component-இல் [rendering போது `useState`-இலிருந்து `set` function call செய்வதற்கு](/reference/react/useState#storing-information-from-previous-renders) equivalent.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


நீங்கள் `UNSAFE_componentWillUpdate` define செய்தால், புதிய props அல்லது state உடன் render செய்வதற்கு முன் React அதை call செய்யும். இது historical reasons-க்காக மட்டுமே உள்ளது; புதிய code-இல் use செய்யக்கூடாது. அதற்கு பதிலாக alternatives-இல் ஒன்றை use செய்யுங்கள்:

- Prop அல்லது state changes-க்கு response ஆக side effect run செய்ய வேண்டுமெனில் (உதாரணமாக data fetch செய்தல், animation run செய்தல், அல்லது subscription reinitialize செய்தல்), அந்த logic-ஐ [`componentDidUpdate`](#componentdidupdate)-க்கு move செய்யுங்கள்.
- பின்னர் [`componentDidUpdate`](#componentdidupdate)-இல் use செய்ய DOM-இலிருந்து சில information read செய்ய வேண்டுமெனில் (உதாரணமாக current scroll position save செய்ய), அதற்கு பதிலாக [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)-க்குள் read செய்யுங்கள்.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Component render ஆகவிருக்கும் next props. என்ன மாறியது என்பதை தீர்மானிக்க `nextProps`-ஐ [`this.props`](#props) உடன் compare செய்யுங்கள்.
- `nextState`: Component render ஆகவிருக்கும் next state. என்ன மாறியது என்பதை தீர்மானிக்க `nextState`-ஐ [`this.state`](#state) உடன் compare செய்யுங்கள்.

#### Returns {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` should not return anything.

#### Caveats {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` will not get called if [`shouldComponentUpdate`](#shouldcomponentupdate) is defined and returns `false`.

- `UNSAFE_componentWillUpdate` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- `componentWillUpdate` போது [`setState`](#setstate) call செய்வது (அல்லது Redux action dispatch செய்வது போன்ற `setState` call ஆக வழிவகுக்கும் எந்த method-யும்) supported அல்ல.

- பெயர் அப்படியாக இருந்தாலும், உங்கள் app [`Suspense`](/reference/react/Suspense) போன்ற modern React features use செய்தால் component *நிச்சயம்* update ஆகும் என்று `UNSAFE_componentWillUpdate` guarantee செய்யாது. Render attempt suspend ஆனால் (உதாரணமாக, சில child component-ன் code இன்னும் load ஆகாததால்), React in-progress tree-ஐ throw away செய்து அடுத்த attempt போது component-ஐ scratch-இலிருந்து construct செய்ய முயலும். அடுத்த render attempt நேரத்திற்குள் props மற்றும் state வேறுபட்டிருக்கலாம். அதனால்தான் இந்த method "unsafe". Committed updates-க்கு மட்டும் run ஆக வேண்டிய code (subscription reset செய்வது போன்றது) [`componentDidUpdate`](#componentdidupdate)-க்கு செல்ல வேண்டும்.

- `UNSAFE_componentWillUpdate` என்பது component last time-ஐ விட *different* props அல்லது state receive செய்தது என்று அர்த்தமல்ல. ஏதாவது மாறியதா என்று check செய்ய `nextProps`-ஐ `this.props` உடனும் `nextState`-ஐ `this.state` உடனும் நீங்களே compare செய்ய வேண்டும்.

- React doesn't call `UNSAFE_componentWillUpdate` with initial props and state during mounting.

<Note>

There is no direct equivalent to `UNSAFE_componentWillUpdate` in function components.

</Note>

---

### `static contextType` {/*static-contexttype*/}

உங்கள் class component-இலிருந்து [`this.context`](#context-instance-field) read செய்ய விரும்பினால், அது எந்த context-ஐ read செய்ய வேண்டும் என்பதை specify செய்ய வேண்டும். `static contextType` ஆக நீங்கள் specify செய்யும் context, முன்பு [`createContext`](/reference/react/createContext) மூலம் created ஆன value ஆக இருக்க வேண்டும்.

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Class components-இல் `this.context` read செய்வது function components-இல் [`useContext`](/reference/react/useContext) call செய்வதற்கு equivalent.

[Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Class-க்கு default props set செய்ய `static defaultProps` define செய்யலாம். அவை `undefined` மற்றும் missing props-க்கு use செய்யப்படும்; ஆனால் `null` props-க்கு அல்ல.

உதாரணமாக, `color` prop default ஆக `'blue'` ஆக இருக்க வேண்டும் என்பதை இவ்வாறு define செய்யலாம்:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click செய்</button>;
  }
}
```

`color` prop provided செய்யப்படவில்லை அல்லது `undefined` ஆக இருந்தால், அது default ஆக `'blue'` ஆக set செய்யப்படும்:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Class components-இல் `defaultProps` define செய்வது function components-இல் [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) use செய்வதைப் போன்றது.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

நீங்கள் `static getDerivedStateFromError` define செய்தால், rendering போது child component (தொலைவில் உள்ள children உட்பட) error throw செய்யும்போது React அதை call செய்யும். UI-ஐ clear செய்வதற்கு பதிலாக error message display செய்ய இது அனுமதிக்கிறது.

பொதுவாக, error report-ஐ analytics service ஒன்றுக்கு send செய்ய அனுமதிக்கும் [`componentDidCatch`](#componentdidcatch) உடன் இது சேர்த்து use செய்யப்படுகிறது. இந்த methods கொண்ட component *Error Boundary* என்று அழைக்கப்படுகிறது.

[See an example.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*static-getderivedstatefromerror-parameters*/}

* `error`: Throw செய்யப்பட்ட error. நடைமுறையில், இது பொதுவாக [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance ஆக இருக்கும்; ஆனால் இது guaranteed அல்ல, ஏனெனில் JavaScript strings அல்லது `null` உட்பட எந்த value-யையும் [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) செய்ய அனுமதிக்கிறது.

#### Returns {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError`, error message display செய்ய component-க்கு சொல்லும் state-ஐ return செய்ய வேண்டும்.

#### Caveats {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` pure function ஆக இருக்க வேண்டும். Side effect செய்ய விரும்பினால் (உதாரணமாக analytics service call செய்ய), [`componentDidCatch`](#componentdidcatch)-ஐயும் implement செய்ய வேண்டும்.

<Note>

Function components-இல் `static getDerivedStateFromError`-க்கு இன்னும் direct equivalent இல்லை. Class components create செய்வதைத் தவிர்க்க விரும்பினால், மேலுள்ளதைப் போன்ற single `ErrorBoundary` component எழுதிவிட்டு உங்கள் app முழுவதும் use செய்யுங்கள். மாற்றாக, அதைச் செய்யும் [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package-ஐ use செய்யலாம்.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

நீங்கள் `static getDerivedStateFromProps` define செய்தால், initial mount-இலும் subsequent updates-இலும் [`render`](#render) call செய்வதற்கு உடனடியாக முன் React அதை call செய்யும். State update செய்ய object ஒன்றையோ, எதையும் update செய்ய வேண்டாம் எனில் `null`-ஐயோ return செய்ய வேண்டும்.

State காலப்போக்கில் props changes-ஐ depend செய்யும் [அரிதான use cases](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)-க்காக இந்த method உள்ளது. உதாரணமாக, `userID` prop மாறும்போது இந்த `Form` component `email` state-ஐ reset செய்கிறது:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

இந்த pattern, prop-ன் previous value ஒன்றை (`userID` போன்றது) state-இல் (`prevUserID` போன்றது) வைத்திருக்க வேண்டும் என்பதை கவனிக்கவும்.

<Pitfall>

State derive செய்வது verbose code-க்கு வழிவகுக்கும்; உங்கள் components பற்றி சிந்திப்பதை கடினமாக்கும். [நேரடியான alternatives உங்களுக்கு தெரிந்திருக்கிறதா என்பதை உறுதி செய்யுங்கள்:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Props-இல் change-க்கு response ஆக **side effect செய்ய** வேண்டுமெனில் (உதாரணமாக data fetching அல்லது animation), அதற்கு பதிலாக [`componentDidUpdate`](#componentdidupdate) method use செய்யுங்கள்.
- If you want to **re-compute some data only when a prop changes,** [use a memoization helper instead.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Prop மாறும்போது **சில state-ஐ "reset" செய்ய** வேண்டுமெனில், component-ஐ [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ஆக்கவோ அல்லது [key உடன் fully uncontrolled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) ஆக்கவோ consider செய்யுங்கள்.

</Pitfall>

#### Parameters {/*static-getderivedstatefromprops-parameters*/}

- `props`: The next props that the component is about to render with.
- `state`: The next state that the component is about to render with.

#### Returns {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` return an object to update the state, or `null` to update nothing.

#### Caveats {/*static-getderivedstatefromprops-caveats*/}

- இந்த method cause எதுவாக இருந்தாலும் *ஒவ்வொரு* render-இலும் fired ஆகும். Parent re-render ஏற்படுத்தும் போது மட்டும் fire ஆகும், local `setState` காரணமாக அல்லாத [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops)-இலிருந்து இது வேறுபடும்.

- இந்த method component instance-க்கு access இல்லை. விரும்பினால், component props மற்றும் state-ன் pure functions-ஐ class definition-க்கு வெளியே extract செய்வதன் மூலம் `static getDerivedStateFromProps` மற்றும் மற்ற class methods இடையே சில code reuse செய்யலாம்.

<Note>

Class component-இல் `static getDerivedStateFromProps` implement செய்வது function component-இல் [rendering போது `useState`-இலிருந்து `set` function call செய்வதற்கு](/reference/react/useState#storing-information-from-previous-renders) equivalent.

</Note>

---

## Usage {/*usage*/}

### Defining a class component {/*defining-a-class-component*/}

React component ஒன்றை class ஆக define செய்ய, built-in `Component` class-ஐ extend செய்து [`render` method](#render) define செய்யுங்கள்:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}
```

Screen-இல் என்ன display செய்ய வேண்டும் என்பதை தெரிந்துகொள்ள வேண்டிய ஒவ்வொரு முறையும் React உங்கள் [`render`](#render) method-ஐ call செய்யும். பொதுவாக, அதிலிருந்து சில [JSX](/learn/writing-markup-with-jsx) return செய்வீர்கள். உங்கள் `render` method [pure function](https://en.wikipedia.org/wiki/Pure_function) ஆக இருக்க வேண்டும்: அது JSX-ஐ மட்டும் calculate செய்ய வேண்டும்.

[Function components](/learn/your-first-component#defining-a-component) போலவே, class component தனது parent component-இலிருந்து [props மூலம் information receive செய்யலாம்](/learn/your-first-component#defining-a-component). ஆனால் props read செய்யும் syntax வேறுபடும். உதாரணமாக, parent component `<Greeting name="Taylor" />` render செய்தால், `name` prop-ஐ [`this.props`](#props)-இலிருந்து `this.props.name` போல read செய்யலாம்:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

[`useState`](/reference/react/useState) போன்ற `use`-ஆல் தொடங்கும் functions ஆன Hooks class components-க்குள் supported அல்ல என்பதை கவனிக்கவும்.

<Pitfall>

Components-ஐ classes-க்கு பதிலாக functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adding state to a class component {/*adding-state-to-a-class-component*/}

Class-க்கு [state](/learn/state-a-components-memory) add செய்ய, [`state`](#state) என்ற property-க்கு object assign செய்யுங்கள். State update செய்ய [`this.setState`](#setstate) call செய்யுங்கள்.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          வயதை அதிகரி
        </button>
        <p>வணக்கம், {this.state.name}. உங்கள் வயது {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Pitfall>

Components-ஐ classes-க்கு பதிலாக functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Class component-க்கு lifecycle methods சேர்த்தல் {/*adding-lifecycle-methods-to-a-class-component*/}

உங்கள் class-இல் define செய்யக்கூடிய சில special methods உள்ளன.

நீங்கள் [`componentDidMount`](#componentdidmount) method define செய்தால், உங்கள் component screen-க்கு add *(mounted)* ஆகும்போது React அதை call செய்யும். Props அல்லது state மாறியதால் உங்கள் component re-render ஆன பிறகு React [`componentDidUpdate`](#componentdidupdate)-ஐ call செய்யும். உங்கள் component screen-இலிருந்து remove *(unmounted)* ஆன பிறகு React [`componentWillUnmount`](#componentwillunmount)-ஐ call செய்யும்.

`componentDidMount` implement செய்தால், bugs தவிர்க்க பொதுவாக மூன்று lifecycles அனைத்தையும் implement செய்ய வேண்டும். உதாரணமாக, `componentDidMount` சில state அல்லது props read செய்தால், அவற்றின் changes handle செய்ய `componentDidUpdate`-ஐயும், `componentDidMount` செய்ததை clean up செய்ய `componentWillUnmount`-ஐயும் implement செய்ய வேண்டும்.

உதாரணமாக, இந்த `ChatRoom` component props மற்றும் state உடன் chat connection-ஐ synchronized ஆக வைத்திருக்கிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>{this.props.roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Development-இல் [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், React `componentDidMount`-ஐ call செய்து, உடனே `componentWillUnmount`-ஐ call செய்து, பின்னர் `componentDidMount`-ஐ மீண்டும் call செய்யும் என்பதை கவனிக்கவும். `componentWillUnmount` implement செய்ய மறந்தீர்களா அல்லது அதன் logic `componentDidMount` செய்வதை முழுமையாக "mirror" செய்யவில்லையா என்பதை கவனிக்க இது உதவும்.

<Pitfall>

Components-ஐ classes-க்கு பதிலாக functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்பதை பார்க்கவும்.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Error Boundary மூலம் rendering errors catch செய்தல் {/*catching-rendering-errors-with-an-error-boundary*/}

Default ஆக, உங்கள் application rendering போது error throw செய்தால், React அதன் UI-ஐ screen-இலிருந்து remove செய்யும். இதைத் தடுக்க, உங்கள் UI-ன் ஒரு பகுதியை *Error Boundary* ஒன்றில் wrap செய்யலாம். Error Boundary என்பது crashed ஆன பகுதியின் பதிலாக சில fallback UI-ஐ, உதாரணமாக error message-ஐ, display செய்ய அனுமதிக்கும் special component.

<Note>
Error boundaries பின்வற்றுக்கான errors-ஐ catch செய்யாது:

- Event handlers [(மேலும் அறிக)](/learn/responding-to-events)
- [Server side rendering](/reference/react-dom/server)
- Error boundary-யிலேயே throw செய்யப்பட்ட errors (அதன் children அல்ல)
- Asynchronous code (எ.கா. `setTimeout` அல்லது `requestAnimationFrame` callbacks); இதற்கு exception: [`useTransition`](/reference/react/useTransition) Hook return செய்யும் [`startTransition`](/reference/react/useTransition#starttransition) function-ன் usage. Transition function-க்குள் throw செய்யப்படும் errors error boundaries மூலம் catch செய்யப்படும் [(மேலும் அறிக)](/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

</Note>

Error Boundary component implement செய்ய, error-க்கு response ஆக state update செய்து user-க்கு error message display செய்ய அனுமதிக்கும் [`static getDerivedStateFromError`](#static-getderivedstatefromerror)-ஐ provide செய்ய வேண்டும். கூடுதல் logic சேர்க்க, உதாரணமாக error-ஐ analytics service-க்கு log செய்ய, optional ஆக [`componentDidCatch`](#componentdidcatch)-ஐயும் implement செய்யலாம்.

[`captureOwnerStack`](/reference/react/captureOwnerStack) மூலம் development போது Owner Stack-ஐ include செய்யலாம்.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

பிறகு உங்கள் component tree-ன் ஒரு பகுதியை அதனால் wrap செய்யலாம்:

```js {1,3}
<ErrorBoundary fallback={<p>ஏதோ தவறு நடந்தது</p>}>
  <Profile />
</ErrorBoundary>
```

`Profile` அல்லது அதன் child component error throw செய்தால், `ErrorBoundary` அந்த error-ஐ "catch" செய்து, நீங்கள் provided செய்த error message உடன் fallback UI display செய்து, production error report-ஐ உங்கள் error reporting service-க்கு send செய்யும்.

ஒவ்வொரு component-ஐயும் தனி Error Boundary-இல் wrap செய்ய வேண்டியதில்லை. [Error Boundaries-ன் granularity](https://www.brandondail.com/posts/fault-tolerance-react) பற்றி சிந்திக்கும் போது, error message display செய்வது எங்கே பொருத்தமுள்ளதாக இருக்கும் என்பதை consider செய்யுங்கள். உதாரணமாக, messaging app-இல் conversations list சுற்றி Error Boundary வைப்பது பொருத்தம். ஒவ்வொரு individual message-ஐச் சுற்றியும் ஒன்று வைப்பதும் பொருத்தம். ஆனால் ஒவ்வொரு avatar-ஐச் சுற்றியும் boundary வைப்பது பொருத்தமல்ல.

<Note>

தற்போது Error Boundary-ஐ function component ஆக எழுத வழி இல்லை. ஆனால் Error Boundary class-ஐ நீங்களே எழுத வேண்டியதில்லை. உதாரணமாக, அதற்கு பதிலாக [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) use செய்யலாம்.

</Note>

---

## Alternatives {/*alternatives*/}

### Simple component-ஐ class-இலிருந்து function-க்கு migrate செய்தல் {/*migrating-a-simple-component-from-a-class-to-a-function*/}

பொதுவாக, அதற்கு பதிலாக [components-ஐ functions ஆக define செய்வீர்கள்](/learn/your-first-component#defining-a-component).

உதாரணமாக, இந்த `Greeting` class component-ஐ function-ஆக convert செய்கிறீர்கள் என வைத்துக்கொள்ளுங்கள்:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>வணக்கம், {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

`Greeting` என்ற function define செய்யுங்கள். உங்கள் `render` function-ன் body-ஐ இங்கே move செய்வீர்கள்.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

`this.props.name` பதிலாக, [destructuring syntax](/learn/passing-props-to-a-component) பயன்படுத்தி `name` prop-ஐ define செய்து நேரடியாக read செய்யுங்கள்:

```js
function Greeting({ name }) {
  return <h1>வணக்கம், {name}!</h1>;
}
```

முழு example இதோ:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>வணக்கம், {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### State கொண்ட component-ஐ class-இலிருந்து function-க்கு migrate செய்தல் {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

இந்த `Counter` class component-ஐ function-ஆக convert செய்கிறீர்கள் என வைத்துக்கொள்ளுங்கள்:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          வயதை அதிகரி
        </button>
        <p>வணக்கம், {this.state.name}. உங்கள் வயது {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

தேவையான [state variables](/reference/react/useState#adding-state-to-a-component) உடன் function declare செய்வதிலிருந்து தொடங்குங்கள்:

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

அடுத்து, event handlers-ஐ convert செய்யுங்கள்:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

இறுதியாக, `this`-ஆல் தொடங்கும் references அனைத்தையும் உங்கள் component-இல் defined செய்த variables மற்றும் functions-ஆக replace செய்யுங்கள். உதாரணமாக, `this.state.age`-ஐ `age`-ஆகவும், `this.handleNameChange`-ஐ `handleNameChange`-ஆகவும் replace செய்யுங்கள்.

முழுமையாக converted component இதோ:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        வயதை அதிகரி
      </button>
      <p>வணக்கம், {name}. உங்கள் வயது {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Lifecycle methods கொண்ட component-ஐ class-இலிருந்து function-க்கு migrate செய்தல் {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Lifecycle methods கொண்ட இந்த `ChatRoom` class component-ஐ function-ஆக convert செய்கிறீர்கள் என வைத்துக்கொள்ளுங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>{this.props.roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

முதலில், உங்கள் [`componentWillUnmount`](#componentwillunmount), [`componentDidMount`](#componentdidmount) செய்வதற்கு opposite ஆக செய்கிறதா என்பதை verify செய்யுங்கள். மேலுள்ள example-இல் அது உண்மை: `componentDidMount` set up செய்யும் connection-ஐ அது disconnect செய்கிறது. அத்தகைய logic missing என்றால், அதை முதலில் சேர்க்கவும்.

அடுத்து, `componentDidMount`-இல் use செய்யும் props மற்றும் state-இல் ஏதாவது changes-ஐ உங்கள் [`componentDidUpdate`](#componentdidupdate) method handle செய்கிறதா என்பதை verify செய்யுங்கள். மேலுள்ள example-இல், `componentDidMount` `setupConnection` call செய்கிறது; அது `this.state.serverUrl` மற்றும் `this.props.roomId` read செய்கிறது. அதனால்தான் `componentDidUpdate`, `this.state.serverUrl` மற்றும் `this.props.roomId` மாறியுள்ளதா என்று check செய்து, மாறியிருந்தால் connection-ஐ reset செய்கிறது. உங்கள் `componentDidUpdate` logic missing அல்லது relevant props மற்றும் state அனைத்தின் changes-ஐ handle செய்யவில்லை என்றால், அதை முதலில் fix செய்யுங்கள்.

மேலுள்ள example-இல், lifecycle methods-க்குள் உள்ள logic component-ஐ React-க்கு வெளியே உள்ள system ஒன்றுக்கு (chat server) connect செய்கிறது. Component-ஐ external system-க்கு connect செய்ய, [இந்த logic-ஐ single Effect ஆக describe செய்யுங்கள்:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

இந்த [`useEffect`](/reference/react/useEffect) call மேலுள்ள lifecycle methods-இல் உள்ள logic-க்கு equivalent. உங்கள் lifecycle methods பல unrelated விஷயங்களைச் செய்தால், [அவற்றை பல independent Effects-ஆக split செய்யுங்கள்.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) பயன்படுத்திப் பார்க்கக்கூடிய முழு example இதோ:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

உங்கள் component எந்த external systems-உடனும் synchronize செய்யவில்லை என்றால், [உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)

</Note>

---

### Context கொண்ட component-ஐ class-இலிருந்து function-க்கு migrate செய்தல் {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

இந்த example-இல், `Panel` மற்றும் `Button` class components [`this.context`](#context)-இலிருந்து [context](/learn/passing-data-deeply-with-context) read செய்கின்றன:

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="வரவேற்கிறோம்">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

அவற்றை function components-ஆக convert செய்யும்போது, `this.context`-ஐ [`useContext`](/reference/react/useContext) calls-ஆக replace செய்யுங்கள்:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="வரவேற்கிறோம்">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
