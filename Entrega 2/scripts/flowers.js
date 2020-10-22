const selection = document.getElementById("species")

d3.select("#species")
    .on("change", () => {
        const sepal_lenght_avg = d3.mean(iris_array, row => row.species === selection.options[selection.selectedIndex].value ? row.sepal_length : NaN)
        const sepal_width_avg = d3.mean(iris_array, row => row.species === selection.options[selection.selectedIndex].value ? row.sepal_width : NaN)
        const petal_lenght_avg = d3.mean(iris_array, row => row.species === selection.options[selection.selectedIndex].value ? row.petal_length : NaN)
        const petal_width_avg = d3.mean(iris_array, row => row.species === selection.options[selection.selectedIndex].value ? row.petal_width : NaN)
        

        container.selectAll("*").remove()

        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", petal_width_avg * 20)
            .attr("ry", petal_lenght_avg * 20)
            .attr("transform", "rotate(180, 250,250)")
            .attr("fill", "purple")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")

        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", petal_width_avg * 20)
            .attr("ry", petal_lenght_avg * 20)
            .attr("transform", "rotate(60, 250,250)")
            .attr("fill", "purple")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")

        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", petal_width_avg * 20)
            .attr("ry", petal_lenght_avg * 20)
            .attr("transform", "rotate(300, 250,250)")
            .attr("fill", "purple")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")

        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", sepal_width_avg*10)
            .attr("ry", sepal_lenght_avg*10)
            .attr("transform", "rotate(240, 250,250)")
            .attr("fill", "blue")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")
        
        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", sepal_width_avg * 10)
            .attr("ry", sepal_lenght_avg * 10)
            .attr("transform", "rotate(120, 250,250)")
            .attr("fill", "blue")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")
        
        container.append("ellipse")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("rx", sepal_width_avg * 10)
            .attr("ry", sepal_lenght_avg * 10)
            .attr("transform", "rotate(0, 250,250)")
            .attr("fill", "blue")
            .attr("class", "sepal")
            .attr("fill-opacity", "0.4")
        
        footer.select("#sepal")
            .append("text")
            .text(`${sepal_width_avg} x ${sepal_lenght_avg} cm`)
            
        footer.select("#petal")
            .append("text")
            .text(`${petal_width_avg} x ${petal_lenght_avg} cm`)
        

})


