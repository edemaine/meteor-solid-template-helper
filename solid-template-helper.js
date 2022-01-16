// This code is based on react-template-helper:
// https://github.com/meteor/react-packages/blob/master/packages/react-template-helper/react-template-helper.js
// which is licensed under the same MIT License (but with different authors)

import {checkNpmVersions} from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'solid-js': '>=1',
}, 'solid-template-helper');

const {createStore, reconcile} = require('solid-js/store');
const SolidWeb = require('solid-js/web');

// Empty template; logic in `onRendered` below
Template.Solid = new Template("Template.Solid", () => []);

Template.Solid.onRendered(function () {
  const parentTemplate = parentTemplateName();
  const template = this;
  const container = this.firstNode.parentNode;

  let lastComponent, setRenderProps;
  this.autorun(function (c) {
    const data = Blaze.getData();
    const component = data && data.component;
    if (!component) {
      throw new Error(
        `In template "${parentTemplate}", call to \`{{> Solid ... }}\` ` +
        "missing `component` argument.");
    }
    if (typeof component !== 'function') {
      throw new Error(
        `In template "${parentTemplate}", call to \`{{> Solid ... }}\` ` +
        "passed non-function for `component` argument.");
    }
    const props = Object.assign({}, data);
    delete props.component;

    if (component !== lastComponent) {
      // Initial render or changed component
      if (template.dispose) template.dispose();
      template.dispose = SolidWeb.render(
        () => {
          let renderProps;
          [renderProps, setRenderProps] = createStore(props);
          return SolidWeb.createComponent(component, renderProps);
        }, container);
    } else {
      // Same component; just update changed props reactively
      setRenderProps(reconcile(props));
    }
    lastComponent = component;
  });
});

Template.Solid.onDestroyed(function () {
  if (this.dispose) this.dispose();
});

// Gets the name of the template inside of which this instance of `{{>
// Solid ...}}` is being used. Used to print more explicit error messages.
// Roughly identical to react-template-helper.js's `parentTemplateName`.
function parentTemplateName() {
  let view = Blaze.getView();
  if (!view || view.name !== "Template.Solid")
    throw new Error("Unexpected: called outside of Template.Solid");

  // find the first parent view which is a template or body
  view = view.parentView;
  while (view) {
    // check `view.name.match(/^Template\./)` because iron-router (and
    // maybe other packages) create a view named "yield" that has the
    // `template` property set
    let m;
    if (view.template && view.name &&
        (m = view.name.match(/^Template\.(.*)/))) {
      return m[1];
    } else if (view.name === "body") {
      return "<body>";
    }

    view = view.parentView;
  }

  // not sure when this could happen
  return "<unknown>";
};
