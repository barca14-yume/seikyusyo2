# 請求書PDF生成CLIツール

CSVファイルから日本語の請求書PDFを生成するNode.js + TypeScriptのCLIツールです。

## 特徴

- ✅ CSV形式の請求データから自動でPDF生成
- ✅ A4縦サイズ、日本語フォント（Noto Sans JP）対応
- ✅ マルチページ対応（明細が多い場合は自動改ページ）
- ✅ インボイス制度対応（登録番号、軽減税率表示）
- ✅ PDFパスワード保護（オプション）
- ✅ 罫線、桁区切り、和文レイアウト完全対応

## 必要要件

- Node.js 18.x 以上
- npm または yarn

## インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd 請求書作成２

# 依存パッケージをインストール
npm install
```

## フォントのセットアップ

PDFに日本語を埋め込むため、Noto Sans JPフォントが必要です。

### フォントファイルの配置

1. Noto Sans JPをダウンロード:
   - [Google Fonts - Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)
   - または直接ダウンロード: https://github.com/notofonts/noto-cjk/releases

2. 以下のファイルを `assets/fonts/` ディレクトリに配置:
   ```
   assets/fonts/NotoSansJP-Regular.ttf
   assets/fonts/NotoSansJP-Bold.ttf
   ```

3. ディレクトリ構造:
   ```
   invoice-cli/
   ├── assets/
   │   └── fonts/
   │       ├── NotoSansJP-Regular.ttf
   │       └── NotoSansJP-Bold.ttf
   ```

### フォントファイルの作成（代替方法）

フォントファイルが用意できない場合、空のダミーファイルを作成してください（ただし日本語は表示されません）:

```powershell
# PowerShellで実行
New-Item -ItemType Directory -Force -Path assets/fonts
New-Item -ItemType File -Path assets/fonts/NotoSansJP-Regular.ttf
New-Item -ItemType File -Path assets/fonts/NotoSansJP-Bold.ttf
```

## 使い方

### 基本的な使い方

```bash
# TypeScriptを直接実行
npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out

# または開発スクリプトを使用
npm run dev
```

### コマンドラインオプション

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--input <path>` | 入力CSVファイルのパス（必須） | - |
| `--outDir <path>` | 出力ディレクトリ | `./out` |
| `--encrypt` | パスワード列が設定されている場合にPDFを暗号化 | 無効 |
| `--debugLayout` | デバッグモード（ボックス線を表示） | 無効 |
| `--help, -h` | ヘルプを表示 | - |

### 実行例

```bash
# 基本的な実行
npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out

# パスワード保護を有効化
npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out --encrypt

# デバッグモードで実行
npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out --debugLayout

# PowerShellでの実行例
npx ts-node src/index.ts --input .\samples\sample.csv --outDir .\out
```

### ビルドして実行

```bash
# TypeScriptをビルド
npm run build

# ビルドしたJSを実行
node dist/index.js --input ./samples/sample.csv --outDir ./out
```

## CSV形式

### 必須カラム

CSVファイルには以下のカラムが必要です（ヘッダー行必須）:

| カラム名 | 説明 | 例 |
|---------|------|-----|
| 請求書番号 | 請求書の一意な番号（グルーピングキー） | `0000394` |
| 発行年月日 | 請求書の発行日 | `2025/10/1` |
| 相手先_名 | 請求先の名称 | `鳥取ヤクルト販売株式会社` |
| 請求元_名 | 請求元の名称 | `株式会社サンプル` |
| 項目行 | 明細行フラグ（1=明細として表示） | `1` |

### CSV列マッピング表

<details>
<summary>全カラム一覧（クリックで展開）</summary>

#### ヘッダ情報
- `帳票区分`, `帳票名`, `月度表示`
- `発行年月日`, `請求書番号`, `お客様番号`

#### 相手先情報
- `相手先_郵便番号`, `相手先_住所１`, `相手先_住所２`
- `相手先_名`, `相手先事業者番号`

#### 請求元情報
- `請求元_名`, `請求元_郵便番号`, `請求元_住所１`
- `請求元_住所２`, `請求元_電話番号`

#### インボイス情報
- `販売会社事業者番号` → 登録番号として表示
- `インボイス注記1`, `インボイス注記2`

#### サマリー（金額表）
- `ヘッダ2_タイトル`, `ヘッダ2_金額` 〜 `ヘッダ17_タイトル`, `ヘッダ17_金額`
  - タイトルが空欄の項目はスキップされます

#### お知らせ
- `お知らせ1` 〜 `お知らせ5`
  - 先頭に `!!` がある場合はハイライト表示

#### 明細情報
- `明細ヘッダ名称` → 明細表のヘッダ名
- `項目行` → `1` の行のみ明細として表示
- `空白行` → `1` の場合は空行を挿入
- `中間見出し区分` → `1` の場合はセクション見出し
- `中間見出し名称` → セクション見出しのテキスト

#### 明細列
- `日付`, `明細種別`, `商品名`, `コード`
- `数量`, `単価`, `金額`, `税区分`
- `金額説明`, `精算補足説明`

#### その他
- `印影` → ファイル名（assets/hanko.pngを表示）
- `税記号` → 税区分の凡例
- `パスワード` → PDF暗号化用パスワード
- `軽減税率対象有無フラグ` → `1` で軽減税率注記を表示

</details>

### サンプルCSV

`samples/sample.csv` にサンプルデータが含まれています。

## 出力ファイル名

生成されるPDFのファイル名は以下の形式です:

```
{請求書番号}_{相手先名}_{月度表示}.pdf
```

例: `0000394_鳥取ヤクルト販売株式会社_202509.pdf`

## プロジェクト構造

```
invoice-cli/
├── package.json              # 依存関係とスクリプト
├── tsconfig.json             # TypeScript設定
├── README.md                 # このファイル
├── src/
│   ├── index.ts              # CLIエントリポイント
│   ├── parse.ts              # CSV解析
│   ├── types.ts              # 型定義
│   ├── group.ts              # 請求書単位にグルーピング
│   ├── compute.ts            # 集計・整形
│   ├── paginate.ts           # ページネーション
│   ├── render.ts             # HTML生成→PDF化、暗号化
│   └── utils.ts              # ユーティリティ関数
├── templates/
│   ├── invoice.ejs           # 請求書HTMLテンプレート
│   └── styles.css            # スタイルシート
├── assets/
│   └── fonts/                # フォントファイル（要配置）
│       ├── NotoSansJP-Regular.ttf
│       └── NotoSansJP-Bold.ttf
├── samples/
│   └── sample.csv            # サンプルCSV
└── out/                      # 出力先（自動生成）
```

## データ処理フロー

1. **CSV読み込み** (`parse.ts`)
   - BOM除去、UTF-8パース

2. **グルーピング** (`group.ts`)
   - 請求書番号ごとにデータをまとめる

3. **整形** (`compute.ts`)
   - 数値フォーマット（千位区切り）
   - 日付フォーマット

4. **ページ分割** (`paginate.ts`)
   - 1ページ最大32行で自動改ページ

5. **レンダリング** (`render.ts`)
   - EJSテンプレートでHTML生成
   - PuppeteerでPDF変換
   - pdf-libでパスワード保護（オプション）

## レイアウト仕様

### ページ設定
- **用紙**: A4縦（210mm × 297mm）
- **余白**: 上下左右 12mm
- **フォント**: Noto Sans JP 10.5pt

### セクション構成

1. **ヘッダー**（1ページ目のみ）
   - 左上: 宛先（名称、住所、事業者番号）
   - 中央: タイトル「請 求 書」
   - 右上: 発行情報、請求元情報

2. **サマリー表**
   - ヘッダ2〜17の項目を2列ずつ表示
   - 金額は右揃え、千位区切り

3. **お知らせ欄**
   - 黄色背景、オレンジ枠線
   - `!!` 付きはハイライト表示

4. **明細表**
   - 10列: 日付/種別/商品名/コード/数量/単価/金額/税/金額説明/精算補足
   - ページごとにヘッダー行を表示

5. **フッター**
   - 登録番号、税区分凡例
   - 軽減税率注記（該当時）
   - ページ番号

## トラブルシューティング

### 日本語が文字化けする

フォントファイルが正しく配置されているか確認してください:

```bash
ls assets/fonts/
# NotoSansJP-Regular.ttf と NotoSansJP-Bold.ttf が必要
```

### Puppeteerがエラーになる

Chromiumのダウンロードに失敗している可能性があります:

```bash
# 再インストール
npm install puppeteer --force
```

Windows環境で権限エラーが出る場合:

```bash
# 管理者権限でPowerShellを起動して実行
npm install
```

### PDFが生成されない

出力ディレクトリの書き込み権限を確認してください:

```bash
# 出力ディレクトリを手動作成
mkdir out
```

## ライセンス

MIT

## 開発

### 依存パッケージ

- **csv-parse**: CSV解析
- **ejs**: HTMLテンプレート
- **puppeteer**: PDF生成
- **pdf-lib**: PDF暗号化
- **dayjs**: 日付処理

### 開発スクリプト

```bash
# 開発モード（サンプルCSVで実行）
npm run dev

# TypeScriptビルド
npm run build

# ビルド後実行
npm start
```

## 今後の拡張案

- [ ] 複数CSVファイルの一括処理
- [ ] カスタムテンプレート対応
- [ ] Excel出力対応
- [ ] Web UI版の開発
