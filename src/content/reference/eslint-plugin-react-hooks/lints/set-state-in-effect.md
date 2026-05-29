---
title: set-state-in-effect
---

<Intro>

Effect-இல் setState synchronously அழைப்பதை எதிர்த்து validate செய்கிறது; இது performance-ஐ குறைக்கும் re-renders-க்கு வழிவகுக்கலாம்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Effect உள்ளே உடனே state அமைப்பது முழு render cycle-ஐ React மீண்டும் தொடங்கும்படி கட்டாயப்படுத்துகிறது. Effect-இல் state update செய்தால், React உங்கள் component-ஐ மீண்டும் render செய்து, DOM-க்கு changes apply செய்து, பிறகு effects-ஐ மீண்டும் இயக்க வேண்டும். Render நடக்கும் போது data-வை நேரடியாக transform செய்தாலோ props-இலிருந்து state-ஐ derive செய்தாலோ தவிர்க்கக்கூடிய கூடுதல் render pass இது. அதற்கு பதிலாக, உங்கள் component-இன் top level-இல் data-வை transform செய்யுங்கள். Props அல்லது state மாறும்போது, கூடுதல் render cycles trigger செய்யாமல் இந்த code இயல்பாகவே மீண்டும் இயங்கும்.

Effects-இல் synchronous `setState` calls, browser paint செய்யும் முன்பே உடனடி re-renders-ஐ trigger செய்கின்றன; இதனால் performance பிரச்சினைகள் மற்றும் visual jank ஏற்படலாம். React இரண்டு முறை render செய்ய வேண்டும்: state update-ஐ apply செய்ய ஒருமுறை, effects ஓடிய பிறகு மீண்டும் ஒருமுறை. அதே முடிவை single render-இல் பெற முடியும்போது, இந்த double rendering வீணானது.

பல நிலைகளில், உங்களுக்கு effect வேண்டாமலும் இருக்கலாம். மேலும் தகவல்களுக்கு [You Might Not Need an Effect](/learn/you-might-not-need-an-effect)-ஐப் பார்க்கவும்.

## பொதுவான மீறல்கள் {/*common-violations*/}

Synchronous setState தேவையில்லாமல் பயன்படுத்தப்படும் பல patterns-ஐ இந்த விதி பிடிக்கிறது:

- Loading state-ஐ synchronously அமைத்தல்
- Effects-இல் props-இலிருந்து state derive செய்தல்
- Render-க்கு பதிலாக effects-இல் data transform செய்தல்

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Synchronous setState in effect
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // Extra render, use initial state instead
  }, [data]);
}

// ❌ Setting loading state synchronously
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Synchronous, causes extra render
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ Transforming data in effect
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // Should derive in render
  }, [rawData]);
}

// ❌ Deriving state from props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ setState in an effect is fine if the value comes from a ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ Calculate during render
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**ஏதாவது ஒன்றை ஏற்கனவே உள்ள props அல்லது state-இலிருந்து கணக்கிட முடிந்தால், அதை state-இல் வைக்க வேண்டாம்.** அதற்கு பதிலாக rendering நடக்கும் போது அதை கணக்கிடுங்கள். இது உங்கள் code-ஐ வேகமானதாகவும் நேரடியானதாகவும் பிழைகள் குறைவானதாகவும் ஆக்கும். [You Might Not Need an Effect](/learn/you-might-not-need-an-effect)-இல் மேலும் அறியலாம்.
