---
title: தவறான ARIA Prop குறித்த எச்சரிக்கை
---

Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [விவரக்குறிப்பில்](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) இல்லாத ஓர் `aria-*` prop-உடன் DOM element-ஐ render செய்ய முயன்றால் இந்த எச்சரிக்கை காட்டப்படும்.

1. நீங்கள் செல்லுபடியாகும் prop-ஐப் பயன்படுத்துவதாக நினைத்தால், அதன் எழுத்துக்கூட்டலைக் கவனமாகச் சரிபார்க்கவும். `aria-labelledby` மற்றும் `aria-activedescendant` ஆகியவை அடிக்கடி தவறாக எழுதப்படுகின்றன.

2. நீங்கள் `aria-role` என எழுதியிருந்தால், `role` என்பதைக் குறிப்பிட்டிருக்கலாம்.

3. இல்லையெனில், React DOM-இன் சமீபத்திய பதிப்பைப் பயன்படுத்துவதோடு, ARIA விவரக்குறிப்பில் பட்டியலிடப்பட்ட செல்லுபடியாகும் property பெயரையே பயன்படுத்துவதை உறுதிசெய்திருந்தால், தயவுசெய்து [பிழையைப் புகாரளிக்கவும்](https://github.com/facebook/react/issues/new/choose).
