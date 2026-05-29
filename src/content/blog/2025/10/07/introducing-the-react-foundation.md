---
title: "React Foundation அறிமுகம்"
author: Seth Webster, Matt Carroll, Joe Savona
date: 2025/10/07
description: இன்று, React Foundation மற்றும் புதிய technical governance அமைப்பை உருவாக்கும் எங்கள் திட்டங்களை அறிவிக்கிறோம்
---

October 7, 2025 அன்று [Seth Webster](https://x.com/sethwebster), [Matt Carroll](https://x.com/mattcarrollcode), [Joe Savona](https://x.com/en_JS), [Sophie Alpert](https://x.com/sophiebits) எழுதியது

---


<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem', marginLeft: '7rem', marginRight: '7rem' }}>
  <picture >
      <source srcset="/images/blog/react-foundation/react_foundation_logo.png" />
      <img className="w-full light-image" src="/images/blog/react-foundation/react_foundation_logo.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-foundation/react_foundation_logo_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-foundation/react_foundation_logo_dark.webp" />
  </picture>
</div>

<Intro>

இன்று, React Foundation மற்றும் புதிய technical governance அமைப்பை உருவாக்கும் எங்கள் திட்டங்களை அறிவிக்கிறோம்.

</Intro>

---

Developers சிறந்த user experiences உருவாக்க உதவுவதற்காக பத்து ஆண்டுகளுக்கு முன்பே React-ஐ open source செய்தோம். ஆரம்ப நாட்களிலிருந்தே, Meta-விற்கு வெளியே உள்ள contributors-இடமிருந்து React குறிப்பிடத்தக்க பங்களிப்புகளைப் பெற்றுள்ளது. காலப்போக்கில் contributors எண்ணிக்கையும் அவர்களின் பங்களிப்புகளின் பரப்பளவும் பெரிதாக வளர்ந்துள்ளது. Meta-க்காக உருவாக்கப்பட்ட tool ஆகத் தொடங்கியது, ecosystem முழுவதிலும் இருந்து சீரான பங்களிப்புகளைப் பெறும் பல நிறுவனங்களைத் தாண்டி பரவிய project ஆக விரிந்துள்ளது. React இப்போது எந்த ஒரு நிறுவனத்தின் வரம்பையும் தாண்டி வளர்ந்துள்ளது.

React சமூகத்துக்கு மேலும் சிறப்பாக சேவை செய்ய, React மற்றும் React Native-ஐ Meta-விலிருந்து புதிய React Foundation-க்கு மாற்றும் எங்கள் திட்டங்களை அறிவிக்கிறோம். இந்த மாற்றத்தின் ஒரு பகுதியாக, புதிய சுயாதீன technical governance அமைப்பையும் செயல்படுத்த உள்ளோம். இந்த மாற்றங்கள் React ecosystem projects-க்கு மேலும் resources வழங்க உதவும் என்று நாங்கள் நம்புகிறோம்.

## The React Foundation {/*the-react-foundation*/}

React, React Native, மற்றும் JSX போன்ற சில ஆதரவு projects-க்கான புதிய இல்லமாக React Foundation-ஐ உருவாக்குவோம். React சமூகத்தையும் ecosystem-ஐயும் ஆதரிப்பதே React Foundation-இன் நோக்கம். இது செயல்படுத்தப்பட்ட பிறகு, React Foundation:

* GitHub, CI, மற்றும் trademarks போன்ற React-இன் infrastructure-ஐ பராமரிக்கும்
* React Conf-ஐ நடத்தும்
* Ecosystem projects-க்கு நிதி ஆதரவு, grants வழங்குதல், மற்றும் programs உருவாக்குதல் போன்ற React ecosystem-ஐ ஆதரிக்கும் முயற்சிகளை உருவாக்கும்

Seth Webster executive director ஆகப் பணியாற்றும் board of directors React Foundation-ஐ நிர்வகிக்கும். இந்த board React-இன் development, community, மற்றும் ecosystem-ஐ ஆதரிக்க funds மற்றும் resources-ஐ வழிநடத்தும். React Foundation vendor-neutral ஆகவும் சமூகத்தின் சிறந்த நலன்களை பிரதிபலிப்பதாகவும் இருக்க இது சிறந்த அமைப்பு என்று நாங்கள் நம்புகிறோம்.

React Foundation-இன் founding corporate members Amazon, Callstack, Expo, Meta, Microsoft, Software Mansion, மற்றும் Vercel ஆக இருப்பார்கள். இந்த நிறுவனங்கள் React மற்றும் React Native ecosystems-இல் பெரிய தாக்கத்தை ஏற்படுத்தியுள்ளன; அவர்களின் ஆதரவுக்கு நன்றி. எதிர்காலத்தில் மேலும் பல உறுப்பினர்களை வரவேற்க ஆவலாக உள்ளோம்.

<div style={{display: 'flex', justifyContent: 'center', margin: '2rem'}}>
  <picture >
      <source srcset="/images/blog/react-foundation/react_foundation_member_logos.png" />
      <img className="w-full light-image" src="/images/blog/react-foundation/react_foundation_member_logos.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-foundation/react_foundation_member_logos_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-foundation/react_foundation_member_logos_dark.webp" />
  </picture>
</div>

## React-இன் technical governance {/*reacts-technical-governance*/}

React-க்கு பங்களித்து அதை maintain செய்பவர்களே React-இன் technical direction-ஐ தீர்மானிக்க வேண்டும் என்று நாங்கள் நம்புகிறோம். React ஒரு foundation-க்கு மாறும் போது, எந்த ஒரு நிறுவனம் அல்லது அமைப்பும் அளவுக்கு மீறி பிரதிநிதித்துவப்படுத்தப்படாதது முக்கியம். இதை அடைய, React Foundation-இலிருந்து சுயாதீனமான புதிய technical governance அமைப்பை React-க்காக வரையறுக்க திட்டமிட்டுள்ளோம்.

React-இன் புதிய technical governance அமைப்பை உருவாக்கும் ஒரு பகுதியாக, feedback-க்காக சமூகத்தை அணுகுவோம். அது final ஆன பிறகு, விவரங்களை எதிர்கால post ஒன்றில் பகிர்வோம்.

## நன்றி {/*thank-you*/}

React-இன் அபாரமான வளர்ச்சி, React-ஐ வடிவமைத்த ஆயிரக்கணக்கான நபர்கள், நிறுவனங்கள், மற்றும் projects காரணமாகும். React Foundation உருவாக்கப்படுவது React சமூகத்தின் வலிமை மற்றும் உயிர்ப்புக்கான சான்றாகும். React Foundation மற்றும் React-இன் புதிய technical governance இணைந்து, வருங்கால பல ஆண்டுகளுக்கும் React-இன் எதிர்காலம் உறுதியாக இருப்பதை உறுதிசெய்யும்.
