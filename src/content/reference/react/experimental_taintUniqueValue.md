---
title: experimental_taintUniqueValue
version: experimental
---

<Experimental>

**இந்த API experimental; React-ன் stable version-இல் இன்னும் கிடைக்கவில்லை.**

React packages-ஐ மிகச் சமீபத்திய experimental version-க்கு upgrade செய்து இதைப் பயன்படுத்திப் பார்க்கலாம்:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React-ன் experimental versions-இல் bugs இருக்கலாம். Production-இல் அவற்றைப் பயன்படுத்த வேண்டாம்.

இந்த API [React Server Components](/reference/rsc/use-client)-க்குள் மட்டுமே கிடைக்கும்.

</Experimental>


<Intro>

Passwords, keys, அல்லது tokens போன்ற unique values Client Components-க்கு pass செய்யப்படுவதைத் தடுக்க `taintUniqueValue` உதவுகிறது.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Sensitive data கொண்ட object pass செய்யப்படுவதைத் தடுக்க, [`taintObjectReference`](/reference/react/experimental_taintObjectReference)-ஐப் பார்க்கவும்.

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Password, token, key, அல்லது hash Client-க்கு அப்படியே pass செய்ய அனுமதிக்கப்படக்கூடாத ஒன்று என்று React-இல் register செய்ய, அந்த value உடன் `taintUniqueValue`-ஐ call செய்யுங்கள்:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `message`: `value` Client Component-க்கு pass செய்யப்பட்டால் காட்ட வேண்டிய message. `value` Client Component-க்கு pass செய்யப்பட்டால் throw ஆகும் Error-ன் ஒரு பகுதியாக இந்த message காட்டப்படும்.

* `lifetime`: `value` எவ்வளவு நேரம் tainted ஆக இருக்க வேண்டும் என்பதை காட்டும் எந்த object-வும். இந்த object இன்னும் இருக்கும் வரை, `value` எந்த Client Component-க்கும் அனுப்பப்படுவது தடுக்கப்படும். உதாரணமாக, `globalThis` pass செய்தால் app-ன் lifetime முழுவதும் value block செய்யப்படும். பொதுவாக `lifetime` என்பது `value`-ஐ properties-ல் கொண்டிருக்கும் object ஆகும்.

* `value`: ஒரு string, bigint, அல்லது TypedArray. `value` cryptographic token, private key, hash, அல்லது நீண்ட password போன்ற high entropy கொண்ட characters அல்லது bytes-ன் unique sequence ஆக இருக்க வேண்டும். `value` எந்த Client Component-க்கும் அனுப்பப்படுவது தடுக்கப்படும்.

#### Returns {/*returns*/}

`experimental_taintUniqueValue` `undefined` return செய்கிறது.

#### Caveats {/*caveats*/}

* Tainted values-இலிருந்து புதிய values derive செய்வது tainting protection-ஐ பலவீனப்படுத்தலாம். Tainted values-ஐ uppercase செய்வது, tainted string values-ஐ பெரிய string-களில் concatenate செய்வது, tainted values-ஐ base64-க்கு convert செய்வது, tainted values-இன் substring எடுப்பது, மற்றும் இதுபோன்ற transformations மூலம் உருவாகும் புதிய values tainted அல்ல; அவற்றின் மீது explicit-ஆக `taintUniqueValue` call செய்தால் மட்டுமே tainted ஆகும்.
* PIN codes அல்லது phone numbers போன்ற low-entropy values-ஐப் பாதுகாக்க `taintUniqueValue` பயன்படுத்த வேண்டாம். ஒரு request-இல் உள்ள எந்த value-யும் attacker-னால் கட்டுப்படுத்தப்பட்டால், secret-ன் அனைத்து சாத்தியமான values-ஐ enumerate செய்து எந்த value tainted என்பதை infer செய்ய முடியும்.

---

## பயன்பாடு {/*usage*/}

### Token Client Components-க்கு pass செய்யப்படுவதைத் தடுக்கவும் {/*prevent-a-token-from-being-passed-to-client-components*/}

Passwords, session tokens, அல்லது பிற unique values போன்ற sensitive information தவறுதலாக Client Components-க்கு pass செய்யப்படாததை உறுதிசெய்ய, `taintUniqueValue` function ஒரு பாதுகாப்பு layer வழங்குகிறது. ஒரு value tainted ஆனால், அதை Client Component-க்கு pass செய்யும் எந்த முயற்சியும் error-ஆக முடியும்.

`lifetime` argument, value எவ்வளவு காலம் tainted ஆக இருக்கும் என்பதை வரையறுக்கிறது. காலவரையின்றி tainted ஆக இருக்க வேண்டிய values-க்கு, [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) அல்லது `process` போன்ற objects `lifetime` argument ஆக பயன்படலாம். இந்த objects உங்கள் app execution முழு காலத்திற்கும் இருக்கும் lifespan கொண்டவை.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

Tainted value-ன் lifespan ஒரு object-இன் lifespan-ஐ சார்ந்திருந்தால், `lifetime` அந்த value-ஐ encapsulate செய்யும் object ஆக இருக்க வேண்டும். இதனால் encapsulating object-ன் lifetime முழுவதும் tainted value பாதுகாக்கப்பட்டிருப்பது உறுதியாகும்.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

இந்த உதாரணத்தில், `user` object `lifetime` argument ஆக செயல்படுகிறது. இந்த object global cache-இல் store செய்யப்பட்டாலோ அல்லது மற்றொரு request மூலம் access செய்யக்கூடியதாக இருந்தாலோ, session token தொடர்ந்து tainted ஆக இருக்கும்.

<Pitfall>

**Security-க்காக tainting-ஐ மட்டும் நம்ப வேண்டாம்.** ஒரு value-ஐ taint செய்வது, அதிலிருந்து derive செய்யக்கூடிய ஒவ்வொரு value-யையும் block செய்யாது. உதாரணமாக, tainted string-ஐ uppercase செய்து புதிய value உருவாக்கினால், அந்த புதிய value taint ஆகாது.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` tainted அல்ல
```

இந்த உதாரணத்தில், constant `password` tainted. பிறகு `password` மீது `toUpperCase` method call செய்து புதிய value `uppercasePassword` உருவாக்கப்படுகிறது. புதிதாக உருவாக்கப்பட்ட `uppercasePassword` tainted அல்ல.

Tainted values-இலிருந்து புதிய values derive செய்யும் இதுபோன்ற பிற வழிகள், உதாரணமாக பெரிய string-க்கு concatenate செய்தல், base64-க்கு convert செய்தல், அல்லது substring return செய்தல் ஆகியவை untainted values-ஐ உருவாக்கும்.

Secret values-ஐ client-க்கு explicit-ஆக pass செய்வது போன்ற நேரடியான தவறுகளிலிருந்து மட்டுமே tainting பாதுகாக்கிறது. Corresponding lifetime object இல்லாமல் React-க்கு வெளியே global store பயன்படுத்துவது போன்ற `taintUniqueValue` call-இல் உள்ள தவறுகள், tainted value untainted ஆகிவிட காரணமாகலாம். Tainting ஒரு பாதுகாப்பு layer; secure app-ல் பல protection layers, நன்றாக வடிவமைக்கப்பட்ட APIs, மற்றும் isolation patterns இருக்கும்.

</Pitfall>

<DeepDive>

#### Secrets leak ஆகாமல் தடுக்க `server-only` மற்றும் `taintUniqueValue` பயன்படுத்துதல் {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Database passwords போன்ற private keys அல்லது passwords-க்கு access உள்ள Server Components environment-ஐ நீங்கள் run செய்தால், அவற்றை Client Component-க்கு pass செய்யாமல் கவனமாக இருக்க வேண்டும்.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

இந்த உதாரணம் secret API token-ஐ client-க்கு leak செய்யும். குறிப்பிட்ட user-க்கு access இருக்கக்கூடாத data-வை access செய்ய இந்த API token பயன்படுத்த முடிந்தால், அது data breach-க்கு வழிவகுக்கலாம்.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

சிறந்த முறையில், இப்படிப்பட்ட secrets server-இல் உள்ள trusted data utilities மட்டுமே import செய்யக்கூடிய ஒரு helper file-க்கு abstract செய்யப்பட வேண்டும். இந்த file client-இல் import செய்யப்படாமல் இருப்பதை உறுதிசெய்ய helper-ஐ [`server-only`](https://www.npmjs.com/package/server-only) கொண்டு tag செய்யலாம்.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

சில நேரங்களில் refactoring-இல் தவறுகள் நடக்கலாம்; உங்கள் colleagues எல்லோரும் இதைப் பற்றி அறிந்திருக்க வேண்டிய அவசியமில்லை.
பின்னர் இப்படியான தவறுகள் நடப்பதிலிருந்து பாதுகாக்க, actual password-ஐ "taint" செய்யலாம்:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

இப்போது யாராவது இந்த password-ஐ Client Component-க்கு pass செய்யவோ, அல்லது Server Function மூலம் password-ஐ Client Component-க்கு அனுப்பவோ முயன்றால், நீங்கள் `taintUniqueValue` call செய்தபோது வரையறுத்த message உடன் ஒரு error throw ஆகும்.

</DeepDive>

---
