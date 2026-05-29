---
title: <Profiler>
---

<Intro>

`<Profiler>` ஒரு React tree-இன் rendering performance-ஐ programmatically அளவிட உதவுகிறது.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Profiler>` {/*profiler*/}

Component tree ஒன்றின் rendering performance-ஐ அளவிட அதை `<Profiler>`-இல் wrap செய்யுங்கள்.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: நீங்கள் அளவிடும் UI பகுதியை அடையாளப்படுத்தும் string.
* `onRender`: Profile செய்யப்பட்ட tree-க்குள் உள்ள components update ஆகும் ஒவ்வொரு முறையும் React அழைக்கும் [`onRender` callback](#onrender-callback). என்ன render ஆனது, எவ்வளவு நேரம் எடுத்தது என்ற தகவலை இது பெறும்.

#### Caveats {/*caveats*/}

* Profiling சில கூடுதல் overhead சேர்க்கிறது, எனவே **production build-இல் default ஆக disable செய்யப்பட்டுள்ளது.** Production profiling-ஐ opt in செய்ய, [profiling enabled செய்யப்பட்ட சிறப்பு production build](/reference/dev-tools/react-performance-tracks#using-profiling-builds)-ஐ enable செய்ய வேண்டும்.

---

### `onRender` callback {/*onrender-callback*/}

என்ன render ஆனது என்ற தகவலுடன் React உங்கள் `onRender` callback-ஐ அழைக்கும்.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Parameters {/*onrender-parameters*/}

* `id`: இப்போதுதான் commit ஆன `<Profiler>` tree-இன் string `id` prop. பல profilers பயன்படுத்தினால், tree-இன் எந்த பகுதி commit ஆனது என்பதை அடையாளப்படுத்த இது உதவும்.
* `phase`: `"mount"`, `"update"` அல்லது `"nested-update"`. Tree முதல் முறையாக mount ஆனதா, அல்லது props, state, அல்லது Hooks மாற்றம் காரணமாக re-render ஆனதா என்பதை அறிய உதவும்.
* `actualDuration`: தற்போதைய update-க்காக `<Profiler>` மற்றும் அதன் descendants render ஆக எடுத்த milliseconds எண்ணிக்கை. Subtree memoization-ஐ (உதா. [`memo`](/reference/react/memo) மற்றும் [`useMemo`](/reference/react/useMemo)) எவ்வளவு நன்றாகப் பயன்படுத்துகிறது என்பதை இது காட்டுகிறது. சிறந்த நிலையில், initial mount-க்கு பிறகு இந்த value குறிப்பிடத்தக்க அளவில் குறைய வேண்டும்; ஏனெனில் descendants-இல் பலவற்றுக்கு அவற்றின் குறிப்பிட்ட props மாறினால் மட்டுமே re-render தேவைப்படும்.
* `baseDuration`: எந்த optimizations இல்லாமல் முழு `<Profiler>` subtree-ஐ re-render செய்ய எவ்வளவு நேரம் எடுக்கும் என்பதை மதிப்பிடும் milliseconds எண்ணிக்கை. Tree-இல் ஒவ்வொரு component-இன் சமீபத்திய render durations-ஐ கூட்டி இது கணக்கிடப்படுகிறது. Rendering-இன் worst-case cost-ஐ (உதா. initial mount அல்லது memoization இல்லாத tree) இந்த value மதிப்பிடுகிறது. Memoization வேலை செய்கிறதா என்பதைப் பார்க்க இதை `actualDuration`-உடன் ஒப்பிடுங்கள்.
* `startTime`: தற்போதைய update-ஐ React render செய்யத் தொடங்கிய நேரத்துக்கான numeric timestamp.
* `commitTime`: தற்போதைய update-ஐ React commit செய்த நேரத்துக்கான numeric timestamp. இந்த value commit-இல் உள்ள அனைத்து profilers-க்கும் பகிரப்படுகிறது; தேவையெனில் அவற்றை group செய்ய உதவும்.

---

## Usage {/*usage*/}

### Rendering performance-ஐ programmatically அளவிடுதல் {/*measuring-rendering-performance-programmatically*/}

React tree ஒன்றின் rendering performance-ஐ அளவிட, அதன் சுற்றில் `<Profiler>` component-ஐ wrap செய்யுங்கள்.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

இதற்கு இரண்டு props தேவை: `id` (string) மற்றும் tree-க்குள் உள்ள component ஒன்று update-ஐ "commit" செய்யும் போதெல்லாம் React அழைக்கும் `onRender` callback (function).

<Pitfall>

Profiling சில கூடுதல் overhead சேர்க்கிறது, எனவே **production build-இல் default ஆக disable செய்யப்பட்டுள்ளது.** Production profiling-ஐ opt in செய்ய, [profiling enabled செய்யப்பட்ட சிறப்பு production build](/reference/dev-tools/react-performance-tracks#using-profiling-builds)-ஐ enable செய்ய வேண்டும்.

</Pitfall>

<Note>

`<Profiler>` measurements-ஐ programmatically சேகரிக்க உதவுகிறது. Interactive profiler தேடுகிறீர்கள் என்றால், [React Developer Tools](/learn/react-developer-tools)-இல் உள்ள Profiler tab-ஐ முயற்சிக்கவும். Browser extension ஆக அது இதே போன்ற functionality-ஐ வெளிப்படுத்துகிறது.

`<Profiler>`-இல் wrap செய்யப்பட்ட components profiling builds-இல்கூட React Performance tracks-இன் [Component tracks](/reference/dev-tools/react-performance-tracks#components)-இல் குறிக்கப்படும்.
Development builds-இல், `<Profiler>`-இல் wrap செய்யப்பட்டுள்ளதா இல்லையா என்பதைக் கருத்தில் கொள்ளாமல் அனைத்து components-உம் Components track-இல் குறிக்கப்படும்.

</Note>

---

### Application-இன் வெவ்வேறு பகுதிகளை அளவிடுதல் {/*measuring-different-parts-of-the-application*/}

உங்கள் application-இன் வெவ்வேறு பகுதிகளை அளவிட பல `<Profiler>` components-ஐப் பயன்படுத்தலாம்:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

`<Profiler>` components-ஐ nest செய்யவும் முடியும்:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>` lightweight component என்றாலும், தேவையானபோது மட்டுமே பயன்படுத்த வேண்டும். ஒவ்வொரு பயன்பாடும் application-க்கு சில CPU மற்றும் memory overhead சேர்க்கும்.

---
