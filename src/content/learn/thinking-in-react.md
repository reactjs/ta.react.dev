---
title: React-இல் சிந்தித்தல்
---

<Intro>

நீங்கள் பார்க்கும் designs பற்றியும், நீங்கள் கட்டும் apps பற்றியும் சிந்திக்கும் முறையை React மாற்றக்கூடும். React-இல் user interface ஒன்றை கட்டும்போது, முதலில் அதை *components* எனப்படும் துண்டுகளாகப் பிரிப்பீர்கள். பிறகு, உங்கள் ஒவ்வொரு component-க்கும் உள்ள வெவ்வேறு காட்சி நிலைகளை விவரிப்பீர்கள். இறுதியாக, data அவற்றின் வழியாக பாயும் வகையில் உங்கள் components-ஐ ஒன்றோடொன்று இணைப்பீர்கள். இந்த tutorial-இல், React கொண்டு தேடக்கூடிய product data table ஒன்றை கட்டுவதற்கான சிந்தனை செயல்முறையை உங்களுக்கு வழிகாட்டுகிறோம்.

</Intro>

## Mockup-இலிருந்து தொடங்குங்கள் {/*start-with-the-mockup*/}

உங்களிடம் ஏற்கனவே ஒரு JSON API-யும், designer ஒருவரிடமிருந்து ஒரு mockup-உம் உள்ளதாகக் கற்பனை செய்யுங்கள்.

JSON API இதுபோன்ற data-வைத் திருப்பித் தருகிறது:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Mockup இதுபோல் இருக்கும்:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

React-இல் UI ஒன்றை செயல்படுத்த, பொதுவாக இதே ஐந்து படிகளைப் பின்பற்றுவீர்கள்.

## படி 1: UI-யை component hierarchy ஆகப் பிரியுங்கள் {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Mockup-இல் உள்ள ஒவ்வொரு component மற்றும் subcomponent-ஐச் சுற்றி பெட்டிகள் வரைந்து அவற்றுக்கு பெயர் வைப்பதிலிருந்து தொடங்குங்கள். நீங்கள் designer உடன் பணிபுரிந்தால், அவர்கள் தங்கள் design tool-இல் இந்த components-க்கு ஏற்கனவே பெயர் வைத்திருக்கலாம். அவர்களிடம் கேளுங்கள்!

உங்கள் பின்னணியைப் பொறுத்து, design ஒன்றை components ஆகப் பிரிப்பதை வெவ்வேறு வழிகளில் சிந்திக்கலாம்:

* **Programming**--புதிய function அல்லது object ஒன்றை உருவாக்க வேண்டுமா என்பதை முடிவு செய்யும் அதே techniques-ஐப் பயன்படுத்துங்கள். அவற்றில் ஒரு technique [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns): அதாவது, ஒரு component சிறந்த முறையில் ஒரே ஒரு விஷயத்திற்கே பொறுப்பாக இருக்க வேண்டும். அது பெரிதாக வளர்ந்தால், சிறிய subcomponents ஆகப் பிரிக்கப்பட வேண்டும்.
* **CSS**--எதற்காக class selectors உருவாக்குவீர்கள் என்பதைச் சிந்தியுங்கள். (ஆனால், components கொஞ்சம் குறைவான granular ஆக இருக்கும்.)
* **Design**--design-ன் layers-ஐ எப்படி ஒழுங்குபடுத்துவீர்கள் என்பதைச் சிந்தியுங்கள்.

உங்கள் JSON நன்றாக அமைக்கப்பட்டிருந்தால், அது உங்கள் UI-யின் component structure-க்கு இயல்பாகவே பொருந்துவதை அடிக்கடி காண்பீர்கள். ஏனெனில் UI மற்றும் data models பெரும்பாலும் அதே information architecture-ஐக் கொண்டிருக்கும்--அதாவது, அதே வடிவத்தை. உங்கள் UI-யை components ஆகப் பிரியுங்கள்; ஒவ்வொரு component-உம் உங்கள் data model-இன் ஒரு பகுதியுடன் பொருந்தட்டும்.

இந்த திரையில் ஐந்து components உள்ளன:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (grey) முழு app-ஐக் கொண்டுள்ளது.
2. `SearchBar` (blue) user input-ஐப் பெறுகிறது.
3. `ProductTable` (lavender) user input-க்கு ஏற்ப பட்டியலைக் காட்டி filter செய்கிறது.
4. `ProductCategoryRow` (green) ஒவ்வொரு category-க்கும் heading-ஐக் காட்டுகிறது.
5. `ProductRow`	(yellow) ஒவ்வொரு product-க்கும் ஒரு row-வை காட்டுகிறது.

</CodeDiagram>

</FullWidth>

`ProductTable` (lavender)-ஐப் பார்த்தால், table header ("Name" மற்றும் "Price" labels-ஐ கொண்டது) தனி component ஆக இல்லை என்பதை காண்பீர்கள். இது விருப்பத் தேர்வு; எந்த வழியையும் எடுக்கலாம். இந்த எடுத்துக்காட்டில், அது `ProductTable`-இன் ஒரு பகுதியாக இருக்கிறது, ஏனெனில் அது `ProductTable`-இன் list-க்குள் தோன்றுகிறது. ஆனால் இந்த header சிக்கலானதாக வளர்ந்தால் (எ.கா. sorting சேர்த்தால்), அதை தனி `ProductTableHeader` component-க்கு நகர்த்தலாம்.

Mockup-இல் components-ஐ அடையாளம் கண்ட பிறகு, அவற்றை hierarchy-ஆக ஒழுங்குபடுத்துங்கள். Mockup-இல் மற்றொரு component-க்குள் தோன்றும் components, hierarchy-யில் child ஆகத் தோன்ற வேண்டும்:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## படி 2: React-இல் static version ஒன்றை கட்டுங்கள் {/*step-2-build-a-static-version-in-react*/}

இப்போது உங்கள் component hierarchy தயார்; உங்கள் app-ஐ செயல்படுத்த வேண்டிய நேரம் இது. மிக நேரடியான அணுகுமுறை என்னவெனில், எந்த interactivity-யும் சேர்க்காமல், உங்கள் data model-இலிருந்து UI-யை render செய்யும் version ஒன்றை கட்டுவது... இப்போதைக்கு! முதலில் static version-ஐ கட்டி, பின்னர் interactivity-யைச் சேர்ப்பது பெரும்பாலும் சாத்தியம். Static version-ஐ கட்ட அதிக typing வேண்டும்; அதிக சிந்தனை தேவையில்லை. ஆனால் interactivity சேர்க்க அதிக சிந்தனை வேண்டும்; typing அதிகம் தேவையில்லை.

உங்கள் data model-ஐ render செய்யும் static version-ஐ கட்ட, மற்ற components-ஐ reuse செய்து, [props](/learn/passing-props-to-a-component) மூலம் data-வை அனுப்பும் [components](/learn/your-first-component)-ஐ உருவாக்க வேண்டும். Props என்பது parent-இலிருந்து child-க்கு data அனுப்பும் ஒரு வழி. ([state](/learn/state-a-components-memory) என்ற கருத்து உங்களுக்கு தெரிந்திருந்தால், இந்த static version-ஐ கட்ட state-ஐ எக்காரணம் கொண்டும் பயன்படுத்த வேண்டாம். State என்பது interactivity-க்காக மட்டுமே வைத்திருக்கப்படுகிறது; அதாவது காலத்துடன் மாறும் data-க்காக. இது app-இன் static version என்பதால், உங்களுக்கு அது தேவையில்லை.)

Hierarchy-யில் மேலே உள்ள components-ஐ (உதாரணமாக `FilterableProductTable`) கட்டுவதிலிருந்து தொடங்கி "top down" ஆகவும், கீழே உள்ள components-இலிருந்து (உதாரணமாக `ProductRow`) வேலை செய்து "bottom up" ஆகவும் கட்டலாம். நேரடியான எடுத்துக்காட்டுகளில் top-down ஆகச் செல்லுவது வழக்கமாக சாத்தியம்; பெரிய projects-இல் bottom-up ஆகச் செல்லுவது சாத்தியம்.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>பெயர்</th>
          <th>விலை</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="தேடு..." />
      <label>
        <input type="checkbox" />
        {' '}
        கையிருப்பில் உள்ள products மட்டும் காட்டு
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(இந்த code அச்சுறுத்தலாகத் தெரிந்தால், முதலில் [Quick Start](/learn/)-ஐப் பாருங்கள்!)

உங்கள் components-ஐ கட்டிய பிறகு, உங்கள் data model-ஐ render செய்யும் reusable components-ன் library ஒன்று உங்களிடம் இருக்கும். இது static app என்பதால், components JSX-ஐ மட்டும் திருப்பித் தரும். Hierarchy-யின் மேலேயுள்ள component (`FilterableProductTable`) உங்கள் data model-ஐ prop ஆகப் பெறும். இதை _one-way data flow_ என்று அழைக்கிறோம், ஏனெனில் data top-level component-இலிருந்து tree-யின் கீழே உள்ள components-க்கு கீழ்நோக்கிப் பாய்கிறது.

<Pitfall>

இந்த கட்டத்தில், நீங்கள் எந்த state values-ஐயும் பயன்படுத்தக்கூடாது. அது அடுத்த படிக்கானது!

</Pitfall>

## படி 3: UI state-ன் குறைந்தபட்சமான ஆனால் முழுமையான பிரதிநிதித்துவத்தை கண்டறியுங்கள் {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI-யை interactive ஆக்க, users உங்கள் அடிப்படை data model-ஐ மாற்ற அனுமதிக்க வேண்டும். இதற்காக நீங்கள் *state* பயன்படுத்துவீர்கள்.

உங்கள் app நினைவில் வைத்திருக்க வேண்டிய மாறும் data-வின் குறைந்தபட்ச தொகுப்பாக state-ஐ நினைத்துப் பாருங்கள். State-ஐ அமைப்பதற்கான மிக முக்கியக் கொள்கை [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ஆக வைத்திருப்பதுதான். உங்கள் application-க்கு தேவையான state-ன் முற்றிலும் குறைந்தபட்ச representation-ஐ கண்டறிந்து, மற்ற அனைத்தையும் தேவையான நேரத்தில் compute செய்யுங்கள். உதாரணமாக, shopping list ஒன்றை கட்டினால், items-ஐ state-இல் array ஆக வைத்திருக்கலாம். பட்டியலில் உள்ள items எண்ணிக்கையையும் காட்ட வேண்டுமென்றால், items எண்ணிக்கையை வேறு state value ஆக வைத்திருக்க வேண்டாம்--அதற்கு பதிலாக உங்கள் array-யின் length-ஐ படியுங்கள்.

இப்போது இந்த எடுத்துக்காட்டு application-இல் உள்ள data துண்டுகள் அனைத்தையும் சிந்தியுங்கள்:

1. Products-ன் அசல் list
2. User உள்ளிட்ட search text
3. Checkbox-ன் value
4. Products-ன் filtered list

இவற்றில் எவை state? State அல்லாதவற்றை அடையாளம் காணுங்கள்:

* அது காலப்போக்கில் **மாறாமல் இருக்கிறதா**? அப்படியானால் அது state அல்ல.
* அது parent-இலிருந்து props மூலம் **அனுப்பப்படுகிறதா**? அப்படியானால் அது state அல்ல.
* உங்கள் component-இல் ஏற்கனவே உள்ள state அல்லது props அடிப்படையில் அதை **compute செய்ய முடியுமா**? அப்படியானால் அது *நிச்சயமாக* state அல்ல!

மீதமுள்ளதே state ஆக இருக்கலாம்.

அவற்றை மீண்டும் ஒன்றன்பின் ஒன்றாகப் பார்ப்போம்:

1. Products-ன் அசல் list **props ஆக அனுப்பப்படுகிறது, எனவே அது state அல்ல.**
2. Search text காலப்போக்கில் மாறுகிறது மற்றும் வேறு எதிலிருந்தும் compute செய்ய முடியாது; எனவே அது state போல் தெரிகிறது.
3. Checkbox-ன் value காலப்போக்கில் மாறுகிறது மற்றும் வேறு எதிலிருந்தும் compute செய்ய முடியாது; எனவே அது state போல் தெரிகிறது.
4. Products-ன் filtered list **state அல்ல, ஏனெனில் அதை compute செய்ய முடியும்**: products-ன் அசல் list-ஐ எடுத்து, search text மற்றும் checkbox value-க்கு ஏற்ப filter செய்வதால் அது கிடைக்கும்.

இதனால் search text மற்றும் checkbox-ன் value மட்டுமே state! நன்றாக செய்தீர்கள்!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

React-இல் "model" data-விற்கு இரண்டு வகைகள் உள்ளன: props மற்றும் state. இரண்டும் மிகவும் வேறுபட்டவை:

* [**Props** என்பது function-க்கு அனுப்பும் arguments போன்றவை](/learn/passing-props-to-a-component). அவை parent component-ஐ child component-க்கு data அனுப்பவும், அதன் தோற்றத்தை customize செய்யவும் அனுமதிக்கின்றன. உதாரணமாக, `Form` ஒரு `color` prop-ஐ `Button`-க்கு அனுப்பலாம்.
* [**State** என்பது component-ன் நினைவகம் போன்றது.](/learn/state-a-components-memory) அது ஒரு component சில தகவலைப் பின்தொடர்ந்து, interactions-க்கு பதிலாக அதை மாற்ற அனுமதிக்கிறது. உதாரணமாக, `Button` `isHovered` state-ஐப் பின்தொடரலாம்.

Props மற்றும் state வேறுபட்டவை, ஆனால் அவை ஒன்றாகச் செயல்படுகின்றன. ஒரு parent component சில தகவலை state-இல் வைத்திருக்கும் (அதை மாற்ற முடியும் என்பதற்காக), அதை child components-க்கு அவற்றின் props ஆக *கீழே அனுப்பும்*. முதல் வாசிப்பில் இந்த வேறுபாடு இன்னும் மங்கலாகத் தோன்றினாலும் பரவாயில்லை. அது உண்மையில் பதிய சிறிது பயிற்சி தேவை!

</DeepDive>

## படி 4: உங்கள் state எங்கு இருக்க வேண்டும் என்பதை அடையாளம் காணுங்கள் {/*step-4-identify-where-your-state-should-live*/}

உங்கள் app-இன் குறைந்தபட்ச state data-வை அடையாளம் கண்ட பிறகு, இந்த state-ஐ மாற்றுவதற்கு எந்த component பொறுப்பாக இருக்கிறது, அல்லது state-ஐ *owns* செய்கிறது என்பதை அடையாளம் காண வேண்டும். நினைவில் கொள்ளுங்கள்: React one-way data flow-ஐப் பயன்படுத்துகிறது; parent-இலிருந்து child component-க்கு component hierarchy வழியாக data-வை கீழே அனுப்புகிறது. எந்த component எந்த state-ஐ own செய்ய வேண்டும் என்பது உடனடியாகத் தெளிவாக இருக்காமல் இருக்கலாம். இந்த கருத்துக்கு நீங்கள் புதியவராக இருந்தால் இது சவாலாக இருக்கலாம், ஆனால் கீழே உள்ள படிகளைப் பின்பற்றி அதை கண்டறியலாம்!

உங்கள் application-இல் உள்ள ஒவ்வொரு state துண்டுக்கும்:

1. அந்த state அடிப்படையில் ஏதாவது render செய்யும் *ஒவ்வொரு* component-ஐயும் அடையாளம் காணுங்கள்.
2. அவற்றின் அருகிலுள்ள common parent component-ஐக் கண்டறியுங்கள்--hierarchy-யில் அவற்றிற்கெல்லாம் மேலே இருக்கும் component.
3. State எங்கு இருக்க வேண்டும் என்பதை முடிவு செய்யுங்கள்:
    1. பெரும்பாலும், state-ஐ அவற்றின் common parent-இல் நேரடியாக வைக்கலாம்.
    2. State-ஐ அவற்றின் common parent-க்கு மேலே உள்ள ஏதேனும் component-இலும் வைக்கலாம்.
    3. State-ஐ own செய்ய பொருத்தமான component ஒன்றைக் கண்டுபிடிக்க முடியாவிட்டால், state-ஐ வைத்திருக்க மட்டும் ஒரு புதிய component உருவாக்கி, common parent component-க்கு மேலே hierarchy-யில் எங்காவது சேர்க்கவும்.

முந்தைய படியில், இந்த application-இல் இரண்டு state துண்டுகளை கண்டீர்கள்: search input text மற்றும் checkbox-ன் value. இந்த எடுத்துக்காட்டில் அவை எப்போதும் ஒன்றாகத் தோன்றுகின்றன, எனவே அவற்றை ஒரே இடத்தில் வைப்பது பொருத்தமாகும்.

இப்போது அவற்றுக்கான நமது strategy-யை படிப்படியாகப் பார்ப்போம்:

1. **State-ஐ பயன்படுத்தும் components-ஐ அடையாளம் காணுங்கள்:**
    * `ProductTable` அந்த state (search text மற்றும் checkbox value) அடிப்படையில் product list-ஐ filter செய்ய வேண்டும்.
    * `SearchBar` அந்த state-ஐ (search text மற்றும் checkbox value) காட்ட வேண்டும்.
2. **அவற்றின் common parent-ஐக் கண்டறியுங்கள்:** இரு components-மும் பகிரும் முதல் parent component `FilterableProductTable`.
3. **State எங்கு வாழ வேண்டும் என்பதை முடிவு செய்யுங்கள்**: filter text மற்றும் checked state values-ஐ `FilterableProductTable`-இல் வைத்திருப்போம்.

ஆகவே state values `FilterableProductTable`-இல் வாழும்.

[`useState()` Hook](/reference/react/useState) மூலம் component-க்கு state சேர்க்கவும். Hooks என்பது React-இல் "hook into" செய்ய அனுமதிக்கும் சிறப்பு functions. `FilterableProductTable`-ன் மேலே இரண்டு state variables-ஐச் சேர்த்து, அவற்றின் initial state-ஐ குறிப்பிடுங்கள்:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

பிறகு, `filterText` மற்றும் `inStockOnly`-ஐ props ஆக `ProductTable` மற்றும் `SearchBar`-க்கு அனுப்புங்கள்:

```js
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

உங்கள் application எப்படி நடக்கும் என்பதை பார்க்கத் தொடங்கலாம். கீழே உள்ள sandbox code-இல் `filterText` initial value-ஐ `useState('')` இலிருந்து `useState('fruit')` ஆக மாற்றிப் பாருங்கள். Search input text மற்றும் table இரண்டும் update ஆகும்:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>பெயர்</th>
          <th>விலை</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="தேடு..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        கையிருப்பில் உள்ள products மட்டும் காட்டு
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Form-ஐ edit செய்வது இன்னும் வேலை செய்யவில்லை என்பதை கவனியுங்கள். ஏன் என்பதை விளக்கும் console error மேலுள்ள sandbox-இல் உள்ளது:

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.

</ConsoleBlock>

மேலுள்ள sandbox-இல், `ProductTable` மற்றும் `SearchBar` table, input, checkbox ஆகியவற்றை render செய்ய `filterText` மற்றும் `inStockOnly` props-ஐப் படிக்கின்றன. உதாரணமாக, `SearchBar` input value-ஐ இவ்வாறு நிரப்புகிறது:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="தேடு..."/>
```

ஆனால், typing போன்ற user actions-க்கு பதிலளிக்க நீங்கள் இன்னும் எந்த code-யும் சேர்க்கவில்லை. அது உங்கள் இறுதி படியாகும்.


## படி 5: inverse data flow சேர்க்கவும் {/*step-5-add-inverse-data-flow*/}

தற்போது உங்கள் app, props மற்றும் state hierarchy வழியாக கீழே பாய்வதால் சரியாக render செய்கிறது. ஆனால் user input-க்கு ஏற்ப state-ஐ மாற்ற, data எதிர் திசையில் பாய்வதையும் ஆதரிக்க வேண்டும்: hierarchy-யின் ஆழத்தில் உள்ள form components, `FilterableProductTable`-இல் உள்ள state-ஐ update செய்ய வேண்டும்.

React இந்த data flow-ஐ வெளிப்படையாக ஆக்குகிறது, ஆனால் two-way data binding-ஐவிட இது கொஞ்சம் அதிக typing தேவைப்படுத்துகிறது. மேலுள்ள எடுத்துக்காட்டில் type செய்யவோ checkbox-ஐ check செய்யவோ முயன்றால், React உங்கள் input-ஐ புறக்கணிப்பதை காண்பீர்கள். இது திட்டமிட்டதே. `<input value={filterText} />` என்று எழுதுவதன் மூலம், `input`-ன் `value` prop எப்போதும் `FilterableProductTable`-இலிருந்து அனுப்பப்படும் `filterText` state-க்கு சமமாக இருக்கும்படி அமைத்துள்ளீர்கள். `filterText` state ஒருபோதும் set செய்யப்படாததால், input ஒருபோதும் மாறாது.

User form inputs-ஐ மாற்றும் ஒவ்வொரு முறையும், அந்த மாற்றங்களை பிரதிபலிக்க state update ஆக வேண்டும். State-ஐ `FilterableProductTable` own செய்கிறது, எனவே அதுவே `setFilterText` மற்றும் `setInStockOnly`-ஐ call செய்ய முடியும். `SearchBar` `FilterableProductTable`-ன் state-ஐ update செய்ய அனுமதிக்க, இந்த functions-ஐ `SearchBar`-க்கு கீழே அனுப்ப வேண்டும்:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar`-க்குள், `onChange` event handlers-ஐச் சேர்த்து, அவற்றிலிருந்து parent state-ஐ set செய்வீர்கள்:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="தேடு..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

இப்போது application முழுமையாக வேலை செய்கிறது!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>பெயர்</th>
          <th>விலை</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="தேடு..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        கையிருப்பில் உள்ள products மட்டும் காட்டு
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Events-ஐ handle செய்வதும் state-ஐ update செய்வதும் பற்றி அனைத்தையும் [Adding Interactivity](/learn/adding-interactivity) பகுதியில் கற்றுக்கொள்ளலாம்.

## அடுத்து எங்கு செல்லலாம் {/*where-to-go-from-here*/}

React கொண்டு components மற்றும் applications கட்டுவது பற்றி எப்படி சிந்திப்பது என்பதற்கான மிகச் சுருக்கமான அறிமுகம் இதுவாகும். இப்போதே நீங்கள் [React project ஒன்றைத் தொடங்கலாம்](/learn/installation) அல்லது இந்த tutorial-இல் பயன்படுத்தப்பட்ட [syntax அனைத்திலும் மேலும் ஆழமாகச் செல்லலாம்](/learn/describing-the-ui).
