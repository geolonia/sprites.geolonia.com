const spritezero = require("@mapbox/spritezero");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

// make aliases with src/${sprite-name}.json
const alias = (aliasMap, data) => {
  const keys = Object.keys(aliasMap || {}).filter((key) =>
    Array.isArray(aliasMap[key])
  );
  for (const key of keys) {
    if (!data[key]) {
      throw new Error(`${key} cannot be found in the layout.`);
    } else {
      aliasMap[key].forEach((aliasKey) => {
        data[aliasKey] = data[key];
      });
    }
  }

  return data;
};

/**
 * @param {string} basename An identifier for the distributing sprites
 * @param {number} pxRatio 1x, 2x or ..
 * @returns { name: string, data: Buffer }
 */
const genLayout = (basename, pxRatio) => {
  let aliasMap = {};
  try {
    aliasMap = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, "..", "src", `${basename}.json`))
        .toString()
    ).aliasMap;
  } catch {}

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
          const layoutWithAliases = alias(aliasMap, layout);
          resolve({
            name: `${basename}${postfix}.json`,
            data: JSON.stringify(layoutWithAliases),
          });
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
