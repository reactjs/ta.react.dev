---
title: panicThreshold
---

<Intro>

Compilation நடக்கும்போது errors-ஐ React Compiler எவ்வாறு கையாள வேண்டும் என்பதை `panicThreshold` option கட்டுப்படுத்துகிறது.

</Intro>

```js
{
  panicThreshold: 'none' // Recommended
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

Compilation errors build-ஐ fail செய்ய வேண்டுமா அல்லது optimization-ஐ skip செய்ய வேண்டுமா என்பதை தீர்மானிக்கிறது.

#### Type {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Default value {/*default-value*/}

`'none'`

#### Options {/*options*/}

- **`'none'`** (default, recommended): Compile செய்ய முடியாத components-ஐ skip செய்து build-ஐத் தொடரும்
- **`'critical_errors'`**: Critical compiler errors வந்தால் மட்டுமே build-ஐ fail செய்யும்
- **`'all_errors'`**: எந்த compiler diagnostic வந்தாலும் build-ஐ fail செய்யும்

#### Caveats {/*caveats*/}

- Production builds எப்போதும் `'none'` பயன்படுத்த வேண்டும்
- Build failures உங்கள் application build ஆகாமல் தடுக்கின்றன
- `'none'` பயன்படுத்தும்போது compiler பிரச்சினையான code-ஐ தானாக கண்டறிந்து skip செய்கிறது
- அதிகமான thresholds development நேர debugging-க்கு மட்டுமே பயனுள்ளதாக இருக்கும்

---

## Usage {/*usage*/}

### Production configuration (பரிந்துரைக்கப்படுகிறது) {/*production-configuration*/}

Production builds-க்கு எப்போதும் `'none'` பயன்படுத்துங்கள். இதுவே default value:

```js
{
  panicThreshold: 'none'
}
```

இது பின்வற்றை உறுதிசெய்கிறது:
- Compiler பிரச்சினைகளால் உங்கள் build ஒருபோதும் fail ஆகாது
- Optimize செய்ய முடியாத components வழக்கம்போல இயங்கும்
- அதிகபட்ச components optimize செய்யப்படும்
- நிலையான production deployments கிடைக்கும்

### Development debugging {/*development-debugging*/}

பிரச்சினைகளை கண்டுபிடிக்க தற்காலிகமாக கடுமையான thresholds-ஐப் பயன்படுத்துங்கள்:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```
