# sprites.geolonia.com

このサーバーは、Mapbox GL JS 用のアイコン用サーバーです。

ドキュメント: [https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite](https://www.mapbox.com/mapbox-gl-js/style-spec/#root-sprite)

## アイコンについて

このサーバーでは以下のアイコンセットを提供しています。それぞれの URL を `style.json` の `sprite` の値にセットしてください。

### Basic

Mapbox 社がオープンソースで公開している地図用のアイコンセット([6.2.0](https://github.com/mapbox/maki/releases/tag/6.2.0))を使用しています。

[https://github.com/mapbox/maki/releases/tag/6.2.0](https://github.com/mapbox/maki/releases/tag/6.2.0)

色の異なるアイコンセットを下の URL で配信しています。

#### 黒色

```
https://sprites.geolonia.com/basic
```

#### 白色

```
https://sprites.geolonia.com/basic-white
```

#### カラフル

```
https://sprites.geolonia.com/basic-color
```

## ビルド

```shell
$ npm install
$ npm run build-icon  # アイコンをビルド。src/basic-white/*.svg は 自動的に生成されます
$ npm run build-html  # HTML ページをビルド
```

プルリクエストや Issue はいつでも歓迎します。

[https://github.com/geolonia/sprites.geolonia.com](https://github.com/geolonia/sprites.geolonia.com)

## 免責事項

- 本サーバーは、日本における Mapbox GL JS の開発コミュニティの皆さんのお役に立つために、無償でだれでもご利用可能とさせていただきますが、予告なくサービスを停止させていただくこともございますのであらかじめご了承ください。

## ライセンス

このプロジェクトで同梱している各アイコンのライセンスはそれぞれの配布元で確認してください。

- Maki - [https://github.com/mapbox/maki](https://github.com/mapbox/maki)

それ以外のソースコードは MIT ライセンスとします。
