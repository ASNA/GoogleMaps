var rp = rp || {};

rp.GoogleMap = function() {
    // rpGoogleMap requires this markup available somewhere.
    //  <div  id="xxx" title="Google maps location"></div>
    // If it doesn't exist, this routine injects it into the page.

    var defaultMapZoomSize = 15;
    var address = [];
    var region = []
    var titleText;

    function appendAddress( value ) {
        if ( $.trim( value ).length === 0 ) return;
        address.push( value );
    }

    function appendRegion( value ) {
        if ( $.trim( value ).length === 0 ) return;
        region.push( value );
    }

    function setTitleText( value ) {
        titleText = value;
    }

    function getFullAddress() {
        return address.join( "," ) + "," + region.join( "," );
    }

    function clearAddressAndRegion() {
        address = [];
        region = [];
    }

    function configureModalDialog( mapDialogId ) {
        // Inject modal dialog markup if necessary.
        if ( $( "#" + mapDialogId ).length === 0 ) {
            var markUp = [];
            markUp.push( '<div id="{id}">' );
            markUp.push( '<div style="width:99%;height:99%;' );
            markUp.push( 'border: 1px solid gray;"></div></div>' );

            $( "body" ).append( markUp.join( "" ).
                                replace( "{id}", mapDialogId ) );
        }
        else {
            return;
        }

        $( "#" + mapDialogId ).dialog( {
            autoOpen: false,
            width: 550,
            height: 550,
            resizable: false,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            },
            modal: true
        } );
    }

    function loadSimpleMap( mapDialogId, address, text, zoomSize ) {
        zoomSize = zoomSize || defaultMapZoomSize;
        $( "#" + mapDialogId + " div" ).html("");
        $( "#" + mapDialogId + " div" ).
              gMap( { markers : [ { address : address,
                                    html : text } ],
                            address : address,
                            zoom : zoomSize } );
    }

    function show( zoomSize ) {
        var mapDialogId = "mapDialog";
        var fullAddress = getFullAddress();
        var text;
        var textMask = [];

        textMask.push( "<span style='font-size:.7em'>" );
        textMask.push( "<strong>{titleText}</strong><br/>" );
        textMask.push( "{address}<br/>{region}<br/></span>" );

        text = textMask.join( "" ).
               replace( "{titleText}", titleText ).
               replace( "{address}", address.join( "<br/>" ) ).
               replace( "{region}", region.join( " " ) );

        configureModalDialog( mapDialogId );
        $('#' + mapDialogId ).dialog( "option", "title", titleText );
        $('#' + mapDialogId ).dialog( "open" );
        // Important to load the map _after_ displaying the dialog.
        loadSimpleMap( mapDialogId, fullAddress, text, zoomSize );

        clearAddressAndRegion();
    }

    return {
        show : show,
        appendAddress : appendAddress,
        appendRegion : appendRegion,
        setTitleText : setTitleText
    };
}();
