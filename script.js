document.addEventListener("DOMContentLoaded", () => {
   const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
   req = new XMLHttpRequest();
   req.open("GET", url, true);
   req.send();
   req.onload = () => {
      json = JSON.parse(req.responseText);

      const dataset = json.data;
      const yearData = [];
      for (let i = 0; i < dataset.length; i++) {
         yearData.push(new Date(dataset[i][0]));
      };

      const fullWidth = 800;
      const fullHeight = 600;
      const padding = 50;
      const w = fullWidth - 2 * padding;
      const h = fullHeight - 2 * padding;

      const maxDate = d3.max(yearData, d => d);
      const minDate = d3.min(yearData, d => d);
      const maxDateMore = new Date(maxDate);
      const minDateLess = new Date(minDate);
      maxDateMore.setMonth(maxDate.getMonth() + 3);
      minDateLess.setMonth(minDate.getMonth() - 3);

      const maxValue = d3.max(dataset, d => d[1]);
      const roundedUpMax = Math.ceil(maxValue / 1000) * 1000;

      const barWidth = (w - padding) / (dataset.length + 2);

      const svg = d3.select(".visHolder")
         .append("svg")
         .attr("width", fullWidth)
         .attr("height", fullHeight);
      const tooltip = svg.append("text")
         .attr("id", "tooltip")
         .attr("x", 0.5 * w - 50)
         .attr("y", h * 0.5)
         .attr("opacity", 0.9)
         .style("fill", "white");

      const xScale = d3.scaleTime()
         .domain([minDateLess, maxDateMore])
         .range([padding, w]);
      const yScale = d3.scaleLinear()
         .domain([0, roundedUpMax])
         .range([h, 0]);

      svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("data-date", (d, i) => d[0])
         .attr("data-gdp", (d, i) => d[1])
         .attr("x", (d, i) => xScale(yearData[i]))
         .attr("y", (d, i) => h - yScale(roundedUpMax - d[1]))
         .attr("width", (d, i) => barWidth)
         .attr("height", (d, i) => {
            if (yScale(roundedUpMax - d[1]) <= 0) {
               console.log("height: " + d[1]);
               console.log("yScale height: " + yScale(roundedUpMax - d[1]));
               return 1;
            } else {
               return yScale(roundedUpMax - d[1]);
            }
         })
         .attr("fill", "white")
         .attr("class", "bar")
         .on("mouseover", (d, i) => tooltip.text(d[0] + ": $" + d[1] + " Billion")
            .attr("data-date", d[0])
            .attr("opacity", 0.9))
         .on("mouseout", d => tooltip.attr("opacity", 0))
         .append("title")
         .text((d, i) => d[0] + ": $" + d[1] + " Billion")
         .attr("data-date", (d, i) => d[0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
         .attr("transform", "translate(0," + (h) + ")")
         .attr("id", "x-axis")
         .call(xAxis);
      svg.append("g")
         .attr("transform", "translate(" + padding + ",0)")
         .attr("id", "y-axis")
         .call(yAxis);
   }
});
