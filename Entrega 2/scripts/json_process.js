const height = 500
const width = 500
const marginLeft = 40
const marginTop = 40

const svg = d3.select("#vis")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

const container = svg.append("g")

const footer = svg.select("foot")


const dataset = d3.csv(
    "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv",
    row => {
        return {
            ...row,
            sepal_length: +row.sepal_length,
            sepal_width: +row.sepal_width,
            petal_length: +row.petal_length,
            petal_width: +row.petal_width,
        }
    }
)
.then(data => {
    iris_array = data
})

