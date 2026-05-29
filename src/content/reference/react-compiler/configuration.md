---
title: Configuration
---

<Intro>

இந்தப் பக்கம் React Compiler-இல் கிடைக்கும் அனைத்து configuration options-ஐ பட்டியலிடுகிறது.

</Intro>

<Note>

பெரும்பாலான apps-க்கு default options எந்த கூடுதல் அமைப்புமின்றி வேலை செய்ய வேண்டும். உங்களுக்கு சிறப்பு தேவை இருந்தால், இந்த advanced options-ஐப் பயன்படுத்தலாம்.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## Compilation கட்டுப்பாடு {/*compilation-control*/}

Compiler *எதை* optimize செய்கிறது மற்றும் compile செய்ய வேண்டிய components, hooks-ஐ *எப்படி* தேர்வு செய்கிறது என்பதை இந்த options கட்டுப்படுத்துகின்றன.

* [`compilationMode`](/reference/react-compiler/compilationMode) compile செய்ய வேண்டிய functions-ஐத் தேர்வு செய்யும் strategy-ஐ கட்டுப்படுத்துகிறது (எ.கா. அனைத்து functions, annotated functions மட்டும், அல்லது intelligent detection).

```js
{
  compilationMode: 'annotation' // "use memo" functions மட்டும் compile செய்யவும்
}
```

---

## Version compatibility {/*version-compatibility*/}

React version configuration, compiler உங்கள் React version-க்கு compatible ஆன code-ஐ உருவாக்குவதை உறுதிசெய்கிறது.

நீங்கள் எந்த React version-ஐப் பயன்படுத்துகிறீர்கள் (17, 18, அல்லது 19) என்பதை [`target`](/reference/react-compiler/target) குறிப்பிடுகிறது.

```js
// For React 18 projects
{
  target: '18' // react-compiler-runtime package-உம் தேவை
}
```

---

## Error handling {/*error-handling*/}

[Rules of React](/reference/rules)-ஐப் பின்பற்றாத code-க்கு compiler எவ்வாறு பதிலளிக்க வேண்டும் என்பதை இந்த options கட்டுப்படுத்துகின்றன.

Build-ஐ fail செய்ய வேண்டுமா அல்லது பிரச்சினையான components-ஐ skip செய்ய வேண்டுமா என்பதை [`panicThreshold`](/reference/react-compiler/panicThreshold) தீர்மானிக்கிறது.

```js
// Recommended for production
{
  panicThreshold: 'none' // Build-ஐ fail செய்யாமல் errors உள்ள components-ஐ skip செய்யவும்
}
```

---

## Debugging {/*debugging*/}

Compiler என்ன செய்கிறது என்பதைப் புரிந்துகொள்ள logging மற்றும் analysis options உதவுகின்றன.

Compilation events-க்கு [`logger`](/reference/react-compiler/logger) custom logging வழங்குகிறது.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## Feature flags {/*feature-flags*/}

Optimized code எப்போது பயன்படுத்தப்பட வேண்டும் என்பதை conditional compilation மூலம் கட்டுப்படுத்தலாம்.

A/B testing அல்லது gradual rollouts-க்கு [`gating`](/reference/react-compiler/gating) runtime feature flags-ஐ enable செய்கிறது.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## பொதுவான configuration patterns {/*common-patterns*/}

### Default configuration {/*default-configuration*/}

பெரும்பாலான React 19 applications-இல் compiler configuration இல்லாமலே வேலை செய்கிறது:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### React 17/18 projects {/*react-17-18*/}

பழைய React versions-க்கு runtime package மற்றும் target configuration தேவை:

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // அல்லது '17'
}
```

### படிப்படியான adoption {/*incremental-adoption*/}

குறிப்பிட்ட directories-இல் தொடங்கி, படிப்படியாக விரிவாக்குங்கள்:

```js
{
  compilationMode: 'annotation' // "use memo" functions மட்டும் compile செய்யவும்
}
```
