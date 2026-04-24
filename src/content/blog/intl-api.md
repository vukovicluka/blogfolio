---
title: "Intl API as a replacement for formatting libraries"
description: "You don't need date formatting libraries as Intl API does the job."
publishDate: 2026-04-24
tags: ["intl"]
---

All projects that I had a chance to work on included a formatting library to format primarily dates, but also numbers, currencies, plurals - from the early beginnings of using moment.js to recent more popular libraries like date-fns or date.js.
Those are very useful libraries and each of them has it pros and cons, with modern and lightweight date-fns taking the edge recently.
They all have something in common - as they are a third-party dependency they add kilobytes to the download size of your application.
In my recent project we used date-fns and removed it in favour of browser's native API - <b>Intl API</b>.

# Intl

From the MDN docs, The Intl namespace object contains several constructors as well as functionality common to the internationalization constructors and other language sensitive functions. Collectively, they comprise the ECMAScript Internationalization API, which provides language sensitive string comparison, number formatting, date and time formatting, and more.

The most important thing when using browser APIs is to check their support in major browsers. The good thing is that Intl is baseline widely available (some parts have varying level of support though), which means it works in every major browser.

- <b>0 kb</b> size as it is built into the browser
- <b>locale-aware</b> - supports languages and locales to comply with country-specific conventions
- <b>fast</b> as it is native browser API

# How it works

When using Intl API, you usually create a formatter with the static method you need for specific case, i.e. `Intl.DateTimeFormat`:

```ts
const locale = "hr-HR";
const options = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

const formatter = new Intl.DateTimeFormat(locale, options);
```

Then, once you created the formatter, you pass to it the value you want to format:

```ts
const createdDate = new Date("2026-04-24T12:15:00Z");

formatter.format(createdDate);
// "24. 04. 2026."
```

So each static method follows
`new (locales?: LocalesArgument, options?: FormatOptions): Format`

1. <b>locale</b> string such as `"hr-HR"`, `"en-US"`, `"fr-FR"` or `undefined` which will then use browser's default locale.
2. <b>options object</b> which controls the output of the formatter. Different static method has different options.

⚠️ It's advisible to create the formatter once and reuse it when you're handling values in the project.

```ts
// ✅ Good: create once, reuse many times.
const formatter = new Intl.DateTimeFormat(locale, options);
dates.map((date) => formatter.format(date));

// 👎 Less good: create a new formatter every time
dates.map((date) => new Intl.DateTimeFormat(locale, options).format(date));
```

# Usage

On my recent project, we swapped all date-fns occurances with Intl API replacements. Some of the API's we are using are:

1. `Intl.DateTimeFormat` - is the API for formatting dates and times.

```ts
const locale = "hr-HR";
const options = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};
const formatter = new Intl.DateTimeFormat(locale, options);
formatter.format(createdDate);
// "24. 04. 2026."
```

- `Intl.RelativeTimeFormat` - yields human-friendly relative time strings like "yesterday", "3 days ago", "in 3 days".

```ts
const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});
formatter.format(-3, "day");
// "3 days ago"
```

- `Intl.NumberFormat` - formats plain numbers, currencies, and units.

```ts
const formatter = new Intl.NumberFormat("hr-HR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
console.log(formatter.format(10199.2));
// "10.199,20"

const formatter = new Intl.NumberFormat("hr-HR", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "symbol",
});
formatter.format(123456.789);
// "123.456,79 €"
```

# References

[MDN - Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
