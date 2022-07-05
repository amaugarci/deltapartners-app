angular.module( 'starter' ).filter( 'shortNumber', function() {
return function( number ) {
if ( number || number == 0) {
abs = Math.abs( number );
if ( abs >= Math.pow( 10, 12 ) ) {
// trillion
number = ( number / Math.pow( 10, 12 ) ).toFixed( 0 ) + "T";
} else if ( abs < Math.pow( 10, 12 ) && abs >= Math.pow( 10, 9 ) ) {
// billion
number = ( number / Math.pow( 10, 9 ) ).toFixed( 0 ) + "B";
} else if ( abs < Math.pow( 10, 9 ) && abs >= Math.pow( 10, 6 ) ) {
// million
number = ( number / Math.pow( 10, 6 ) ).toFixed( 0 ) + "M";
} else if ( abs < Math.pow( 10, 6 ) && abs >= Math.pow( 10, 3 ) ) {
// thousand
number = ( number / Math.pow( 10, 3 ) ).toFixed( 0 ) + "K";
}
else {
    number = number.toFixed(0);
}
return number;
}
};
} );

angular.module( 'starter' ).filter( 'shortNumberThousand', function() {
return function( number ) {
if ( number || number == 0) {
abs = Math.abs( number );

number = ( number / Math.pow( 10, 3 ) ).toFixed( 0 );
return number;
}
};
} );


angular.module( 'starter' ).filter( 'shortNumberInMillions', function() {
return function( number ) {
if ( number || number == 0) {
abs = Math.abs( number );

number = ( number / Math.pow( 10, 6 ) ).toFixed( 2 );
return number;
}
};
} );

angular.module( 'starter' ).filter( 'shortNumberInMillionsOneDecimal', function() {
return function( number ) {
if ( number || number == 0) {
abs = Math.abs( number );

number = ( number / Math.pow( 10, 6 ) ).toFixed( 1 );
return number;
}
};
} );