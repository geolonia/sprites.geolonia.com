var fs = require('fs');
var glob = require('glob');
var path = require('path');

const targetDir = 'sample'; // 変換したいアイコンがあるディレクトリを指定
const srcPath = path.resolve(__dirname, '..', 'src')

glob(`${srcPath}/*`, (err, files) => {

  files.forEach(file => {

    const iconCategoryName = file.replace(`${srcPath}/`, "");
    const iconPath = path.join(srcPath, iconCategoryName);

    var svgs = glob.sync(`${iconPath}/*.svg`)
    .map(function(f) {
        const iconName = f.replace(`${iconPath}/`, '')
        return {
            svg: fs.readFileSync(f, 'utf-8'),
            id: path.basename(f).replace('.svg', ''),
            name: iconName
        };
    });

    svgs.forEach(function(svg) {

      // ファイル名末尾が -数字 のファイルと、サイズが特殊なファイルは除外。
      const regex = /-[0-9]+\.svg$|^oneway|^default/g;
      const matched = svg.name.match(regex)

      if (!matched) {
        const name = svg.name.replace('.svg', '')

        fs.writeFileSync(`${iconPath}/${name}-11.svg`, svg.svg);
        fs.writeFileSync(`${iconPath}/${name}-15.svg`, svg.svg);

      }

    })
  });
});