---
title: Debugging மற்றும் Troubleshooting
---

<Intro>
React Compiler பயன்படுத்தும்போது பிரச்சினைகளை கண்டறிந்து சரிசெய்ய இந்த வழிகாட்டி உதவும். Compilation பிரச்சினைகளை debug செய்வது மற்றும் பொதுவான பிரச்சினைகளைத் தீர்ப்பது எப்படி என்பதை அறிக.
</Intro>

<YouWillLearn>

* Compiler errors மற்றும் runtime issues இடையிலான வேறுபாடு
* Compilation-ஐ உடைக்கும் பொதுவான patterns
* படிப்படியான debugging workflow

</YouWillLearn>

## Compiler behavior-ஐப் புரிதல் {/*understanding-compiler-behavior*/}

React Compiler, [React விதிகளை](/reference/rules) பின்பற்றும் code-ஐ கையாள வடிவமைக்கப்பட்டுள்ளது. இந்த விதிகளை உடைக்கக்கூடிய code-ஐ சந்தித்தால், உங்கள் app-இன் behavior-ஐ மாற்றும் அபாயத்தை ஏற்படுத்தாமல், optimization-ஐ பாதுகாப்பாக skip செய்கிறது.

### Compiler errors vs runtime issues {/*compiler-errors-vs-runtime-issues*/}

**Compiler errors** build time-இல் ஏற்பட்டு, உங்கள் code compile ஆகாமல் தடுக்கின்றன. இவை அரிதானவை; ஏனெனில் compiler fail ஆகுவதற்கு பதிலாக problematic code-ஐ skip செய்யும்படி வடிவமைக்கப்பட்டுள்ளது.

**Runtime issues** compiled code எதிர்பார்த்ததை விட வேறுபட்டு நடந்தால் ஏற்படும். React Compiler-உடன் நீங்கள் சந்திக்கும் பிரச்சினைகள் பெரும்பாலும் runtime issues ஆக இருக்கும். பொதுவாக, compiler கண்டறிய முடியாத நுணுக்கமான முறையில் உங்கள் code React விதிகளை மீறும்போது, skip செய்ய வேண்டிய component-ஐ compiler தவறுதலாக compile செய்தால் இது நடக்கும்.

Runtime issues-ஐ debug செய்யும்போது, ESLint rule கண்டறியாத React விதி மீறல்களை பாதிக்கப்பட்ட components-இல் கண்டுபிடிப்பதில் கவனம் செலுத்துங்கள். உங்கள் code இந்த விதிகளைப் பின்பற்றுகிறது என்பதையே compiler நம்புகிறது; அது கண்டறிய முடியாத முறையில் அவை மீறப்பட்டால் runtime பிரச்சினைகள் ஏற்படும்.


## பொதுவான breaking patterns {/*common-breaking-patterns*/}

உங்கள் code correctness-க்காக memoization மீது நம்பிக்கை வைத்து எழுதப்பட்டிருந்தால், React Compiler உங்கள் app-ஐ உடைக்கக்கூடிய முக்கிய வழிகளில் அது ஒன்று. இதன் பொருள், உங்கள் app சரியாக வேலை செய்ய குறிப்பிட்ட values memoize செய்யப்பட வேண்டும் என்று அது சார்ந்துள்ளது. Compiler உங்கள் manual அணுகுமுறையிலிருந்து வேறுபட்டு memoize செய்யக்கூடும் என்பதால், effects அதிகமாக fire ஆகுதல், infinite loops, அல்லது updates தவறுதல் போன்ற எதிர்பாராத behavior ஏற்படலாம்.

இது ஏற்படும் பொதுவான சூழல்கள்:

- **Referential equality-ஐ சார்ந்த Effects** - Objects அல்லது arrays renders முழுவதும் அதே reference-ஐ வைத்திருப்பதை effects சார்ந்திருக்கும்போது
- **Stable references தேவைப்படும் dependency arrays** - Unstable dependencies effects-ஐ மிக அதிகமாக fire செய்யவோ infinite loops உருவாக்கவோ செய்யும்போது
- **Reference checks அடிப்படையிலான conditional logic** - Caching அல்லது optimization-க்கு code referential equality checks பயன்படுத்தும்போது

## Debugging workflow {/*debugging-workflow*/}

பிரச்சினைகள் ஏற்பட்டால் இந்த படிகளைப் பின்பற்றுங்கள்:

### Compiler build errors {/*compiler-build-errors*/}

உங்கள் build-ஐ எதிர்பாராத விதமாக உடைக்கும் compiler error ஏற்பட்டால், அது compiler-இல் bug ஆக இருக்கலாம். இதை பின்வரும் தகவல்களுடன் [facebook/react](https://github.com/facebook/react/issues) repository-க்கு report செய்யுங்கள்:
- Error message
- Error ஏற்படுத்திய code
- உங்கள் React மற்றும் compiler versions

### Runtime issues {/*runtime-issues*/}

Runtime behavior பிரச்சினைகளுக்கு:

### 1. Compilation-ஐ தற்காலிகமாக disable செய்தல் {/*temporarily-disable-compilation*/}

பிரச்சினை compiler தொடர்புடையதா என்பதை தனிமைப்படுத்த `"use no memo"` பயன்படுத்துங்கள்:

```js
function ProblematicComponent() {
  "use no memo"; // இந்த component-க்கு compilation-ஐ skip செய்கிறது
  // ... rest of component
}
```

பிரச்சினை மறைந்தால், அது React விதி மீறலுடன் தொடர்புடையதாக இருக்கலாம்.

Manual memoization (`useMemo`, `useCallback`, `memo`) அனைத்தையும் problematic component-இலிருந்து நீக்கி, எந்த memoization இல்லாமலேயே உங்கள் app சரியாக வேலை செய்கிறதா என்பதைச் சரிபார்க்கலாம். அனைத்து memoization நீக்கப்பட்ட பிறகும் bug ஏற்பட்டால், சரிசெய்ய வேண்டிய React விதி மீறல் உங்களிடம் உள்ளது.

### 2. பிரச்சினைகளை படிப்படியாக சரிசெய்தல் {/*fix-issues-step-by-step*/}

1. Root cause-ஐ கண்டறியுங்கள் (அடிக்கடி correctness-க்கான memoization)
2. ஒவ்வொரு fix-க்கும் பிறகு test செய்யுங்கள்
3. சரிசெய்த பிறகு `"use no memo"`-ஐ நீக்குங்கள்
4. React DevTools-இல் component ✨ badge காட்டுகிறதா என்பதைச் சரிபார்க்கவும்

## Compiler bugs report செய்தல் {/*reporting-compiler-bugs*/}

Compiler bug ஒன்றைக் கண்டுபிடித்துள்ளீர்கள் என்று நம்பினால்:

1. **இது React விதி மீறல் அல்ல என்பதை உறுதிசெய்யுங்கள்** - ESLint மூலம் சரிபார்க்கவும்
2. **Minimal reproduction உருவாக்குங்கள்** - பிரச்சினையை சிறிய உதாரணத்தில் தனிமைப்படுத்துங்கள்
3. **Compiler இல்லாமல் test செய்யுங்கள்** - Compilation இருந்தால் மட்டுமே பிரச்சினை ஏற்படுகிறதா என்பதை உறுதிசெய்யுங்கள்
4. **[Issue](https://github.com/facebook/react/issues/new?template=compiler_bug_report.yml) file செய்யுங்கள்**:
   - React மற்றும் compiler versions
   - Minimal reproduction code
   - Expected vs actual behavior
   - ஏதேனும் error messages

## அடுத்த படிகள் {/*next-steps*/}

- பிரச்சினைகளைத் தவிர்க்க [React விதிகளை](/reference/rules) review செய்யுங்கள்
- படிப்படியான rollout strategies-க்கு [incremental adoption guide](/learn/react-compiler/incremental-adoption)-ஐப் பார்க்கவும்
