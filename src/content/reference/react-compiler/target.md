---
title: target
---

<Intro>

Compiler எந்த React version-க்காக code உருவாக்க வேண்டும் என்பதை `target` option குறிப்பிடுகிறது.

</Intro>

```js
{
  target: '19' // அல்லது '18', '17'
}
```

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `target` {/*target*/}

Compiled output-க்கு React version compatibility-ஐ configure செய்கிறது.

#### வகை {/*type*/}

```
'17' | '18' | '19'
```

#### Default value {/*default-value*/}

`'19'`

#### செல்லுபடியாகும் values {/*valid-values*/}

- **`'19'`**: React 19-ஐ target செய்கிறது (default). கூடுதல் runtime தேவையில்லை.
- **`'18'`**: React 18-ஐ target செய்கிறது. `react-compiler-runtime` package தேவை.
- **`'17'`**: React 17-ஐ target செய்கிறது. `react-compiler-runtime` package தேவை.

#### எச்சரிக்கைகள் {/*caveats*/}

- எப்போதும் string values-ஐப் பயன்படுத்துங்கள்; numbers அல்ல (எ.கா. `17` அல்ல, `'17'`)
- Patch versions-ஐ சேர்க்க வேண்டாம் (எ.கா. `'18.2.0'` அல்ல, `'18'` பயன்படுத்துங்கள்)
- React 19 built-in compiler runtime APIs-ஐ கொண்டுள்ளது
- React 17 மற்றும் 18-க்கு `react-compiler-runtime@latest` install செய்ய வேண்டும்

---

## பயன்பாடு {/*usage*/}

### React 19-ஐ target செய்தல் (default) {/*targeting-react-19*/}

React 19-க்கு சிறப்பு configuration தேவையில்லை:

```js
{
  // defaults to target: '19'
}
```

Compiler React 19-ன் built-in runtime APIs-ஐப் பயன்படுத்தும்:

```js
// Compiled output uses React 19's native APIs
import { c as _c } from 'react/compiler-runtime';
```

### React 17 அல்லது 18-ஐ target செய்தல் {/*targeting-react-17-or-18*/}

React 17 மற்றும் React 18 projects-க்கு இரண்டு படிகள் தேவை:

1. Runtime package-ஐ install செய்யுங்கள்:

```bash
npm install react-compiler-runtime@latest
```

2. Target-ஐ configure செய்யுங்கள்:

```js
// For React 18
{
  target: '18'
}

// For React 17
{
  target: '17'
}
```

இரு versions-க்கும் compiler polyfill runtime-ஐப் பயன்படுத்தும்:

```js
// Compiled output uses the polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Compiler runtime காணப்படாதது குறித்த runtime errors {/*missing-runtime*/}

`"Cannot find module 'react/compiler-runtime'"` போன்ற errors தெரிந்தால்:

1. உங்கள் React version-ஐச் சரிபார்க்கவும்:
   ```bash
   npm why react
   ```

2. React 17 அல்லது 18 பயன்படுத்தினால், runtime-ஐ install செய்யுங்கள்:
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. உங்கள் target உங்கள் React version-க்கு பொருந்துகிறதா என்பதை உறுதிசெய்யுங்கள்:
   ```js
   {
     target: '18' // உங்கள் React major version-க்கு பொருந்த வேண்டும்
   }
   ```

### Runtime package வேலை செய்யவில்லை {/*runtime-not-working*/}

Runtime package பின்வருமாறு உள்ளதா என்பதை உறுதிசெய்யுங்கள்:

1. உங்கள் project-இல் install செய்யப்பட்டிருக்க வேண்டும் (globally அல்ல)
2. உங்கள் `package.json` dependencies-இல் பட்டியலிடப்பட்டிருக்க வேண்டும்
3. சரியான version (`@latest` tag) ஆக இருக்க வேண்டும்
4. `devDependencies`-இல் இருக்கக்கூடாது (runtime-இல் தேவைப்படும்)

### Compiled output-ஐச் சரிபார்த்தல் {/*checking-output*/}

சரியான runtime பயன்படுத்தப்படுகிறதா என்பதை உறுதிசெய்ய, வேறுபட்ட import-ஐ கவனியுங்கள் (`react/compiler-runtime` என்பது builtin-க்கு, `react-compiler-runtime` என்பது 17/18-க்கான standalone package-க்கு):

```js
// For React 19 (built-in runtime)
import { c } from 'react/compiler-runtime'
//                      ^

// For React 17/18 (polyfill runtime)
import { c } from 'react-compiler-runtime'
//                      ^
```
