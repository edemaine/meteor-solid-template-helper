# SolidJS Components in Blaze Templates

This package makes it easy to use ([SolidJS](https://www.solidjs.com/)
components within
[Meteor](https://www.meteor.com/) [Blaze](https://blazejs.org/) templates.
This makes it easy to gradually transition your Meteor project's user interface
from Blaze templates to SolidJS, enabling more-fine-grained reactivity,
substantially faster and more control over (re)rendering,
combined template and code via JSX, and many more advanced features
(higher-order components, Stores, Context, Suspense/lazy loading, Portals,
Error Boundaries, SSR, etc.).

`edemaine:solid-template-package` is essentially a port of
[`react-template-helper`](https://github.com/meteor/react-packages/tree/master/packages/react-template-helper),
sharing much of the code with that package.

## Usage

To add the `edemaine:solid-template-package` to your Meteor project:

```bash
meteor add edemaine:solid-template-helper
```

To then use a SolidJS component, use `{{> Solid component=...}}` in a
Blaze template, within at least one actual HTML element (not directly within
a `<template>`).  The `component` argument should resolve (via a template
helper) to a SolidJS component function.  Optionally, you can provide other
arguments (via more template helpers or, more usefully, from template data)
that will be passed in as props to that component;
if the arguments change reactively, the component will update reactively
(avoiding a complete dispose/render cycle).

Here is an example HTML template that uses a SolidJS component:

```html
<template name="Hello">
  <div>
    {{> Solid component=Hello name=name}}
  </div>
</template>
```

And here is an example of associated JavaScript code:

```js
import {createSignal, createEffect, onCleanup} from 'solid-js';

Template.Hello.helpers({
  Hello: () => Hello,  // note wrapped in closure to avoid getting called early
  name: () => Session.get('name'),
});

// SolidJS component, assuming edemaine:meteor is active
const Hello = (props) => {
  const [color, setColor] = createSignal('inherit');
  createEffect(() => {
    const interval = setInterval(
      () => setColor(`#${Math.floor(Math.random() * 0xffffff)
                         .toString(16).padStart(6, '0')}`),
      200);
    onCleanup(() => clearInterval(interval));
  });
  return (
    <h1 style={{color: color()}}>
      Hello {props.name}!
    </h1>
  );
};
```

## Related Tools

You might also want to use the following SolidJS + Meteor tools:

* [`edemaine:meteor`](https://github.com/edemaine/meteor-solid)
  to enable the SolidJS JSX compiler
* [`solid-meteor-data`](https://github.com/edemaine/solid-meteor-data)
  for easier use of Meteor Tracker reactive data in SolidJS.
