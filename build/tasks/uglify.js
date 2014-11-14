module.exports = function( grunt ) {
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.config( "uglify", {
		release: {
			options: {},
			files: {
				"dist/source.min.js": [ "dev/googleMaps.js" ]
			}
		}
	});
};