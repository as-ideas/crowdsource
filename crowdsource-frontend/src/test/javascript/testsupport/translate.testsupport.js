function mockTranslation() {
     inject(function ($httpBackend) {
          $httpBackend
              .when('GET', '/translations/en.json')
              .respond(200, {});
     })

     inject(function ($translate) {
          $translate.use('en');
     })
}
