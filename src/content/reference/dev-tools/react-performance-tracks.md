---
title: React Performance tracks
---

<Intro>

React Performance tracks என்பது உங்கள் browser developer tools-இல் உள்ள Performance panel timeline-ல் தோன்றும் சிறப்பான custom entries.

</Intro>

இந்த tracks, React-specific events மற்றும் metrics-ஐ network requests, JavaScript execution, event loop activity போன்ற முக்கிய data sources உடன் Performance panel-இல் ஒரே unified timeline-ல் synchronized ஆக visualize செய்து, React application performance குறித்து developers-க்கு முழுமையான insights வழங்க வடிவமைக்கப்பட்டவை.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="React Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="React Performance Tracks" />
</div>

<InlineToc />

---

## பயன்பாடு {/*usage*/}

React Performance tracks, React-ன் development மற்றும் profiling builds-இல் மட்டுமே கிடைக்கும்:

- **Development**: default-ஆக enabled.
- **Profiling**: default-ஆக Scheduler tracks மட்டும் enabled. Components track, [`<Profiler>`](/reference/react/Profiler)-ஆல் wrap செய்யப்பட்ட subtrees-இல் உள்ள Components-ஐ மட்டும் list செய்யும். [React Developer Tools extension](/learn/react-developer-tools) enabled இருந்தால், `<Profiler>`-இல் wrap செய்யப்படாவிட்டாலும் எல்லா Components-மும் Components track-இல் சேர்க்கப்படும். Profiling builds-இல் Server tracks கிடைக்காது.

Enabled இருந்தால், [extensibility APIs](https://developer.chrome.com/docs/devtools/performance/extension) வழங்கும் browsers-ன் Performance panel கொண்டு record செய்யும் traces-இல் tracks தானாகத் தோன்ற வேண்டும்.

<Pitfall>

React Performance tracks-ஐ இயக்கும் profiling instrumentation கூடுதல் overhead சேர்க்கிறது; ஆகவே production builds-இல் அது default-ஆக disabled.
Server Components மற்றும் Server Requests tracks development builds-இல் மட்டுமே கிடைக்கும்.

</Pitfall>

### Profiling builds பயன்படுத்துதல் {/*using-profiling-builds*/}

Production மற்றும் development builds-க்கு கூடுதலாக, React ஒரு special profiling build-யையும் கொண்டுள்ளது.
Profiling builds பயன்படுத்த, `react-dom/client`-க்கு பதிலாக `react-dom/profiling` பயன்படுத்த வேண்டும்.
ஒவ்வொரு `react-dom/client` import-ஐயும் manually update செய்வதற்கு பதிலாக, build time-இல் bundler aliases மூலம் `react-dom/client`-ஐ `react-dom/profiling`-க்கு alias செய்ய பரிந்துரைக்கிறோம்.
உங்கள் framework, React-ன் profiling build-ஐ enable செய்ய built-in support கொண்டிருக்கலாம்.

---

## Tracks {/*tracks*/}

### Scheduler {/*scheduler*/}

Scheduler என்பது வெவ்வேறு priorities கொண்ட tasks-ஐ manage செய்யப் பயன்படுத்தப்படும் internal React concept. இந்த track 4 subtracks கொண்டுள்ளது; ஒவ்வொன்றும் குறிப்பிட்ட priority-யில் உள்ள work-ஐ பிரதிநிதித்துவப்படுத்துகிறது:

- **Blocking** - User interactions மூலம் தொடங்கியிருக்கக்கூடிய synchronous updates.
- **Transition** - Background-இல் நடக்கும் non-blocking work; பொதுவாக [`startTransition`](/reference/react/startTransition) மூலம் தொடங்கப்படும்.
- **Suspense** - Fallbacks display செய்வது அல்லது content reveal செய்வது போன்ற Suspense boundaries தொடர்பான work.
- **Idle** - அதிக priority கொண்ட வேறு tasks இல்லாதபோது செய்யப்படும் மிகக் குறைந்த priority work.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="Scheduler track" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="Scheduler track" />
</div>

#### Renders {/*renders*/}

ஒவ்வொரு render pass-மும் timeline-இல் காணக்கூடிய பல phases கொண்டது:

- **Update** - புதிய render pass-க்கு காரணமானது.
- **Render** - Components-ன் render functions-ஐ call செய்து React updated subtree-ஐ render செய்கிறது. அதே color scheme-ஐப் பின்பற்றும் [Components track](#components)-இல் rendered components subtree-ஐ காணலாம்.
- **Commit** - Components render ஆன பிறகு, React changes-ஐ DOM-க்கு submit செய்து [`useLayoutEffect`](/reference/react/useLayoutEffect) போன்ற layout effects-ஐ run செய்யும்.
- **Remaining Effects** - Rendered subtree-ன் passive effects-ஐ React run செய்கிறது. இது பொதுவாக paint-க்கு பிறகு நடக்கும்; அப்போது React [`useEffect`](/reference/react/useEffect) போன்ற hooks-ஐ run செய்கிறது. Clicks போன்ற user interactions அல்லது பிற discrete events ஒரு அறியப்பட்ட விதிவிலக்கு. இந்த scenario-வில், இந்த phase paint-க்கு முன் run ஆகலாம்.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="Scheduler track: updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="Scheduler track: updates" />
</div>

[Renders மற்றும் commits பற்றி மேலும் அறிக](/learn/render-and-commit).

#### Cascading updates {/*cascading-updates*/}

Cascading updates என்பது performance regressions-க்கான patterns-இல் ஒன்று. Render pass நடக்கும் போது update ஒன்று scheduled ஆனால், React முடிக்கப்பட்ட work-ஐ discard செய்து புதிய pass தொடங்கலாம்.

Development builds-இல், எந்த Component புதிய update schedule செய்தது என்பதை React காட்ட முடியும். இதில் general updates மற்றும் cascading updates இரண்டும் அடங்கும். "Cascading update" entry-ஐ click செய்தால் enhanced stack trace-ஐ காணலாம்; update schedule செய்த method name-யையும் அது display செய்ய வேண்டும்.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="Scheduler track: cascading updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="Scheduler track: cascading updates" />
</div>

[Effects பற்றி மேலும் அறிக](/learn/you-might-not-need-an-effect).

### Components {/*components*/}

Components track, React components-ன் durations-ஐ visualize செய்கிறது. அவை flamegraph ஆக display செய்யப்படும்; ஒவ்வொரு entry-யும் தொடர்புடைய component render மற்றும் அதன் descendant children components அனைத்திற்குமான duration-ஐ பிரதிநிதித்துவப்படுத்தும்.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="Components track: render durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="Components track: render durations" />
</div>

Render durations போலவே, effect durations-மும் flamegraph ஆக பிரதிநிதித்துவப்படுத்தப்படுகின்றன; ஆனால் Scheduler track-இல் உள்ள தொடர்புடைய phase உடன் align ஆகும் வேறு color scheme-யுடன் இருக்கும்.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="Components track: effects durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="Components track: effects durations" />
</div>

<Note>

Renders-க்கு மாறாக, எல்லா effects-மும் Components track-இல் default-ஆக காட்டப்படாது.

Performance-ஐ maintain செய்து UI clutter-ஐத் தவிர்க்க, 0.05ms அல்லது அதற்கு மேல் duration கொண்ட effects, அல்லது update trigger செய்த effects மட்டும் React display செய்யும்.

</Note>

Render மற்றும் effects phases நடக்கும் போது கூடுதல் events display செய்யப்படலாம்:

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> - Component renders அல்லது effects-ன் தொடர்புடைய subtree mounted ஆனது.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> - Component renders அல்லது effects-ன் தொடர்புடைய subtree unmounted ஆனது.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> - Mount போலவே, ஆனால் [`<Activity>`](/reference/react/Activity) பயன்படுத்தப்படும் cases-க்கு மட்டுமே.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> - Unmount போலவே, ஆனால் [`<Activity>`](/reference/react/Activity) பயன்படுத்தப்படும் cases-க்கு மட்டுமே.

#### Changed props {/*changed-props*/}

Development builds-இல், component render entry-ஐ click செய்தால் props-இல் ஏற்பட்டிருக்கக்கூடிய changes-ஐ inspect செய்யலாம். தேவையற்ற renders-ஐ identify செய்ய இந்த தகவலைப் பயன்படுத்தலாம்.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="Components track: changed props" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="Components track: changed props" />
</div>

### Server {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="React Server Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="React Server Performance Tracks" />
</div>

#### Server Requests {/*server-requests*/}

Server Requests track, இறுதியில் React Server Component-இல் முடியும் எல்லா Promises-யையும் visualize செய்கிறது. இதில் `fetch` call செய்வது அல்லது async Node.js file operations போன்ற எந்த `async` operations-மும் அடங்கும்.

Third-party code-க்குள் தொடங்கப்படும் Promises-ஐ, 1st party code-ஐ block செய்யும் முழு operation duration-ஐ பிரதிநிதித்துவப்படுத்தும் single span ஆக combine செய்ய React முயற்சிக்கும்.
உதாரணமாக, internally பலமுறை `fetch` call செய்யும் `getUser` என்ற third-party library method, பல `fetch` spans காட்டுவதற்கு பதிலாக `getUser` என்ற single span ஆக பிரதிநிதித்துவப்படுத்தப்படும்.

Spans-ஐ click செய்தால், Promise எங்கு created ஆனது என்பதற்கான stack trace-யையும், கிடைத்தால் Promise resolve ஆன value-ன் view-யையும் காட்டும்.

Rejected Promises அவற்றின் rejected value உடன் red-ஆக display செய்யப்படும்.

#### Server Components {/*server-components*/}

Server Components tracks, React Server Components await செய்த Promises-ன் durations-ஐ visualize செய்கின்றன. Timings flamegraph ஆக display செய்யப்படும்; ஒவ்வொரு entry-யும் தொடர்புடைய component render மற்றும் அதன் descendant children components அனைத்திற்குமான duration-ஐ பிரதிநிதித்துவப்படுத்தும்.

நீங்கள் Promise ஒன்றை await செய்தால், அந்த Promise-ன் duration-ஐ React display செய்யும். எல்லா I/O operations-ஐப் பார்க்க Server Requests track-ஐ பயன்படுத்தவும்.

Component render duration-ஐ குறிக்க வேறு colors பயன்படுத்தப்படுகின்றன. Color இருண்டிருக்கிற அளவுக்கு duration நீளமானது.

Server Components track group எப்போதும் "Primary" track ஒன்றைக் கொண்டிருக்கும். React Server Components-ஐ concurrently render செய்ய முடிந்தால், கூடுதல் "Parallel" tracks display செய்யும்.
8-க்கும் மேற்பட்ட Server Components concurrently render செய்யப்பட்டால், மேலும் tracks சேர்ப்பதற்கு பதிலாக கடைசி "Parallel" track உடன் அவற்றை React associate செய்யும்.
