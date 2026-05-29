---
title: "React Server Components-இல் Denial of Service மற்றும் Source Code Exposure"
author: The React Team
date: 2025/12/11
description: கடந்த வார critical vulnerability-யின் patches-ஐ exploit செய்ய முயன்றபோது, security researchers React Server Components-இல் மேலும் இரண்டு vulnerabilities-ஐ கண்டறிந்து disclosure செய்துள்ளனர். High vulnerability Denial of Service (CVE-2025-55184), மற்றும் medium vulnerability Source Code Exposure (CVE-2025-55183)


---

December 11, 2025 அன்று [React Team](/community/team) எழுதியது

_January 26, 2026 அன்று update செய்யப்பட்டது._

---

<Intro>

கடந்த வார critical vulnerability-யின் patches-ஐ exploit செய்ய முயன்றபோது, security researchers React Server Components-இல் மேலும் இரண்டு vulnerabilities-ஐ கண்டறிந்து disclosure செய்துள்ளனர்.

**இந்த புதிய vulnerabilities Remote Code Execution-ஐ அனுமதிப்பதில்லை.** React2Shell-க்கான patch, Remote Code Execution exploit-ஐ mitigate செய்வதில் இன்னும் effective ஆக உள்ளது.

</Intro>

---

புதிய vulnerabilities இவ்வாறு disclosed செய்யப்பட்டுள்ளன:

- **Denial of Service - High Severity**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184), [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779), மற்றும் [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) (CVSS 7.5)
- **Source Code Exposure - Medium Severity**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) (CVSS 5.3)

புதியதாக disclosed செய்யப்பட்ட vulnerabilities-ன் severity காரணமாக உடனடியாக upgrade செய்ய பரிந்துரைக்கிறோம்.

<Note>

#### முன்பு publish செய்யப்பட்ட patches vulnerable ஆக உள்ளன. {/*the-patches-published-earlier-are-vulnerable*/}

முந்தைய vulnerabilities-க்காக ஏற்கனவே update செய்திருந்தால், மீண்டும் update செய்ய வேண்டும்.

நீங்கள் 19.0.3, 19.1.4, மற்றும் 19.2.3-க்கு update செய்திருந்தால், [இவை முழுமையற்றவை](#additional-fix-published); மீண்டும் update செய்ய வேண்டும்.

Upgrade steps-க்கு [முந்தைய post-இல் உள்ள instructions](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)-ஐ பார்க்கவும்.

-----

_ஜனவரி 26, 2026 அன்று update செய்யப்பட்டது._

</Note>

Fixes rollout முழுமையாக முடிந்த பிறகு இந்த vulnerabilities குறித்த மேலும் விவரங்கள் வழங்கப்படும்.

## உடனடி action தேவை {/*immediate-action-required*/}

இந்த vulnerabilities, [CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)-இல் உள்ள அதே packages மற்றும் versions-இல் உள்ளன.

இதில் பின்வரும் packages-ன் 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.1.0, 19.1.1, 19.1.2, 19.1.3, 19.2.0, 19.2.1, 19.2.2, மற்றும் 19.2.3 அடங்கும்:

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

Fixes 19.0.4, 19.1.5, மற்றும் 19.2.4 versions-க்கு backport செய்யப்பட்டுள்ளன. மேலுள்ள packages-ல் ஏதேனும் ஒன்றைப் பயன்படுத்தினால், fixed versions-ல் ஏதேனும் ஒன்றுக்கு உடனடியாக upgrade செய்யவும்.

முன்பு போலவே, உங்கள் app-ன் React code server பயன்படுத்தவில்லை என்றால், உங்கள் app இந்த vulnerabilities-ஆல் பாதிக்கப்படாது. React Server Components-ஐ support செய்யும் framework, bundler, அல்லது bundler plugin உங்கள் app பயன்படுத்தவில்லை என்றால், உங்கள் app இந்த vulnerabilities-ஆல் பாதிக்கப்படாது.

<Note>

#### Critical CVEs follow-up vulnerabilities-ஐ வெளிக்கொணர்வது பொதுவானது. {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

Critical vulnerability ஒன்று disclosed செய்யப்பட்டால், initial mitigation bypass செய்ய முடியுமா என்பதைச் சோதிக்க researchers adjacent code paths-ஐ ஆராய்ந்து variant exploit techniques-ஐ தேடுவார்கள்.

இந்த pattern JavaScript-இல் மட்டும் அல்லாமல் industry முழுவதும் காணப்படுகிறது. உதாரணமாக, [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228)-க்கு பிறகு, community original fix-ஐ probe செய்தபோது கூடுதல் CVEs ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) report செய்யப்பட்டன.

கூடுதல் disclosures வருவது சிரமமாக இருக்கலாம்; ஆனால் அவை பொதுவாக ஆரோக்கியமான response cycle-ன் அறிகுறி.

</Note>

### பாதிக்கப்பட்ட frameworks மற்றும் bundlers {/*affected-frameworks-and-bundlers*/}

சில React frameworks மற்றும் bundlers vulnerable React packages மீது depended on, peer dependencies வைத்திருந்தன, அல்லது அவற்றை include செய்திருந்தன. பின்வரும் React frameworks மற்றும் bundlers பாதிக்கப்பட்டுள்ளன: [next](https://www.npmjs.com/package/next), [react-router](https://www.npmjs.com/package/react-router), [waku](https://www.npmjs.com/package/waku), [@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc), [@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc), மற்றும் [rwsdk](https://www.npmjs.com/package/rwsdk).

Upgrade steps-க்கு [முந்தைய post-இல் உள்ள instructions](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)-ஐ பார்க்கவும்.

### Hosting providers-ன் தற்காலிக பாதுகாப்பு நடவடிக்கைகள் {/*hosting-provider-mitigations*/}

முன்பு போலவே, temporary mitigations apply செய்ய பல hosting providers உடன் பணிபுரிந்துள்ளோம்.

உங்கள் app-ஐ secure செய்ய இவற்றை மட்டும் நம்பக்கூடாது; உடனடியாக update செய்ய வேண்டும்.

### React Native {/*react-native*/}

Monorepo அல்லது `react-dom` பயன்படுத்தாத React Native users-க்கு, உங்கள் `react` version `package.json`-இல் pinned ஆக இருக்க வேண்டும்; கூடுதல் steps தேவையில்லை.

React Native-ஐ monorepo-வில் பயன்படுத்தினால், கீழுள்ள impacted packages install செய்யப்பட்டிருந்தால் அவற்றை _மட்டுமே_ update செய்ய வேண்டும்:

- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

Security advisories-ஐ mitigate செய்ய இது தேவை; ஆனால் `react` மற்றும் `react-dom` update செய்ய வேண்டியதில்லை, எனவே இது React Native-இல் version mismatch error ஏற்படுத்தாது.

மேலும் தகவலுக்கு [இந்த issue](https://github.com/facebook/react-native/issues/54772#issuecomment-3617929832)-ஐ பார்க்கவும்.

---

## அதிக severity: பல சேவை மறுப்பு (DoS) vulnerabilities {/*high-severity-multiple-denial-of-service*/}

**CVEs:** [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Base Score:** 7.5 (High)
**Date**: ஜனவரி 26, 2026

React Server Components-இல் கூடுதல் DoS vulnerabilities இன்னும் உள்ளன என்பதை security researchers கண்டுபிடித்தனர்.

Server Function endpoints-க்கு specially crafted HTTP requests அனுப்புவதால் vulnerabilities trigger ஆகின்றன; மேலும் vulnerable code path, application configuration, மற்றும் application code ஆகியவற்றைப் பொறுத்து server crashes, out-of-memory exceptions, அல்லது excessive CPU usage-க்கு வழிவகுக்கலாம்.

ஜனவரி 26 அன்று publish செய்யப்பட்ட patches இந்த DoS vulnerabilities-ஐ mitigate செய்கின்றன.

<Note>

#### கூடுதல் fixes publish செய்யப்பட்டன {/*additional-fix-published*/}

[CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184)-இல் உள்ள DoS-ஐ address செய்த original fix முழுமையற்றது.

இதனால் முந்தைய versions vulnerable ஆக இருந்தன. Versions 19.0.4, 19.1.5, 19.2.4 safe ஆக உள்ளன.

-----

_ஜனவரி 26, 2026 அன்று update செய்யப்பட்டது._

</Note>

---

## அதிக severity: சேவை மறுப்பு (DoS) {/*high-severity-denial-of-service*/}

**CVEs:** [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) மற்றும் [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Base Score:** 7.5 (High)

Security researchers, எந்த Server Functions endpoint-க்கும் malicious HTTP request ஒன்றை craft செய்து அனுப்ப முடியும் என்பதை கண்டுபிடித்துள்ளனர்; அதை React deserialize செய்யும்போது, server process hang ஆகவும் CPU consume செய்யவும் செய்யும் infinite loop ஏற்படலாம். உங்கள் app எந்த React Server Function endpoints-யும் implement செய்யவில்லை என்றாலும், உங்கள் app React Server Components support செய்தால் அது இன்னும் vulnerable ஆக இருக்கலாம்.

இதனால் attacker users product-ஐ access செய்வதை deny செய்யக்கூடிய vulnerability vector உருவாகிறது; மேலும் server environment-இல் performance impact ஏற்படக்கூடும்.

இன்று publish செய்யப்பட்ட patches infinite loop-ஐத் தடுக்குவதன் மூலம் mitigate செய்கின்றன.

## நடுத்தர severity: Source Code Exposure {/*low-severity-source-code-exposure*/}

**CVE:** [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183)
**Base Score**: 5.3 (Medium)

Vulnerable Server Function-க்கு அனுப்பப்படும் malicious HTTP request, எந்த Server Function-ன் source code-ஐயும் unsafe ஆக return செய்யக்கூடும் என்பதை security researcher கண்டுபிடித்துள்ளார். Exploitation-க்கு stringified argument ஒன்றை explicit அல்லது implicit ஆக expose செய்யும் Server Function இருக்க வேண்டும்:

```javascript
'use server';

export async function serverFunction(name) {
  const conn = db.createConnection('SECRET KEY');
  const user = await conn.createUser(name); // implicit ஆக stringified, db-இல் leaked

  return {
   id: user.id,
   message: `Hello, ${name}!` // explicit ஆக stringified, reply-இல் leaked
  }}
```

Attacker பின்வருவன leak செய்யக்கூடும்:

```txt
0:{"a":"$@1","f":"","b":"Wy43RxUKdxmr5iuBzJ1pN"}
1:{"id":"tva1sfodwq","message":"Hello, async function(a){console.log(\"serverFunction\");let b=i.createConnection(\"SECRET KEY\");return{id:(await b.createUser(a)).id,message:`Hello, ${a}!`}}!"}
```

இன்று publish செய்யப்பட்ட patches Server Function source code stringifying ஆகாமல் தடுக்கின்றன.

<Note>

#### Source code-இல் உள்ள secrets மட்டுமே expose ஆகக்கூடும். {/*only-secrets-in-source-code-may-be-exposed*/}

Source code-இல் hardcoded secrets expose ஆகக்கூடும்; ஆனால் `process.env.SECRET` போன்ற runtime secrets பாதிக்கப்படாது.

Exposed code-ன் scope, Server Function உள்ளே உள்ள code-க்கு மட்டுமே வரையறுக்கப்பட்டுள்ளது; உங்கள் bundler வழங்கும் inlining அளவைப் பொறுத்து இதில் பிற functions சேரக்கூடும்.

எப்போதும் production bundles-க்கு எதிராக verify செய்யவும்.

</Note>

---

## Timeline {/*timeline*/}
* **டிசம்பர் 3**: [Andrew MacPherson](https://github.com/AndrewMohawk), Vercel மற்றும் [Meta Bug Bounty](https://bugbounty.meta.com/)-க்கு leak report செய்தார்.
* **டிசம்பர் 4**: [RyotaK](https://ryotak.net), [Meta Bug Bounty](https://bugbounty.meta.com/)-க்கு initial DoS report செய்தார்.
* **டிசம்பர் 6**: இரு issues-யையும் React team confirm செய்தது; team investigation தொடங்கியது.
* **டிசம்பர் 7**: Initial fixes உருவாக்கப்பட்டன; React team புதிய patch-ஐ verify செய்து plan செய்யத் தொடங்கியது.
* **டிசம்பர் 8**: பாதிக்கப்பட்ட hosting providers மற்றும் open source projects-க்கு அறிவிக்கப்பட்டது.
* **டிசம்பர் 10**: Hosting provider mitigations அமலில் வந்தன; patches verify செய்யப்பட்டன.
* **டிசம்பர் 11**: Shinsaku Nomura, [Meta Bug Bounty](https://bugbounty.meta.com/)-க்கு additional DoS report செய்தார்.
* **டிசம்பர் 11**: Patches publish செய்யப்பட்டன; [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) மற்றும் [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) ஆக publicly disclosed செய்யப்பட்டன.
* **டிசம்பர் 11**: Missing DoS case internally கண்டுபிடிக்கப்பட்டு patched செய்யப்பட்டது; [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779) ஆக publicly disclosed செய்யப்பட்டது.
* **ஜனவரி 26**: Additional DoS cases கண்டுபிடிக்கப்பட்டு patched செய்யப்பட்டது; [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) ஆக publicly disclosed செய்யப்பட்டது.
---

## Attribution {/*attribution*/}

Source Code Exposure-ஐ report செய்த [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk)-க்கும், Denial of Service vulnerabilities-ஐ report செய்த [GMO Flatt Security Inc](https://flatt.tech/en/)-இலிருந்து [RyotaK](https://ryotak.net) மற்றும் Bitforest Co., Ltd.-இலிருந்து Shinsaku Nomura-க்கும் நன்றி. Additional DoS vulnerabilities-ஐ report செய்த [Winfunc Research](https://winfunc.com)-இலிருந்து [Mufeed VH](https://x.com/mufeedvh), [Joachim Viide](https://jviide.iki.fi), [GMO Flatt Security Inc](https://flatt.tech/en/)-இலிருந்து [RyotaK](https://ryotak.net), மற்றும் Tencent Security YUNDING LAB-இலிருந்து Xiangwei Zhang-க்கும் நன்றி.
