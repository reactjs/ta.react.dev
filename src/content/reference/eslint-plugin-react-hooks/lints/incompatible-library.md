---
title: incompatible-library
---

<Intro>

Memoization-உடன் (manual அல்லது automatic) compatible அல்லாத libraries பயன்படுத்தப்படுவதை எதிர்த்து validate செய்கிறது.

</Intro>

<Note>

React-இன் memoization rules முழுமையாக document செய்யப்படுவதற்கு முன் இந்த libraries வடிவமைக்கப்பட்டவை. App state மாறும்போது components தேவையான அளவுக்கு மட்டும் reactive ஆக இருக்க ergonomic வழிகளை optimize செய்ய, அப்போது சரியான தேர்வுகளை அவை செய்தன. இந்த legacy patterns வேலை செய்தாலும், அவை React-இன் programming model-உடன் compatible அல்ல என்று பின்னர் கண்டறிந்தோம். React விதிகளைப் பின்பற்றும் patterns-க்கு இந்த libraries-ஐ migrate செய்ய library authors-உடன் தொடர்ந்து பணியாற்றுவோம்.

</Note>

## விதி விவரங்கள் {/*rule-details*/}

சில libraries React ஆதரிக்காத patterns-ஐப் பயன்படுத்துகின்றன. [அறியப்பட்ட பட்டியலில்](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts) உள்ள இந்த API-களின் பயன்பாடுகளை linter கண்டறிந்தால், இந்த விதியின் கீழ் அவற்றை flag செய்கிறது. இதன் பொருள், உங்கள் app உடையாமல் இருக்க React Compiler இந்த incompatible APIs பயன்படுத்தும் components-ஐ தானாக skip செய்ய முடியும்.

```js
// Example of how memoization breaks with these libraries
function Form() {
  const { watch } = useForm();

  // ❌ This value will never update, even when 'name' field changes
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // UI "frozen" போலத் தோன்றும்
}
```

React Compiler, React விதிகளைப் பின்பற்றி values-ஐ தானாக memoize செய்கிறது. Manual `useMemo`-உடன் ஏதாவது உடைந்தால், compiler-இன் automatic optimization-உம் உடையும். இந்த problematic patterns-ஐ அடையாளம் காண இந்த விதி உதவுகிறது.

<DeepDive>

#### React விதிகளைப் பின்பற்றும் API-களை வடிவமைத்தல் {/*designing-apis-that-follow-the-rules-of-react*/}

Library API அல்லது hook வடிவமைக்கும் போது யோசிக்க வேண்டிய கேள்வி: அந்த API call-ஐ `useMemo` மூலம் பாதுகாப்பாக memoize செய்ய முடியுமா? முடியாவிட்டால், manual memoization-வும் React Compiler memoization-வும் உங்கள் user-இன் code-ஐ உடைக்கும்.

உதாரணமாக, அத்தகைய incompatible pattern ஒன்று "interior mutability". ஒரு object அல்லது function-க்கு reference அதேபோல இருந்தாலும், காலப்போக்கில் மாறும் மறை state அதன் உள்ளே இருந்தால் அதுவே interior mutability. வெளிப்புறத்தில் அதேபோலத் தெரியும் பெட்டி ஒன்று, உள்ளடக்கத்தை மறைமுகமாக மறுசீரமைப்பதைப் போல நினைத்துக்கொள்ளுங்கள். நீங்கள் வேறு பெட்டியை கொடுத்தீர்களா என்பதையே React பார்க்கிறது; உள்ளே என்ன உள்ளது என்பதை அல்ல. எனவே ஏதாவது மாறியது என்பதை அது சொல்ல முடியாது. Value-இன் ஒரு பகுதி மாறினால் வெளிப்புற object (அல்லது function) மாறும் என்பதையே React சார்ந்திருப்பதால், இது memoization-ஐ உடைக்கும்.

ஒரு thumb rule ஆக, React API-களை வடிவமைக்கும் போது `useMemo` அதை உடைக்குமா என்று யோசியுங்கள்:

```js
function Component() {
  const { someFunction } = useLibrary();
  // it should always be safe to memoize functions like this
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

அதற்கு பதிலாக, immutable state return செய்து explicit update functions பயன்படுத்தும் API-களை வடிவமைக்கவும்:

```js
// ✅ Good: Return immutable state that changes reference when updated
function Component() {
  const { field, updateField } = useLibrary();
  // this is always safe to memo
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ react-hook-form `watch`
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // Interior mutability
  return <div>{value}</div>;
}

// ❌ TanStack Table `useReactTable`
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // table instance uses interior mutability
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

`observer` போன்ற MobX patterns-உம் memoization assumptions-ஐ உடைக்கும், ஆனால் linter இன்னும் அவற்றை கண்டறியவில்லை. நீங்கள் MobX-ஐ சார்ந்து இருக்கிறீர்கள் மற்றும் உங்கள் app React Compiler-உடன் வேலை செய்யவில்லை என்றால், `"use no memo"` directive-ஐப் பயன்படுத்த வேண்டியிருக்கலாம்.

```js
// ❌ MobX `observer`
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ For react-hook-form, use `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

சில பிற libraries-க்கு React-இன் memoization model-உடன் compatible ஆன alternative APIs இன்னும் இல்லை. இந்த API-களை அழைக்கும் உங்கள் components அல்லது hooks-ஐ linter தானாக skip செய்யவில்லை என்றால், அதை linter-இல் சேர்க்க எங்களுக்கு [issue file செய்யுங்கள்](https://github.com/facebook/react/issues).
