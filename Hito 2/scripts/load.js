const height = 800;
const width = 800;
const marginLeft = 40;
const marginTop = 40;

const svg = d3
  .select("#vis")

const cardsNum = document.getElementById("cardsNum")
const resDiv = d3.select("#sumary");

const dataset = d3.csv(
  "./data/fifa_20_data.csv",
  row => {
    return {
      ...row,
      rating: +row.RATING,
      pace: +row.PACE,
      shooting: +row.SHOOTING,
      passing: +row.PASSING,
      dribbling: +row.DRIBBLING,
      defending: +row.DEFENDING,
      physical: +row.PHYSICAL,
    };
  }
)
  .then(data => {
    var allData = data
    svg
      .selectAll("svg")
      .data(data)
      .join(enter);
    

    var playersCards = d3.selectAll("svg");

    playersCards.on("mouseover", (player, i) => {
      playersCards
        .filter((d) => {
          return d.CLUB === i.CLUB;
        })
        .style("font-weight", "bold")
        .style("opacity", 0.8)
        .style("transform", "scale(1.07)");
    });

    playersCards.on("mouseout", (player, i) => {
      playersCards
        .filter((d) => {
          return d.CLUB === i.CLUB;
        })
        .style("font-weight", "normal")
        .style("opacity", 1)
        .style("transform", "scale(1)");
    });

    cardsNum.textContent = data.length;

    var teams = ["all"];
    var leagues = ["all"];

    let avgValues = {
      dribbling: 0,
      defending: 0,
      physical: 0,
      pace: 0,
      shooting: 0,
      passing: 0,
    };
    data.forEach(element => {
      avgValues.dribbling += element.dribbling;
      avgValues.defending += element.defending;
      avgValues.physical += element.physical;
      avgValues.pace += element.pace;
      avgValues.shooting += element.shooting;
      avgValues.passing += element.passing;

      teams.push(element.CLUB)
      leagues.push(element.LEAGUE)

    
    });

    avgValues.dribbling = avgValues.dribbling / data.length;
    avgValues.defending = avgValues.defending / data.length;
    avgValues.physical = avgValues.physical / data.length;
    avgValues.pace = avgValues.pace / data.length;
    avgValues.shooting = avgValues.shooting / data.length;
    avgValues.passing = avgValues.passing / data.length;
    resDiv
      .selectAll("svg")
      .data([avgValues])
      .join(enterSumary);

    var uniqueTeams = [... new Set(teams)]
    
    var teamsSelect = document.getElementById("teamsSelect");


    uniqueTeams.forEach((d)=>{
      let option = document.createElement("option");
      option.text = d
      option.value = d

      teamsSelect.options.add(option)
    })

    teamsSelect.onchange = function () {
      svg.selectAll("svg").remove()
      if (teamsSelect.value == "all") {
        svg.selectAll("svg").data(allData).join(enter, enter, exit);
      } else {
        let filteredData = allData.filter((d) => {
          return d.CLUB == teamsSelect.value;
        });
        svg.selectAll("svg").data(filteredData).join(enter, enter, exit);
      }
    }

    var uniqueLeagues = [...new Set(leagues)];

    var leagueSelect = document.getElementById("leagueSelect");

    uniqueLeagues.forEach((d) => {
      let option = document.createElement("option");
      option.text = d;
      option.value = d;

      leagueSelect.options.add(option);
    });


  })

const sizeScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

const positions = ["CB", "RB", "LB", "LWB", "RWB", "CM", "CAM", "CDM", "LM", "RM", "LF", "CF", "RF", "ST", "RW", "LW"]
const colours = ["#2471A3", "#2471A3", "#2471A3", "#2471A3", "#2471A3", "#17A589", "#17A589", "#17A589", "#17A589", "#17A589", "#E74C3C", "#E74C3C", "#E74C3C", "#E74C3C", "#E74C3C", "#E74C3C"];
const colourScale = d3.scaleOrdinal(positions, colours);

const thresholdScale = d3
  .scaleThreshold()
  .domain([65, 75, 99])
  .range(["#CD7F32", "silver", "#D4AF37"]);

function exagonPoints(radius) {
  xOffset = 0;
  yOffset = 0;
  cos = Math.cos(Math.PI / 3);
  sin = Math.sin(Math.PI / 3);
  return [
    [
      { x: -radius + xOffset, y: 0 + yOffset },
      { x: -radius * cos + xOffset, y: -radius * sin + yOffset },
      { x: radius * cos + xOffset, y: -radius * sin + yOffset },
      { x: radius + xOffset, y: 0 + yOffset },
      { x: radius * cos + xOffset, y: radius * sin + yOffset },
      { x: -radius * cos + xOffset, y: radius * sin + yOffset },
      { x: -radius + xOffset, y: 0 + yOffset },
    ],
    [
      { x: -radius + xOffset, y: 0 + yOffset },
      { x: radius + xOffset, y: 0 + yOffset },
    ],
    [
      { x: -radius * cos + xOffset, y: -radius * sin + yOffset },
      { x: radius * cos + xOffset, y: radius * sin + yOffset },
    ],
    [
      { x: -radius * cos + xOffset, y: radius * sin + yOffset },
      { x: radius * cos + xOffset, y: -radius * sin + yOffset },
    ],
  ];
}

function labelPosition(radius) {
  xOffset = 0;
  yOffset = 0;
  cos = Math.cos(Math.PI / 3);
  sin = Math.sin(Math.PI / 3);
  return [
    {
      x: -radius + xOffset - sizeScale(15),
      y: 0 + yOffset + sizeScale(5),
      text: "DRI",
    },
    {
      x: -radius * cos + xOffset,
      y: -radius * sin + yOffset - sizeScale(5),
      text: "DEF",
    },
    {
      x: radius * cos + xOffset,
      y: -radius * sin + yOffset - sizeScale(5),
      text: "PHY",
    },
    {
      x: radius + xOffset + sizeScale(15),
      y: 0 + yOffset + sizeScale(5),
      text: "PAC",
    },
    {
      x: radius * cos + xOffset,
      y: radius * sin + yOffset + sizeScale(15),
      text: "SHO",
    },
    {
      x: -radius * cos + xOffset,
      y: radius * sin + yOffset + sizeScale(15),
      text: "PASS",
    },
  ];
}

function playerStats(player) {
  xOffset = 0;
  yOffset = 0;
  cos = Math.cos(Math.PI / 3);
  sin = Math.sin(Math.PI / 3);
  return [
    { x: -sizeScale(player.dribbling / 2) + xOffset, y: 0 + yOffset },
    {
      x: -sizeScale(player.defending / 2) * cos + xOffset,
      y: -sizeScale(player.defending / 2) * sin + yOffset,
    },
    {
      x: sizeScale(player.physical / 2) * cos + xOffset,
      y: -sizeScale(player.physical / 2) * sin + yOffset,
    },
    { x: sizeScale(player.pace / 2) + xOffset, y: 0 + yOffset },
    {
      x: sizeScale(player.shooting / 2) * cos + xOffset,
      y: sizeScale(player.shooting / 2) * sin + yOffset,
    },
    {
      x: -sizeScale(player.passing / 2) * cos + xOffset,
      y: sizeScale(player.passing / 2) * sin + yOffset,
    },
    { x: -sizeScale(player.dribbling / 2) + xOffset, y: 0 + yOffset },
  ];
}

function playerStatsResumen(player) {
  xOffset = 0;
  yOffset = 0;
  cos = Math.cos(Math.PI / 3);
  sin = Math.sin(Math.PI / 3);
  return [
    { x: -sizeScale(player.dribbling ) + xOffset, y: 0 + yOffset },
    {
      x: -sizeScale(player.defending ) * cos + xOffset,
      y: -sizeScale(player.defending ) * sin + yOffset,
    },
    {
      x: sizeScale(player.physical ) * cos + xOffset,
      y: -sizeScale(player.physical ) * sin + yOffset,
    },
    { x: sizeScale(player.pace ) + xOffset, y: 0 + yOffset },
    {
      x: sizeScale(player.shooting ) * cos + xOffset,
      y: sizeScale(player.shooting ) * sin + yOffset,
    },
    {
      x: -sizeScale(player.passing ) * cos + xOffset,
      y: sizeScale(player.passing ) * sin + yOffset,
    },
    { x: -sizeScale(player.dribbling ) + xOffset, y: 0 + yOffset },
  ];
}

drawLines = d3
  .line()
  .x(function (d) {
    return d.x;
  })
  .y(function (d) {
    return d.y;
  });

const enter = (enter) =>
  enter
    .append("svg")
    .attr("class", "playerCard")
    .attr("height", 300)
    .attr("width", 200)
    .each(function (d) {

      d3.select(this)
        .append("rect")
        .attr("class", "playerCardRect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", (d) => thresholdScale(d.rating))
        .attr("rx", 20)
        .attr("ry", 20);

      d3.select(this)
        .append("text")
        .attr("x", "55%")
        .attr("y", "10%")
        .attr("text-anchor", "middle")
        .text((d) => d.NAME)
        .attr("color", "black")
        .attr("textLength", "70%")
        .attr("class", "playerName");

      d3.select(this)
        .append("text")
        .attr("x", "10%")
        .attr("y", "10%")
        .attr("text-anchor", "middle")
        .text((d) => d.RATING)
        .attr("color", "black")
        .attr("class", "playerRating");

      d3.select(this)
        .append("text")
        .attr("x", "50%")
        .attr("y", "20%")
        .attr("text-anchor", "middle")
        .text((d) => d.CLUB)
        .attr("color", "black")
        .attr("textLength", "50%")
        .attr("class", "playerClub");

      d3.select(this)
        .append("text")
        .attr("x", "50%")
        .attr("y", "30%")
        .attr("text-anchor", "middle")
        .text((d) => d.LEAGUE)
        .attr("color", "black")
        .attr("textLength", "90%")
        .attr("class", "playerLeague");

      d3.select(this)
        .append("g")
        .attr("transform", "translate(100, 205)")
        .each(function (d) {

          d3.select(this)
            .append("circle")
            .attr("r", "35%")
            .attr("fill", "white")

          d3.select(this)
            .append("path")
            .attr("d", drawLines(exagonPoints(sizeScale(50))[0]))
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

          d3.select(this)
            .selectAll("path.figure")
            .data(exagonPoints(sizeScale(50)).slice(1))
            .join((enter) =>
              enter
                .append("path")
                .attr("d", drawLines)
                .attr("fill", "transparent")
                .attr("stroke", "black")
            );

          d3.select(this)
            .selectAll("text.labels")
            .data(labelPosition(sizeScale(50)))
            .join((enter) =>
              enter
                .append("text")
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y)
                .attr("text-anchor", "middle")
                .text((d) => d.text)
            );

          d3.select(this)
            .append("path")
            .attr("d", drawLines(playerStats(d)))
            .attr("fill", (d) => colourScale(d.POSITION))
            .attr("opacity", 0.85);
        })
    });

const enterSumary = (enter) =>
  enter
    .append("svg")
    .attr("class", "playerCard")
    .attr("height", 450)
    .attr("width", 300)
    .each(function (d) {

      d3.select(this)
        .append("g")
        .attr("transform", "translate(150, 150)")
        .each(function (d) {
          d3.select(this)
            .append("circle")
            .attr("r", "35%")
            .attr("fill", "white");

          d3.select(this)
            .append("path")
            .attr("d", drawLines(exagonPoints(sizeScale(75))[0]))
            .attr("fill", "transparent")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

          d3.select(this)
            .selectAll("path.figure")
            .data(exagonPoints(sizeScale(75)).slice(1))
            .join((enter) =>
              enter
                .append("path")
                .attr("d", drawLines)
                .attr("fill", "transparent")
                .attr("stroke", "black")
            );

          d3.select(this)
            .selectAll("text.labels")
            .data(labelPosition(sizeScale(75)))
            .join((enter) =>
              enter
                .append("text")
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y)
                .attr("text-anchor", "middle")
                .text((d) => d.text)
            );

          d3.select(this)
            .append("path")
            .attr("d", drawLines(playerStatsResumen(d)))
            .attr("fill", "purple")
            .attr("opacity", 0.85);
        });
    });

const exit = (exit) =>
  exit.remove();