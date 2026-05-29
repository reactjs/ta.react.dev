---
title: நிபந்தனை அடிப்படையிலான Rendering
---

<Intro>

உங்கள் components வெவ்வேறு conditions-ஐப் பொறுத்து வெவ்வேறு விஷயங்களை display செய்ய வேண்டியிருக்கும். React-இல், `if` statements, `&&`, மற்றும் `? :` operators போன்ற JavaScript syntax-ஐப் பயன்படுத்தி JSX-ஐ conditionally render செய்யலாம்.

</Intro>

<YouWillLearn>

* ஒரு condition-ஐப் பொறுத்து வெவ்வேறு JSX-ஐ return செய்வது எப்படி
* JSX-ன் ஒரு பகுதியை conditionally include அல்லது exclude செய்வது எப்படி
* React codebases-இல் நீங்கள் சந்திக்கும் பொதுவான conditional syntax shortcuts

</YouWillLearn>

## JSX-ஐ conditionally return செய்தல் {/*conditionally-returning-jsx*/}

பல `Item`s-ஐ render செய்யும் `PackingList` component ஒன்று உங்களிடம் இருக்கிறது என்று வைத்துக்கொள்ளுங்கள்; அவை packed ஆகவோ இல்லையோ mark செய்யப்படலாம்:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

சில `Item` components-இல் `isPacked` prop `false`-க்கு பதிலாக `true` ஆக set செய்யப்பட்டிருப்பதை கவனியுங்கள். `isPacked={true}` என்றால் packed items-க்கு checkmark (✅) ஒன்றை சேர்க்க விரும்புகிறீர்கள்.

இதை [`if`/`else` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) ஆக இதுபோல் எழுதலாம்:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

`isPacked` prop `true` என்றால், இந்த code **வேறொரு JSX tree-ஐ return செய்கிறது.** இந்த change-உடன், சில items-ன் இறுதியில் checkmark கிடைக்கும்:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

இரண்டு cases-லுமே என்ன return ஆகிறது என்பதை edit செய்து, result எப்படி மாறுகிறது என்பதைப் பாருங்கள்!

JavaScript-ன் `if` மற்றும் `return` statements மூலம் branching logic உருவாக்குகிறீர்கள் என்பதை கவனியுங்கள். React-இல், control flow (conditions போன்றவை) JavaScript-ஆல் handle செய்யப்படுகிறது.

### `null` மூலம் எதையும் conditionally return செய்யாமல் இருப்பது {/*conditionally-returning-nothing-with-null*/}

சில சூழல்களில், எதையும் render செய்ய விரும்பாமல் இருக்கலாம். உதாரணமாக, packed items-ஐ முற்றிலும் காட்ட வேண்டாம் என்று வைத்துக்கொள்ளுங்கள். ஒரு component ஏதாவது ஒன்றை return செய்ய வேண்டும். இந்த case-இல், `null` return செய்யலாம்:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked` true என்றால், component எதையும் return செய்யாது, `null`. இல்லையெனில், render செய்ய JSX-ஐ return செய்யும்.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

நடைமுறையில், component-இலிருந்து `null` return செய்வது பொதுவானதல்ல; ஏனெனில் அதை render செய்ய முயலும் developer-ஐ அது ஆச்சரியப்படுத்தலாம். அடிக்கடி, parent component-ன் JSX-இல் component-ஐ conditionally include அல்லது exclude செய்வீர்கள். அதை எப்படி செய்வது என்று பார்ப்போம்!

## JSX-ஐ conditionally include செய்தல் {/*conditionally-including-jsx*/}

முந்தைய example-இல், எந்த JSX tree (ஏதேனும் இருந்தால்!) component-ஆல் return செய்யப்படும் என்பதை நீங்கள் control செய்தீர்கள். Render output-இல் சில duplication-ஐ ஏற்கனவே கவனித்திருக்கலாம்:

```js
<li className="item">{name} ✅</li>
```

இதற்கு மிகவும் ஒத்தது:

```js
<li className="item">{name}</li>
```

இரண்டு conditional branches-மும் `<li className="item">...</li>`-ஐ return செய்கின்றன:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

இந்த duplication தீங்கு இல்லை என்றாலும், உங்கள் code maintain செய்வதை கடினமாக்கலாம். `className` மாற்ற விரும்பினால் என்ன? Code-இல் இரண்டு இடங்களில் செய்ய வேண்டியிருக்கும்! அத்தகைய சூழலில், code-ஐ மேலும் [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ஆக்க சிறிது JSX-ஐ conditionally include செய்யலாம்.

### Conditional (ternary) operator (`? :`) {/*conditional-ternary-operator--*/}

Conditional expression எழுத JavaScript-க்கு compact syntax உள்ளது--[conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) அல்லது "ternary operator".

இதற்குப் பதிலாக:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

இதை எழுதலாம்:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

இதை *"`isPacked` true என்றால், (`?`) `name + ' ✅'` render செய்; இல்லையெனில் (`:`) `name` render செய்"* என்று வாசிக்கலாம்.

<DeepDive>

#### இந்த இரண்டு examples முழுமையாக equivalent ஆக உள்ளனவா? {/*are-these-two-examples-fully-equivalent*/}

நீங்கள் object-oriented programming பின்னணியிலிருந்து வந்தால், மேலுள்ள இரண்டு examples சிறிது வேறுபட்டவை என்று நினைக்கலாம்; ஏனெனில் அவற்றில் ஒன்று `<li>`-ன் இரண்டு வெவ்வேறு "instances" உருவாக்கலாம் என்று தோன்றும். ஆனால் JSX elements "instances" அல்ல; ஏனெனில் அவை internal state வைத்திருக்காது, real DOM nodes-களும் அல்ல. அவை blueprints போன்ற lightweight descriptions. எனவே இந்த இரண்டு examples உண்மையில் *முழுமையாக* equivalent. இது எப்படி வேலை செய்கிறது என்பதை [Preserving and Resetting State](/learn/preserving-and-resetting-state) விரிவாக விவரிக்கிறது.

</DeepDive>

இப்போது completed item's text-ஐ `<del>` போன்ற மற்றொரு HTML tag-க்குள் wrap செய்து strike out செய்ய விரும்புகிறீர்கள் என்று வைத்துக்கொள்ளுங்கள். ஒவ்வொரு case-இலும் மேலும் JSX nest செய்வது நேரடியாக இருக்க, இன்னும் newlines மற்றும் parentheses சேர்க்கலாம்:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

இந்த style simple conditions-க்கு நன்றாக வேலை செய்கிறது; ஆனால் அளவோடு பயன்படுத்துங்கள். மிக அதிக nested conditional markup காரணமாக உங்கள் components messy ஆகினால், child components-ஐ extract செய்து சுத்தப்படுத்துவது பற்றி சிந்தியுங்கள். React-இல் markup உங்கள் code-ன் ஒரு பகுதி; எனவே complex expressions-ஐ ஒழுங்குபடுத்த variables மற்றும் functions போன்ற tools-ஐ பயன்படுத்தலாம்.

### Logical AND operator (`&&`) {/*logical-and-operator-*/}

நீங்கள் சந்திக்கும் மற்றொரு பொதுவான shortcut [JavaScript logical AND (`&&`) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) ஆகும். React components-க்குள், condition true ஆக இருக்கும்போது சில JSX render செய்ய வேண்டும், **இல்லையெனில் எதையும் render செய்ய வேண்டாம்** என்ற சூழலில் இது அடிக்கடி வரும். `&&` மூலம், `isPacked` `true` என்றால் மட்டுமே checkmark-ஐ conditionally render செய்யலாம்:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

இதை *"`isPacked` என்றால், (`&&`) checkmark render செய்; இல்லையெனில் எதையும் render செய்யாதே"* என்று வாசிக்கலாம்.

இது செயல்பாட்டில்:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript && expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND), இடது பக்கம் (நமது condition) `true` என்றால் அதன் வலது பக்க value-ஐ (நமது case-இல் checkmark) return செய்கிறது. ஆனால் condition `false` என்றால், முழு expression `false` ஆகிறது. `null` அல்லது `undefined` போலவே `false`-ஐ JSX tree-இல் ஒரு "hole" என்று React கருதுகிறது; அதன் இடத்தில் எதையும் render செய்யாது.


<Pitfall>

**`&&`-ன் இடது பக்கத்தில் numbers வைக்காதீர்கள்.**

Condition-ஐ test செய்ய, JavaScript இடது பக்கத்தை தானாக boolean ஆக convert செய்கிறது. ஆனால் இடது பக்கம் `0` என்றால், முழு expression அந்த value-ஐ (`0`) பெறும்; React எதையும் render செய்யாமல் இருப்பதற்கு பதிலாக மகிழ்ச்சியாக `0` render செய்யும்.

உதாரணமாக, `messageCount && <p>புதிய messages</p>` போன்ற code எழுதுவது ஒரு பொதுவான தவறு. `messageCount` `0` என்றால் அது எதையும் render செய்யாது என்று நினைப்பது சாத்தியம், ஆனால் அது உண்மையில் `0`-யையே render செய்கிறது!

இதைக் சரிசெய்ய, இடது பக்கத்தை boolean ஆக்குங்கள்: `messageCount > 0 && <p>புதிய messages</p>`.

</Pitfall>

### JSX-ஐ conditionally variable-க்கு assign செய்தல் {/*conditionally-assigning-jsx-to-a-variable*/}

Shortcuts plain code எழுதுவதற்கு இடையூறாக இருந்தால், `if` statement மற்றும் variable பயன்படுத்திப் பாருங்கள். [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) கொண்டு defined செய்யப்பட்ட variables-ஐ reassign செய்யலாம்; எனவே நீங்கள் display செய்ய விரும்பும் default content, name-ஐ வழங்குவதிலிருந்து தொடங்குங்கள்:

```js
let itemContent = name;
```

`isPacked` `true` என்றால் `itemContent`-க்கு JSX expression-ஐ reassign செய்ய `if` statement பயன்படுத்துங்கள்:

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[Curly braces "JavaScript-க்கான சாளரத்தை" திறக்கும்.](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) முன்பு calculate செய்யப்பட்ட expression-ஐ JSX-க்குள் nest செய்து, return செய்யப்படும் JSX tree-இல் variable-ஐ curly braces மூலம் embed செய்யுங்கள்:

```js
<li className="item">
  {itemContent}
</li>
```

இந்த style மிகவும் verbose, ஆனால் மிகவும் flexible-உம் ஆகும். இது செயல்பாட்டில்:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

முந்தையதைப் போலவே, இது text-க்கு மட்டும் அல்ல, arbitrary JSX-க்கும் வேலை செய்கிறது:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

JavaScript-க்கு பழக்கம் இல்லாவிட்டால், இந்த styles பலவகையாக இருப்பது முதலில் overwhelming ஆகத் தோன்றலாம். ஆனால் அவற்றைக் கற்றுக்கொள்வது எந்த JavaScript code-யையும்--React components மட்டும் அல்ல--படிக்கவும் எழுதவும் உதவும்! தொடக்கத்திற்கு உங்களுக்கு விருப்பமான ஒன்றைத் தேர்ந்தெடுத்து, மற்றவை எப்படி வேலை செய்கின்றன என்பதை மறந்தால் இந்த reference-ஐ மீண்டும் பாருங்கள்.

<Recap>

* React-இல், branching logic-ஐ JavaScript மூலம் control செய்கிறீர்கள்.
* `if` statement மூலம் JSX expression-ஐ conditionally return செய்யலாம்.
* சில JSX-ஐ variable-ல் conditionally save செய்து, curly braces பயன்படுத்தி அதை மற்ற JSX-க்குள் include செய்யலாம்.
* JSX-இல், `{cond ? <A /> : <B />}` என்பது *"`cond` என்றால் `<A />` render செய்; இல்லையெனில் `<B />`"* என்பதைக் குறிக்கும்.
* JSX-இல், `{cond && <A />}` என்பது *"`cond` என்றால் `<A />` render செய்; இல்லையெனில் எதுவுமில்லை"* என்பதைக் குறிக்கும்.
* Shortcuts பொதுவானவை, ஆனால் plain `if` விருப்பமாக இருந்தால் அவற்றைப் பயன்படுத்த வேண்டிய அவசியமில்லை.

</Recap>



<Challenges>

#### முடிக்கப்படாத items-க்கு `? :` மூலம் icon காட்டுங்கள் {/*show-an-icon-for-incomplete-items-with--*/}

`isPacked` `true` அல்லாவிட்டால் ❌ render செய்ய conditional operator (`cond ? a : b`)-ஐப் பயன்படுத்துங்கள்.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="விண்வெளி உடை"
        />
        <Item
          isPacked={true}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          isPacked={false}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&` மூலம் item importance-ஐ காட்டுங்கள் {/*show-the-item-importance-with-*/}

இந்த example-இல், ஒவ்வொரு `Item`-க்கும் numerical `importance` prop கிடைக்கிறது. Zero அல்லாத importance கொண்ட items-க்கு மட்டும் italics-இல் "_(முக்கியத்துவம்: X)_" render செய்ய `&&` operator-ஐப் பயன்படுத்துங்கள். உங்கள் item list இறுதியில் இதுபோல் இருக்க வேண்டும்:

* விண்வெளி உடை _(முக்கியத்துவம்: 9)_
* தங்க இலை கொண்ட தலைக்கவசம்
* டாமின் புகைப்படம் _(முக்கியத்துவம்: 6)_

இரண்டு labels-க்கும் இடையில் ஒரு space சேர்க்க மறக்காதீர்கள்!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="விண்வெளி உடை"
        />
        <Item
          importance={0}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          importance={6}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

இது போதுமானது:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(முக்கியத்துவம்: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride-ன் Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="விண்வெளி உடை"
        />
        <Item
          importance={0}
          name="தங்க இலை கொண்ட தலைக்கவசம்"
        />
        <Item
          importance={6}
          name="டாமின் புகைப்படம்"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance` `0` ஆக இருந்தால் result ஆக `0` render ஆகாமல் இருக்க, `importance && ...` என்பதற்குப் பதிலாக `importance > 0 && ...` என்று எழுத வேண்டும் என்பதை கவனியுங்கள்!

இந்த solution-இல், name மற்றும் importance label இடையில் space insert செய்ய இரண்டு தனித்தனி conditions பயன்படுத்தப்படுகின்றன. மாற்றாக, leading space கொண்ட Fragment பயன்படுத்தலாம்: `importance > 0 && <> <i>...</i></>` அல்லது `<i>`-க்குள் உடனே space சேர்க்கலாம்:  `importance > 0 && <i> ...</i>`.

</Solution>

#### `? :` தொடரை `if` மற்றும் variables ஆக refactor செய்யுங்கள் {/*refactor-a-series-of---to-if-and-variables*/}

இந்த `Drink` component, `name` prop `"tea"` அல்லது `"coffee"` என்பதைக் பொறுத்து வேறு தகவலைக் காட்ட `? :` conditions தொடரை பயன்படுத்துகிறது. பிரச்சினை என்னவெனில் ஒவ்வொரு drink பற்றிய தகவலும் பல conditions-களில் பரவியுள்ளது. இந்த code-ஐ மூன்று `? :` conditions-க்கு பதிலாக ஒரே `if` statement பயன்படுத்த refactor செய்யுங்கள்.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>செடியின் பகுதி</dt>
        <dd>{name === 'tea' ? 'இலை' : 'விதை'}</dd>
        <dt>Caffeine அளவு</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>வயது</dt>
        <dd>{name === 'tea' ? '4,000+ ஆண்டுகள்' : '1,000+ ஆண்டுகள்'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Code-ஐ `if` பயன்படுத்த refactor செய்த பிறகு, அதை மேலும் எப்படிச் simplify செய்யலாம் என்ற ideas உண்டா?

<Solution>

இதற்கு பல வழிகள் உள்ளன; ஒரு starting point இதோ:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'இலை';
    caffeine = '15–70 mg/cup';
    age = '4,000+ ஆண்டுகள்';
  } else if (name === 'coffee') {
    part = 'விதை';
    caffeine = '80–185 mg/cup';
    age = '1,000+ ஆண்டுகள்';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>செடியின் பகுதி</dt>
        <dd>{part}</dd>
        <dt>Caffeine அளவு</dt>
        <dd>{caffeine}</dd>
        <dt>வயது</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

இங்கே ஒவ்வொரு drink பற்றிய தகவலும் பல conditions-களில் பரவுவதற்கு பதிலாக ஒன்றாக grouped செய்யப்பட்டுள்ளது. இதனால் future-இல் மேலும் drinks சேர்ப்பது மேம்படுகிறது.

மற்றொரு solution, information-ஐ objects-க்குள் நகர்த்துவதன் மூலம் condition-ஐ முற்றிலும் remove செய்வது:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'இலை',
    caffeine: '15–70 mg/cup',
    age: '4,000+ ஆண்டுகள்'
  },
  coffee: {
    part: 'விதை',
    caffeine: '80–185 mg/cup',
    age: '1,000+ ஆண்டுகள்'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>செடியின் பகுதி</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine அளவு</dt>
        <dd>{info.caffeine}</dd>
        <dt>வயது</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
