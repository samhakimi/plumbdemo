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
    $.each(jsPlumb.getConnections(), function (idx, connection) {
      connections.push({
      connectionId: connection.id,
      pageSourceId: connection.sourceId,
      pageTargetId: connection.targetId,
      anchors: $.map(connection.endpoints, function(endpoint) {

        return [[endpoint.anchor.x, 
        endpoint.anchor.y, 
        endpoint.anchor.orientation[0], 
        endpoint.anchor.orientation[1],
        endpoint.anchor.offsets[0],
        endpoint.anchor.offsets[1]]];

      })
    });
  });

 var flowChart = {};
    flowChart.nodes = nodes;
    flowChart.connections = connections; 

    var flowChartJson = JSON.stringify(flowChart);
    //console.log(flowChartJson);

    $('#jsonOutput').text(flowChartJson);
}

//load the chart
function loadState() {
 
$.each(connections, function( index, elem ) {
var connection1 = jsPlumb.connect({
source: elem.pageSourceId,
target: elem.pageTargetId,
anchors: elem.anchors
});
 
});


}


$("#save").click(function() {saveState();});
$("#load").click(function() {loadState();});
