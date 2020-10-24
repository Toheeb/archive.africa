let buttonIsClicked = false;

window.onload = () => {

    d3.select('#toggle-container').style('display', 'block')
    d3.select('.main-nav-wrapper').style('margin-top', '-4rem')

    const toggleButton = d3.select('#country-view-switch')
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches



    const countryData = d3.select('#country_carousel-view')

    toggleButton.on('click', () => {
        buttonIsClicked = !buttonIsClicked

        if (buttonIsClicked === true) {
            countryVisual.style("display", "flex")
            // d3.zoom().scaleTo(countryVisual, 2)
            countryData.style("display", "none")
        } else {
            countryVisual.style("display", "none")
            countryData.style("display", "flex")
        }
    })

    const countryVisual = d3.select('#country-view').append('svg')
        .attr('viewBox', '0 0 500 500')
        .attr('class', 'world-map')
        .style('display', 'none')
        .style('margin', 'auto')
        .style('transform', 'translateX(-1rem)')

    let totalCountriesInAfrica = 55
    countryVisual.append('pattern')
        .attr('id', 'pattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', '3')
        .attr('height', '3')
        .append('rect')
        .attr('width', '2')
        .attr('height', '2')
        .attr('fill', '#e3e8ef')

    const mapContainer = countryVisual.append('g')
    // .attr('transform', 'translate(0, 0) scale(2)')
    // .attr('transform', 'translate(-370,-70) scale(1)')

    const projection = d3.geoOrthographic().scale([357]).translate([166, 250])
    const pathGenerator = d3.geoPath().projection(projection)

    countryVisual.call(d3.zoom().scaleExtent([0.6, 10]).on('zoom', ({ transform }) => {
        mapContainer.attr('transform', transform)
    }))


    Promise.all([
        d3.tsv("/scripts/world-atlas-50m.tsv"),
        d3.json("/scripts/world-atlas-50m.json")
    ]).then(([tsvData, topoJSONdata]) => {
        // console.log(tsvData)
        const continents = {
            "Africa": "africa",
            "Antarctica": "antarctica",
            "Asia": "asia",
            "Europe": "europe",
            "North America": "north-america",
            "Oceania": "oceania",
            "Seven seas (open ocean)": "seven-seas",
            "South America": "south-america"
        }
        const countryNames = tsvData.reduce((acc, d) => {
            acc[d.iso_n3] = [d.name, continents[d.continent]]
            return acc
        }, {})

        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

        const africa = {
            480: "Mauritius",
            690: "Seychelles",
            450: "Madagascar",
            174: "Comoros",
            706: "Somalia",
            404: "Kenya",
            834: "Tanzania",
            454: "Malawi",
            508: "Mozambique",
            710: "South Africa",
            426: "Lesotho",
            716: "Zimbabwe",
            748: "Swaziland",
            231: "Ethiopia",
            262: "Djibouti",
            646: "Rwanda",
            800: "Uganda",
            108: "Burundi",
            232: "Eritrea",
            728: "S. Sudan",
            729: "Sudan",
            180: "Dem. Rep. Congo",
            894: "Zambia",
            072: "Botswana",
            024: "Angola",
            140: "Central African Rep.",
            516: "Namibia",
            120: "Cameroon",
            818: "Egypt",
            148: "Chad",
            178: "Congo",
            266: "Gabon",
            226: "Eq. Guinea",
            562: "Niger",
            566: "Nigeria",
            434: "Libya",
            678: "São Tomé and Principe",
            012: "Algeria",
            788: "Tunisia",
            204: "Benin",
            854: "Burkina Faso",
            768: "Togo",
            288: "Ghana",
            384: "Côte d'Ivoire",
            430: "Liberia",
            466: "Mali",
            504: "Morocco",
            478: "Mauritania",
            732: "W. Sahara",
            686: "Senegal",
            324: "Guinea",
            694: "Sierra Leone",
            270: "Gambia",
            624: "Guinea-Bissau",
            132: "Cape Verde",
        }

        let africanCountryCodes = [480, 690, 450, 174, 706, 404, 834, 454, 508, 710, 426, 716, 748, 231, 262, 646, 800, 108, 232, 728, 729, 180, 894, 72, 24, 140, 516, 120, 818, 148, 178, 266, 226, 562, 566, 434, 678, 12, 788, 204, 854, 768, 288, 384, 430, 466, 504, 478, 732, 686, 324, 694, 270, 624, 132];


        const somalia = countries.features.splice(197, 2)
        africanCountryCodes.splice(africanCountryCodes.indexOf(706), 1)
        totalCountriesInAfrica--;


        const countrySet = countries.features.reduce((acc, cur, idx) => {
            let index = africanCountryCodes.indexOf(+cur.id)
            if (index == -1) {
                acc.others.push(cur)
            } else {
                acc.africa[index] = cur
            }

            return acc
        }, { africa: [...Array(totalCountriesInAfrica)], others: [] })

        const otherContinents = mapContainer.append('g').selectAll('path').data(countrySet.others).enter()

        otherContinents.append('path')
            .attr('d', pathGenerator)
            .attr('class', d => `country region-${countryNames[d.id][1]}`)
            .append('title')
            .text(d => `${countryNames[d.id][0]} - ${countryNames[d.id][1]}`)



        const africaContinent =
            mapContainer.append('g').attr('class', 'africa')

        const africaCountries = africaContinent.selectAll('path').data(countrySet.africa).enter()
            .append('g').attr('class', 'africa__country')

        africaCountries.append('path')
            .attr('d', pathGenerator)
            .append('title')
            .text(d => countryNames[d.id][0])
        africaCountries.append('circle')
            .attr('r', 2)
            .attr('cx', d => pathGenerator.centroid(d)[0])
            .attr('cy', d => pathGenerator.centroid(d)[1])

        africaCountries.append('text')
            .text(d => countryNames[d.id][0])
            .attr('x', d => pathGenerator.centroid(d)[0] + 4)
            .attr('y', d => pathGenerator.centroid(d)[1] + 1.5)
            .attr('font-size', '4pt')


        const somaliaTerritories = africaContinent.append('g').attr('class', 'africa__country')
        const somaliland = somalia[0]
        somaliaTerritories.selectAll('path').data(somalia).enter()
            .append('path')
            .attr('d', pathGenerator)
        somaliaTerritories.append('text').text("Somalia")
            .attr('x', 661)
            .attr('y', 231)
            .attr('font-size', '4pt')
        somaliaTerritories.append('circle')
            .attr('r', 2)
            .attr('cx', 657)
            .attr('cy', 229.5)
    })
}

function createMap() {
    return d3.select('#world-map').append('text').text('Hello').node()
}