---
title: experimental_taintObjectReference
version: experimental
---

<Experimental>

**இந்த API experimental; React-ன் stable version-இல் இன்னும் கிடைக்கவில்லை.**

React packages-ஐ மிகச் சமீபத்திய experimental version-க்கு upgrade செய்து இதைப் பயன்படுத்திப் பார்க்கலாம்:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React-ன் experimental versions-இல் bugs இருக்கலாம். Production-இல் அவற்றைப் பயன்படுத்த வேண்டாம்.

இந்த API React Server Components-க்குள் மட்டுமே கிடைக்கும்.

</Experimental>


<Intro>

`user` object போன்ற ஒரு குறிப்பிட்ட object instance Client Component-க்கு pass செய்யப்படுவதைத் தடுக்க `taintObjectReference` உதவுகிறது.

```js
experimental_taintObjectReference(message, object);
```

Key, hash, அல்லது token pass செய்யப்படுவதைத் தடுக்க, [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue)-ஐப் பார்க்கவும்.

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

ஒரு object Client-க்கு அப்படியே pass செய்ய அனுமதிக்கப்படக்கூடாத ஒன்று என்று React-இல் register செய்ய, அந்த object உடன் `taintObjectReference`-ஐ call செய்யுங்கள்:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `message`: அந்த object Client Component-க்கு pass செய்யப்பட்டால் காட்ட வேண்டிய message. Object Client Component-க்கு pass செய்யப்பட்டால் throw ஆகும் Error-ன் ஒரு பகுதியாக இந்த message காட்டப்படும்.

* `object`: Taint செய்ய வேண்டிய object. Functions மற்றும் class instances-ஐ `taintObjectReference`-க்கு `object` ஆக pass செய்யலாம். Functions மற்றும் classes ஏற்கனவே Client Components-க்கு pass செய்யப்படுவது தடுக்கப்பட்டுள்ளது; ஆனால் React-ன் default error message, நீங்கள் `message`-இல் வரையறுத்ததனால் மாற்றப்படும். ஒரு Typed Array-ன் குறிப்பிட்ட instance `taintObjectReference`-க்கு `object` ஆக pass செய்யப்பட்டால், அந்த Typed Array-ன் மற்ற copies taint செய்யப்படாது.

#### Returns {/*returns*/}

`experimental_taintObjectReference` `undefined` return செய்கிறது.

#### Caveats {/*caveats*/}

- Tainted object-ஐ மீண்டும் உருவாக்குவது அல்லது clone செய்வது, sensitive data கொண்டிருக்கக்கூடிய புதிய untainted object-ஐ உருவாக்கும். உதாரணமாக, tainted `user` object உங்களிடம் இருந்தால், `const userInfo = {name: user.name, ssn: user.ssn}` அல்லது `{...user}` tainted அல்லாத புதிய objects-ஐ உருவாக்கும். Object மாற்றப்படாமல் Client Component-க்கு pass செய்யப்படும் நேரடியான தவறுகளிலிருந்து மட்டுமே `taintObjectReference` பாதுகாக்கிறது.

<Pitfall>

**Security-க்காக tainting மட்டும் நம்ப வேண்டாம்.** ஒரு object-ஐ taint செய்வது, அதிலிருந்து derive செய்யக்கூடிய ஒவ்வொரு value-உம் leak ஆகுவதைத் தடுக்காது. உதாரணமாக, tainted object-ன் clone ஒரு புதிய untainted object-ஐ உருவாக்கும். Tainted object-இலிருந்து data பயன்படுத்துவது (எ.கா. `{secret: taintedObj.secret}`) tainted அல்லாத புதிய value அல்லது object-ஐ உருவாக்கும். Tainting ஒரு பாதுகாப்பு layer மட்டுமே; secure app-ல் பல layers of protection, நன்றாக வடிவமைக்கப்பட்ட APIs, மற்றும் isolation patterns இருக்கும்.

</Pitfall>

---

## பயன்பாடு {/*usage*/}

### User data தவறுதலாக client-ஐ அடைவதைத் தடுக்கவும் {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Sensitive data கொண்ட objects-ஐ Client Component ஒருபோதும் ஏற்கக்கூடாது. சிறந்த முறையில், தற்போதைய user-க்கு access இல்லாத data-வை data fetching functions expose செய்யக்கூடாது. சில நேரங்களில் refactoring-இல் தவறுகள் நடக்கலாம். பின்னர் இப்படியான தவறுகள் நடப்பதிலிருந்து பாதுகாக்க, data API-இல் user object-ஐ "taint" செய்யலாம்.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

இப்போது யாராவது இந்த object-ஐ Client Component-க்கு pass செய்ய முயன்றால், pass செய்யப்பட்ட error message உடன் ஒரு error throw ஆகும்.

<DeepDive>

#### Data fetching-இல் leaks-இற்கு எதிராக பாதுகாப்பது {/*protecting-against-leaks-in-data-fetching*/}

Sensitive data-க்கு access உள்ள Server Components environment-ஐ நீங்கள் run செய்தால், objects-ஐ நேரடியாக pass செய்யாமல் கவனமாக இருக்க வேண்டும்:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

சிறந்த முறையில், தற்போதைய user-க்கு access இல்லாத data-வை `getUser` expose செய்யக்கூடாது. பின்னர் `user` object Client Component-க்கு pass செய்யப்படுவதைத் தடுக்க, user object-ஐ "taint" செய்யலாம்:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

இப்போது யாராவது `user` object-ஐ Client Component-க்கு pass செய்ய முயன்றால், pass செய்யப்பட்ட error message உடன் ஒரு error throw ஆகும்.

</DeepDive>
