---
title: State மூலம் Input-க்கு பதிலளித்தல்
---

<Intro>

UI-ஐ கையாள React ஒரு declarative வழியை வழங்குகிறது. UI-ன் தனித்தனி பகுதிகளை நேரடியாக manipulate செய்வதற்குப் பதிலாக, உங்கள் component இருக்கக்கூடிய வெவ்வேறு states-ஐ நீங்கள் விவரிக்கிறீர்கள்; user input-க்கு பதிலாக அவற்றுக்கிடையே switch செய்கிறீர்கள். Designers UI பற்றி சிந்திக்கும் முறைக்கு இது ஒத்ததாகும்.

</Intro>

<YouWillLearn>

* Declarative UI programming, imperative UI programming-இலிருந்து எப்படி வேறுபடுகிறது
* உங்கள் component இருக்கக்கூடிய வெவ்வேறு visual states-ஐ எப்படி பட்டியலிடுவது
* Code-இலிருந்து வெவ்வேறு visual states இடையிலான changes-ஐ எப்படி trigger செய்வது

</YouWillLearn>

## Declarative UI-யை imperative முறையுடன் ஒப்பிடுதல் {/*how-declarative-ui-compares-to-imperative*/}

UI interactions design செய்யும்போது, user actions-க்கு பதிலாக UI எப்படி *மாறுகிறது* என்று நீங்கள் நினைப்பீர்கள். User ஒரு பதிலை submit செய்ய அனுமதிக்கும் form ஒன்றைக் கருதுங்கள்:

* Form-இல் ஏதாவது type செய்தால், "சமர்ப்பி" button **enabled ஆகிறது.**
* "சமர்ப்பி" அழுத்தினால், form மற்றும் button இரண்டும் **disabled ஆகிறது,** மேலும் spinner **தோன்றுகிறது.**
* Network request வெற்றியடைந்தால், form **hidden ஆகிறது,** மேலும் "நன்றி" message **தோன்றுகிறது.**
* Network request தோல்வியடைந்தால், error message **தோன்றுகிறது,** மேலும் form மீண்டும் **enabled ஆகிறது.**

**Imperative programming**-இல், மேலே சொன்னவை interaction-ஐ implement செய்யும் முறையுடன் நேரடியாக பொருந்தும். இப்போது என்ன நடந்தது என்பதைப் பொறுத்து UI-ஐ manipulate செய்ய exact instructions எழுத வேண்டும். இதை சிந்திக்க இன்னொரு வழி: காரில் ஒருவரின் பக்கத்தில் அமர்ந்து, எங்கே திரும்ப வேண்டும் என்று ஒவ்வொரு turn-ஆக சொல்லுகிறீர்கள் என்று கற்பனை செய்யுங்கள்.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="JavaScript-ஐ குறிக்கும் பதட்டமான ஓட்டுநர் ஓட்டும் காரில், பயணி சிக்கலான turn-by-turn வழிநடத்தல்களின் வரிசையை செய்ய ஓட்டுநருக்கு கட்டளையிடுகிறார்." />

நீங்கள் எங்கே போக விரும்புகிறீர்கள் என்று அவர்களுக்கு தெரியாது; அவர்கள் உங்கள் commands-ஐ மட்டுமே பின்பற்றுகிறார்கள். (Directions தவறாக இருந்தால், நீங்கள் தவறான இடத்தில் முடிவடைவீர்கள்!) Spinner முதல் button வரை ஒவ்வொரு element-க்கும் "command" கொடுத்து, UI-ஐ *எப்படி* update செய்ய வேண்டும் என்று computer-க்கு சொல்ல வேண்டியதால் இது *imperative* என்று அழைக்கப்படுகிறது.

இந்த imperative UI programming example-இல், form React *இல்லாமல்* கட்டப்பட்டுள்ளது. இது browser [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)-ஐ மட்டும் பயன்படுத்துகிறது:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('நல்ல முயற்சி, ஆனால் தவறான பதில். மீண்டும் முயற்சிக்கவும்!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>நகர quiz</h2>
  <p>
    எந்த நகரம் இரண்டு கண்டங்களில் அமைந்துள்ளது?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>சமர்ப்பி</button>
  <p id="loading" style="display: none">ஏற்றப்படுகிறது...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">அது சரி!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

UI-ஐ imperatively manipulate செய்வது தனித்த examples-க்கு போதுமானதாக வேலை செய்யும்; ஆனால் சிக்கலான systems-இல் அதை manage செய்வது மிக வேகமாக கடினமாகிறது. இதுபோன்ற பல forms நிறைந்த page ஒன்றை update செய்வதை கற்பனை செய்யுங்கள். புதிய UI element அல்லது புதிய interaction சேர்க்கும்போது, bug ஒன்றை (உதாரணமாக, ஏதாவது show அல்லது hide செய்ய மறந்துவிடுதல்) சேர்க்கவில்லை என்பதை உறுதி செய்ய எல்லா existing code-ஐயும் கவனமாக check செய்ய வேண்டியிருக்கும்.

இந்த பிரச்சினையை தீர்க்கவே React கட்டப்பட்டது.

React-இல், நீங்கள் UI-ஐ நேரடியாக manipulate செய்வதில்லை--அதாவது components-ஐ நேரடியாக enable, disable, show, அல்லது hide செய்வதில்லை. அதற்கு பதிலாக, **நீங்கள் என்ன காட்ட வேண்டும் என்பதை declare செய்கிறீர்கள்;** UI-ஐ எப்படி update செய்வது என்பதை React தீர்மானிக்கிறது. எங்கு திரும்ப வேண்டும் என்று ஓட்டுநரிடம் துல்லியமாக சொல்லுவதற்குப் பதிலாக, taxi-யில் ஏறி நீங்கள் எங்கே போக விரும்புகிறீர்கள் என்று சொல்வதைப் போல நினைத்துக்கொள்ளுங்கள். உங்களை அங்கே கொண்டு சேர்ப்பது ஓட்டுநரின் வேலை; நீங்கள் நினைக்காத shortcuts கூட அவர்களுக்கு தெரிந்திருக்கலாம்!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="React ஓட்டும் காரில், பயணி map-இல் குறிப்பிட்ட இடத்துக்கு அழைத்து செல்லுமாறு கேட்கிறார். அதை எப்படி செய்வது என்பதை React கண்டுபிடிக்கிறது." />

## UI பற்றி declarative ஆக சிந்தித்தல் {/*thinking-about-ui-declaratively*/}

மேலே form ஒன்றை imperatively implement செய்வது எப்படி என்பதை பார்த்தீர்கள். React-இல் எப்படி சிந்திக்க வேண்டும் என்பதை நன்றாகப் புரிந்துகொள்ள, கீழே இந்த UI-ஐ React-இல் மீண்டும் implement செய்வதை படிப்படியாகப் பார்ப்பீர்கள்:

1. உங்கள் component-ன் வெவ்வேறு visual states-ஐ **அடையாளம் காணுங்கள்**
2. அந்த state changes-ஐ trigger செய்வது என்ன என்பதை **தீர்மானியுங்கள்**
3. `useState` பயன்படுத்தி state-ஐ memory-இல் **represent செய்யுங்கள்**
4. தேவையில்லாத state variables-ஐ **நீக்குங்கள்**
5. State set செய்ய event handlers-ஐ **இணைக்குங்கள்**

### Step 1: உங்கள் component-ன் வெவ்வேறு visual states-ஐ அடையாளம் காணுங்கள் {/*step-1-identify-your-components-different-visual-states*/}

Computer science-இல், ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine) பல “states”-இல் ஒன்றில் இருக்கும் என்று நீங்கள் கேள்விப்பட்டிருக்கலாம். Designer உடன் வேலை செய்தால், வெவ்வேறு "visual states"-க்கான mockups பார்த்திருக்கலாம். React design மற்றும் computer science சந்திக்கும் இடத்தில் இருப்பதால், இந்த இரண்டு ideas-உம் inspiration ஆகின்றன.

முதலில், user பார்க்கக்கூடிய UI-ன் எல்லா வெவ்வேறு "states"-ஐ visualize செய்ய வேண்டும்:

* **Empty**: Form-இல் disabled "சமர்ப்பி" button உள்ளது.
* **Typing**: Form-இல் enabled "சமர்ப்பி" button உள்ளது.
* **Submitting**: Form முழுவதும் disabled. Spinner காட்டப்படுகிறது.
* **Success**: Form-க்கு பதிலாக "நன்றி" message காட்டப்படுகிறது.
* **Error**: Typing state போலவே, ஆனால் கூடுதலாக error message உள்ளது.

Designer போலவே, logic சேர்ப்பதற்கு முன் வெவ்வேறு states-க்கான "mock up" அல்லது "mocks" உருவாக்க விரும்புவீர்கள். உதாரணமாக, form-ன் visual பகுதியுக்கான mock இதோ. இந்த mock, default value `'empty'` கொண்ட `status` என்ற prop மூலம் control செய்யப்படுகிறது:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>அது சரி!</h1>
  }
  return (
    <>
      <h2>நகர quiz</h2>
      <p>
        காற்றை குடிக்கக்கூடிய நீராக மாற்றும் billboard எந்த நகரத்தில் உள்ளது?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          சமர்ப்பி
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

அந்த prop-க்கு நீங்கள் விரும்பும் எந்த பெயரையும் தரலாம்; பெயரிடுதல் முக்கியமல்ல. Success message தோன்றுவதை பார்க்க `status = 'empty'` என்பதை `status = 'success'` ஆக edit செய்து பாருங்கள். Logic ஒன்றையும் wire up செய்வதற்கு முன் UI-ஐ விரைவாக iterate செய்ய mocking உதவுகிறது. அதே component-ன் மேலும் விரிவான prototype இதோ; இதுவும் இன்னும் `status` prop மூலம் "controlled" ஆகிறது:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>அது சரி!</h1>
  }
  return (
    <>
      <h2>நகர quiz</h2>
      <p>
        காற்றை குடிக்கக்கூடிய நீராக மாற்றும் billboard எந்த நகரத்தில் உள்ளது?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          சமர்ப்பி
        </button>
        {status === 'error' &&
          <p className="Error">
            நல்ல முயற்சி, ஆனால் தவறான பதில். மீண்டும் முயற்சிக்கவும்!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### பல visual states-ஐ ஒரே நேரத்தில் காட்டுதல் {/*displaying-many-visual-states-at-once*/}

ஒரு component-க்கு பல visual states இருந்தால், அவற்றையெல்லாம் ஒரே page-இல் காட்டுவது வசதியாக இருக்கும்:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>அது சரி!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        சமர்ப்பி
      </button>
      {status === 'error' &&
        <p className="Error">
          நல்ல முயற்சி, ஆனால் தவறான பதில். மீண்டும் முயற்சிக்கவும்!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

இத்தகைய pages பெரும்பாலும் "living styleguides" அல்லது "storybooks" என்று அழைக்கப்படுகின்றன.

</DeepDive>

### Step 2: அந்த state changes-ஐ trigger செய்வது என்ன என்பதை தீர்மானியுங்கள் {/*step-2-determine-what-triggers-those-state-changes*/}

இரண்டு வகை inputs-க்கு பதிலாக state updates trigger செய்யலாம்:

* Button click செய்தல், field-இல் type செய்தல், link navigate செய்தல் போன்ற **human inputs.**
* Network response வருதல், timeout முடிதல், image load ஆகுதல் போன்ற **computer inputs.**

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="ஒரு விரல்." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="ஒன்றுகள் மற்றும் பூஜ்ஜியங்கள்." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

இரண்டு நிலைகளிலும், **UI-ஐ update செய்ய [state variables](/learn/state-a-components-memory#anatomy-of-usestate)-ஐ set செய்ய வேண்டும்.** நீங்கள் உருவாக்கும் form-க்கு, சில வெவ்வேறு inputs-க்கு பதிலாக state மாற்ற வேண்டியிருக்கும்:

* **Text input மாற்றுதல்** (human), text box empty ஆக உள்ளதா இல்லையா என்பதன் அடிப்படையில், அதை *Empty* state-இலிருந்து *Typing* state-க்கு அல்லது மீண்டும் மாற்ற வேண்டும்.
* **சமர்ப்பி button click செய்தல்** (human), அதை *Submitting* state-க்கு மாற்ற வேண்டும்.
* **வெற்றிகரமான network response** (computer), அதை *Success* state-க்கு மாற்ற வேண்டும்.
* **தோல்வியடைந்த network response** (computer), பொருந்தும் error message உடன் அதை *Error* state-க்கு மாற்ற வேண்டும்.

<Note>

Human inputs-க்கு பெரும்பாலும் [event handlers](/learn/responding-to-events) தேவைப்படும் என்பதை கவனிக்கவும்!

</Note>

இந்த flow-ஐ visualize செய்ய உதவ, ஒவ்வொரு state-ஐயும் paper-இல் label கொண்ட circle ஆகவும், இரண்டு states இடையிலான ஒவ்வொரு change-ஐயும் arrow ஆகவும் வரைந்து பாருங்கள். இவ்வாறு பல flows-ஐ sketch செய்து, implementation-க்கு முன்பே bugs-ஐ தெளிவுபடுத்தலாம்.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="இடமிருந்து வலமாக நகரும் 5 nodes கொண்ட flow chart. 'empty' என்று label செய்யப்பட்ட முதல் node-க்கு 'start typing' என்று label செய்யப்பட்ட edge ஒன்று உள்ளது; அது 'typing' node-க்கு இணைக்கிறது. அந்த node-க்கு 'press submit' என்று label செய்யப்பட்ட edge ஒன்று உள்ளது; அது 'submitting' node-க்கு இணைக்கிறது; அதற்கு இரண்டு edges உள்ளன. இடது edge 'network error' என்று label செய்யப்பட்டு 'error' node-க்கு இணைகிறது. வலது edge 'network success' என்று label செய்யப்பட்டு 'success' node-க்கு இணைகிறது.">

Form நிலைகள்

</Diagram>

</DiagramGroup>

### Step 3: `useState` மூலம் state-ஐ memory-இல் குறிக்குங்கள் {/*step-3-represent-the-state-in-memory-with-usestate*/}

அடுத்ததாக, உங்கள் component-ன் visual states-ஐ [`useState`](/reference/react/useState) மூலம் memory-இல் represent செய்ய வேண்டும். தெளிவு முக்கியம்: ஒவ்வொரு state பகுதியும் ஒரு "moving piece"; **"moving pieces" எவ்வளவு குறைவாக இருக்குமோ அவ்வளவு நல்லது.** அதிக complexity அதிக bugs-க்கு வழிவகுக்கும்!

*கண்டிப்பாக* இருக்க வேண்டிய state-இலிருந்து தொடங்குங்கள். உதாரணமாக, input-க்கான `answer`-ஐ store செய்ய வேண்டும்; கடைசி error-ஐ store செய்ய `error` (இருந்தால்) தேவைப்படும்:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

பிறகு, நீங்கள் display செய்ய விரும்பும் visual states-இல் எது என்பதை represent செய்ய ஒரு state variable தேவைப்படும். அதை memory-இல் represent செய்ய பொதுவாக ஒன்றுக்கு மேற்பட்ட வழிகள் இருக்கும்; எனவே அதைப் பரிசோதிக்க வேண்டியிருக்கும்.

உடனடியாக சிறந்த வழியை கண்டுபிடிக்க முடியவில்லை என்றால், சாத்தியமான எல்லா visual states-உம் cover ஆகின்றன என்று *நிச்சயமாக* உறுதி செய்யும் அளவு state சேர்ப்பதிலிருந்து தொடங்குங்கள்:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

உங்கள் முதல் idea சிறந்ததாக இருக்காமல் இருக்கலாம்; அது பரவாயில்லை--state-ஐ refactor செய்வது process-ன் ஒரு பகுதி!

### Step 4: அத்தியாவசியமற்ற state variables-ஐ நீக்குங்கள் {/*step-4-remove-any-non-essential-state-variables*/}

State content-இல் duplication தவிர்த்து, essential ஆனதை மட்டும் track செய்ய விரும்புவீர்கள். உங்கள் state structure-ஐ refactor செய்ய சிறிது நேரம் செலவிடுவது components-ஐ புரிந்துகொள்ள உதவும், duplication-ஐ குறைக்கும், மற்றும் unintended meanings-ஐ தவிர்க்கும். உங்கள் இலக்கு: **memory-இல் உள்ள state, user பார்க்க வேண்டிய எந்த valid UI-யையும் represent செய்யாத நிலைகளைத் தவிர்ப்பது.** (உதாரணமாக, ஒரே நேரத்தில் error message காட்டியும் input-ஐ disable செய்தும் இருக்க வேண்டாம்; அப்படி இருந்தால் user error-ஐ சரிசெய்ய முடியாது!)

உங்கள் state variables பற்றி கேட்கக்கூடிய சில கேள்விகள்:

* **இந்த state ஒரு paradox ஏற்படுத்துகிறதா?** உதாரணமாக, `isTyping` மற்றும் `isSubmitting` இரண்டும் ஒரே நேரத்தில் `true` ஆக இருக்க முடியாது. Paradox என்றால் state போதுமான அளவு constrained இல்லை என்பதைக் குறிக்கும். இரண்டு booleans-க்கு நான்கு combinations இருக்கலாம், ஆனால் மூன்றே valid states-க்கு பொருந்தும். "Impossible" state-ஐ நீக்க, இவற்றை `'typing'`, `'submitting'`, அல்லது `'success'` என்ற மூன்று values-இல் ஒன்றாக இருக்க வேண்டிய `status`-ஆக combine செய்யலாம்.
* **அதே தகவல் ஏற்கனவே வேறு state variable-இல் கிடைக்கிறதா?** இன்னொரு paradox: `isEmpty` மற்றும் `isTyping` ஒரே நேரத்தில் `true` ஆக இருக்க முடியாது. இவற்றை தனித்தனி state variables-ஆக வைத்தால், அவை sync-இலிருந்து விலகி bugs ஏற்படுத்தும் அபாயம் உண்டு. நல்ல விஷயம், `isEmpty`-ஐ நீக்கி அதற்குப் பதிலாக `answer.length === 0` check செய்யலாம்.
* **வேறு state variable-ன் inverse-இலிருந்து அதே தகவலை பெற முடியுமா?** `isError` தேவையில்லை; அதற்கு பதிலாக `error !== null` check செய்யலாம்.

இந்த clean-up-க்குப் பிறகு, 7-இலிருந்து 3 *essential* state variables மட்டும் இருக்கும்:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Functionality உடையாமல் இவற்றில் எதையும் நீக்க முடியாது என்பதால், இவை essential என்பதை அறிவீர்கள்.

<DeepDive>

#### Reducer மூலம் “சாத்தியமற்ற” states-ஐ நீக்குதல் {/*eliminating-impossible-states-with-a-reducer*/}

இந்த மூன்று variables இந்த form-ன் state-க்கு போதுமான representation ஆகும். ஆனால் இன்னும் முழுமையாக பொருள் இல்லாத சில intermediate states உள்ளன. உதாரணமாக, `status` `'success'` ஆக இருக்கும்போது non-null `error` பொருள் தராது. State-ஐ இன்னும் துல்லியமாக model செய்ய, அதை [reducer-க்குள் extract செய்யலாம்.](/learn/extracting-state-logic-into-a-reducer) Reducers பல state variables-ஐ single object-ஆக unify செய்து, தொடர்புடைய logic அனைத்தையும் ஒன்றாக consolidate செய்ய அனுமதிக்கின்றன!

</DeepDive>

### Step 5: State அமைக்க event handlers-ஐ இணைக்குங்கள் {/*step-5-connect-the-event-handlers-to-set-state*/}

இறுதியாக, state update செய்யும் event handlers உருவாக்குங்கள். எல்லா event handlers-உம் wired up செய்யப்பட்ட final form கீழே உள்ளது:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>அது சரி!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>நகர quiz</h2>
      <p>
        காற்றை குடிக்கக்கூடிய நீராக மாற்றும் billboard எந்த நகரத்தில் உள்ளது?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          சமர்ப்பி
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('நல்ல முயற்சி, ஆனால் தவறான பதில். மீண்டும் முயற்சிக்கவும்!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

இந்த code original imperative example-ஐ விட நீளமாக இருந்தாலும், இது மிகவும் குறைவாக fragile. எல்லா interactions-ஐயும் state changes ஆக express செய்வது, பின்னர் existing states உடையாமல் புதிய visual states சேர்க்க அனுமதிக்கிறது. Interaction logic-ஐ மாற்றாமல், ஒவ்வொரு state-இலும் என்ன display செய்ய வேண்டும் என்பதையும் மாற்ற அனுமதிக்கிறது.

<Recap>

* Declarative programming என்பது UI-ஐ micromanage செய்வதற்குப் பதிலாக (imperative), ஒவ்வொரு visual state-க்கும் UI-ஐ விவரிப்பதாகும்.
* Component develop செய்யும்போது:
  1. அதன் எல்லா visual states-ஐ அடையாளம் காணுங்கள்.
  2. State changes-க்கான human மற்றும் computer triggers-ஐ தீர்மானியுங்கள்.
  3. `useState` மூலம் state-ஐ model செய்யுங்கள்.
  4. Bugs மற்றும் paradoxes தவிர்க்க non-essential state-ஐ நீக்குங்கள்.
  5. State set செய்ய event handlers-ஐ இணைக்குங்கள்.

</Recap>



<Challenges>

#### CSS class ஒன்றை சேர்த்தும் நீக்கியும் பாருங்கள் {/*add-and-remove-a-css-class*/}

Picture-ஐ click செய்தால் outer `<div>`-இலிருந்து `background--active` CSS class *நீங்கும்*, ஆனால் `<img>`-க்கு `picture--active` class *சேரும்* வகையில் செய்யுங்கள். Background-ஐ மீண்டும் click செய்தால் original CSS classes restore ஆக வேண்டும்.

Visual ஆக, picture-ஐ click செய்தால் purple background நீங்கி picture border highlight ஆக வேண்டும். Picture-க்கு வெளியே click செய்தால் background highlight ஆக வேண்டும், ஆனால் picture border highlight நீங்க வேண்டும்.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="இந்தோனேசியாவின் Kampung Pelangi-இல் உள்ள வானவில் வீடுகள்"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

இந்த component-க்கு இரண்டு visual states உள்ளன: image active ஆக இருக்கும் நிலை, image inactive ஆக இருக்கும் நிலை:

* Image active ஆக இருக்கும்போது, CSS classes `background` மற்றும் `picture picture--active`.
* Image inactive ஆக இருக்கும்போது, CSS classes `background background--active` மற்றும் `picture`.

Image active ஆக உள்ளதா என்பதை நினைவில் கொள்ள ஒரு boolean state variable போதுமானது. Original task CSS classes-ஐ remove அல்லது add செய்வதாக இருந்தது. ஆனால் React-இல் UI elements-ஐ *manipulate* செய்வதற்குப் பதிலாக, நீங்கள் என்ன பார்க்க விரும்புகிறீர்கள் என்பதை *describe* செய்ய வேண்டும். எனவே current state அடிப்படையில் இரு CSS classes-ஐயும் calculate செய்ய வேண்டும். Image click செய்தது background click ஆக register ஆகாமல் இருக்க [propagation-ஐ நிறுத்தவும்](/learn/responding-to-events#stopping-propagation) வேண்டும்.

Image-ஐ click செய்து, பிறகு அதன் வெளியே click செய்து இந்த version வேலை செய்கிறதா verify செய்யுங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="இந்தோனேசியாவின் Kampung Pelangi-இல் உள்ள வானவில் வீடுகள்"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

மாற்றாக, இரண்டு தனித்த JSX chunks-ஐ return செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="இந்தோனேசியாவின் Kampung Pelangi-இல் உள்ள வானவில் வீடுகள்"
          src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="இந்தோனேசியாவின் Kampung Pelangi-இல் உள்ள வானவில் வீடுகள்"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

இரண்டு வெவ்வேறு JSX chunks ஒரே tree-ஐ describe செய்தால், அவற்றின் nesting (முதல் `<div>` → முதல் `<img>`) align ஆக வேண்டும் என்பதை நினைவில் கொள்ளுங்கள். இல்லையெனில், `isActive` toggle செய்வது கீழுள்ள முழு tree-ஐ recreate செய்து [அதன் state-ஐ reset செய்யும்.](/learn/preserving-and-resetting-state) அதனால், இரு cases-இலும் ஒரேபோன்ற JSX tree return செய்யப்படுமானால், அவற்றை single JSX piece ஆக எழுதுவது நல்லது.

</Solution>

#### Profile திருத்தி {/*profile-editor*/}

Plain JavaScript மற்றும் DOM மூலம் implement செய்யப்பட்ட சிறிய form இதோ. அதன் behavior-ஐ புரிந்துகொள்ள அதை பயன்படுத்திப் பாருங்கள்:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Profile-ஐ திருத்து') {
    editButton.textContent = 'Profile-ஐ சேமி';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profile-ஐ திருத்து';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'வணக்கம், ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'வணக்கம், ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    முதல் பெயர்:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    கடைசி பெயர்:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profile-ஐ திருத்து</button>
  <p><i id="helloText">வணக்கம், Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

இந்த form இரண்டு modes இடையே switch செய்கிறது: editing mode-இல் inputs தெரியும்; viewing mode-இல் result மட்டும் தெரியும். நீங்கள் இருக்கும் mode-ஐப் பொறுத்து button label "திருத்து" மற்றும் "சேமி" இடையே மாறும். Inputs மாற்றும்போது, கீழே உள்ள welcome message real time-இல் update ஆகும்.

கீழுள்ள sandbox-இல் இதை React-இல் மீண்டும் implement செய்வதே உங்கள் பணியாகும். வசதிக்காக markup ஏற்கனவே JSX ஆக மாற்றப்பட்டுள்ளது, ஆனால் original போல inputs show மற்றும் hide ஆகும்படி நீங்கள் செய்ய வேண்டும்.

கீழே உள்ள text-ஐயும் அது update செய்கிறது என்பதை உறுதி செய்யுங்கள்!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        முதல் பெயர்:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        கடைசி பெயர்:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Profile-ஐ திருத்து
      </button>
      <p><i>வணக்கம், Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Input values-ஐ hold செய்ய `firstName` மற்றும் `lastName` என்ற இரண்டு state variables தேவைப்படும். Inputs display செய்ய வேண்டுமா இல்லையா என்பதை hold செய்ய `isEditing` state variable-உம் தேவைப்படும். `fullName` variable _தேவையில்லை_; ஏனெனில் full name எப்போதும் `firstName` மற்றும் `lastName` இலிருந்து calculate செய்யலாம்.

இறுதியாக, `isEditing`-ஐப் பொறுத்து inputs show அல்லது hide செய்ய [conditional rendering](/learn/conditional-rendering) பயன்படுத்த வேண்டும்.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        முதல் பெயர்:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        கடைசி பெயர்:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Profile-ஐ சேமி' : 'Profile-ஐ திருத்து'}
      </button>
      <p><i>வணக்கம், {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

இந்த solution-ஐ original imperative code உடன் compare செய்யுங்கள். அவை எப்படி வேறுபடுகின்றன?

</Solution>

#### React இல்லாமல் imperative தீர்வை refactor செய்தல் {/*refactor-the-imperative-solution-without-react*/}

முந்தைய challenge-இலிருந்த original sandbox இதோ; இது React இல்லாமல் imperatively எழுதப்பட்டுள்ளது:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Profile-ஐ திருத்து') {
    editButton.textContent = 'Profile-ஐ சேமி';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profile-ஐ திருத்து';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'வணக்கம், ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'வணக்கம், ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    முதல் பெயர்:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    கடைசி பெயர்:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profile-ஐ திருத்து</button>
  <p><i id="helloText">வணக்கம், Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

React இல்லை என்று கற்பனை செய்யுங்கள். Logic குறைவாக fragile ஆகவும் React version-க்கு இன்னும் ஒத்ததாகவும் இருக்கும் வகையில் இந்த code-ஐ refactor செய்ய முடியுமா? React போல state explicit ஆக இருந்தால் அது எப்படி இருக்கும்?

எங்கே தொடங்குவது என்று யோசிக்க சிரமமாக இருந்தால், கீழுள்ள stub-இல் structure-ன் பெரும்பாலானது ஏற்கனவே உள்ளது. இங்கிருந்து தொடங்கினால், `updateDOM` function-இல் missing logic-ஐ நிரப்புங்கள். (தேவைப்பட்டால் original code-ஐ பார்க்கவும்.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Profile-ஐ சேமி';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Profile-ஐ திருத்து';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    முதல் பெயர்:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    கடைசி பெயர்:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profile-ஐ திருத்து</button>
  <p><i id="helloText">வணக்கம், Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Missing logic-இல் inputs மற்றும் content display-ஐ toggle செய்தலும் labels-ஐ update செய்தலும் அடங்கும்:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Profile-ஐ சேமி';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profile-ஐ திருத்து';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'வணக்கம், ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    முதல் பெயர்:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    கடைசி பெயர்:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profile-ஐ திருத்து</button>
  <p><i id="helloText">வணக்கம், Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

நீங்கள் எழுதிய `updateDOM` function, state set செய்யும்போது React internally என்ன செய்கிறது என்பதை காட்டுகிறது. (ஆனால் கடைசியாக set செய்யப்பட்டதிலிருந்து மாறாத properties-க்காக DOM-ஐத் தொடுவதை React தவிர்க்கிறது.)

</Solution>

</Challenges>
