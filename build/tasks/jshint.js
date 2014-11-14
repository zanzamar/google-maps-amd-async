module.exports = function( grunt ) {
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.config( "jshint", {
		options: {
			sub: true
		},
		all: [
			"dev/**/*.js"
		]
	});
};