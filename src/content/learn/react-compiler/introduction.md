---
title: அறிமுகம்
---

<Intro>
React Compiler என்பது உங்கள் React app-ஐ தானாக optimize செய்யும் புதிய build-time tool. இது plain JavaScript உடன் வேலை செய்கிறது, மேலும் [React விதிகள்](/reference/rules)-ஐ புரிந்துகொள்கிறது; எனவே இதைப் பயன்படுத்த எந்த code-ஐயும் மீண்டும் எழுத வேண்டியதில்லை.
</Intro>

<YouWillLearn>

* React Compiler என்ன செய்கிறது
* Compiler-ஐ தொடங்குவது எப்படி
* Incremental adoption strategies
* ஏதாவது தவறாகும்போது debugging மற்றும் troubleshooting
* உங்கள் React library-யில் compiler-ஐ பயன்படுத்துதல்

</YouWillLearn>

## React Compiler என்ன செய்கிறது? {/*what-does-react-compiler-do*/}

React Compiler, build time-இல் உங்கள் React application-ஐ தானாக optimize செய்கிறது. Optimization இல்லாமலேயே React பெரும்பாலும் போதுமான வேகமாக இருக்கும்; ஆனால் சில நேரங்களில் app responsive ஆக இருக்க components மற்றும் values-ஐ கைமுறையாக memoize செய்ய வேண்டியிருக்கும். இந்த manual memoization சலிப்பானது, தவறாக செய்வது சாத்தியம், மேலும் maintain செய்ய கூடுதல் code சேர்க்கிறது. React Compiler இந்த optimization-ஐ உங்களுக்காக தானாக செய்கிறது; இந்த மனச்சுமையிலிருந்து விடுவித்து features உருவாக்குவதில் கவனம் செலுத்த உதவுகிறது.

### React Compiler-க்கு முன் {/*before-react-compiler*/}

Compiler இல்லாமல், re-renders-ஐ optimize செய்ய components மற்றும் values-ஐ கைமுறையாக memoize செய்ய வேண்டும்:

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```


<Note>

இந்த manual memoization-இல் memoization-ஐ உடைக்கும் ஒரு நுணுக்கமான bug உள்ளது:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

`handleClick` `useCallback`-ஆல் wrapped இருந்தாலும், `() => handleClick(item)` என்ற arrow function, component render ஆகும் ஒவ்வொரு முறையும் புதிய function ஒன்றை உருவாக்குகிறது. இதனால் `Item` எப்போதும் புதிய `onClick` prop-ஐப் பெறும்; memoization உடையும்.

React Compiler, arrow function இருந்தாலும் இல்லாவிட்டாலும், இதை சரியாக optimize செய்ய முடியும்; `props.onClick` மாறும்போது மட்டுமே `Item` re-render ஆகும் என்பதை உறுதிசெய்கிறது.

</Note>

### React Compiler-க்கு பின் {/*after-react-compiler*/}

React Compiler உடன், manual memoization இல்லாமல் அதே code-ஐ எழுதலாம்:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[இந்த உதாரணத்தை React Compiler Playground-இல் பார்க்கவும்](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

React Compiler தானாகவே optimal memoization-ஐ பயன்படுத்துகிறது; அவசியமானபோது மட்டுமே உங்கள் app re-render ஆகும் என்பதை உறுதிசெய்கிறது.

<DeepDive>
#### React Compiler எந்த வகை memoization சேர்க்கிறது? {/*what-kind-of-memoization-does-react-compiler-add*/}

React Compiler-ன் automatic memoization முதன்மையாக **update performance-ஐ மேம்படுத்துவதில்** (ஏற்கனவே உள்ள components-ஐ re-render செய்வது) கவனம் செலுத்துகிறது. எனவே இது இந்த இரண்டு use cases மீது கவனம் செலுத்துகிறது:

1. **Components-ன் cascading re-rendering-ஐ தவிர்த்தல்**
    * `<Parent />` re-render ஆகும்போது, அதன் component tree-இல் உள்ள பல components-மும் re-render ஆகும்; மாறியது `<Parent />` மட்டும் என்றாலும் கூட
1. **React-க்கு வெளியே உள்ள expensive calculations-ஐ தவிர்த்தல்**
    * உதாரணமாக, அந்த data தேவைப்படும் உங்கள் component அல்லது hook உள்ளே `expensivelyProcessAReallyLargeArrayOfObjects()` அழைப்பது

#### Re-renders-ஐ optimize செய்தல் {/*optimizing-re-renders*/}

உங்கள் UI-ஐ அதன் தற்போதைய state-ன் function ஆக (மேலும் தெளிவாக: அதன் props, state, மற்றும் context-ன் function ஆக) வெளிப்படுத்த React அனுமதிக்கிறது. தற்போதைய implementation-இல், ஒரு component-ன் state மாறும்போது, `useMemo()`, `useCallback()`, அல்லது `React.memo()` மூலம் manual memoization ஏதேனும் பயன்படுத்தவில்லை என்றால், React அந்த component-ஐயும் _அதன் அனைத்து children-யையும்_ re-render செய்யும். உதாரணமாக, கீழுள்ள example-இல், `<FriendList>`-ன் state மாறும் ஒவ்வொரு முறையும் `<MessageButton>` re-render ஆகும்:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_இந்த உதாரணத்தை React Compiler Playground-இல் பார்க்கவும்_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler, manual memoization-க்கு equivalent ஆனதை தானாக பயன்படுத்துகிறது; state மாறும்போது app-ன் சம்பந்தப்பட்ட பகுதிகள் மட்டுமே re-render ஆகும் என்பதை உறுதிசெய்கிறது. இது சில நேரங்களில் "fine-grained reactivity" என்று அழைக்கப்படுகிறது. மேலுள்ள example-இல், `friends` மாறினாலும் `<FriendListCard />`-ன் return value-ஐ reuse செய்யலாம் என்று React Compiler தீர்மானிக்கிறது; மேலும் count மாறும்போது இந்த JSX-ஐ மீண்டும் உருவாக்குவதையும் `<MessageButton>`-ஐ re-render செய்வதையும் தவிர்க்க முடியும்.

#### Expensive calculations-யும் memoize செய்யப்படும் {/*expensive-calculations-also-get-memoized*/}

Rendering போது பயன்படுத்தப்படும் expensive calculations-ஐயும் React Compiler தானாக memoize செய்ய முடியும்:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_இந்த உதாரணத்தை React Compiler Playground-இல் பார்க்கவும்_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

ஆனால் `expensivelyProcessAReallyLargeArrayOfObjects` உண்மையிலேயே expensive function என்றால், React-க்கு வெளியே அதற்கே உரிய memoization-ஐ implement செய்வதைப் பரிசீலிக்கலாம், ஏனெனில்:

- React Compiler, React components மற்றும் hooks-ஐ மட்டுமே memoize செய்கிறது; எல்லா functions-ஐயும் அல்ல
- React Compiler-ன் memoization பல components அல்லது hooks இடையே shared ஆகாது

அதனால் `expensivelyProcessAReallyLargeArrayOfObjects` பல வேறு components-இல் பயன்படுத்தப்பட்டிருந்தால், அதே exact items pass செய்யப்பட்டிருந்தாலும் அந்த expensive calculation மீண்டும் மீண்டும் run ஆகும். Code-ஐ மேலும் சிக்கலாக்குவதற்கு முன் அது உண்மையிலேயே இத்தனை expensive ஆக உள்ளதா என்பதை அறிய முதலில் [profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) செய்ய பரிந்துரைக்கிறோம்.
</DeepDive>

## Compiler-ஐ நான் முயற்சிக்க வேண்டுமா? {/*should-i-try-out-the-compiler*/}

React Compiler-ஐ அனைவரும் பயன்படுத்த தொடங்க ஊக்குவிக்கிறோம். இன்று compiler இன்னும் React-க்கு optional addition ஆக இருந்தாலும், எதிர்காலத்தில் சில features முழுமையாக வேலை செய்ய compiler தேவைப்படலாம்.

### இதைப் பயன்படுத்துவது பாதுகாப்பானதா? {/*is-it-safe-to-use*/}

React Compiler இப்போது stable ஆக உள்ளது மற்றும் production-இல் விரிவாக test செய்யப்பட்டுள்ளது. Meta போன்ற நிறுவனங்களில் production-இல் பயன்படுத்தப்பட்டிருந்தாலும், உங்கள் app-க்கு compiler-ஐ production-க்கு rollout செய்வது உங்கள் codebase-ன் health மற்றும் [React விதிகள்](/reference/rules)-ஐ எவ்வளவு நன்றாகப் பின்பற்றியிருக்கிறீர்கள் என்பதைக் கொண்டே அமையும்.

## எந்த build tools support செய்யப்படுகின்றன? {/*what-build-tools-are-supported*/}

React Compiler, Babel, Vite, Metro, Rsbuild போன்ற [பல build tools](/learn/react-compiler/installation)-இல் install செய்யப்படலாம்.

React Compiler பெரும்பாலும் core compiler சுற்றி இருக்கும் ஒரு light Babel plugin wrapper. அந்த core compiler, Babel-இலிருந்து decoupled ஆக இருக்கும்படி வடிவமைக்கப்பட்டது. Compiler-ன் ஆரம்ப stable version பெரும்பாலும் Babel plugin ஆகவே இருக்கும்; ஆனால் எதிர்காலத்தில் உங்கள் build pipelines-க்கு Babel-ஐ மீண்டும் சேர்க்க வேண்டியதில்லாமல் React Compiler-க்கு first class support உருவாக்க swc மற்றும் [oxc](https://github.com/oxc-project/oxc/issues/10048) teams உடன் பணிபுரிகிறோம்.

Next.js users, [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) மற்றும் அதற்கு மேல் பயன்படுத்தி swc-invoked React Compiler-ஐ enable செய்யலாம்.

## useMemo, useCallback, மற்றும் React.memo பற்றி என்ன செய்ய வேண்டும்? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

Default ஆக, React Compiler அதன் analysis மற்றும் heuristics அடிப்படையில் உங்கள் code-ஐ memoize செய்யும். பெரும்பாலான cases-இல், இந்த memoization நீங்கள் எழுதியிருக்கக்கூடியதைப் போலவே துல்லியமாக, அல்லது அதைவிடவும் துல்லியமாக இருக்கும்.

ஆனால் சில cases-இல் developers-க்கு memoization மீது கூடுதல் control தேவைப்படலாம். எந்த values memoize செய்யப்பட வேண்டும் என்பதில் control தரும் escape hatch ஆக `useMemo` மற்றும் `useCallback` hooks-ஐ React Compiler உடன் தொடர்ந்து பயன்படுத்தலாம். இதற்கான பொதுவான use-case ஒன்று: ஒரு memoized value effect dependency ஆக பயன்படுத்தப்படும்போது, அதன் dependencies அர்த்தமுள்ள வகையில் மாறாதபோதும் effect மீண்டும் மீண்டும் fire ஆகாமல் உறுதிசெய்வது.

புதிய code-க்கு, memoization-க்கு compiler-ஐ நம்பவும், precise control தேவைப்படும் இடங்களில் `useMemo`/`useCallback` பயன்படுத்தவும் பரிந்துரைக்கிறோம்.

Existing code-க்கு, ஏற்கனவே உள்ள memoization-ஐ அப்படியே விடவோ (அதை நீக்குவது compilation output-ஐ மாற்றக்கூடும்), அல்லது memoization-ஐ நீக்கும் முன் கவனமாக test செய்யவோ பரிந்துரைக்கிறோம்.

## React Compiler-ஐ முயற்சிக்கவும் {/*try-react-compiler*/}

இந்த section, React Compiler-ஐ தொடங்கவும் உங்கள் projects-இல் அதை பயனுள்ளதாகப் பயன்படுத்துவது எப்படி என்பதைப் புரிந்துகொள்ளவும் உதவும்.

* **[Installation](/learn/react-compiler/installation)** - React Compiler-ஐ install செய்து, உங்கள் build tools-க்கு configure செய்யவும்
* **[React Version Compatibility](/reference/react-compiler/target)** - React 17, 18, மற்றும் 19 support
* **[Configuration](/reference/react-compiler/configuration)** - உங்கள் குறிப்பிட்ட தேவைகளுக்காக compiler-ஐ customize செய்யவும்
* **[Incremental Adoption](/learn/react-compiler/incremental-adoption)** - Existing codebases-இல் compiler-ஐ gradual-ஆக rollout செய்வதற்கான strategies
* **[Debugging and Troubleshooting](/learn/react-compiler/debugging)** - Compiler பயன்படுத்தும்போது issues-ஐ கண்டறிந்து சரிசெய்யவும்
* **[Compiling Libraries](/reference/react-compiler/compiling-libraries)** - Compiled code ship செய்வதற்கான best practices
* **[API Reference](/reference/react-compiler/configuration)** - எல்லா configuration options-க்கும் விரிவான documentation

## கூடுதல் resources {/*additional-resources*/}

இந்த docs-க்கு கூடுதலாக, compiler பற்றிய கூடுதல் தகவல் மற்றும் discussion-க்கு [React Compiler Working Group](https://github.com/reactwg/react-compiler)-ஐ பார்க்க பரிந்துரைக்கிறோம்.
