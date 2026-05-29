---
title: Editor அமைத்தல்
---

<Intro>

சரியாக configure செய்யப்பட்ட editor, code-ஐ வாசிக்க தெளிவாகவும் எழுத வேகமாகவும் மாற்ற முடியும். எழுதிக்கொண்டிருக்கும்போதே bugs-ஐ கண்டுபிடிக்கவும் அது உதவும்! நீங்கள் முதன்முறையாக editor ஒன்றை அமைக்கிறீர்களானாலும், அல்லது தற்போது பயன்படுத்தும் editor-ஐ மேம்படுத்த விரும்புகிறீர்களானாலும், எங்களிடம் சில பரிந்துரைகள் உள்ளன.

</Intro>

<YouWillLearn>

* மிகவும் பிரபலமான editors எவை
* உங்கள் code-ஐ தானாக format செய்வது எப்படி

</YouWillLearn>

## உங்கள் editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) இன்று அதிகம் பயன்படுத்தப்படும் editors-இல் ஒன்று. இதற்கு extensions-க்கான பெரிய marketplace உள்ளது; GitHub போன்ற பிரபலமான services-உடன் நன்றாக ஒருங்கிணைகிறது. கீழே பட்டியலிடப்பட்டுள்ள பெரும்பாலான அம்சங்களை VS Code-இல் extensions ஆகச் சேர்க்கலாம், அதனால் அதை மிகவும் விரிவாக configure செய்யலாம்!

React சமூகத்தில் பயன்படுத்தப்படும் பிற பிரபலமான text editors:

* [WebStorm](https://www.jetbrains.com/webstorm/) என்பது JavaScript-க்காகவே வடிவமைக்கப்பட்ட integrated development environment.
* [Sublime Text](https://www.sublimetext.com/) JSX மற்றும் TypeScript ஆதரவு, [syntax highlighting](https://stackoverflow.com/a/70960574/458193), மற்றும் autocomplete ஆகியவற்றை உட்பட கொண்டுள்ளது.
* [Vim](https://www.vim.org/) எந்த வகை text-ஐயும் உருவாக்கவும் மாற்றவும் மிகவும் திறமையாக இருக்கும்படி உருவாக்கப்பட்ட, விரிவாக configure செய்யக்கூடிய text editor. பெரும்பாலான UNIX systems மற்றும் Apple OS X-இல் இது "vi" என சேர்க்கப்பட்டுள்ளது.

## பரிந்துரைக்கப்படும் text editor அம்சங்கள் {/*recommended-text-editor-features*/}

சில editors-இல் இந்த அம்சங்கள் built-in ஆக இருக்கும்; மற்றவற்றில் extension சேர்க்க வேண்டியிருக்கலாம். நீங்கள் தேர்ந்தெடுத்த editor எந்த ஆதரவை வழங்குகிறது என்பதை உறுதிப்படுத்திப் பாருங்கள்!

### Linting {/*linting*/}

நீங்கள் code எழுதும்போதே அதில் உள்ள பிரச்சினைகளை code linters கண்டுபிடித்து, அவற்றை ஆரம்பத்திலேயே சரிசெய்ய உதவுகின்றன. [ESLint](https://eslint.org/) என்பது JavaScript-க்கான பிரபலமான open source linter.

* [React-க்கான பரிந்துரைக்கப்பட்ட configuration-உடன் ESLint-ஐ நிறுவவும்](https://www.npmjs.com/package/eslint-config-react-app) ([Node நிறுவப்பட்டிருக்கிறதா](https://nodejs.org/en/download/current/) என்பதை உறுதிசெய்க!)
* [அதிகாரப்பூர்வ extension மூலம் ESLint-ஐ VSCode-இல் ஒருங்கிணைக்கவும்](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**உங்கள் project-க்காக [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) விதிகள் அனைத்தையும் enable செய்துள்ளீர்களா என்பதை உறுதிசெய்யுங்கள்.** அவை அத்தியாவசியமானவை; மிகக் கடுமையான bugs-ஐ ஆரம்பத்திலேயே கண்டுபிடிக்கும். பரிந்துரைக்கப்பட்ட [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset ஏற்கனவே அவற்றை உள்ளடக்கியுள்ளது.

### Formatting {/*formatting*/}

உங்கள் code-ஐ மற்றொரு contributor-உடன் பகிரும்போது நீங்கள் விரும்பாத கடைசி விஷயம் [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces) பற்றிய விவாதத்தில் சிக்குவதுதான்! அதிர்ஷ்டவசமாக, [Prettier](https://prettier.io/) உங்கள் code-ஐ முன்கூட்டியே அமைக்கப்பட்ட, configure செய்யக்கூடிய விதிகளுக்கு ஏற்ப மறுபடியும் format செய்து சுத்தப்படுத்தும். Prettier-ஐ இயக்கினால், உங்கள் tabs அனைத்தும் spaces ஆக மாற்றப்படும்; indentation, quotes போன்றவையும் configuration-க்கு ஏற்ப மாற்றப்படும். சிறந்த அமைப்பில், நீங்கள் file-ஐ save செய்யும்போது Prettier இயங்கி, இந்த மாற்றங்களை உடனே செய்து விடும்.

[VSCode-இல் Prettier extension-ஐ](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) பின்வரும் படிகளின் மூலம் நிறுவலாம்:

1. VS Code-ஐ திறக்கவும்
2. Quick Open-ஐ பயன்படுத்தவும் (Ctrl/Cmd+P அழுத்தவும்)
3. `ext install esbenp.prettier-vscode` என்பதை paste செய்யவும்
4. Enter அழுத்தவும்

#### Save செய்யும்போது formatting {/*formatting-on-save*/}

சிறந்த முறையில், ஒவ்வொரு save-க்கும் உங்கள் code format ஆக வேண்டும். இதற்கான settings VS Code-இல் உள்ளன!

1. VS Code-இல் `CTRL/CMD + SHIFT + P` அழுத்தவும்.
2. "settings" என type செய்யவும்
3. Enter அழுத்தவும்
4. Search bar-இல் "format on save" என type செய்யவும்
5. "format on save" option tick செய்யப்பட்டுள்ளதா என்பதை உறுதிசெய்யவும்!

> உங்கள் ESLint preset-இல் formatting rules இருந்தால், அவை Prettier-உடன் முரண்படலாம். ESLint *logical mistakes* கண்டுபிடிப்பதற்காக மட்டுமே பயன்படுத்தப்படும்படி, [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) மூலம் உங்கள் ESLint preset-இல் உள்ள அனைத்து formatting rules-ஐ disable செய்ய பரிந்துரைக்கிறோம். Pull request merge செய்யப்படுவதற்கு முன் files format செய்யப்பட்டிருக்க வேண்டும் என்பதை enforce செய்ய விரும்பினால், உங்கள் continuous integration-க்கு [`prettier --check`](https://prettier.io/docs/en/cli.html#--check)-ஐப் பயன்படுத்துங்கள்.
