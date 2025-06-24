# otel-processor-local-test

## 検証目的

このリポジトリは、OpenTelemetry Collector Processor を通じて トレースデータを追加・フィルタする設定をローカル環境で動作検証するためのリポジトリです

### リポジトリ内に含まれる内容

- Node.js アプリケーションの自動計装によるトレース生成
- OpenTelemetry Collector によるトレースデータの受信・処理
- otel-tui を使用したトレースデータの可視化

## 前提条件

以下のツールがインストールされている必要があります：

- Node.js (v20 以上推奨)
- OpenTelemetry Collector
- otel-tui

## プロジェクト構成

```bash
.
├── src/
│   └── app.js           # サンプルアプリケーション（HTTP fetch処理）
├── otel/
│   └── otel-collector-dev.yaml  # OpenTelemetry Collectorの設定
└── package.json
```

## 検証手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. OpenTelemetry Collector の起動

```bash
otelcol --config=otel/otel-collector-dev.yaml
```

### 3. otel-tui の起動（別ターミナル）

```bash
npm run tui
```

または直接実行：

```bash
otel-tui --grpc 4319 --http 4320
```

### 4. アプリケーションの実行（別ターミナル）

※事前に、`.env.example` を参考に環境変数を設定してください

OpenTelemetry 自動計装有効でアプリケーションを実行

```bash
npm run start:otel
```

実行後、環境変数に`OTEL_TRACES_EXPORTER=otlp,console`が設定されていれば実行ターミナル上に**node.js アプリケーションによって生成されたトレース**が表示されます

## 注目すべき出力

### アプリケーション出力

[`src/app.js`](src/app.js)の実行により、以下のような出力が表示されます：

```bash
status: 200
 data: <!doctype html>
...
中略
...
{
  resource: {
    attributes: {
      'process.pid': xxxxx,
      'process.executable.name': 'node',
...
```

### otel-tui 画面

otel-tui で`deployment.collector: "col-local"`が付与されたトレース情報を確認できます。これは、node アプリケーションを実行した後に表示されるトレース情報では付与されておらず、Collector の Processor で付与した属性です。

## 設定の詳細

### OpenTelemetry Collector 設定

[`otel/otel-collector-dev.yaml`](otel/otel-collector-dev.yaml)では以下を設定：

- **Receivers**: OTLP over gRPC (4317) / HTTP (4318)
- **Processors**: バッチ処理、リソース属性の追加
- **Exporters**: otel-tui への転送 (4319)

## トラブルシューティング

- otel-tui にトレースが表示されない場合は、Collector と otel-tui が正常に起動していることを確認してください
- ポート競合が発生した場合は、[`otel/otel-collector-dev.yaml`](otel/otel-collector-dev.yaml)の設定を変更してください
