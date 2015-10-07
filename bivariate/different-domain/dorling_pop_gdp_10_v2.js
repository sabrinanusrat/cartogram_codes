var force = d3.layout.force()
    .charge(0)
    .gravity(0)
   .size([960, 500]);
  //  .size([800, 400]);

var svg = d3.select("#chart").append("svg:svg")
  .attr("width", 960 + 100)
    .attr("height", 500 + 100)
  .append("svg:g")
    .attr("transform", "translate(50,50)");
	


var nodes, nodes2, links = [];

var Pop=[];

var PopMax, PopMean;

var states;

d3.json("USA-Pop2010-input.json", function(states) {

    
//	states=states1;
	states.features.map(function(d)
		{Pop.push(d.properties.Pop2010)});
  




	var project = d3.geo.albersUsa(),
	idToNode = {};
	//PopMax = d3.max(Pop);
	PopMean = d3.sum(Pop)/50;
	
	nodes = states.features.map(function(d) {
	var xy = project(d.geometry.coordinates);
		return idToNode[d.id] = {
			x: xy[0],
			y: xy[1],
			gravity: {x: xy[0], y: xy[1]},
			//r1: Math.sqrt(d.properties.Pop2010/PopMax)*50,
			//value1: d.properties.Pop2010/PopMax,
			
			r1: Math.sqrt(d.properties.Pop2010/PopMean)*25,
			value1: d.properties.Pop2010/PopMean,
			var1: d.properties.Pop2010,
			name: d.properties.name
		};
	});


	//r1set
	
	var r1set = [];
	var r2set =[];
	for (var i = 0; i<= 48; i++ ) r1set.push(nodes[i].r1);
	 var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
	
	
	d3.json("USA-GDP10-input.json", function(states) {
	
		var GDP=[];
	
		//var GDPMax;
	
	    var GDPMean;
		
		
		states.features.map(function(d) {
			GDP.push(d.properties.GDP10)});

		var project = d3.geo.albersUsa(),
		idToNode = {},
		links = [];
		
		//GDPMax= d3.max(GDP);
		
		GDPMean= d3.sum(GDP)/50;
		
		console.log(GDPMean);
		
		//console.log(nodes);
		
		states.features.map(function(d,i) {
			
			//console.log(nodes[i]);
			
			//nodes[i].r2=Math.sqrt(d.properties.GDP10/GDPMax)*50;
			//nodes[i].value2=d.properties.GDP10/GDPMax;
			
			nodes[i].var2= d.properties.GDP10;
			nodes[i].r2=Math.sqrt(d.properties.GDP10/GDPMean)*25;
			nodes[i].value2=d.properties.GDP10/GDPMean;
			
		});

		
		//r2set
		
  for (var i = 0; i<= 48; i++ ) r2set.push(nodes[i].r2);
  
  
  var diff = [];
   for (var i = 0; i<= 48; i++ ) diff.push(nodes[i].r1 - nodes[i].r2);
   
   
   
   var color = d3.scale.linear()
	.domain([d3.min(diff), 0, d3.max(diff)])
	.range(['darkorange', 'grey' ,'blue']); 
	
  
        //console.log(GDPMax);
		var dx, dy, l, d1, d2, d;

console.log(nodes[1]);
		
	svg.selectAll("circle")
	.data(nodes)
	.enter().append("svg:circle")
	//.style("stroke", function(d) { return "#0000FF"; })
	.style("stroke", function(d) { //if (1.03*d.r1<d.r2) return "#FF6600"; else if (1.03*d.r2<d.r1) return "#0000FF"; else return "#d3d3d3"; 
	return color(d.r1 - d.r2);	
	})
	.style("stroke-width", function(d) { return 3; })
	.style("stroke-opacity", function(d) { return 0.7; })
	//.style("fill", "none")
	//.style("fill", function(d) { return "#FFFFFF"; })
	.style("fill", function(d) { 
	//if (1.03*d.r1<d.r2) return "#FF6600"; else if (1.03*d.r2<d.r1) return "#0000FF"; else return "#d3d3d3";  
	return color(d.r1 - d.r2);	
	})
	//.style("fill-opacity", function(d) { return 0.3; })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { if (d.r1<d.r2) return d.r2; else return d.r1; })
    //.attr("visibility",visibility1960)
    .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Population "+"of "+ d.name +" is " +d.var1+" GDP of "+d.name+" is "+ d.var2);})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});  
	


		
		
		force
		.nodes(nodes)
		//.links(links)
		.start()
		.on("tick", function(e) {
			var k = e.alpha,
			kg = k * .02;

			nodes.forEach(function(a, i) {

			//Apply gravity forces.
				a.x += (a.gravity.x - a.x) * kg;
				a.y += (a.gravity.y - a.y) * kg;
			  
				nodes.slice(i + 1).forEach(function(b, j) {
				// Check for collisions.
					b = nodes.slice(i+1)[j];

					dx = a.x - b.x,
					dy = a.y - b.y,
					l = Math.sqrt(dx * dx + dy * dy),
					d1 = a.r1 + b.r1,
					d2 = a.r2 + b.r2;
					
					d = d3.max([d1,d2]);

					if (l < d) {
						l = (l - d) / l * k;
						dx *= l;
						dy *= l;
			  
						a.x -= dx;
						a.y -= dy;
						b.x += dx;
						b.y += dy;
					}
					nodes.slice(i+1)[j].x=b.x;
					nodes.slice(i+1)[j].y=b.y;
				});
				
				nodes[i].x=a.x;
				nodes[i].y=a.y;
			});

			svg.selectAll("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
			
			
			svg.selectAll("text")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; });
			
		});

		
		 var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
	
	
		svg
		.selectAll("g")
		.data(nodes)
		.enter()
		.append("svg:circle")
		.style("stroke", function(d) { return "#FFFFFF"; })
		//.style("stroke", function(d) { if (d.r1>=d.r2) return "#00FFaa"; else return "#0000FF"; })
		.style("stroke-width", function(d) { return 1; })
		.style("stroke-opacity", function(d) { return 0.7; })
		//.style("fill", "none")
		//.style("fill", function(d) { if (d.r1<d.r2) return "#00FFaa"; else return "#FFFFFF"; })
		//.style("fill-opacity", function(d) { return 0.3; })
		//.attr("cx", function(d) { return d.x; })
		//.attr("cy", function(d) { return d.y; })
		//.attr("r", function(d, i) { return d.r2; });
		.style("fill", function(d) { return "#FFFFFF"; })
		.attr("cx", function(d) { return d.x; })
    	.attr("cy", function(d) { return d.y; })
	    .attr("r", function(d, i) { if (d.r1>d.r2) return d.r2; else return d.r1; })
		//.attr("visibility",visibility2010)
		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Population "+"of "+ d.name +" is " +d.var1+", GDP of "+d.name+" is "+ d.var2);})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
	//.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
		
		
		
		var text = svg
		.selectAll("text")
		.data(nodes)
		.enter()
		.append("svg:text")
         .attr("x", function(d){return d.x})
		.attr("y", function(d){return d.y})
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("fill", "red")
		.text(function(d){console.log(d.name); if(d.r1<11 || d.r2<11) return ""; else return d.name;});


		
	});



  
  
});