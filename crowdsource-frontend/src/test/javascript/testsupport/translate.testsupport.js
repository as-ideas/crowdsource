function mockTranslation() {
     inject(function ($httpBackend) {
          $httpBackend
              .when('GET', '/translations/de.json')
              .respond(200, {});
     })

     inject(function ($translate) {
          $translate.use('de');
     })
}
