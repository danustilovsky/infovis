const CLgraph = async (height, width, margin) => {

  const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const comunas = container.append("g");

  const labels = svg.append("g");

  var geoData = await d3.json("../data/comunas.geojson");
  var censo = await d3.csv("../data/censo.csv");
  var density = await d3.json("../data/density.json");
  var maxVal = Math.max(...Object.values(density).map((d) => +d.INDICE_DEP));

  // MAIN GRAPH

  const zoom = d3
    .zoom()
    .translateExtent([
      [-300, -300],
      [width + 300 , height + 300],
    ])
    .scaleExtent([0.5, 30])
    .on("zoom", (e) => container.attr("transform", e.transform));

  svg.call(zoom);

  const geoScale = d3
    .geoMercator()
    .fitSize(
      [width - margin.left - margin.right, height - margin.top - margin.bottom],
      geoData
    );

  const fillScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateBuGn)
    .domain([0, maxVal]);

  const geoPaths = d3.geoPath().projection(geoScale);

  const clicked = (event, d) => {
    const values = {
      id: d.id,
      nombre: d.properties.comuna,
      IND_DEP_JU: +density[d.id].IND_DEP_JU,
      IND_DEP_VE: +density[d.id].IND_DEP_VE,
    };
    if (selectedComunas.some(comuna => comuna.id === values.id)) {  
      selectedComunas = selectedComunas.filter(e => e.id != values.id);
      comunasJoin
        .filter((data) => 
          data.properties.id === d.properties.id
        )
        .attr("fill", fillScale(density[d.properties.id].INDICE_DEP));
      selectionGraph(selectedComunas);
    } else {
      selectedComunas.push(values);
      comunasJoin
        .filter((data) => 
          data.properties.id === d.properties.id
        )
        .attr("fill", "#34495E");
      selectionGraph(selectedComunas);
    }
  };

  const comunasJoin = comunas
    .selectAll("path")
    .data(geoData.features, (d) => d.properties.id)
    .join("path")
      .attr("d", geoPaths)
      .attr("fill", (d) => fillScale(density[d.properties.id].INDICE_DEP))
      .attr("stroke", "black")
      .attr("stroke-width", 0.1)
    .on("click", clicked);

  const labelData = [0, 20, 40, 60, 80];
  const rectHeight = 20;
  const rectWidth = 20;
  const labelHeight = labelData.length * rectHeight;

  labels
    .selectAll("rect")
    .data(labelData)
    .join("rect")
      .attr("fill", (d) => fillScale((maxVal * d) / 100))
      .attr("stroke", "black")
      .attr("x", 20)
      .attr("y", (_, i) => height / 2 + labelHeight / 2 - rectHeight * (i + 1))
      .attr("width", rectWidth)
      .attr("height", rectHeight);
    
  labels
    .selectAll("text")
    .data(labelData)
    .join("text")
    .text(
      (d) =>
        `[${Math.round((maxVal * d) / 100)} - ${Math.round(maxVal * (d+19) / 100)}]`
    )
    .attr("x", 45)
    .attr("y", (_, i) => height / 2 + labelHeight / 2 - rectHeight * (i + 0.3))
    .attr("color", "black")
    .attr("font-size", 20);


  
  // SECOND GRAPH

  var selectedComunas = [];

  const svgBar = d3
    .select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  const barContainer = svgBar.append("g")

  const barLabel = svgBar.append("g").attr("class", "label")
    
  const apilador = d3.stack().keys(["IND_DEP_JU", "IND_DEP_VE"]);

  const selectionGraph = (selectedComunas) => {

    const series = apilador(selectedComunas);

    const escalaX = d3
      .scaleBand()
      .domain(selectedComunas.map((d) => d.nombre))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const escalaY = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(series, (serie) => d3.max(serie, (arreglo) => arreglo[1])),
      ])
      .range([height - margin.bottom, margin.top]);
    
    const escalaColor = d3
      .scaleOrdinal()
      .domain(series.keys())
      .range(["#3498DB", "#1ABC9C"]);
        
    xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("font-size", 20)
        .call(d3.axisBottom(escalaX).tickSizeOuter(0))

    yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .attr("font-size", 20)
        .call(d3.axisLeft(escalaY).ticks(null, "s"))
        
    barContainer
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => escalaColor(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d, i) => escalaX(d.data.nombre))
      .attr("rx", 2)
      .attr("y", (d) => escalaY(d[1]))
      .attr("height", (d) => escalaY(d[0]) - escalaY(d[1]))
      .attr("width", escalaX.bandwidth())
      .append("title")
      .text((d) => `${d.data.nombre} ${Math.round(d[1] - d[0])}`)
      .attr("font-size", 20);
    
    barContainer.select(".xAxis").innerHTML = "";
    barContainer.append("g").attr("class", "xAxis").call(xAxis);

    barContainer.select(".yAxis").innerHTML = "";
    barContainer.append("g").attr("class", "yAxis").call(yAxis);

    barLabel
      .selectAll(".label")
      .data(series)
      .join("rect")
      .attr("fill", (d) => escalaColor(d.key))
      .attr("stroke", "black")
      .attr("x", width - 40)
      .attr("y", (_, i) => i * 40 + 45)
      .attr("width", rectWidth)
      .attr("height", rectHeight);
    
    barLabel
      .selectAll("text")
      .data(series)
      .join("text")
      .text((d) => `${d.key}`)
      .attr("x", width - 70)
      .attr("y", (_, i) => i * 40 + 40)
      .attr("color", "black")
      .attr("font-size", 30);

  }
};

const WIDTH = 600;
const HEIGHT = 500;
const MARGIN = {
  top: 40,
  left: 25,
  right: 40,
  bottom: 40,
};

CLgraph(HEIGHT, WIDTH, MARGIN);
