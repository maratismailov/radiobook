const Image = require('@11ty/eleventy-img');

module.exports = async (src, alt) => {
// eleventyConfig.addJavaScriptFunction("myResponsiveImage", async function (src, alt) {
    if (alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on myResponsiveImage from: ${src}`);
    }
    src = 'dd'
    const stats = await Image(src, {
        formats: ['webp'],
        widths: [320, 640, null],
        // set desired directory name for <img> src paths
        urlPath: '/images/uploads',
        // set desired file system directory for dist images
        outputDir: './_site/images/uploads'
    });
    let lowestSrc = stats.jpeg[0];
    let sizes = "100vw"; // Make sure you customize this!

    // Iterate over formats and widths
    return `<picture>
      ${Object.values(stats).map(imageFormat => {
        return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => `${entry.url} ${entry.width}w`).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
        <img
          alt="${alt}"
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}">
      </picture>`;
};