//save the chart
function saveState() {
    var blocks = [];
    $(".w").each(function (idx, elem) {
    var $elem = $(elem);
    blocks.push({
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
        pageTargetId: connection.targetId
    });
});


var serializedData = JSON.stringify(blocks);
console.log(serializedData);
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
