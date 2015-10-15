var svgWidth = 500
var svgHeight = 300
var xSlack = 10
var ySlack = 10


var svg = d3.select("#demo").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

    // svg.append("circle")
    //     .attr("cx",50)
    // 	.attr("cy",50)
    // 	.attr("r",40)
    // 	.attr("fill","red")
    //     .attr("stroke","black")
    //     .attr("stroke-width",3)
    // .attr("fill","red")



function myFunction() {
    var x = document.getElementById("frm1");
    
    var x_1 = Number(x.elements[0].value);
    var y_1 = Number(x.elements[1].value);
    var x_2 = Number(x.elements[2].value);
    var y_2 = Number(x.elements[3].value);

    //
    data_x = [x_1,x_2]
    maximumX = d3.max(data_x)
    data_x = data_x.map(function(d){return d/(1.0*maximumX);})

    //
    data_y = [y_1,y_2]
    maximumY = d3.max(data_y)
    data_y = data_y.map(function(d){return d/maximumY;})

    //fit to the size of the svg with slack
    radiusScale = Math.min((svgWidth - 3*xSlack) / 4.0, (svgHeight - 2*ySlack) / 2);
    
    //
    points = []
    for(i = 0 ; i < data_x.length ; ++i){
	vx = data_x[i]
	vy = data_y[i]
	
	
	if (vx >= vy){
	    color = "blue";
	    vMax = vx;
	    vMin = vy;
	}
	else{
	    color = "orange";
	    vMax = vy;
	    vMin = vx;
	}

	//outer circler
	point = {}
	point["x"] = xSlack + radiusScale + i * (xSlack + 2*radiusScale);
	point["y"] = ySlack + radiusScale;
	point["color"] = color;
	point["r"] = vMax * radiusScale;
	points.push(point);
    
	//inner circle
	point = {}
	point["x"] = xSlack + radiusScale + i * (xSlack + 2*radiusScale);
	point["y"] = ySlack + radiusScale;
	point["color"] = "white";
	point["r"] = vMin * radiusScale;
	points.push(point);
    }

    //
    // points = [{
    // 	       "x":(xSlack + radiusScale),
    // 	       "y":(ySlack + radiusScale),
    // 	       "v1":data_x[0] * radiusScale,
    // 	       "v2":data_y[0] * radiusScale
    // 	      },
    // 	      {
    // 	       "x":(2*xSlack + 3*radiusScale),
    // 	       "y":(ySlack + radiusScale),
    // 	       "v1":data_x[1] * radiusScale,
    // 	       "v2":data_y[1] * radiusScale
    // 	      }]
    
    console.log(points)


    //
    glyphs = svg.selectAll("circle")
    	.data(points)

    //update
    glyphs.attr("cx", function(d) { return d["x"];})
    	.attr("cy",function(d) { return d["y"];})
    	.attr("r", function(d) { return d["r"];} )
    	.style("fill",function(d) { return d["color"];})

    //
    glyphs.enter()
    	.append("circle")
    	.attr("cx", function(d) { return d["x"];})
    	.attr("cy",function(d) { return d["y"];})
    	.attr("r", function(d) { return d["r"];} )
    	.style("fill",function(d) { return d["color"];})

}

