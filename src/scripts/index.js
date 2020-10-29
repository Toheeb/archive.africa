let buttonIsClicked = false;

window.onload = () => {

    d3.select('#toggle-container').style('display', 'block')
    d3.select('.main-nav').style('margin-top', '-4rem')

    const toggleButton = d3.select('#country-view-switch')
    const regionButton = d3.select('#region-check')
    const countryButton = d3.select('#country-check')
    const isLargeScreen = window.matchMedia('(min-width: 1024px)').matches


    regionButton.on('click', () => {
        document.getElementById('country-section').classList.add('show-region')
    })
    
    countryButton.on('click', () => {
        document.getElementById('country-section').classList.remove('show-region')
    })

    const countryData = d3.select('#country_carousel-view')

    toggleButton.on('click', () => {
        buttonIsClicked = !buttonIsClicked

        if (buttonIsClicked === true) {
            document.getElementById('country-section').classList.add('js-active')
            // countryVisual.style("display", "flex")
            // // d3.zoom().scaleTo(countryVisual, 2)
            // countryData.style("display", "none")
        } else {
            document.getElementById('country-section').classList.remove('js-active')
            // countryVisual.style("display", "none")
            // countryData.style("display", "flex")
        }
    })

    const countryVisual = d3.select('#country-view').append('svg')
        .attr('viewBox', '0 0 500 500')
        .attr('class', 'world-map')
        .attr('id', 'world-map')
        // .style('display', 'none')
        .style('margin', '0 auto 1rem')

    let totalCountriesInAfrica = 55

    const mapContainer = countryVisual.append('g')
    // .attr('transform', 'translate(0, 0) scale(2)')
    // .attr('transform', 'translate(-370,-70) scale(1)')

    // const projection = d3.geoOrthographic().scale([300])
    const projection = d3.geoOrthographic().scale([360]).translate([150, 250])
    const pathGenerator = d3.geoPath().projection(projection)

    countryVisual.call(d3.zoom().scaleExtent([0.5, 5]).translateExtent([[-250, -150], [550, 650]]).on('zoom', ({ transform }) => {
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

            let result = {
                country: d.name,
                continent: continents[d.continent],
                subregion: d.subregion
            }

            if (d.continent == 'Africa') {
                switch (d.name) {
                    case 'Angola':
                        result.subregion = 'Southern Africa'
                        break

                    case 'Burundi':
                        result.subregion = 'Middle Africa'
                        break

                    case 'Dem. Rep. Congo':
                        result.country = 'DR Congo'
                        break

                    case 'Congo':
                        result.country = "Congo Republic"
                        break

                    case 'Cape Verde':
                        result.country = 'Cabo Verde'
                        break
                 
                    case 'W. Sahara':
                        result.country = 'Sahrawi Republic'
                        break

                    case 'Mozambique':
                        result.subregion = 'Southern Africa'
                        break

                    case 'Malawi':
                        result.subregion = 'Southern Africa'
                        break

                    case 'Mauritania':
                        result.subregion = 'Northern Africa'
                        break

                    case 'Sudan':
                        result.subregion = 'Eastern Africa'
                        break

                    case 'Zambia':
                        result.subregion = 'Southern Africa'
                        break

                    case 'Zimbabwe':
                        result.subregion = 'Southern Africa'
                        break

                    case 'S. Sudan':
                        result.country = 'South Sudan'
                        break

                    case 'Swaziland':
                        result.country = 'Eswatini'
                        break
                }
            }
            // acc[d.iso_n3] = [d.name, continents[d.continent]]
            acc[d.iso_n3] = result
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
            508: "Mozambique",
            454: "Malawi",
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

        // Used to sort the map paths so each label overlap correctly
        let africanCountryCodes = [480, 690, 450, 174, 706, 404, 834, 508, 454, 710, 426, 716, 748, 231, 262, 646, 800, 108, 232, 728, 729, 180, 894, 72, 24, 140, 516, 120, 818, 148, 178, 266, 226, 562, 566, 434, 678, 12, 788, 204, 854, 768, 288, 384, 430, 466, 504, 478, 732, 686, 324, 694, 270, 624, 132];


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

        // console.log("------------", countrySet.others)
        const otherContinents = mapContainer.append('g').selectAll('path').data(countrySet.others).enter()

        otherContinents.append('path')
            .attr('d', pathGenerator)
            .attr('class', 'country')
            .append('title')
            .text(d => `${countryNames[d.id].country} - ${countryNames[d.id].continent}`)



        const somaliaTerritories = mapContainer.append('g').attr('class', 'africa__country eastern-africa')
        const somaliland = somalia[0]
        somaliaTerritories.selectAll('path').data(somalia).enter()
            .append('path')
            .attr('d', pathGenerator)
        somaliaTerritories.append('text').text("Somalia")
            .attr('x', 414)
            .attr('y', 221.5)
            .attr('font-size', '6pt')
        somaliaTerritories.append('circle')
            .attr('r', 2)
            .attr('cx', 410)
            .attr('cy', 220)

        const africaContinent =
            mapContainer.append('g').attr('class', 'africa')

        const africaCountries = africaContinent.selectAll('path').data(countrySet.africa).enter()
            .append('g')
                .attr('class',  d => `africa__country ${countryNames[d.id].subregion.replace(' ', '-').toLowerCase()}`)

        africaCountries.append('path')
            .attr('d', pathGenerator)
            .append('title')
            .text(d => countryNames[d.id].country);

        africaCountries.append('circle')
            .attr('r', 2)
            .attr('cx', d => pathGenerator.centroid(d)[0])
            .attr('cy', d => pathGenerator.centroid(d)[1])

        africaCountries.append('text')
            .text(d => countryNames[d.id].country)
            .attr('x', d => pathGenerator.centroid(d)[0] + 4)
            .attr('y', d => pathGenerator.centroid(d)[1] + 1.5)
            .attr('font-size', '6pt')

        

        
    })
}

function createMap() {
    return d3.select('#world-map').append('text').text('Hello').node()
}