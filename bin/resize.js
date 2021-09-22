var fs = require('fs');
var glob = require('glob');
var path = require('path');


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

      // -数字にマッチするファイル名を取得
      const matched = svg.name.match(/-[0-9]+\.svg$/g)

      if (!matched) {
        fs.writeFileSync(`${iconPath}/`,req.query.text);
        // res.send("書き込みしました");
      }

    })
  });
});
