---
title: அறியப்படாத Prop குறித்த எச்சரிக்கை
---

செல்லுபடியாகும் DOM attribute/property ஆக React அடையாளம் காணாத prop-உடன் DOM element-ஐ render செய்ய முயன்றால், அறியப்படாத prop குறித்த எச்சரிக்கை காட்டப்படும். உங்கள் DOM elements-இல் தேவையற்ற props அனுப்பப்படவில்லை என்பதை உறுதிசெய்ய வேண்டும்.

இந்த எச்சரிக்கை தோன்றுவதற்கான சில சாத்தியமான காரணங்கள்:

1. நீங்கள் `{...props}` அல்லது `cloneElement(element, props)` பயன்படுத்துகிறீர்களா? child component-க்கு props-ஐ நகலெடுக்கும்போது, parent component-க்கு மட்டும் உரிய props-ஐ தவறுதலாக அனுப்பவில்லை என்பதை உறுதிசெய்ய வேண்டும். இந்தப் பிரச்சினைக்கான பொதுவான தீர்வுகளைக் கீழே பார்க்கவும்.

2. custom data-ஐக் குறிக்க, native DOM node ஒன்றில் தரநிலையற்ற DOM attribute-ஐ நீங்கள் பயன்படுத்திக் கொண்டிருக்கலாம். நிலையான DOM element-ல் custom data-ஐ இணைக்க முயன்றால், [MDN-இல் விளக்கப்பட்டுள்ளபடி](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) custom data attribute-ஐப் பயன்படுத்துவது குறித்து பரிசீலிக்கவும்.

3. நீங்கள் குறிப்பிட்ட attribute-ஐ React இன்னும் அடையாளம் காணாமல் இருக்கலாம். React-இன் எதிர்காலப் பதிப்பில் இது சரிசெய்யப்பட வாய்ப்புள்ளது. attribute பெயரை lowercase-இல் எழுதினால், எச்சரிக்கையின்றி அதை அனுப்ப React அனுமதிக்கும்.

4. `<myButton />` போன்ற, uppercase-இல் தொடங்காத React component-ஐ நீங்கள் பயன்படுத்துகிறீர்கள். பயனர் வரையறுத்த components-ஐயும் DOM tags-ஐயும் வேறுபடுத்த React JSX transform uppercase மற்றும் lowercase மரபைப் பயன்படுத்துவதால், அதை DOM tag-ஆக React புரிந்துகொள்கிறது. உங்கள் சொந்த React components-க்கு PascalCase-ஐப் பயன்படுத்தவும். உதாரணமாக, `<myButton />` என்பதற்குப் பதிலாக `<MyButton />` என எழுதவும்.

---

`{...props}` போன்ற முறையில் props-ஐ அனுப்புவதால் இந்த எச்சரிக்கையைப் பெற்றால், parent component-க்கானதும் child component-க்கானது அல்லாததுமான ஒவ்வொரு prop-ஐயும் உங்கள் parent component பயன்படுத்தி அகற்ற வேண்டும். உதாரணம்:

**தவறு:** எதிர்பாராத `layout` prop, `div` tag-க்கு அனுப்பப்படுகிறது.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**சரி:** spread syntax-ஐப் பயன்படுத்தி props-இலிருந்து மாறிகளைப் பிரித்தெடுத்து, மீதமுள்ள props-ஐ ஒரு மாறியில் வைக்கலாம்.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**சரி:** props-ஐ ஒரு புதிய object-க்கு ஒதுக்கி, நீங்கள் பயன்படுத்தும் keys-ஐ அந்தப் புதிய object-இலிருந்து நீக்கவும் செய்யலாம். அசல் `this.props` object immutable-ஆகக் கருதப்பட வேண்டும் என்பதால், அதிலிருந்து props-ஐ நீக்காதீர்கள்.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
