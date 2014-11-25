google-maps
-----------

A simple AMD script for asynchronously loading google maps and associated libraries.

Includes methods for basic interaction with google maps and places.

### Revisions

 -  __1.0.0:__ Initial Release
 -  __1.0.1:__ Added the ability to have a callback when the google autocomplete place changed.

### Tools Utilized

 -  [Grunt](http://gruntjs.com/)
 -  [Bower](http://bower.io/)

See package.json and bower.json for individual libraries and frameworks.

### Notes

 -  Assumes the inclusion of jQuery or Zepto

__Github__: There are debates as to whether you should include the packages from bower/grunt in the repository...  It is possible for them to disappear and then no longer be able to be installed.  I prefer not to clutter the repository and run the risk of packages being missing.  If a package is removed by its maintainer, do you really want to continue using it?