const spritezero = require("@mapbox/spritezero");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

/**
 * @param {string} basename An identifier for the distributing sprites
 * @param {number} pxRatio 1x, 2x or ..
 * @param {'json' | 'png'} Output format
 * @returns { name: string, data: Buffer }[]
 */
const generate = (basename, pxRatio, format) => {
  const imgs = glob
    .sync(path.resolve(__dirname, "..", "src", basename, "*.svg"))
    .map((f) => {
      return {
        svg: fs.readFileSync(f),
        id: path.basename(f).replace(".svg", ""),
      };
    });

  const postfix = pxRatio > 1 ? `@${pxRatio}x` : "";

  return new Promise((resolve, reject) => {
    spritezero.generateLayout(
      { imgs, pixelRatio: pxRatio, format: format === "json" },
      (error, layout) => {
        if (error) {
          reject(error);
        } else if (format === "json") {
          const json = JSON.stringify(layout);
          resolve({ name: `${basename}${postfix}.json`, data: json });
        } else {
          spritezero.generateImage(layout, (error, sprite) => {
            if (error) {
              reject(error);
            } else {
              resolve({ name: `${basename}${postfix}.png`, data: sprite });
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param { name: string, data: string | Buffer }[] files
 */
const writeFile = ({ name, data }) => {
  const filepath = path.resolve(__dirname, "..", "public", name);
  fs.writeFileSync(filepath, data);
};

const main = async () => {
  const dirnames = fs
    .readdirSync(path.resolve(__dirname, "..", "src"), {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // generate x1 and x2
  const items = await Promise.all([
    ...dirnames.map((name) => generate(name, 1, "json").then(writeFile)),
    ...dirnames.map((name) => generate(name, 2, "json").then(writeFile)),
    ...dirnames.map((name) => generate(name, 1, "png").then(writeFile)),
    ...dirnames.map((name) => generate(name, 2, "png").then(writeFile)),
  ]);
};

main();
