const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");
const { j2xParser } = require("fast-xml-parser");

// destructive. Append <path fill="#ffffff" />
const convert = (parent) => {
  if (Array.isArray(parent)) {
    for (const item of parent) {
      convert(item);
    }
  } else if (typeof parent === "object") {
    const keys = Object.keys(parent).filter((key) => !key.startsWith("@_"));
    for (const key of keys) {
      if (key === "path") {
        if (Array.isArray(parent.path)) {
          for (const eachPath of parent.path) {
            eachPath["@_fill"] = "#ffffff";
          }
        } else {
          parent.path["@_fill"] = "#ffffff";
        }
      } else {
        convert(parent[key]);
      }
    }
  }
};

const main = async () => {
  const basicDir = path.resolve(__dirname, "..", "src", "basic");
  const basicWhiteDir = path.resolve(__dirname, "..", "src", "basic-white");

  const svgs = fs
    .readdirSync(basicDir, {
      withFileTypes: true,
    })
    .filter(
      (dirent) => dirent.isFile() && dirent.name.toLowerCase().endsWith(".svg")
    )
    .map((dirent) => ({
      src: path.resolve(basicDir, dirent.name),
      dest: path.resolve(basicWhiteDir, dirent.name),
    }));

  await Promise.all(
    svgs.map(({ src, dest }) => {
      const xmlData = fs.readFileSync(src).toString();
      const xml = parser.parse(xmlData, {
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        ignoreAttributes: false,
      });

      convert(xml);

      const whitened = new j2xParser({
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        ignoreAttributes: false,
      }).parse(xml);

      fs.writeFileSync(dest, whitened);
    })
  );
};

main();
