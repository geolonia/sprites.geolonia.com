const spritezero = require("@mapbox/spritezero");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

const allAliases = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, "..", "src", "config.json"))
    .toString()
);

// make aliases with src/config.json
const alias = (src, data) => {
  const aliasConfig = allAliases[src] || {};
  Object.keys(aliasConfig)
    .filter(
      (key) => !!aliasConfig[key] && Array.isArray(aliasConfig[key].aliases)
    )
    .forEach((key) => {
      if (!data[key]) {
        throw new Error(`${key} cannot be found in the layout.`);
      }
      const { aliases } = aliasConfig[key];
      aliases.forEach((aliasKey) => {
        data[aliasKey] = data[key];
      });
    });

  return data;
};

/**
 * @param {string} basename An identifier for the distributing sprites
 * @param {number} pxRatio 1x, 2x or ..
 * @returns { name: string, data: Buffer }
 */
const genLayout = (basename, pxRatio) => {
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
      { imgs, pixelRatio: pxRatio, format: true },
      (error, layout) => {
        if (error) {
          reject(error);
        } else {
          const json = JSON.stringify(alias(basename, layout));
          resolve({ name: `${basename}${postfix}.json`, data: json });
        }
      }
    );
  });
};

/**
 * @param {string} basename An identifier for the distributing sprites
 * @param {number} pxRatio 1x, 2x or ..
 * @returns { name: string, data: string }
 */
const genSprite = (basename, pxRatio) => {
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
      { imgs, pixelRatio: pxRatio, format: false },
      (error, layout) => {
        if (error) {
          reject(error);
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
 * @param { name: string, data: string | Buffer } file
 */
const writeFile = ({ name, data }) => {
  const filepath = path.resolve(__dirname, "..", "public", name);
  fs.writeFileSync(filepath, data);
  return filepath;
};

const main = async () => {
  const dirnames = fs
    .readdirSync(path.resolve(__dirname, "..", "src"), {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // generate x1 and x2
  const files = await Promise.all([
    ...dirnames.map((name) => genLayout(name, 1).then(writeFile)),
    ...dirnames.map((name) => genLayout(name, 2).then(writeFile)),
    ...dirnames.map((name) => genSprite(name, 1).then(writeFile)),
    ...dirnames.map((name) => genSprite(name, 2).then(writeFile)),
  ]);
};

main();
