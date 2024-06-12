---
title: நிறுவல்
---

<Intro>

React ஆரம்பத்திலிருந்தே படிப்படியாக ஏற்றுக்கொள்ளும் வகையில் வடிவமைக்கப்பட்டுள்ளது. உங்களுக்குத் தேவையான அளவு Reactஐ பயன்படுத்திக்கொள்ளலாம். நீங்கள் React இன் சுவையைப் பெற விரும்பினாலும், ஒரு HTML பக்கத்திற்கு சில ஊடாடலைச் (interactivity) சேர்க்கவும் அல்லது சிக்கலான React-இயங்கும் பயன்பாட்டை (powered app) தொடங்க விரும்பினாலும், இந்தப் பகுதி உங்களுக்குத் தொடங்க உதவும்.

</Intro>

<YouWillLearn isChapter={true}>

* [புதிய React திட்டத்தை (project) எவ்வாறு தொடங்குவது](/learn/start-a-new-react-project)
* [ஏற்கனவேயுள்ள திட்டத்திற்கு (existing project) Reactஐ எவ்வாறு சேர்ப்பது](/learn/add-react-to-an-existing-project)
* [தொகுப்பை (editor) எப்படி அமைப்பது](/learn/editor-setup)
* [React டெவலப்பர் (developer) கருவிகளை எவ்வாறு நிறுவுவது](/learn/react-developer-tools)

</YouWillLearn>

## Reactஐ முயற்சிக்க {/*try-react*/}

React உடன் விளையாட நீங்கள் எதையும் நிறுவ (install) வேண்டியதில்லை. இந்த sandboxஐ திருத்த முயற்சிக்கவும்!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

மேல் வலது மூலையில் உள்ள "fork" பொத்தானை (button) அழுத்துவதன் மூலம் நீங்கள் அதை நேரடியாகத் திருத்தலாம் அல்லது புதிய தாவலில் (tab) திறக்கலாம்.

React ஆவணத்தில் (documentation) உள்ள பெரும்பாலான பக்கங்கள் இது போன்ற sandboxஐ கொண்டிருக்கின்றன. React ஆவணங்களுக்கு வெளியே, Reactஐ ஆதரிக்கும் பல ஆன்லைன் sandbox கள் உள்ளன: உதாரணமாக, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), அல்லது [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### தங்கள் கணினியில் (locally) reactஐ பயன்படுத்த {/*try-react-locally*/}

தங்கள் கணினியில் (locally) Reactஐ பயன்படுத்த, [இந்த HTML பக்கத்தைப் பதிவிறக்கவும்.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) அதை உங்கள் editorலும் உலாவியிலும் (browser) திறக்கவும்!

## புதிய React திட்டத்தைத்(project) தொடங்கவும் {/*start-a-new-react-project*/}

நீங்கள் react மூலம் ஒரு app அல்லது இணையதளத்தை (website) முழுமையாக உருவாக்க விரும்பினால், [புதிய react திட்டத்தைத் தொடங்கவும்.](/learn/start-a-new-react-project)
ஏற்கனவே உள்ள திட்டத்திற்கு எதிர்வினையைச் 

## ஏற்கனவேயுள்ள திட்டத்திற்கு (existing project) reactஐ சேர்க்க {/*add-react-to-an-existing-project*/}

உங்கள் தற்போதைய app அல்லது இணையதளத்தில் (website) reactஐ பயன்படுத்த முயற்சிக்க விரும்பினால், [ஏற்கனவேயுள்ள திட்டத்திற்கு  (existing project) reactஐ சேர்க்க.](/learn/add-react-to-an-existing-project)

## அடுத்த கட்டங்கள் {/*next-steps*/}

ஒவ்வொரு நாளும் நீங்கள் சந்திக்கும் மிக முக்கியமான react கருத்துகளின் (concepts) சுற்றுப்பயணத்திற்கு [விரைவு தொடக்க வழிகாட்டிக்குச்](/learn) செல்லவும்..

