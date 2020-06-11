const pluginPWA = require("eleventy-plugin-pwa");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginPWA);
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('styles')
  eleventyConfig.addPassthroughCopy('manifest.json')
};