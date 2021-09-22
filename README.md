# sprites.geolonia.com

このサーバーは、Mapbox GL JS 用のアイコン用サーバーです。

ドキュメント: [https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite](https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite)

## アイコンについて

このサーバーでは以下のアイコンセットを提供しています。それぞれの URL を `style.json` の `sprite` の値にセットしてください。

### Maki

Mapbox 社がオープンソースで公開している地図用のアイコンセットです。

[https://github.com/mapbox/maki](https://github.com/mapbox/maki)

```
https://sprites.geolonia.com/maki
```

### Basic

このアイコンは、[osm-bright-gl-style](https://github.com/openmaptiles/osm-bright-gl-style) のフォークです。

```
https://sprites.geolonia.com/basic
```

## ビルド

```
$ npm install
$ npm run build-icon # アイコンをビルド
$ npm run build-html # HTML ページをビルド
```

## リサイズ

`src/` 以下にディレクトリを作成しリサイズしたい svg アイコンを配置して下さい。以下のコマンドで 11px と 15px 四方のアイコンを生成します。

```
$ npm install
$ npm run resize-icon -target=src/sample # svg アイコンをリサイズ
$ npm run delete-icon -target=src/sample # リサイズされた svg アイコン以外を削除
```

プルリクエストや Issue はいつでも歓迎します。

[https://github.com/geolonia/sprites.geolonia.com](https://github.com/geolonia/sprites.geolonia.com)

## 免責事項

* 本サーバーは、日本における Mapbox GL JS の開発コミュニティの皆さんのお役に立つために、無償でだれでもご利用可能とさせていただきますが、予告なくサービスを停止させていただくこともございますのであらかじめご了承ください。

## ライセンス

このプロジェクトで同梱している各アイコンのライセンスはそれぞれの配布元で確認してください。

* Maki - [https://github.com/mapbox/maki](https://github.com/mapbox/maki)

それ以外のソースコードはMITライセンスとします。
