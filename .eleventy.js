const pluginPWA = require("eleventy-plugin-pwa");
const sharp = require('sharp');
const fs = require('fs');
const del = require('del');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginJsonFeed = require("eleventy-plugin-json-feed");

module.exports = function (eleventyConfig) {
  // const dirToClean = '_site/*';
  // del(dirToClean);

  eleventyConfig.addPlugin(pluginPWA);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginJsonFeed, {
    content_html: true,
    image_metadata_field_name: "social_media_image",
    summary_metadata_field_name: "description"
  });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);


  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('fonts')
  eleventyConfig.addPassthroughCopy('styles')
  eleventyConfig.addPassthroughCopy('admin')
  eleventyConfig.addPassthroughCopy('manifest.json')

  const {
    DateTime
  } = require("luxon");



  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('yy-MM-dd');
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat("dd-MM-yy");
  });



  eleventyConfig.addTransform("images", function (content, outputPath) {
    const blog = /posts\/([а-яА-Яa-zA-Z0-9_-]+)\/index\.html/i;
    // const projects = /projects\/([a-zA-Z0-9_-]+)\/index\.html/i;
    // const imagesInParagraph =
    //   /\<p\>\<img src\=\"\/images\/([^\.]*).([^\"]*)\" alt\=\"([^\>]*)\"(.*?)\>\<\/p\>/ig;
    const images = /\<img src\=\"\/images\/([^\.]*).([^\"]*)\" alt\=\"([^\>]*)\"(.*?)\>/ig;
    // Image sizes property for adaptive images
    // const sizes = "(max-width: calc(1000px + 2 * 2.4rem)) calc(100vw - 2 * 2.4rem), 1000px"
    const sizes = "(max-width: 600px) 320px, (max-width: 600px) 480px, 1000px"


    function generateImage(url, extension, alt) {
      // Get image
      // const image = sharp(`${url}.${extension}`);
      const image = sharp(`images/${url}.${extension}`, { failOnError: false });
      // Resize image to 320px and 640px
      const smallImage = image.clone().resize({ width: 320 });
      const mediumImage = image.clone().resize({ width: 640 });
      // Generate a webp version of a large image
      image.clone().webp().toFile(`_site/images/${url}.webp`);
      // Generate a small original and webp image
      smallImage.clone().toFile(`_site/images/${url}-small.${extension}`);
      smallImage.clone().webp().toFile(`_site/images/${url}-small.webp`);
      // Generate a medium original and webp image
      mediumImage.clone().toFile(`_site/images/${url}-medium.${extension}`);
      mediumImage.clone().webp().toFile(`_site/images/${url}-medium.webp`);
      return `
      <figure>
      <picture>
        <source
          srcset="/images/${url}-small.webp 320w,
                  /images/${url}-medium.webp 640w,
                  /images/${url}.webp 1000w"
          sizes="${sizes}"
          type="image/webp">
        <img
          src="/images/${url}.${extension}"
          data-src="auto"
          srcset="/images/${url}-small.${extension} 320w,
                  /images/${url}-medium.${extension} 640w,
                  /images/${url}.${extension} 1000w"
          data-srcset="/images/${url}-small.${extension} 320w,
                      /images/${url}-medium.${extension} 640w,
                      /images/${url}.${extension} 1000w"
          sizes="${sizes}"
          alt="${alt}" loading="lazy">
      </picture>
      <figcaption>${alt}</figcaption>
    </figure>`
    }

    if (outputPath && outputPath.match(blog)) {
      content = content.replace(images, (match, p1, p2, p3) => {
        return generateImage(p1, p2, p3);
      });
    }


    return content;
  });

};