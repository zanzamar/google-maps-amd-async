module.exports = function( grunt ) {
	grunt.loadTasks( "build/tasks" );

	grunt.registerTask( "test", [
		"jshint"
	]);

	grunt.registerTask( "default", [
		"clean",
		"jshint",
		"uglify"
	]);
};