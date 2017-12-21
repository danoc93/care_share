angular.module('app.controllers', [])

.controller('profileTabPageCtrl', function($state, $ionicPopup, 
	$rootScope, $scope, TeamData, $sce) {

	$scope.logout = function(){
		$state.go('login');
	};

	$scope.showRecent = function() {
		$scope.info = false;
		$scope.sc = false;
		$scope.list = $scope.team.reports.slice(0, 
			Math.min($scope.team.reports.length, 3));
		$scope.todo = false;
	};

	$scope.showTodo = function() {
		$scope.todo = true;
		$scope.info = false;
		$scope.sc = false;
		
	};

	$scope.getObjectStr = function(object){
		if(object.name)
			return object.name;
		return object;
	};

	$scope.showInfo = function() {
		$scope.info = true;
		$scope.mv = false;
		$scope.sc = false;
		$scope.todo = false;
		$scope.list = $scope.team.patientData.prescriptions;
	};

	$scope.showCareTeam = function() {
		$scope.info = false;
		$scope.list = $scope.team.caregivers;
		$scope.sc = true;
		$scope.todo = false;

	};

	$scope.addAllergies = function() {
		$scope.showPopup('Allergies', '🔬');
	};

	$scope.addCaregiver = function() {
		$scope.showPopup('Caregiver', '👤');
	};

	$scope.addMedication = function() {
		$scope.showPopup('Medication', '💊');
	};

	$scope.addMH = function() {
		$scope.showPopup('Medical History', '🏥');
	};

	$scope.saveALL = function() {
		$scope.mv = false;
		TeamData.getTeamData.then(function(){
			$scope.team = (TeamData.team)[0];
			$scope.team.patientData.allergiesList = $scope.allergiesList;
			$scope.team.patientData.patientHistory = $scope.mhList;
			$scope.team.patientData.medicationList = $scope.medicationList;
			TeamData.team.$save($scope.team).then(function(ref) {
				console.log("Saved");
			});
		});
		
	};

	$scope.editALL = function() {
		$scope.mv = true;
	};

	$scope.editTodo = function() {
		$scope.clearCompleted();
	};

	$scope.markCompleted = function(item) {
		item.completed = true;
	};

	$scope.saveTodo = function(index) {	
		var todo = $scope.todoList[index];
		if (todo.checked) {
			todo.assginedto = $scope.CURRENTUSER;
		}else
		{
			if ($scope.CURRENTUSER != todo.assginedto){
				todo.checked = !todo.checked;
			}else{
				todo.assginedto = 'Nobody';
			}
		}
		
		TeamData.getTeamData.then(function(){
			$scope.team = (TeamData.team)[0];
			$scope.team.todoList = $scope.todoList;
			
			TeamData.team.$save($scope.team).then(function(ref) {
				console.log("Updated");
			});
		});
	};

	$scope.clearCompleted = function() {
		for (var i=0; i < $scope.todoList.length; i++ ){
			var todo = $scope.todoList[i];
			if (todo.completed) {
				$scope.todoList.splice(i, 1);
				i = -1;
			}
		};
		TeamData.getTeamData.then(function(){
			$scope.team = (TeamData.team)[0];
			$scope.team.todoList = $scope.todoList;
			TeamData.team.$save($scope.team).then(function(ref) {
				console.log("Saved");
			});
		});
	};

	$scope.addTodo = function() {
		$scope.showPopup('Todo', '✅');
	};

	$scope.PICS = ['leopard', 'lady', 'goatee', 'bear', 'mustache', 'guy', 'red', 'stubble', 'frida'];

	 // When button is clicked, the popup will be shown...
	 $scope.showPopup = function(type, icon) {
	 	$scope.data = {}

      // Custom popup
      var myPopup = $ionicPopup.show({
      	template: '<input type = "text" ng-model = "data.model">',
      	title: icon+' Adding '+type,
      	subTitle: 'Input the data below',
      	scope: $scope,

      	buttons: [
      	{ text: 'Cancel' }, {
      		text: '<b>Save</b>',
      		type: 'button-positive',
      		onTap: function(e) {

      			if (!$scope.data.model) {
                        //don't allow the user to close unless he enters model...
                        e.preventDefault();
                    } else {
                    	if(type == 'Allergies')
                    		$scope.allergiesList.push($scope.data.model);
                    	if(type == 'Medication')
                    		$scope.medicationList.push($scope.data.model);
                    	if(type == 'Todo') {
                    		$scope.todoList.unshift({ text: $scope.data.model, checked: false, assginedto: "Nobody", completed: false });
														TeamData.getTeamData.then(function(){
														$scope.team = (TeamData.team)[0];
														$scope.team.todoList = $scope.todoList;

														TeamData.team.$save($scope.team).then(function(ref) {
															console.log("Added");
														});
													});
                    	}
                    	if(type == 'Caregiver')
                    		$scope.caregivers.push({name: $scope.data.model, 
                    			pic: $scope.PICS[Math.floor(Math.random() 
                    				* $scope.PICS.length)]});
                    	if(type == 'Medical History')
                    		$scope.mhList.push($scope.data.model);
                    	return $scope.data.model;
                    }
                }
            }
            ]
        });

myPopup.then(function(res) {
	console.log('Tapped!', res);
});    
};

$scope.medicationList = [];
$scope.allergiesList = [];
$scope.mhList = [];
$scope.caregivers = [];
$scope.reports = [];
$scope.todoList = []
	
TeamData.getTeamData.then(function(){
	$scope.team = (TeamData.team)[0];
	$scope.showRecent();
	$scope.allergiesList = $scope.team.patientData.allergiesList;
	$scope.caregivers = $scope.team.caregivers;
	$scope.mhList = $scope.team.patientData.patientHistory;
	$scope.medicationList = $scope.team.patientData.medicationList;
	$scope.reports = $scope.team.reports;
	$scope.todoList = $scope.team.todoList;

	if (!$rootScope.CURRENTUSER){
		$rootScope.CURRENTUSER = 'Undefined';
		$rootScope.CURRENTPIC = 'def';
	}

});

})

.controller('reportsTabPageCtrl', function($scope, TeamData, $rootScope) {

	$scope.getReports = function(reports){
		var last_date = '';
		var list = [];
		var rep = null;
		for(var i=0; i < reports.length; i++){
			rep = reports[i];
			if(rep.date != last_date){
				last_date = rep.date;
				list.push({date: last_date, sep: true});
			}

			//Keep track of the position because of the separators.
			rep.pos = i;
			list.push(rep);
		}

		return list;
	};

	$scope.quantity = 15;

	TeamData.getTeamData.then(function(){
		$scope.team = (TeamData.team)[0];
		$scope.reports = $scope.getReports($scope.team.reports);
	});

	$scope.trimText = function(string){
		var x = 40;
		if (string){
			s = string.substring(0,x);
			if(string.length > x)
				s = s + "...";
			return s;
		}
	};

})

.controller('detailsTabPageCtrl', function($scope, TeamData, $stateParams, $state, $ionicHistory) {

	TeamData.getTeamData.then(function(){
		
		$scope.team = (TeamData.team)[0];
		$scope.report = $scope.team.reports[$stateParams.id];

		var result = $scope.team.caregivers.filter(function( obj ) {
			return obj.name == $scope.report.caregiver;
		});

		$scope.caregiver = result[0];
	});

	//TODO: Archive with an isArchived property
	/*$scope.deleteReport = function (){
		$scope.team.reports.splice($stateParams.id, 1);
		TeamData.team.$save($scope.team).then(
			function() {

				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('tabsController.reportsTabPage', {}, {reload: true});

			});
}*/
})

.controller('trackerTabPageCtrl', function($scope, $ionicPopup, $ionicHistory, 
	ionicDatePicker, TeamData, Categories) {
	

	$scope.getExploreDataSet = function(date, Date){
		dataSet = { 'Memory Loss' : {}, 'Learning Difficulties': 
		{}, "Language Problems": {}, "Wandering" : {},
		 "Behavior/Mood Change" : {}
		};

		var d = new Date(date);
		var dates = {};
		for (var i = 0; i < $scope.reports.length; i++){
			var report = $scope.reports[i];
			
			var a = report.date.split('/');
			var repDate = (a[0] + '-' +a[1] + '-' + a[2]);
		
			if(new Date(repDate) >= d){
				dates[repDate] = 1;

				for (cat in report.categories){
					cat = report.categories[cat];
					if (! (dataSet[cat.text][repDate]))
						dataSet[cat.text][repDate] = 0;
					if (cat.checked)
						dataSet[cat.text][repDate] += 1;
				}
			}
		}

		$scope.progressChart.labels = Object.keys(dates);

		var keys = [];
	for(var k in dataSet) keys.push(dataSet[k]);

		$scope.progressChart.data = keys;

	};



	//Tally up the categories
	TeamData.getTeamData.then(function(){
		
		$scope.team = (TeamData.team)[0];
		$scope.reports = $scope.team.reports;

		$scope.exploreData = {};

		var labels = ["Memory Loss", "Learning Difficulties", "Language Problems", "Wandering", "Behavior/Mood Change"];
		
		var data = labels.map(function(label, index){
			var result = $scope.reports.filter(function( obj ) {
				return obj.categories[index].checked;
			});
			return result.length;
		});
		$scope.data = data;


		
		$scope.progressData = {
			labels: ["Memory Loss", "Learning Difficulties", "Language Problems", "Wandering", "Behavior/Mood Change"],
			series: ["This week"],
			datasets: [

			{
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: $scope.data
			}], };

			$scope.progressChart = {
			labels: ["Memory Loss", "Learning Difficulties", "Language Problems", "Wandering", "Behavior/Mood Change"],
			series: ["This week"],
			datasets: [

			{
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: $scope.data
			}], };


					$scope.getExploreDataSet('2012 09 24', Date);


		});


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

	var currentdate = new Date();

	$scope.date = ("0" + (currentdate.getUTCDate())).slice(-2) + "/"
	+ ("0" + (currentdate.getUTCMonth()+1)).slice(-2)  + "/"
	+ currentdate.getFullYear();
	$scope.openDatePicker = function(){
		ionicDatePicker.openDatePicker(ipObj1);
	};

	$scope.categories = Categories.cat;	

	$scope.allAlerts = [
	{type: 'alertGood', text: 'Wandering Behaviours show a declining pattern.', icon: '🚶'},
	{type: 'alertNeutral', text: 'No change in Learning Difficulties during this period.', icon: '📚'},
	{type: 'alertBad', text: 'Increment in communication problems detected.', icon: '💬'},
	{type: 'alertNeutral', text: 'Behavior and Mood has remained relatively steady.', icon: '😶'},
	{type: 'alertBad', text: 'Memory Loss episodes have increased.', icon: '🙇'}
	];
	//TODO: not sure what this is
	$scope.linechart = {
		labels: ["Memory Loss", "Learning Difficulties", "Language Problems", "Wandering", "Behavior/Mood Change"],
		series: ["This week"],
		datasets: [

		{
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [2, 1, 0, 3, 3]
		}
		], };

	})

.controller('settingsTabPageCtrl', function($scope, $state) {
	$scope.logout = function() {
		$state.go('login');
	}

})

.controller('loginCtrl', function($rootScope, $scope, $state, Users) {
	$rootScope.LOGINID = 'TeamSam';
	$rootScope.LOGINPWD = 'Password';

	$scope.loginNow = function(){

		Users.getUsersLoaded.then(function(){
			for(var i = 0; i < Users.users.length; i++){
				u = Users.users.$getRecord(i).team;
				if (u.teamID == $scope.LOGINID && u.teamPWD == $scope.LOGINPWD )
				{
					//The current ID of the logged in group.
					$rootScope.CURR_ID = i;
					$rootScope.success = true;
					$state.go('chooseProfile');
					break;
				}
			}

			if(!$rootScope.success)
				console.log('User not found :(');
			});
	};
})

.controller('chooseProfileCtrl', function($rootScope, TeamData, $state, $scope) {

	$scope.setProfile = function (user){
		$rootScope.CURRENTUSER = user.name;
		$rootScope.CURRENTPIC = user.pic;

		$state.go('tabsController.profileTabPage');
	};

	$rootScope.getPic = function(a){
		pic = a.pic ? a.pic : 'def';
		return 'img/profiles/'+pic+'.png';
	};

	TeamData.getTeamData.then(function(){
		$scope.team = (TeamData.team)[0];
	});

})


.controller('newReportPageCtrl', function($scope, $location, $state, $rootScope, 
	TeamData, $ionicHistory, ionicDatePicker, $http, Categories) {

	$scope.categories = Categories.cat;
	var currentdate = new Date();
	$scope.date = ("0" + (currentdate.getUTCDate())).slice(-2) + "/"
	+ ("0" + (currentdate.getUTCMonth()+1)).slice(-2)  + "/"
	+ currentdate.getFullYear();
	$scope.time = ("0" + currentdate.getHours()).slice(-2) + ":"
	+ ("0" + currentdate.getUTCMinutes()).slice(-2);

	$scope.report = {};

	$scope.addReport = function(report) {
		if (report) {

			report.caregiver = $rootScope.CURRENTUSER;
			report.datePosted = $scope.date;
			report.timePosted = $scope.time;
			report.date = $scope.date;
			report.time = $scope.time;
			report.categories = $scope.categories;

			TeamData.getTeamData.then(function(){
				$scope.team = (TeamData.team)[0];

				if (!$scope.team.reports){
					$scope.team.reports = [];
				}

				$scope.team.reports.unshift(report);
				TeamData.team.$save($scope.team).then(function(ref) {
					report = {};
					$ionicHistory.nextViewOptions({
						disableBack: true
					});
					$state.go('tabsController.reportsTabPage', {}, {reload: true});
				});
			});
		}
	};

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

	$scope.openDatePicker = function(){
		ionicDatePicker.openDatePicker(ipObj1);
	};

	function timePickerCallback(val) {
		if (typeof (val) === 'undefined') {
			console.log('Time not selected');
		} else {
			var selectedTime = new Date(val * 1000);
			$scope.time = ("0" + selectedTime.getUTCHours()).slice(-2) + ":"
			+ ("0" + selectedTime.getUTCMinutes()).slice(-2);
		}
	}

	$scope.timePickerObject = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
		step: 15,  //Optional
		format: 24,  //Optional
		titleLabel: '24-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallback(val);
		}
	};

	if (!$rootScope.CURRENTUSER){
		$rootScope.CURRENTUSER = 'Undefined';
		$rootScope.CURRENTPIC = 'def';
	}

});
