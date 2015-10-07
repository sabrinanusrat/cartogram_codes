var force = d3.layout.force()
    .charge(0)
    .gravity(0)
   .size([960, 500]);
  //  .size([800, 400]);

var svg = d3.select("#chart").append("svg:svg")
  .attr("width", 960 + 100)
    .attr("height", 500 + 100)
//.attr("width", 800 + 100)
  //  .attr("height", 400 + 100)

  .append("svg:g")
    .attr("transform", "translate(50,50)");

var nodes, nodes2, links = [];

var Pop=[];

var PopMax, PopMean;

var states;


var fl1 = document.getElementById('file1').textContent;
var fl2 = document.getElementById('file2').textContent;
var varName1 = document.getElementById('var1').textContent;
var varName2 = document.getElementById('var2').textContent;
var field1 = document.getElementById('field1').textContent;
var field2 = document.getElementById('field2').textContent;



d3.json(fl1, function(states) {
//d3.json("USA-Pop2010-input.json", function(states) {

    
//	states=states1;
	states.features.map(function(d)
		{eval("Pop.push(d.properties."+field1+")")});
  

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
			
			r1: Math.sqrt(eval("d.properties."+field1)/PopMean)*25,
			value1: eval("d.properties."+field1)/PopMean,
			var1: eval("d.properties."+field1),
			name: d.properties.name
		};
	});


	var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
	

	d3.json(fl2, function(states) {
//	d3.json("USA-NofStarBucks-input.json", function(states) {
	
		var GDP=[];
	
		//var GDPMax;
	
	    var GDPMean;
		
		
		states.features.map(function(d) {
			GDP.push(eval("d.properties."+field2))});

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
			
			nodes[i].var2= eval("d.properties."+field2);
			nodes[i].r2=Math.sqrt(eval("d.properties."+field2)/GDPMean)*25;
			nodes[i].value2=eval("d.properties."+field2)/GDPMean;
			
		});

  
  var r1set = [];
	var r2set =[];
	for (var i = 0; i<= 48; i++ ) r1set.push(nodes[i].r1);
	 var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
	
	
	console.log(r1set[0]);
  //r2set
		
  for (var i = 0; i<= 48; i++ ) r2set.push(nodes[i].r2);
  
  console.log(r2set[0]);
  
  var diff = [];
   for (var i = 0; i<= 48; i++ ) diff.push(nodes[i].r1 - nodes[i].r2);
   
   console.log(diff[0]);
 
var color = d3.scale.linear()
						.domain([-1*Math.sqrt(-1*d3.min(diff)), 0, Math.sqrt(d3.max(diff))])
//						.domain([d3.min(diff), d3.min(diff) * (1/10), 0, d3.max(diff) * (1/10), d3.max(diff)])
						//.range(['#FF6600', '#cd8956', '#acacac', '#4040C0', '#0000FF']);
//						.range(['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6']);
						.range(['#ff6600', '#acacac', '#0000ff']);
  
  
        //console.log(GDPMax);
		var dx, dy, l, d1, d2, d;


		
	svg.selectAll("circle")
	.data(nodes)
	.enter().append("svg:circle")
	//.style("stroke", function(d) { return "#0000FF"; })
	.style("stroke", function(d) { //if (1.03*d.r1<d.r2) return "#FF6600"; else if (1.03*d.r2<d.r1) return "#0000FF"; else return "#d3d3d3"; 
				if(d.r1<d.r2) return color(-1*Math.sqrt(d.r2 - d.r1));	else return color(Math.sqrt(d.r1 - d.r2));	
	})
	.style("stroke-width", function(d) { return 1; })
	.style("stroke-opacity", function(d) { return 0.7; })
	//.style("fill", "none")
	//.style("fill", function(d) { return "#FFFFFF"; })
	.style("fill", function(d) { //if (1.03*d.r1<d.r2) return "#FF6600"; else if (1.03*d.r2<d.r1) return "#0000FF"; else return "#d3d3d3";  
				if(d.r1<d.r2) return color(-1*Math.sqrt(d.r2 - d.r1));	else return color(Math.sqrt(d.r1 - d.r2));	
	})
	//.style("fill-opacity", function(d) { return 0.3; })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { if (d.r1<d.r2) return d.r2; else return d.r1; })
//		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Population "+"of "+ d.name +" is " +d.var1+", number of Starbucks of "+d.name+" is "+ d.var2);})
		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.name+": "+varName1+" is " +d.var1+", "+varName2+" is "+ d.var2);})
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
//		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Population "+"of "+ d.name +" is " +d.var1+", number of Starbucks of "+d.name+" is "+ d.var2);})
		.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.name+": "+varName1+" is " +d.var1+", "+varName2+" is "+ d.var2);})
	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
	//.on("mouseout", function(){return tooltip.style("visibility", "hidden");});  	
	
	
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