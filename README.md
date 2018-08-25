# sprites.tilecloud.io

このサーバーは、Mapbox GL JS 用のアイコン用サーバーです。

ドキュメント: [https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite](https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite)

## アイコンについて

このサーバーでは以下のアイコンセットを提供しています。それぞれの URL を `style.json` の `sprite` の値にセットしてください。

### Maki

Mapbox 社がオープンソースで公開している地図用のアイコンセットです。

https://github.com/mapbox/maki

```
https://sprites.tilecloud.io/
```

## ビルド

```
$ npm install
$ npm run build-icon # アイコンをビルド
$ npm run build-html # HTML ページをビルド
```

プルリクエストや Issue はいつでも歓迎します。

[https://github.com/tilecloud/sprites.tilecloud.io](https://github.com/tilecloud/sprites.tilecloud.io)

## 免責事項

* 本サーバーは、日本における Mapbox GL JS の開発コミュニティの皆さんのお役に立つために、無償でだれでもご利用可能とさせていただきますが、予告なくサービスを停止させていただくこともございますのであらかじめご了承ください。

## ライセンス

このプロジェクトで同梱している各アイコンのライセンスはそれぞれの配布元で確認してください。

* Maki - https://github.com/mapbox/maki

それ以外のソースコードはMITライセンスとします。
