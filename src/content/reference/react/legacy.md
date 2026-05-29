---
title: "Legacy React API-கள்"
---

<Intro>

இந்த API-கள் `react` package-இலிருந்து export செய்யப்படுகின்றன, ஆனால் புதிதாக எழுதப்படும் code-இல் பயன்படுத்த பரிந்துரைக்கப்படவில்லை. பரிந்துரைக்கப்படும் மாற்று வழிகளுக்கு, இணைக்கப்பட்டுள்ள தனித்தனி API பக்கங்களைப் பாருங்கள்.

</Intro>

---

## Legacy API-கள் {/*legacy-apis*/}

* [`Children`](/reference/react/Children) `children` prop ஆகப் பெறப்பட்ட JSX-ஐ மாற்றவும் உருமாற்றவும் உதவுகிறது. [மாற்று வழிகளைப் பாருங்கள்.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) மற்றொரு element-ஐ தொடக்கமாகக் கொண்டு React element ஒன்றை உருவாக்க உதவுகிறது. [மாற்று வழிகளைப் பாருங்கள்.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) JavaScript class ஆக React component ஒன்றை வரையறுக்க உதவுகிறது. [மாற்று வழிகளைப் பாருங்கள்.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) React element ஒன்றை உருவாக்க உதவுகிறது. பொதுவாக, இதற்கு பதிலாக JSX-ஐப் பயன்படுத்துவீர்கள்.
* [`createRef`](/reference/react/createRef) எந்த value-யையும் வைத்திருக்கக்கூடிய ref object ஒன்றை உருவாக்குகிறது. [மாற்று வழிகளைப் பாருங்கள்.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) parent component-க்கு [ref](/learn/manipulating-the-dom-with-refs) மூலம் DOM node ஒன்றை உங்கள் component வெளிப்படுத்த உதவுகிறது.
* [`isValidElement`](/reference/react/isValidElement) ஒரு value React element ஆக உள்ளதா என்பதைச் சரிபார்க்கிறது. பொதுவாக [`cloneElement`.](/reference/react/cloneElement)-உடன் பயன்படுத்தப்படுகிறது
* [`PureComponent`](/reference/react/PureComponent) [`Component`,](/reference/react/Component)-க்கு ஒத்தது, ஆனால் அதே props வந்தால் re-render-களைத் தவிர்க்கிறது. [மாற்று வழிகளைப் பாருங்கள்.](/reference/react/PureComponent#alternatives)

---

## நீக்கப்பட்ட API-கள் {/*removed-apis*/}

இந்த API-கள் React 19-இல் நீக்கப்பட்டன:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): இதற்கு பதிலாக JSX-ஐப் பயன்படுத்துங்கள்.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): இதற்கு பதிலாக [`static contextType`](#static-contexttype)-ஐப் பயன்படுத்துங்கள்.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): இதற்கு பதிலாக [`static contextType`](#static-contexttype)-ஐப் பயன்படுத்துங்கள்.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): இதற்கு பதிலாக [`Context`](/reference/react/createContext#provider)-ஐப் பயன்படுத்துங்கள்.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): இதற்கு பதிலாக [TypeScript](https://www.typescriptlang.org/) போன்ற type system ஒன்றைப் பயன்படுத்துங்கள்.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): இதற்கு பதிலாக [`createRef`](/reference/react/createRef)-ஐப் பயன்படுத்துங்கள்.
