# フォントファイルの配置

このディレクトリには、PDF生成に必要な日本語フォントファイルを配置してください。

## 必要なファイル

以下の2つのフォントファイルが必要です:

- `NotoSansJP-Regular.ttf` - 通常のテキスト用
- `NotoSansJP-Bold.ttf` - 太字テキスト用

## ダウンロード方法

### 方法1: Google Fontsから直接ダウンロード

1. [Google Fonts - Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) にアクセス
2. 右上の「Download family」ボタンをクリック
3. ダウンロードしたZIPファイルを解凍
4. 以下のファイルをこのディレクトリにコピー:
   - `NotoSansJP-Regular.ttf`
   - `NotoSansJP-Bold.ttf`

### 方法2: GitHubリリースからダウンロード

1. [Noto CJK Releases](https://github.com/notofonts/noto-cjk/releases) にアクセス
2. 最新の `NotoSansJP.zip` をダウンロード
3. 解凍して必要なファイルをコピー

## PowerShellでのダウンロード例

```powershell
# このディレクトリに移動
cd assets/fonts

# Google Fontsから一時的にダウンロード（手動で配置が必要）
# または、以下のコマンドでプレースホルダーを作成（動作確認用）
New-Item -ItemType File -Force -Path NotoSansJP-Regular.ttf
New-Item -ItemType File -Force -Path NotoSansJP-Bold.ttf
```

**注意**: 上記のプレースホルダーファイルでは日本語が正しく表示されません。必ず実際のフォントファイルをダウンロードして配置してください。

## ファイル配置後の確認

正しく配置されているか確認:

```powershell
# PowerShell
Get-ChildItem -Path assets/fonts -Filter "*.ttf"
```

```bash
# Bash
ls -lh assets/fonts/*.ttf
```

以下のような出力が表示されればOKです:

```
NotoSansJP-Regular.ttf
NotoSansJP-Bold.ttf
```

## ライセンス

Noto Sans JPは、SIL Open Font License 1.1の下で配布されています。
商用・非商用問わず自由に使用できます。

詳細: https://scripts.sil.org/OFL
