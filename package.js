Package.describe({
  name: 'edemaine:solid-template-helper',
  version: '0.1.0',
  summary: 'Use SolidJS components in Meteor Blaze templates',
  git: 'https://github.com/edemaine/meteor-solid-template-helper',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.5.3');

  api.use([
    'ecmascript',
    'templating@1.0.0',
    'tmeasday:check-npm-versions@1.0.2',
  ]);

  api.addFiles(['solid-template-helper.js'], 'client');
});
