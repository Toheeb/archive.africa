module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/images")
    eleventyConfig.addPassthroughCopy("src/scripts")
    eleventyConfig.addPassthroughCopy("src/styles")

    return {
        dir: {
            input: "src",
        }
    }
}