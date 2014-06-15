// sam h -- jsplumb demo for blinex.com team

jsPlumb.ready(function() {
					
	// setup some defaults for jsPlumb.	
	var instance = jsPlumb.getInstance({
		Endpoint : ["Dot", {radius:5}],
		HoverPaintStyle : {strokeStyle:"red", lineWidth:4 },
		ConnectionOverlays : [
			[ "Arrow", { 
				location:1,
				id:"arrow",
             			length:15,
             			foldback:0.35
			} ],
                        //[ "Label", { label:"connection", id:"label", cssClass:"aLabel" }]
		],
		Container:"statemachine-demo"
	});

	var windows = jsPlumb.getSelector(".w");

    // initialise draggable elements.  
	instance.draggable(windows, {containment:"parent"});
         

    // bind a click listener to each connection; the connection is deleted. you could of course
	// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
	// happening.
	instance.bind("click", function(c) { 
		instance.detach(c); 
	});

	// bind a connection listener. note that the parameter passed to this function contains more than
	// just the new connection - see the documentation for a full list of what is included in 'info'.
	// this listener sets the connection's internal
	// id as the label overlay's text.
 /* instance.bind("connection", function(info) {
		info.connection.getOverlay("label").setLabel(info.connection.id);
    });
*/

	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		var isFilterSupported = instance.isDragFilterSupported();
		// make each ".ep" div a source and give it some parameters to work with.  here we tell it
		// to use a Continuous anchor and the StateMachine connectors, and also we give it the
		// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
		// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
		// would recommend you do. Note also here that we use the 'filter' option to tell jsPlumb
		// which parts of the element should actually respond to a drag start.
		// here we test the capabilities of the library, to see if we
		// can provide a `filter` (our preference, support by vanilla
		// jsPlumb and the jQuery version), or if that is not supported,
		// a `parent` (YUI and MooTools). I want to make it perfectly
		// clear that `filter` is better. Use filter when you can.
		if (isFilterSupported) {
			instance.makeSource(windows, {
				filter:".ep",
				anchor:"Continuous",
				connector:[ "StateMachine", { curviness:12 } ],
				connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:3, outlineColor:"transparent", outlineWidth:4 },
				maxConnections:3,
				onMaxConnections:function(info, e) {
				alert("Maximum connections (" + info.maxConnections + ") reached");
				}
			});
		}
		 
	});

	// initialise all '.w' elements as connection targets.
	instance.makeTarget(windows, {
		dropOptions:{ hoverClass:"dragHover" },
		anchor:"Continuous"				
	});
	
	// and finally, make a couple of connections 
	instance.connect({ source:"opened", target:"phone1" });
	instance.connect({ source:"phone2", target:"inperson" });
	instance.connect({ source:"inperson", target:"rejected" });

	 
	instance.repaintEverything();




	//save the chart 

	function saveState() {
	    var nodes = [];
	    $(".w").each(function (idx, elem) {
	    var $elem = $(elem);
	    nodes.push({
		blockId: $elem.attr('id'),
		positionX: parseInt($elem.css("left"), 10),
		positionY: parseInt($elem.css("top"), 10)
	    });
	});

       
 


    var connections = [];
    $.each(instance.getConnections(), function (idx, connection) {
      
      connections.push({
      connectionId: connection.id,
      pageSourceId: connection.sourceId,
      pageTargetId: connection.targetId,
      anchors: $.map(connection.endpoints, function(endpoint) {
        //console.log(endpoint.anchor);
        return [[
        endpoint.anchor.x, 
        endpoint.anchor.y
        //not present with dynamic anchors  
        //endpoint.anchor.orientation[0], 
        //endpoint.anchor.orientation[1],
        //endpoint.anchor.offsets[0],
        //endpoint.anchor.offsets[1]
        ]];

      })
    });
  });

    var flowChart = {};
    flowChart.nodes = nodes;
    flowChart.connections = connections; 

    var flowChartJson = JSON.stringify(flowChart); 
    $('#jsonOutput').text(flowChartJson);
}






	//load the chart
	function loadState() {

        try {
		var data = $.parseJSON($("#jsonOutput").html());

		if(typeof data == 'object') {
		   clearState(); 
		   loadData(data);
		   $("#items").html("done.");
		}  
	} catch(err) {
                $("#items").html("no JSON found");		
	}

 
      
 
	function loadData(data) {
		
		//position the elements
		$.each(data.nodes, function( index, elem ) {
		$( "div#" + elem.blockId ).offset({ top: elem.positionY+10, left: elem.positionX+10 });
		});

		//make the connections
		$.each(data.connections, function( index, elem ) {
		var connectionLoad = instance.connect({ 
		source: elem.pageSourceId,
		target: elem.pageTargetId,
		anchors: elem.anchors 
		});
		 
		});
        }

	}


	//clear all connections
        function clearState() {
           instance.detachEveryConnection();       
 	}



	$("#save").click(function() {saveState();});
	$("#load").click(function() {loadState();});
	$("#clear").click(function() {clearState();});
      
        //start with a good looking chart
	loadState();


});



