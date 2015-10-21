var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var force = d3.layout.force()
    .charge(0)
    .gravity(0)
   .size([width, height]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });


var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)


//
centers = [{x:100,y:100},{x:200,y:100},{x:100,y:200},{x:200,y:200}]
pieChartData = [{values:[.3,.7],r:100}]

<!-- centers = [{x:100,y:100},{x:200,y:100},{x:100,y:200},{x:200,y:200}] -->
pieChartData = [{values:[.5,.5],r:50},{values:[.3,.7],r:50},{values:[.8,.2],r:50},{values:[.1,.9],r:30}]

function buildSliceData(values,radius){

numSlices = values.length;
result = []
cummulativeSum = 0
for(index = 0 ; index < numSlices ; ++index){
//
currentValue = values[index]
slice = {valuesBefore : cummulativeSum, value : cummulativeSum + currentValue , r : radius};
result.push(slice)
//
cummulativeSum += values[index];
}

return result;
}

function buildSlicePath(sliceData){
//
myradius = sliceData.r;

startAngle = 2 * (Math.PI) * sliceData.valuesBefore;
startPoint = {x : myradius * Math.cos(startAngle),
	      y : myradius * Math.sin(startAngle)};

endAngle   = 2 * (Math.PI) * sliceData.value;
endPoint   = {x : myradius * Math.cos(endAngle),
	      y : myradius * Math.sin(endAngle)};

//
//return "M 0 0 L " + startPoint.x + " " + startPoint.y + " L " + endPoint.x + " " + endPoint.y + " z";

var large_arc_flag = 0;
if(endAngle - startAngle > Math.PI)
  large_arc_flag = 1;

return "M 0 0 L " + startPoint.x + " " + startPoint.y + " A " + myradius + " " + myradius + " 0 " + + large_arc_flag + ",1" + " " + endPoint.x + " " + endPoint.y + " z";

 y1 + "  A180,180 0 0,1 " + x2 + "," + y2 + " z"; //1
}

var g = svg.selectAll(".arc")
.data(centers)
.enter()
.append("g")
.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});

g.selectAll("path")
.data(function(d,i){myData = pieChartData[i];
                    return buildSliceData(myData.values,myData.r);})
.enter()
.append("path")
.attr("d",function(d){return buildSlicePath(d);})
.style("fill", function(d,i) { return color(i); });

//
