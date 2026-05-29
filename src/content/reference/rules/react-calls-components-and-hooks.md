---
title: React தான் Components மற்றும் Hooks-ஐ அழைக்கிறது
---

<Intro>
User experience-ஐ optimize செய்ய தேவையானபோது components மற்றும் Hooks-ஐ render செய்வதற்கு React பொறுப்பாகும். இது declarative: உங்கள் component logic-இல் என்ன render செய்ய வேண்டும் என்பதை React-க்கு சொல்கிறீர்கள்; அதை உங்கள் user-க்கு எவ்வாறு சிறந்த முறையில் காட்டுவது என்பதை React தீர்மானிக்கும்.
</Intro>

<InlineToc />

---

## Component functions-ஐ நேரடியாக ஒருபோதும் அழைக்க வேண்டாம் {/*never-call-component-functions-directly*/}
Components JSX-இல் மட்டுமே பயன்படுத்தப்பட வேண்டும். அவற்றை சாதாரண functions போல அழைக்க வேண்டாம். React அவற்றை அழைக்க வேண்டும்.

[Rendering நடக்கும் போது](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code) உங்கள் component function எப்போது அழைக்கப்பட வேண்டும் என்பதை React தீர்மானிக்க வேண்டும். React-இல், இதை JSX பயன்படுத்தி செய்கிறீர்கள்.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ நல்லது: Components-ஐ JSX-இல் மட்டும் பயன்படுத்துங்கள்
}
```

```js {expectedErrors: {'react-compiler': [2]}} {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 தவறு: அவற்றை நேரடியாக ஒருபோதும் அழைக்க வேண்டாம்
}
```

ஒரு component Hooks கொண்டிருந்தால், components loop-இல் அல்லது conditionally நேரடியாக அழைக்கப்படும் போது [Hooks விதிகளை](/reference/rules/rules-of-hooks) மீறுவது சாத்தியம்.

Rendering-ஐ React orchestrate செய்ய அனுமதிப்பதால் பல நன்மைகள் கிடைக்கும்:

* **Components functions-ஐ விட அதிகமாக மாறுகின்றன.** Tree-இல் component-இன் identity-க்கு இணைக்கப்பட்ட Hooks மூலம் _local state_ போன்ற அம்சங்களை React அவற்றில் சேர்க்க முடியும்.
* **Component types reconciliation-இல் பங்கேற்கின்றன.** உங்கள் components-ஐ React அழைக்க அனுமதிப்பதன் மூலம், உங்கள் tree-இன் conceptual structure பற்றி அதற்கு மேலும் சொல்கிறீர்கள். உதாரணமாக, `<Feed>` render செய்வதிலிருந்து `<Profile>` page-க்கு மாறும்போது, அவற்றை re-use செய்ய React முயற்சிக்காது.
* **React உங்கள் user experience-ஐ மேம்படுத்த முடியும்.** உதாரணமாக, component calls இடையே browser சில வேலை செய்ய அனுமதிக்க முடியும்; இதனால் பெரிய component tree மீண்டும் render ஆகும்போது main thread block ஆகாது.
* **சிறந்த debugging அனுபவம்.** Components library அறிந்த first-class citizens ஆக இருந்தால், development-இல் introspection செய்ய வளமான developer tools உருவாக்க முடியும்.
* **மேலும் திறமையான reconciliation.** Tree-இல் எந்த components மீண்டும் render ஆக வேண்டும் என்பதை React துல்லியமாக தீர்மானித்து, தேவையில்லாதவற்றை skip செய்ய முடியும். இது உங்கள் app-ஐ வேகமானதாகவும் responsive ஆகவும் ஆக்கும்.

---

## Hooks-ஐ சாதாரண values போல ஒருபோதும் பகிர வேண்டாம் {/*never-pass-around-hooks-as-regular-values*/}

Hooks components அல்லது Hooks உள்ளே மட்டுமே அழைக்கப்பட வேண்டும். அவற்றை சாதாரண value போல இடமாற்ற வேண்டாம்.

Hooks ஒரு component-க்கு React அம்சங்களைச் சேர்க்க அனுமதிக்கின்றன. அவை எப்போதும் function ஆகவே அழைக்கப்பட வேண்டும்; சாதாரண value போல ஒருபோதும் pass செய்யப்படக்கூடாது. இது _local reasoning_ எனப்படும் திறனை அளிக்கிறது: ஒரு component-ஐ தனியாகப் பார்த்தாலே அது செய்யக்கூடிய அனைத்தையும் developers புரிந்துகொள்ள முடியும்.

இந்த விதியை மீறினால், React உங்கள் component-ஐ தானாக optimize செய்ய முடியாமல் போகும்.

### Hook-ஐ dynamically mutate செய்ய வேண்டாம் {/*dont-dynamically-mutate-a-hook*/}

Hooks முடிந்தவரை "static" ஆக இருக்க வேண்டும். அதாவது, அவற்றை dynamically mutate செய்யக்கூடாது. உதாரணமாக, higher order Hooks எழுதக்கூடாது:

```js {expectedErrors: {'react-compiler': [2, 3]}} {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 தவறு: higher order Hooks எழுத வேண்டாம்
  const data = useDataWithLogging();
}
```

Hooks immutable ஆக இருக்க வேண்டும்; mutate செய்யப்படக்கூடாது. Hook ஒன்றை dynamically mutate செய்வதற்குப் பதிலாக, தேவையான செயல்பாட்டுடன் Hook-இன் static version ஒன்றை உருவாக்குங்கள்.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ நல்லது: Hook-இன் புதிய version உருவாக்குங்கள்
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### Hooks-ஐ dynamically பயன்படுத்த வேண்டாம் {/*dont-dynamically-use-hooks*/}

Hooks dynamically பயன்படுத்தப்படக்கூடாது. உதாரணமாக, Hook ஒன்றை value ஆக pass செய்து component-இல் dependency injection செய்வதற்குப் பதிலாக:

```js {expectedErrors: {'react-compiler': [2]}} {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 தவறு: Hooks-ஐ props ஆக pass செய்ய வேண்டாம்
}
```

Hook call-ஐ எப்போதும் அந்த component-க்குள் inline செய்து, தேவையான logic-ஐ அங்கேயே கையாள வேண்டும்.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ நல்லது: Hook-ஐ நேரடியாகப் பயன்படுத்துங்கள்
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

இந்த முறையில், `<Button />`-ஐப் புரிந்துகொள்வதும் debug செய்வதும் மிகவும் மேம்படும். Hooks dynamic முறையில் பயன்படுத்தப்பட்டால், உங்கள் app-இன் complexity பெரிதாக அதிகரிக்கும்; local reasoning தடைபடும்; நீண்டகாலத்தில் உங்கள் team குறைவாக productive ஆகும். மேலும் Hooks conditionally அழைக்கப்படக்கூடாது என்ற [Hooks விதிகளை](/reference/rules/rules-of-hooks) தவறுதலாக மீறுவதும் மேம்படும். Tests-க்கு components mock செய்ய வேண்டும் என்று தோன்றினால், canned data-உடன் பதிலளிக்க server-ஐ mock செய்வது சிறந்தது. சாத்தியமானால், உங்கள் app-ஐ end-to-end tests மூலம் சோதிப்பதும் பொதுவாக மேலும் பயனுள்ளதாக இருக்கும்.
