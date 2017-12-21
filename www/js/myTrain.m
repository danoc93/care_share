function res = myTrain()
	addpath('/u/cs401/speechdata/');
	addpath('/u/cs401/A3_ASR/code/');

	trainDir = '/u/cs401/speechdata/Testing/';
	testDir = '//u/cs401/speechdata/Training/';

	%All folders
	trainFolders = dir( [ trainDir ] );

	disp(trainFolders);


end