angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController.profileTabPage', {
    cache: false,
    url: '/profile',
    views: {
      'tab1': {
        templateUrl: 'templates/profileTabPage.html',
        controller: 'profileTabPageCtrl'
      }
    }
  })

  .state('tabsController.reportsTabPage', {
    cache: false,
    url: '/reports',
    views: {
      'tab2': {
        templateUrl: 'templates/reportsTabPage.html',
        controller: 'reportsTabPageCtrl'
      }
    }
  })

  .state('tabsController.detailsTabPage', {
    cache: false,
    url: "/details/:id",
    views: {
     'tab2': {
      templateUrl: "templates/detailsTabPage.html",
      controller: 'detailsTabPageCtrl'
    }
  }
})

  .state('tabsController.trackerTabPage', {
    cache: false,
    url: '/tracker',
    views: {
      'tab3': {
        templateUrl: 'templates/trackerTabPage.html',
        controller: 'trackerTabPageCtrl'
      }
    }
  })

  .state('tabsController.settingsTabPage', {
    cache: false,
    url: '/settings',
    views: {
      'tab6': {
        templateUrl: 'templates/settingsTabPage.html',
        controller: 'settingsTabPageCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    cache: false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('chooseProfile', {
    cache: false,
    url: '/chooseProfile',
    templateUrl: 'templates/chooseProfile.html',
    controller: 'chooseProfileCtrl'
  })

  .state('tabsController.newReport', {
    cache: false,
    url: '/new-report',
    views: {
      'tab2': {
        templateUrl: 'templates/newReportPage.html',
        controller: 'newReportPageCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/login')

});
