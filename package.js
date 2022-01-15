Package.describe({
  name: 'solid-template-helper',
  version: '0.0.0',
  summary: 'Use SolidJS components in Meteor Blaze templates',
  git: 'https://github.com/edemaine/meteor-solid-template-helper',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.5.3');

  api.use([
    'templating',
    'ecmascript',
    'tmeasday:check-npm-versions@1.0.2',
  ]);

  api.addFiles(['solid-template-helper.js'], 'client');
});
