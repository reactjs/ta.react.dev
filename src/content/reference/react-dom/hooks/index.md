---
title: "உள்ளமைந்த React DOM Hooks"
---

<Intro>

`react-dom` package, web applications-இல் மட்டும் ஆதரிக்கப்படும் Hooks-ஐக் கொண்டுள்ளது (அவை browser DOM சூழலில் இயங்குகின்றன). iOS, Android, அல்லது Windows applications போன்ற browser அல்லாத சூழல்களில் இந்த Hooks ஆதரிக்கப்படவில்லை. Web browsers *மற்றும் பிற சூழல்களிலும்* ஆதரிக்கப்படும் Hooks-ஐத் தேடுகிறீர்கள் என்றால், [React Hooks பக்கத்தை](/reference/react/hooks) பார்க்கவும். `react-dom` package-இல் உள்ள அனைத்து Hooks-ஐ இந்தப் பக்கம் பட்டியலிடுகிறது.

</Intro>

---

## Form Hooks {/*form-hooks*/}

*Forms* தகவலை சமர்ப்பிக்க interactive controls உருவாக்க உதவுகின்றன. உங்கள் components-இல் forms-ஐ நிர்வகிக்க, இந்த Hooks-இல் ஒன்றைப் பயன்படுத்துங்கள்:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) ஒரு form-இன் status அடிப்படையில் UI-யில் updates செய்ய அனுமதிக்கிறது.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
