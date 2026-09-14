---
title: "பொதுவான components (எ.கா. <div>)"
---

<Intro>

[`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) போன்ற எல்லா built-in browser components-உம் சில பொதுவான props மற்றும் events-ஐ support செய்கின்றன.

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### பொதுவான components (எ.கா. `<div>`) {/*common*/}

```js
<div className="wrapper">சில உள்ளடக்கம்</div>
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Props {/*common-props*/}

இந்த சிறப்பு React props எல்லா built-in components-க்கும் support செய்யப்படுகின்றன:

* `children`: ஒரு React node (element, string, number, [portal,](/reference/react-dom/createPortal) `null`, `undefined` மற்றும் booleans போன்ற empty node, அல்லது பிற React nodes-ன் array). Component-க்குள் உள்ள content-ஐ குறிப்பிடுகிறது. JSX பயன்படுத்தும்போது, பொதுவாக `<div><span /></div>` போன்ற nested tags மூலம் `children` prop-ஐ மறைமுகமாக குறிப்பிடுவீர்கள்.

<<<<<<< HEAD
* `dangerouslySetInnerHTML`: உள்ளே raw HTML string கொண்ட `{ __html: '<p>some html</p>' }` வடிவ object. DOM node-ன் [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property-ஐ override செய்து, pass செய்யப்பட்ட HTML-ஐ உள்ளே காட்டுகிறது. இதை மிகுந்த கவனத்துடன் மட்டுமே பயன்படுத்த வேண்டும்! உள்ளிருக்கும் HTML நம்பத்தகுந்ததல்ல என்றால் (உதாரணமாக, அது user data அடிப்படையாக இருந்தால்), [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability சேர்க்கும் அபாயம் உண்டு. [`dangerouslySetInnerHTML` பயன்படுத்துவது பற்றி மேலும் வாசிக்கவும்.](#dangerously-setting-the-inner-html)
=======
* `dangerouslySetInnerHTML`: An object of the form `{ __html: '<p>some html</p>' }` with a raw HTML string or [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) value inside. Overrides the [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property of the DOM node and displays the passed HTML inside. This should be used with extreme caution! If the HTML inside isn't trusted (for example, if it's based on user data), you risk introducing an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability. [Read more about using `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)
>>>>>>> 8efce7853d0fc59e615ed1c253799cf1798b8428

* `ref`: [`useRef`](/reference/react/useRef) அல்லது [`createRef`](/reference/react/createRef)-இலிருந்து கிடைக்கும் ref object, [`ref` callback function,](#ref-callback) அல்லது [legacy refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)-க்கான string. இந்த node-க்கான DOM element உங்கள் ref-இல் நிரப்பப்படும். [Refs மூலம் DOM-ஐ கையாளுவது பற்றி மேலும் வாசிக்கவும்.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: ஒரு boolean. `true` என்றால், `children` மற்றும் `contentEditable={true}` இரண்டும் கொண்ட elements-க்கு React காட்டும் warning-ஐ suppress செய்கிறது (இவை பொதுவாக ஒன்றாகச் சரியாக வேலை செய்யாது). `contentEditable` content-ஐ கையால் நிர்வகிக்கும் text input library உருவாக்கினால் இதைப் பயன்படுத்துங்கள்.

* `suppressHydrationWarning`: ஒரு boolean. நீங்கள் [server rendering](/reference/react-dom/server) பயன்படுத்தினால், server மற்றும் client வேறு content render செய்யும்போது பொதுவாக warning வரும். சில அரிய சந்தர்ப்பங்களில் (timestamps போன்றவை), exact match-ஐ உறுதி செய்வது மிகவும் கடினமாகவோ சாத்தியமற்றதாகவோ இருக்கும். `suppressHydrationWarning`-ஐ `true` ஆக set செய்தால், அந்த element-ன் attributes மற்றும் content-இல் உள்ள mismatches குறித்து React warning காட்டாது. இது ஒரு level ஆழம் மட்டுமே வேலை செய்யும்; escape hatch ஆகப் பயன்படுத்துவதற்கானது. இதை மிகையாகப் பயன்படுத்த வேண்டாம். [Hydration errors-ஐ suppress செய்வது பற்றி வாசிக்கவும்.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

<<<<<<< HEAD
* `style`: CSS styles கொண்ட object, உதாரணமாக `{ fontWeight: 'bold', margin: 20 }`. DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property போலவே, CSS property பெயர்கள் `font-weight` என்பதற்குப் பதிலாக `fontWeight` போன்ற `camelCase` வடிவில் எழுதப்பட வேண்டும். Values ஆக strings அல்லது numbers pass செய்யலாம். `width: 100` போன்ற number pass செய்தால், அது [unitless property](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) அல்லாத வரை React value-க்கு தானாக `px` ("pixels") சேர்க்கும். Style values முன்கூட்டியே தெரியாத dynamic styles-க்கு மட்டும் `style` பயன்படுத்த பரிந்துரைக்கிறோம். மற்ற சந்தர்ப்பங்களில், `className` மூலம் plain CSS classes பயன்படுத்துவது அதிக திறனானது. [`className` மற்றும் `style` பற்றி மேலும் வாசிக்கவும்.](#applying-css-styles)
=======
* `style`: An object with CSS styles, for example `{ fontWeight: 'bold', margin: 20 }`. Similarly to the DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property, the CSS property names need to be written as `camelCase`, for example `fontWeight` instead of `font-weight`. You can pass strings or numbers as values. If you pass a number, like `width: 100`, React will automatically append `px` ("pixels") to the value unless it's a [unitless property.](https://github.com/react/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) We recommend using `style` only for dynamic styles where you don't know the style values ahead of time. In other cases, applying plain CSS classes with `className` is more efficient. [Read more about `className` and `style`.](#applying-css-styles)
>>>>>>> 8efce7853d0fc59e615ed1c253799cf1798b8428

இந்த standard DOM props-உம் எல்லா built-in components-க்கும் support செய்யப்படுகின்றன:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): ஒரு string. Element-க்கான keyboard shortcut-ஐ குறிப்பிடுகிறது. [பொதுவாக பரிந்துரைக்கப்படாது.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA attributes இந்த element-க்கான accessibility tree தகவலை குறிப்பிட அனுமதிக்கின்றன. முழு reference-க்கு [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) பார்க்கவும். React-இல், எல்லா ARIA attribute பெயர்களும் HTML-இல் இருப்பதுபோலவே இருக்கும்.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): ஒரு string. User input capitalized ஆக வேண்டுமா, எப்படி ஆக வேண்டும் என்பதை குறிப்பிடுகிறது.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): ஒரு string. Element-ன் CSS class name-ஐ குறிப்பிடுகிறது. [CSS styles பயன்படுத்துவது பற்றி மேலும் வாசிக்கவும்.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): ஒரு boolean. `true` என்றால், rendered element-ஐ user நேரடியாக edit செய்ய browser அனுமதிக்கும். [Lexical](https://lexical.dev/) போன்ற rich text input libraries உருவாக்க இதைப் பயன்படுத்துகிறார்கள். `contentEditable={true}` கொண்ட element-க்கு React children pass செய்ய முயன்றால் React warning காட்டும்; user edits-க்குப் பிறகு அதன் content-ஐ React update செய்ய முடியாது.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data attributes மூலம் element-க்கு சில string data attach செய்யலாம், உதாரணமாக `data-fruit="banana"`. React-இல் இவை பொதுவாக பயன்படுத்தப்படாது, ஏனெனில் data-வை props அல்லது state-இலிருந்து வாசிப்பதே வழக்கம்.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` அல்லது `'rtl'`. Element-ன் text direction-ஐ குறிப்பிடுகிறது.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): ஒரு boolean. Element draggable ஆக இருக்க வேண்டுமா என்பதை குறிப்பிடுகிறது. [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)-ன் ஒரு பகுதி.
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): ஒரு string. Virtual keyboards-இல் enter key-க்கு எந்த action காட்ட வேண்டும் என்பதை குறிப்பிடுகிறது.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): ஒரு string. [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) மற்றும் [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)-க்கு, [label-ஐ ஒரு control-உடன் இணைக்க](/reference/react-dom/components/input#providing-a-label-for-an-input) அனுமதிக்கிறது. இது [`for` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)-க்கு சமம். React HTML attribute பெயர்களுக்குப் பதிலாக standard DOM property names (`htmlFor`) பயன்படுத்துகிறது.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): ஒரு boolean அல்லது string. Element hidden ஆக இருக்க வேண்டுமா என்பதை குறிப்பிடுகிறது.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): ஒரு string. இந்த element-க்கான unique identifier-ஐ குறிப்பிடுகிறது; பின்னர் அதை கண்டுபிடிக்க அல்லது பிற elements-உடன் இணைக்க இதைப் பயன்படுத்தலாம். ஒரே component-ன் பல instances இடையே conflicts தவிர்க்க [`useId`](/reference/react/useId) மூலம் உருவாக்குங்கள்.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): ஒரு string. குறிப்பிடப்பட்டால், component ஒரு [custom element](/reference/react-dom/components#custom-html-elements) போல நடக்கும்.
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): ஒரு string. எந்த வகை keyboard காட்ட வேண்டும் என்பதை குறிப்பிடுகிறது (உதாரணமாக text, number, அல்லது telephone).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): ஒரு string. Structured data crawlers-க்கு element எந்த property-யை represent செய்கிறது என்பதை குறிப்பிடுகிறது.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): ஒரு string. Element-ன் மொழியை குறிப்பிடுகிறது.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): ஒரு [`AnimationEvent` handler](#animationevent-handler) function. CSS animation முடிந்தபோது fire ஆகும்.
* `onAnimationEndCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onAnimationEnd`-ன் version.
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): ஒரு [`AnimationEvent` handler](#animationevent-handler) function. CSS animation-ன் ஒரு iteration முடிந்து மற்றொன்று தொடங்கும்போது fire ஆகும்.
* `onAnimationIterationCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onAnimationIteration`-ன் version.
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): ஒரு [`AnimationEvent` handler](#animationevent-handler) function. CSS animation தொடங்கும்போது fire ஆகும்.
* `onAnimationStartCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onAnimationStart`.
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Primary அல்லாத pointer button click செய்யப்படும் போது fire ஆகும்.
* `onAuxClickCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onAuxClick`-ன் version.
* `onBeforeInput`: ஒரு [`InputEvent` handler](#inputevent-handler) function. Editable element-ன் value மாற்றப்படுவதற்கு முன் fire ஆகும். React இன்னும் native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) event-ஐ பயன்படுத்தவில்லை; அதற்கு பதிலாக பிற events மூலம் polyfill செய்ய முயல்கிறது.
* `onBeforeInputCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onBeforeInput`-ன் version.
* `onBlur`: ஒரு [`FocusEvent` handler](#focusevent-handler) function. Element focus இழக்கும்போது fire ஆகும். Built-in browser [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event போல அல்லாமல், React-இல் `onBlur` event bubbles ஆகும்.
* `onBlurCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onBlur`-ன் version.
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointing device-இல் primary button click செய்யப்படும் போது fire ஆகும்.
* `onClickCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onClick`-ன் version.
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): ஒரு [`CompositionEvent` handler](#compositionevent-handler) function. [Input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) புதிய composition session தொடங்கும்போது fire ஆகும்.
* `onCompositionStartCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCompositionStart`-ன் version.
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): ஒரு [`CompositionEvent` handler](#compositionevent-handler) function. [Input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) composition session-ஐ complete அல்லது cancel செய்யும்போது fire ஆகும்.
* `onCompositionEndCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCompositionEnd`-ன் version.
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): ஒரு [`CompositionEvent` handler](#compositionevent-handler) function. [Input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) புதிய character பெறும்போது fire ஆகும்.
* `onCompositionUpdateCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCompositionUpdate`-ன் version.
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. User context menu திறக்க முயன்றால் fire ஆகும்.
* `onContextMenuCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onContextMenu`-ன் version.
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): ஒரு [`ClipboardEvent` handler](#clipboardevent-handler) function. User clipboard-க்கு ஏதாவது copy செய்ய முயன்றால் fire ஆகும்.
* `onCopyCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCopy`-ன் version.
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): ஒரு [`ClipboardEvent` handler](#clipboardevent-handler) function. User clipboard-க்கு ஏதாவது cut செய்ய முயன்றால் fire ஆகும்.
* `onCutCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCut`-ன் version.
* `onDoubleClick`: ஒரு [`MouseEvent` handler](#mouseevent-handler) function. User இருமுறை click செய்யும்போது fire ஆகும். Browser [`dblclick` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)-க்கு இணையானது.
* `onDoubleClickCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDoubleClick`-ன் version.
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. User ஏதாவது drag செய்யும் போது fire ஆகும்.
* `onDragCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDrag`-ன் version.
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. User drag செய்வதை நிறுத்தும்போது fire ஆகும்.
* `onDragEndCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDragEnd`-ன் version.
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. Drag செய்யப்படும் content valid drop target-க்குள் நுழையும் போது fire ஆகும்.
* `onDragEnterCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDragEnter`-ன் version.
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. Drag செய்யப்படும் content valid drop target மேல் இருக்கும் போது fire ஆகும். Drop செய்ய அனுமதிக்க இங்கே `e.preventDefault()` call செய்ய வேண்டும்.
* `onDragOverCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDragOver`-ன் version.
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. User ஒரு element-ஐ drag செய்யத் தொடங்கும்போது fire ஆகும்.
* `onDragStartCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDragStart`-ன் version.
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): ஒரு [`DragEvent` handler](#dragevent-handler) function. ஏதாவது valid drop target மீது drop செய்யப்பட்டால் fire ஆகும்.
* `onDropCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDrop`-ன் version.
* `onFocus`: ஒரு [`FocusEvent` handler](#focusevent-handler) function. Element focus பெறும்போது fire ஆகும். Built-in browser [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) event போல அல்லாமல், React-இல் `onFocus` event bubbles ஆகும்.
* `onFocusCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onFocus`-ன் version.
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Element code மூலம் pointer-ஐ capture செய்யும்போது fire ஆகும்.
* `onGotPointerCaptureCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onGotPointerCapture`-ன் version.
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): ஒரு [`KeyboardEvent` handler](#keyboardevent-handler) function. Key press செய்யப்படும் போது fire ஆகும்.
* `onKeyDownCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onKeyDown`-ன் version.
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): ஒரு [`KeyboardEvent` handler](#keyboardevent-handler) function. Deprecated. அதற்குப் பதிலாக `onKeyDown` அல்லது `onBeforeInput` பயன்படுத்துங்கள்.
* `onKeyPressCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onKeyPress`-ன் version.
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): ஒரு [`KeyboardEvent` handler](#keyboardevent-handler) function. Key release செய்யப்படும் போது fire ஆகும்.
* `onKeyUpCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onKeyUp`-ன் version.
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Element pointer capture செய்வதை நிறுத்தும்போது fire ஆகும்.
* `onLostPointerCaptureCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onLostPointerCapture`-ன் version.
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer அழுத்தப்படும் போது fire ஆகும்.
* `onMouseDownCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onMouseDown`-ன் version.
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer ஒரு element-க்குள் நகரும்போது fire ஆகும். இதற்கு capture phase இல்லை. அதற்கு பதிலாக, `onMouseLeave` மற்றும் `onMouseEnter` விட்டு வெளியேறும் element-இலிருந்து நுழையும் element-க்கு propagate ஆகும்.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer ஒரு element-க்கு வெளியே நகரும்போது fire ஆகும். இதற்கு capture phase இல்லை. அதற்கு பதிலாக, `onMouseLeave` மற்றும் `onMouseEnter` விட்டு வெளியேறும் element-இலிருந்து நுழையும் element-க்கு propagate ஆகும்.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer coordinates மாறும்போது fire ஆகும்.
* `onMouseMoveCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onMouseMove`-ன் version.
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer ஒரு element-க்கு வெளியே நகரும்போது, அல்லது child element-க்குள் நகரும்போது fire ஆகும்.
* `onMouseOutCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onMouseOut`-ன் version.
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): ஒரு [`MouseEvent` handler](#mouseevent-handler) function. Pointer release செய்யப்படும் போது fire ஆகும்.
* `onMouseUpCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onMouseUp`-ன் version.
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Browser ஒரு pointer interaction-ஐ cancel செய்தால் fire ஆகும்.
* `onPointerCancelCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPointerCancel`-ன் version.
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer active ஆகும்போது fire ஆகும்.
* `onPointerDownCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPointerDown`-ன் version.
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer ஒரு element-க்குள் நகரும்போது fire ஆகும். இதற்கு capture phase இல்லை. அதற்கு பதிலாக, `onPointerLeave` மற்றும் `onPointerEnter` விட்டு வெளியேறும் element-இலிருந்து நுழையும் element-க்கு propagate ஆகும்.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer ஒரு element-க்கு வெளியே நகரும்போது fire ஆகும். இதற்கு capture phase இல்லை. அதற்கு பதிலாக, `onPointerLeave` மற்றும் `onPointerEnter` விட்டு வெளியேறும் element-இலிருந்து நுழையும் element-க்கு propagate ஆகும்.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer coordinates மாறும்போது fire ஆகும்.
* `onPointerMoveCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPointerMove`-ன் version.
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer ஒரு element-க்கு வெளியே நகரும்போது, pointer interaction cancel செய்யப்பட்டால், மற்றும் [சில பிற காரணங்களால்](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event) fire ஆகும்.
* `onPointerOutCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPointerOut`-ன் version.
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): ஒரு [`PointerEvent` handler](#pointerevent-handler) function. Pointer இனி active இல்லாதபோது fire ஆகும்.
* `onPointerUpCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPointerUp`-ன் version.
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): ஒரு [`ClipboardEvent` handler](#clipboardevent-handler) function. User clipboard-இலிருந்து ஏதாவது paste செய்ய முயன்றால் fire ஆகும்.
* `onPasteCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPaste`-ன் version.
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): ஒரு [`Event` handler](#event-handler) function. Element scroll செய்யப்பட்டபோது fire ஆகும். இந்த event bubble ஆகாது.
* `onScrollCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onScroll`-ன் version.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): ஒரு [`Event` handler](#event-handler) function. Input போன்ற editable element-க்குள் selection மாறிய பிறகு fire ஆகும். `contentEditable={true}` elements-க்கும் வேலை செய்ய React `onSelect` event-ஐ விரிவாக்குகிறது. கூடுதலாக, empty selection-க்கும் edits-க்கும் (அவை selection-ஐ பாதிக்கலாம்) fire ஆகும்படி React இதை விரிவாக்குகிறது.
* `onSelectCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSelect`-ன் version.
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): ஒரு [`TouchEvent` handler](#touchevent-handler) function. Browser ஒரு touch interaction-ஐ cancel செய்தால் fire ஆகும்.
* `onTouchCancelCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTouchCancel`-ன் version.
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): ஒரு [`TouchEvent` handler](#touchevent-handler) function. ஒன்று அல்லது அதற்கு மேற்பட்ட touch points அகற்றப்பட்டால் fire ஆகும்.
* `onTouchEndCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTouchEnd`-ன் version.
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): ஒரு [`TouchEvent` handler](#touchevent-handler) function. ஒன்று அல்லது அதற்கு மேற்பட்ட touch points நகர்த்தப்பட்டால் fire ஆகும்.
* `onTouchMoveCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTouchMove`-ன் version.
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): ஒரு [`TouchEvent` handler](#touchevent-handler) function. ஒன்று அல்லது அதற்கு மேற்பட்ட touch points வைக்கப்படும்போது fire ஆகும்.
* `onTouchStartCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTouchStart`-ன் version.
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): ஒரு [`TransitionEvent` handler](#transitionevent-handler) function. CSS transition முடிந்தபோது fire ஆகும்.
* `onTransitionEndCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTransitionEnd`-ன் version.
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): ஒரு [`WheelEvent` handler](#wheelevent-handler) function. User wheel button-ஐ rotate செய்யும்போது fire ஆகும்.
* `onWheelCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onWheel`-ன் version.
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): ஒரு string. Assistive technologies-க்காக element role-ஐ வெளிப்படையாக குறிப்பிடுகிறது.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): ஒரு string. Shadow DOM பயன்படுத்தும்போது slot name-ஐ குறிப்பிடுகிறது. React-இல் இதற்கு இணையான pattern பொதுவாக JSX-ஐ props ஆக pass செய்வதன் மூலம் பெறப்படுகிறது, உதாரணமாக `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): ஒரு boolean அல்லது null. Explicit ஆக `true` அல்லது `false` set செய்தால், spellchecking enable அல்லது disable ஆகும்.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): ஒரு number. Default Tab button behavior-ஐ override செய்கிறது. [`-1` மற்றும் `0` அல்லாத values பயன்படுத்துவதை தவிர்க்கவும்.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): ஒரு string. Element-க்கான tooltip text-ஐ குறிப்பிடுகிறது.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` அல்லது `'no'`. `'no'` pass செய்தால் element content translate செய்யப்படுவதிலிருந்து விலக்கப்படும்.

Custom attributes-ஐயும் props ஆக pass செய்யலாம், உதாரணமாக `mycustomprop="someValue"`. Third-party libraries-உடன் integrate செய்யும்போது இது பயனுள்ளதாக இருக்கலாம். Custom attribute பெயர் lowercase ஆக இருக்க வேண்டும்; `on` என்று தொடங்கக்கூடாது. Value string ஆக மாற்றப்படும். `null` அல்லது `undefined` pass செய்தால், custom attribute நீக்கப்படும்.

இந்த events [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) elements-க்கு மட்டும் fire ஆகும்:

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): ஒரு [`Event` handler](#event-handler) function. Form reset செய்யப்படும் போது fire ஆகும்.
* `onResetCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onReset`-ன் version.
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): ஒரு [`Event` handler](#event-handler) function. Form submit செய்யப்படும் போது fire ஆகும்.
* `onSubmitCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSubmit`-ன் version.

இந்த events [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elements-க்கு மட்டும் fire ஆகும். Browser events போல அல்லாமல், React-இல் இவை bubble ஆகும்:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): ஒரு [`Event` handler](#event-handler) function. User dialog-ஐ dismiss செய்ய முயன்றால் fire ஆகும்.
* `onCancelCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCancel`-ன் version.
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): ஒரு [`Event` handler](#event-handler) function. Dialog close செய்யப்பட்டபோது fire ஆகும்.
* `onCloseCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onClose`-ன் version.

இந்த events [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) elements-க்கு மட்டும் fire ஆகும். Browser events போல அல்லாமல், React-இல் இவை bubble ஆகும்:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): ஒரு [`Event` handler](#event-handler) function. User details-ஐ toggle செய்யும்போது fire ஆகும்.
* `onToggleCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onToggle`-ன் version.

இந்த events [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), மற்றும் [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) elements-க்கு fire ஆகும். Browser events போல அல்லாமல், React-இல் இவை bubble ஆகும்:

* `onLoad`: ஒரு [`Event` handler](#event-handler) function. Resource load ஆனபோது fire ஆகும்.
* `onLoadCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onLoad`-ன் version.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): ஒரு [`Event` handler](#event-handler) function. Resource load ஆக முடியாதபோது fire ஆகும்.
* `onErrorCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onError`-ன் version.

இந்த events [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) மற்றும் [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) போன்ற resources-க்கு fire ஆகும். Browser events போல அல்லாமல், React-இல் இவை bubble ஆகும்:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): ஒரு [`Event` handler](#event-handler) function. Resource முழுமையாக load ஆகாதபோது, ஆனால் error காரணமாக அல்லாதபோது fire ஆகும்.
* `onAbortCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onAbort`-ன் version.
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): ஒரு [`Event` handler](#event-handler) function. Play தொடங்க போதுமான data இருக்கும்போது, ஆனால் buffering இல்லாமல் முடிவு வரை play செய்ய போதுமானதாக இல்லாதபோது fire ஆகும்.
* `onCanPlayCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCanPlay`-ன் version.
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): ஒரு [`Event` handler](#event-handler) function. முடிவு வரை buffering இல்லாமல் play செய்ய போதுமான data இருக்கக்கூடும் என்ற நிலையில் fire ஆகும்.
* `onCanPlayThroughCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onCanPlayThrough`-ன் version.
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): ஒரு [`Event` handler](#event-handler) function. Media duration update ஆனபோது fire ஆகும்.
* `onDurationChangeCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onDurationChange`-ன் version.
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): ஒரு [`Event` handler](#event-handler) function. Media empty ஆனபோது fire ஆகும்.
* `onEmptiedCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onEmptied`-ன் version.
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): ஒரு [`Event` handler](#event-handler) function. Browser encrypted media-வை சந்திக்கும் போது fire ஆகும்.
* `onEncryptedCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onEncrypted`-ன் version.
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): ஒரு [`Event` handler](#event-handler) function. Play செய்ய எதுவும் மீதமில்லாததால் playback நிற்கும்போது fire ஆகும்.
* `onEndedCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onEnded`-ன் version.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): ஒரு [`Event` handler](#event-handler) function. Resource load ஆக முடியாதபோது fire ஆகும்.
* `onErrorCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onError`-ன் version.
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): ஒரு [`Event` handler](#event-handler) function. தற்போதைய playback frame load ஆனபோது fire ஆகும்.
* `onLoadedDataCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onLoadedData`-ன் version.
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): ஒரு [`Event` handler](#event-handler) function. Metadata load ஆனபோது fire ஆகும்.
* `onLoadedMetadataCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onLoadedMetadata`-ன் version.
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): ஒரு [`Event` handler](#event-handler) function. Browser resource-ஐ load செய்யத் தொடங்கும்போது fire ஆகும்.
* `onLoadStartCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onLoadStart`-ன் version.
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): ஒரு [`Event` handler](#event-handler) function. Media pause செய்யப்பட்டபோது fire ஆகும்.
* `onPauseCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPause`-ன் version.
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): ஒரு [`Event` handler](#event-handler) function. Media இனி paused இல்லாதபோது fire ஆகும்.
* `onPlayCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPlay`-ன் version.
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): ஒரு [`Event` handler](#event-handler) function. Media play செய்யத் தொடங்கும்போது அல்லது மீண்டும் தொடங்கும்போது fire ஆகும்.
* `onPlayingCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onPlaying`-ன் version.
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): ஒரு [`Event` handler](#event-handler) function. Resource load ஆகிக்கொண்டிருக்கும் போது அவ்வப்போது fire ஆகும்.
* `onProgressCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onProgress`-ன் version.
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): ஒரு [`Event` handler](#event-handler) function. Playback rate மாறும்போது fire ஆகும்.
* `onRateChangeCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onRateChange`-ன் version.
* `onResize`: ஒரு [`Event` handler](#event-handler) function. Video size மாறும்போது fire ஆகும்.
* `onResizeCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onResize`-ன் version.
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): ஒரு [`Event` handler](#event-handler) function. Seek operation முடிந்தபோது fire ஆகும்.
* `onSeekedCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSeeked`-ன் version.
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): ஒரு [`Event` handler](#event-handler) function. Seek operation தொடங்கும்போது fire ஆகும்.
* `onSeekingCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSeeking`-ன் version.
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): ஒரு [`Event` handler](#event-handler) function. Browser data-க்காக காத்திருக்கும்போது ஆனால் அது தொடர்ந்து load ஆகாதபோது fire ஆகும்.
* `onStalledCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onStalled`-ன் version.
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): ஒரு [`Event` handler](#event-handler) function. Resource loading suspend செய்யப்பட்டபோது fire ஆகும்.
* `onSuspendCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSuspend`-ன் version.
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): ஒரு [`Event` handler](#event-handler) function. தற்போதைய playback time update ஆனபோது fire ஆகும்.
* `onTimeUpdateCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onTimeUpdate`-ன் version.
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): ஒரு [`Event` handler](#event-handler) function. Volume மாறியபோது fire ஆகும்.
* `onVolumeChangeCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onVolumeChange`-ன் version.
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): ஒரு [`Event` handler](#event-handler) function. Temporary data இல்லாமையால் playback நிற்கும்போது fire ஆகும்.
* `onWaitingCapture`: [capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onWaiting`-ன் version.

#### Caveats {/*common-caveats*/}

- `children` மற்றும் `dangerouslySetInnerHTML` இரண்டையும் ஒரே நேரத்தில் pass செய்ய முடியாது.
- சில events (`onAbort` மற்றும் `onLoad` போன்றவை) browser-இல் bubble ஆகாது, ஆனால் React-இல் bubble ஆகும்.

---

### `ref` callback function {/*ref-callback*/}

Ref object-க்கு பதிலாக ([`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) return செய்யும் object போன்றது), `ref` attribute-க்கு function pass செய்யலாம்.

```js
<div ref={(node) => {
  console.log('இணைக்கப்பட்டது', node);

  return () => {
    console.log('சுத்தம் செய்யவும்', node)
  }
}}>
```

[`ref` callback பயன்படுத்தும் உதாரணத்தை பார்க்கவும்.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

`<div>` DOM node screen-க்கு சேர்க்கப்படும் போது, DOM `node`-ஐ argument ஆக வைத்து React உங்கள் `ref` callback-ஐ call செய்யும். அந்த `<div>` DOM node நீக்கப்படும் போது, callback return செய்த cleanup function-ஐ React call செய்யும்.

நீங்கள் *வேறு* `ref` callback pass செய்யும் ஒவ்வொரு முறையும் React உங்கள் `ref` callback-ஐ call செய்யும். மேலுள்ள உதாரணத்தில், `(node) => { ... }` ஒவ்வொரு render-இலும் வேறு function ஆகும். உங்கள் component re-render ஆகும்போது, *முந்தைய* function `null` argument-உடன் call செய்யப்படும்; *அடுத்த* function DOM node-உடன் call செய்யப்படும்.

#### Parameters {/*ref-callback-parameters*/}

* `node`: ஒரு DOM node. Ref attach ஆகும்போது React DOM node-ஐ உங்களுக்கு pass செய்யும். ஒவ்வொரு render-இலும் `ref` callback-க்காக அதே function reference-ஐ pass செய்யாவிட்டால், component re-render ஆகும் ஒவ்வொரு முறையும் callback தற்காலிகமாக cleanup செய்யப்பட்டு மீண்டும் உருவாக்கப்படும்.

<Note>

#### React 19, `ref` callbacks-க்கு cleanup செயல்பாடுகளை சேர்த்தது. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Backwards compatibility-ஐ support செய்ய, `ref` callback-இலிருந்து cleanup function return செய்யப்படவில்லை என்றால், `ref` detach ஆகும் போது `node` `null` உடன் call செய்யப்படும். இந்த behavior எதிர்கால version-இல் நீக்கப்படும்.

</Note>

#### Returns {/*returns*/}

* **optional** `cleanup function`: `ref` detach ஆகும்போது React cleanup function-ஐ call செய்யும். `ref` callback ஒரு function return செய்யாவிட்டால், `ref` detach ஆகும் போது React callback-ஐ மீண்டும் `null` argument-உடன் call செய்யும். இந்த behavior எதிர்கால version-இல் நீக்கப்படும்.

#### Caveats {/*caveats*/}

* Strict Mode on ஆக இருந்தால், முதல் real setup-க்கு முன் React **development-க்கு மட்டும் கூடுதல் setup+cleanup cycle ஒன்றை** run செய்யும். உங்கள் cleanup logic setup logic-ஐ "mirror" செய்கிறதா, setup செய்கிறதை நிறுத்துகிறதா அல்லது undo செய்கிறதா என்பதை உறுதி செய்யும் stress-test இது. இது பிரச்சினை தருமானால், cleanup function-ஐ implement செய்யுங்கள்.
* நீங்கள் *வேறு* `ref` callback pass செய்தால், React *முந்தைய* callback-ன் cleanup function-ஐ call செய்யும். Cleanup function define செய்யப்படவில்லை என்றால், `ref` callback `null` argument-உடன் call செய்யப்படும். *அடுத்த* function DOM node-உடன் call செய்யப்படும்.

---

### React event object {/*react-event-object*/}

உங்கள் event handlers ஒரு *React event object*-ஐப் பெறும். இது சில நேரங்களில் "synthetic event" என்றும் அழைக்கப்படுகிறது.

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

இது underlying DOM events போலவே அதே standard-ஐ பின்பற்றுகிறது, ஆனால் சில browser inconsistencies-ஐ சரிசெய்கிறது.

சில React events browser-ன் native events-க்கு நேரடியாக map ஆகாது. உதாரணமாக `onMouseLeave`-இல், `e.nativeEvent` ஒரு `mouseout` event-ஐ point செய்யும். இந்த specific mapping public API-ன் பகுதி அல்ல; எதிர்காலத்தில் மாறலாம். ஏதாவது காரணத்திற்காக underlying browser event தேவைப்பட்டால், அதை `e.nativeEvent`-இலிருந்து வாசிக்கவும்.

#### Properties {/*react-event-object-properties*/}

React event objects சில standard [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) properties-ஐ implement செய்கின்றன:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): ஒரு boolean. Event DOM வழியாக bubble ஆகுமா என்பதை return செய்கிறது.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): ஒரு boolean. Event cancel செய்ய முடியுமா என்பதை return செய்கிறது.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): ஒரு DOM node. React tree-இல் current handler attach செய்யப்பட்ட node-ஐ return செய்கிறது.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): ஒரு boolean. `preventDefault` call செய்யப்பட்டதா என்பதை return செய்கிறது.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): ஒரு number. Event தற்போது எந்த phase-இல் உள்ளது என்பதை return செய்கிறது.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): ஒரு boolean. Event user மூலம் தொடங்கப்பட்டதா என்பதை return செய்கிறது.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): ஒரு DOM node. Event நிகழ்ந்த node-ஐ return செய்கிறது (அது தூரத்தில் உள்ள child ஆக இருக்கலாம்).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): ஒரு number. Event நிகழ்ந்த நேரத்தை return செய்கிறது.

கூடுதலாக, React event objects இந்த properties-ஐ வழங்குகின்றன:

* `nativeEvent`: ஒரு DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). Original browser event object.

#### Methods {/*react-event-object-methods*/}

React event objects சில standard [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) methods-ஐ implement செய்கின்றன:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Event-க்கான default browser action-ஐத் தடுக்கிறது.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): React tree வழியாக event propagation-ஐ நிறுத்துகிறது.

கூடுதலாக, React event objects இந்த methods-ஐ வழங்குகின்றன:

* `isDefaultPrevented()`: `preventDefault` call செய்யப்பட்டதா என்பதை காட்டும் boolean value-ஐ return செய்கிறது.
* `isPropagationStopped()`: `stopPropagation` call செய்யப்பட்டதா என்பதை காட்டும் boolean value-ஐ return செய்கிறது.
* `persist()`: React DOM உடன் பயன்படுத்தப்படாது. React Native-இல், event பிறகு event-ன் properties-ஐ வாசிக்க இதை call செய்யுங்கள்.
* `isPersistent()`: React DOM உடன் பயன்படுத்தப்படாது. React Native-இல், `persist` call செய்யப்பட்டதா என்பதை return செய்கிறது.

#### Caveats {/*react-event-object-caveats*/}

* `currentTarget`, `eventPhase`, `target`, மற்றும் `type` values உங்கள் React code எதிர்பார்க்கும் values-ஐ reflect செய்கின்றன. Internally, React event handlers-ஐ root-இல் attach செய்கிறது, ஆனால் இது React event objects-இல் reflect ஆகாது. உதாரணமாக, `e.currentTarget` underlying `e.nativeEvent.currentTarget`-ஐப் போல இருக்க வேண்டியதில்லை. Polyfilled events-க்கு, `e.type` (React event type) `e.nativeEvent.type` (underlying type)-இலிருந்து மாறுபடலாம்.

---

### `AnimationEvent` handler function {/*animationevent-handler*/}

[CSS animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) events-க்கான event handler type.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parameters {/*animationevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) properties கொண்ட [React event object](#react-event-object):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` handler function {/*clipboadevent-handler*/}

[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) events-க்கான event handler type.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parameters {/*clipboadevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) properties கொண்ட [React event object](#react-event-object):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` handler function {/*compositionevent-handler*/}

[Input method editor (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) events-க்கான event handler type.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parameters {/*compositionevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) properties கொண்ட [React event object](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` handler function {/*dragevent-handler*/}

[HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) events-க்கான event handler type.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    இழுக்கும் மூலம்
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop இலக்கு
  </div>
</>
```

#### Parameters {/*dragevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) properties கொண்ட [React event object](#react-event-object):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  இதில் inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties-உம் அடங்கும்:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` handler function {/*focusevent-handler*/}

Focus events-க்கான event handler type.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[ஒரு example-ஐ பார்க்கவும்.](#handling-focus-events)

#### Parameters {/*focusevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) properties கொண்ட [React event object](#react-event-object):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` handler function {/*event-handler*/}

Generic events-க்கான event handler type.

#### Parameters {/*event-handler-parameters*/}

* `e`: கூடுதல் properties இல்லாத [React event object](#react-event-object).

---

### `InputEvent` handler function {/*inputevent-handler*/}

`onBeforeInput` event-க்கான event handler type.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parameters {/*inputevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) properties கொண்ட [React event object](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` handler function {/*keyboardevent-handler*/}

Keyboard events-க்கான event handler type.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[ஒரு example-ஐ பார்க்கவும்.](#handling-keyboard-events)

#### Parameters {/*keyboardevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) properties கொண்ட [React event object](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` handler function {/*mouseevent-handler*/}

Mouse events-க்கான event handler type.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[ஒரு example-ஐ பார்க்கவும்.](#handling-mouse-events)

#### Parameters {/*mouseevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties கொண்ட [React event object](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` handler function {/*pointerevent-handler*/}

[Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)-க்கான event handler type.

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[ஒரு example-ஐ பார்க்கவும்.](#handling-pointer-events)

#### Parameters {/*pointerevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) properties கொண்ட [React event object](#react-event-object):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  இதில் inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties-உம் அடங்கும்:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` handler function {/*touchevent-handler*/}

[Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)-க்கான event handler type.

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parameters {/*touchevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) properties கொண்ட [React event object](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` handler function {/*transitionevent-handler*/}

CSS transition events-க்கான event handler type.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parameters {/*transitionevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) properties கொண்ட [React event object](#react-event-object):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` handler function {/*uievent-handler*/}

Generic UI events-க்கான event handler type.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameters {/*uievent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties கொண்ட [React event object](#react-event-object):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` handler function {/*wheelevent-handler*/}

`onWheel` event-க்கான event handler type.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parameters {/*wheelevent-handler-parameters*/}

* `e`: இந்த கூடுதல் [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) properties கொண்ட [React event object](#react-event-object):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  இதில் inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties-உம் அடங்கும்:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  இதில் inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties-உம் அடங்கும்:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Usage {/*usage*/}

### CSS styles பயன்படுத்துதல் {/*applying-css-styles*/}

React-இல், CSS class-ஐ [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) மூலம் குறிப்பிடுகிறீர்கள். இது HTML-இல் உள்ள `class` attribute போலவே வேலை செய்கிறது:

```js
<img className="avatar" />
```

பிறகு அதற்கான CSS rules-ஐ தனி CSS file-இல் எழுதுகிறீர்கள்:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

CSS files-ஐ எப்படி சேர்க்க வேண்டும் என்று React கட்டாயப்படுத்தாது. நேரடியான நிலையில், உங்கள் HTML-க்கு [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag ஒன்றை சேர்ப்பீர்கள். Build tool அல்லது framework பயன்படுத்தினால், உங்கள் project-க்கு CSS file சேர்ப்பது எப்படி என்பதை அதன் documentation-ல் பார்க்கவும்.

சில நேரங்களில் style values data-வைப் பொறுத்திருக்கும். சில styles-ஐ dynamic ஆக pass செய்ய `style` attribute பயன்படுத்துங்கள்:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


மேலுள்ள உதாரணத்தில், `style={{}}` என்பது special syntax அல்ல; `style={ }` [JSX curly braces](/learn/javascript-in-jsx-with-curly-braces)-க்குள் உள்ள வழக்கமான `{}` object மட்டுமே. உங்கள் styles JavaScript variables-ஐ சார்ந்திருக்கும்போது மட்டும் `style` attribute பயன்படுத்த பரிந்துரைக்கிறோம்.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={user.name + ' அவர்களின் படம்'}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### பல CSS classes-ஐ நிபந்தனையுடன் apply செய்வது எப்படி? {/*how-to-apply-multiple-css-classes-conditionally*/}

CSS classes-ஐ conditionally apply செய்ய, JavaScript பயன்படுத்தி `className` string-ஐ நீங்களே உருவாக்க வேண்டும்.

உதாரணமாக, `className={'row ' + (isSelected ? 'selected': '')}` என்பது `isSelected` `true` ஆக உள்ளதா என்பதன் அடிப்படையில் `className="row"` அல்லது `className="row selected"` உருவாக்கும்.

இதை அதிகம் readable ஆக்க, [`classnames`](https://github.com/JedWatson/classnames) போன்ற சிறிய helper library-ஐ பயன்படுத்தலாம்:

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

பல conditional classes இருந்தால் இது குறிப்பாக வசதியானது:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Ref மூலம் DOM node-ஐ கையாளுதல் {/*manipulating-a-dom-node-with-a-ref*/}

சில நேரங்களில், JSX-இல் உள்ள tag-க்கு தொடர்புடைய browser DOM node-ஐ பெற வேண்டியிருக்கும். உதாரணமாக, button click செய்யும்போது `<input>` focus ஆக வேண்டும் என்றால், browser `<input>` DOM node-இல் [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) call செய்ய வேண்டும்.

ஒரு tag-க்கான browser DOM node-ஐ பெற, [ref ஒன்றை declare செய்து](/reference/react/useRef) அதை அந்த tag-க்கு `ref` attribute ஆக pass செய்யுங்கள்:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

Screen-க்கு render ஆன பிறகு React DOM node-ஐ `inputRef.current`-க்குள் வைக்கும்.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Input-ஐ focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

Refs மூலம் [DOM-ஐ கையாளுவது பற்றி மேலும் வாசிக்கவும்](/learn/manipulating-the-dom-with-refs), மேலும் [இன்னும் பல examples-ஐ பார்க்கவும்.](/reference/react/useRef#usage)

மேம்பட்ட use cases-க்கு, `ref` attribute [callback function](#ref-callback)-ஐயும் ஏற்கும்.

---

### Inner HTML-ஐ ஆபத்தான முறையில் set செய்தல் {/*dangerously-setting-the-inner-html*/}

<<<<<<< HEAD
Raw HTML string-ஐ ஒரு element-க்கு இவ்வாறு pass செய்யலாம்:
=======
You can pass a raw HTML string or a [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) value to an element like so:
>>>>>>> 8efce7853d0fc59e615ed1c253799cf1798b8428

```js
const markup = { __html: '<p>சில raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**இது ஆபத்தானது. Underlying DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property போலவே, நீங்கள் மிகுந்த கவனத்துடன் நடக்க வேண்டும்! Markup முற்றிலும் நம்பத்தகுந்த source-இலிருந்து வராத வரை, இவ்வாறு [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability உருவாக்குவது சாத்தியம்.**

<<<<<<< HEAD
உதாரணமாக, Markdown-ஐ HTML ஆக மாற்றும் Markdown library பயன்படுத்தினால், அதன் parser-இல் bugs இல்லை என்று நீங்கள் நம்பினால், மற்றும் user தன்னுடைய input-ஐ மட்டுமே பார்க்கிறான் என்றால், கிடைக்கும் HTML-ஐ இவ்வாறு காட்டலாம்:
=======
If your site enforces [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), pass a `TrustedHTML` value created by your security policy as `__html`. React passes the value to the browser without converting it to a string, allowing the browser to validate it. Your policy must still ensure that any input used to create the value is trusted and sanitized.

For example, if you use a Markdown library that converts Markdown to HTML, you trust that its parser doesn't contain bugs, and the user only sees their own input, you can display the resulting HTML like this:
>>>>>>> 8efce7853d0fc59e615ed1c253799cf1798b8428

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_வணக்கம்,_ **Markdown**!');
  return (
    <>
      <label>
        Markdown உள்ளிடுங்கள்:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

`renderMarkdownToHTML` function-இல் மேலுள்ள example செய்வது போல, `{__html}` object HTML உருவாகும் இடத்திற்கு மிக அருகில் create செய்யப்பட வேண்டும். இதனால் உங்கள் code-இல் பயன்படுத்தப்படும் raw HTML அனைத்தும் தெளிவாக அப்படியே mark செய்யப்படும்; மேலும் HTML கொண்டிருக்கும் என்று நீங்கள் எதிர்பார்க்கும் variables மட்டுமே `dangerouslySetInnerHTML`-க்கு pass செய்யப்படும். `<div dangerouslySetInnerHTML={{__html: markup}} />` போல object-ஐ inline ஆக create செய்வது பரிந்துரைக்கப்படாது.

Arbitrary HTML render செய்வது ஏன் ஆபத்தானது என்பதை பார்க்க, மேலுள்ள code-ஐ இதனால் மாற்றுங்கள்:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("நீங்கள் தாக்கப்பட்டுள்ளீர்கள்")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML-இல் embed செய்யப்பட்ட code run ஆகும். ஒரு attacker இந்த security hole-ஐ பயன்படுத்தி user தகவலை திருடலாம் அல்லது அவர்களுக்குப் பதிலாக actions செய்யலாம். **நம்பத்தகுந்த மற்றும் sanitized data உடன் மட்டுமே `dangerouslySetInnerHTML` பயன்படுத்துங்கள்.**

---

### Mouse events கையாளுதல் {/*handling-mouse-events*/}

இந்த example சில பொதுவான [mouse events](#mouseevent-handler) மற்றும் அவை எப்போது fire ஆகின்றன என்பதை காட்டுகிறது.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        முதல் button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        இரண்டாவது button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Pointer events கையாளுதல் {/*handling-pointer-events*/}

இந்த example சில பொதுவான [pointer events](#pointerevent-handler) மற்றும் அவை எப்போது fire ஆகின்றன என்பதை காட்டுகிறது.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        முதல் child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        இரண்டாவது child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Focus events கையாளுதல் {/*handling-focus-events*/}

React-இல், [focus events](#focusevent-handler) bubble ஆகும். Focusing அல்லது blurring events parent element-க்கு வெளியிலிருந்து தொடங்கியதா என்பதை வேறுபடுத்த `currentTarget` மற்றும் `relatedTarget` பயன்படுத்தலாம். Child focus ஆகுதல், parent element focus ஆகுதல், மற்றும் முழு subtree-க்குள் focus நுழைவதையோ வெளியேறுவதையோ detect செய்வது எப்படி என்பதை இந்த example காட்டுகிறது.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        முதல் பெயர்:
        <input name="firstName" />
      </label>
      <label>
        கடைசி பெயர்:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Keyboard events கையாளுதல் {/*handling-keyboard-events*/}

இந்த example சில பொதுவான [keyboard events](#keyboardevent-handler) மற்றும் அவை எப்போது fire ஆகின்றன என்பதை காட்டுகிறது.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      முதல் பெயர்:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
