/*******************************************************************************
 *
 * Google Maps
 *
 * Utility for asynchronously loading google libraries and working with them.
 *
 * Since Googe Maps is loading asynchronously we need to ensure that any methods
 * which depend on google maps are executed after it loads.  We accomplish this
 * by wrapping all methods in a "delayGoogleFunction" method.
 *
*******************************************************************************/
define([
	"jquery"
], function( $ ) {

	var $body = $( "body" );
	var returnMethods = {};

	/***************************************************************************
	 *
	 * librariesReduce
	 *
	 * Reduces the items into a csv type list for loading google libraries
	 *
	***************************************************************************/
	function librariesReduce( libraries ) {
		return libraries.reduce( function( pv, cv, i ) {
			return "" + pv + ( ( pv !== "" ) ? "," : "" ) + cv;
		}, "" );
	}

	var publicMethods = {

		/***********************************************************************
		 *
		 * validateAddress
		 *
		 * Calls the "success" function if the passed in address validates as
		 * a street address with gogole.  Calls the "fail" function if it is
		 * not valid
		 *
		 * args: {
		 *		origAddress:
		 *		success:
		 *		fail:
		 * }
		 *
		***********************************************************************/
		validateAddress: function( args ) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': args.origAddress }, function ( results, status ) {
				if ( status == google.maps.GeocoderStatus.OK && results[ 0 ].types.indexOf( "street_address" ) != -1 ) {
					args.success( args.origAddress, results );
				} else {
					args.fail( args.origAddress, results );
				}
			});
		},

		/***********************************************************************
		 *
		 * autoComplete
		 *
		 * Provides auto complete functionality on a text input element.
		 *
		***********************************************************************/
		autoComplete: function( args ) {
			var $je = args.$je;
			if ( !$je.hasClass( "google-auto-complete-attached" ) ) {
				$je.addClass( "google-auto-complete-attached" );
				var options = {};
				if ( args.type == "city" ) {
					options.types = [ "(cities)" ];
					options.componentRestrictions = { country: "us" };
				}
				var autocomplete = new google.maps.places.Autocomplete( $je[ 0 ], options );
				google.maps.event.addListener( autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					if ( place && place.address_components ) {
						place.address_components.forEach( function( component ) {
							var name = "";
							var value = "";
							if ( component.types.indexOf( "locality" ) != -1 ) {
								name = "city";
								value = component.long_name;
							} else if ( component.types.indexOf( "administrative_area_level_1" ) != -1 ) {
								name = "state";
								value = component.short_name;
							} else if ( component.types.indexOf( "postal_code" ) != -1 ) {
								name = "postal_code";
								value = component.long_name;
							}
							$( "input[name='" + name + "']", $je.parent() ).val( value );
						});
					}
				});
			}
		}
	};

	/***************************************************************************
	 *
	 * googleMapsInitialized
	 *
	 * Called after the successful loading of google maps.  Sets the proper
	 * body css tags and executes any deferred google maps dependent functions.
	 *
	***************************************************************************/
	window.googleMapsInitialized = function() {
		$body
			.removeClass( "google-maps-loading" )
			.addClass( "google-maps-loaded" );
		if ( window.googleMapsCallbacks ) {
			setTimeout( function() {
				$.each( window.googleMapsCallbacks, function( key, f ) {
					f();
				});
			}, 100 );
		}
	};

	/***********************************************************************
	 *
	 * load
	 *
	 * Asynchronously loads google maps.
	 *
	***********************************************************************/
	returnMethods.load = function( key, libraries ) {
		if ( !$body.hasClass( "google-maps-loaded" ) && !$body.hasClass( "google-maps-loading" ) ) {
			$body.addClass( "google-maps-loading" );
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';

			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=' + librariesReduce( libraries ) + '&key=' + key + '&callback=googleMapsInitialized';
			document.body.appendChild( script );
		}
	};

	/***************************************************************************
	 *
	 * delayGoogleFunction
	 *
	 * Wraps the publicMethods ensuring they are only executed once google maps
	 * is loaded.  The only method not wrapped is the "load" method.
	 *
	***************************************************************************/
	function delayGoogleFunction( k, f ) {
		if ( $body.hasClass( "google-maps-loaded" ) ) {
			f();
		} else {
			window.googleMapsCallbacks = window.googleMapsCallbacks || {};
			window.googleMapsCallbacks[ k ] = f;
		}
	}

	$.each( publicMethods, function( key, func ) {
		if ( key != "load" ) {
			returnMethods[ key ] = function( args ) {
				delayGoogleFunction( key, function() {
					func( args );
				});
			};
		}
	});

	return returnMethods;
});