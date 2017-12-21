angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.factory("TeamData", function($firebaseArray, $rootScope) {

	/*Takes the object for the currently logged in user.*/

	//This is for testing purposes in case it freezes.
	if(!$rootScope.CURR_ID)
		$rootScope.CURR_ID = 0;

	var itemsRef = new Firebase("https://confidant-test1.firebaseio.com/teams/"+$rootScope.CURR_ID);
	var team = $firebaseArray(itemsRef);

	return {
		itemsRef: itemsRef,
		
		team: team,
		
		getTeamData: team.$loaded(),
	}
})
.factory("DatePick", function(ionicDatePicker){

	var ipObj1 = {
		callback: function (val) {  //Mandatory
			var date = new Date(val);
			$scope.date = ("0" + (date.getUTCDate())).slice(-2) + "/"
			+ ("0" + (date.getUTCMonth()+1)).slice(-2)  + "/"
			+ date.getFullYear();
		},
		from: new Date(2012, 1, 1), //Optional
		to: new Date(2016, 10, 30), //Optional
		inputDate: new Date(),      //Optional
		closeOnSelect: false,       //Optional
		templateType: 'popup'       //Optional
	};

	return { time : ipObj1 };

})
.factory("Categories", function(){
	return{ cat :
	[
	{ text: "Memory Loss", checked: false },
	{ text: "Learning Difficulties", checked: false },
	{ text: "Language Problems", checked: false },
	{ text: "Wandering", checked: false },
	{ text: "Behavior/Mood Change", checked: false }
	]};
})

.factory("Users", function($firebaseArray) {

	/*Used to log-in the system.*/

	var itemsRef = new Firebase("https://confidant-test1.firebaseio.com/teams");
	var users = $firebaseArray(itemsRef);

	return {
		itemsRef: itemsRef,
		
		users: users,
		
		getUsersLoaded: users.$loaded(),
	}
})


.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		clear: function() {
			$window.localStorage.clear();
		}
	}
}]);
