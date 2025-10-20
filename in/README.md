# 入力CSVファイル格納フォルダ

このフォルダに実際の請求データCSVファイルを配置してください。

## 使い方

1. **CSVファイルをこのフォルダにコピー**
   ```
   in/
   └── 請求データ.csv  ← ここに配置
   ```

2. **処理を実行**
   ```powershell
   npx ts-node src/index.ts --input .\in\請求データ.csv --outDir .\out
   ```

3. **処理完了後**
   - 生成されたPDFは `out/` フォルダに保存されます
   - 必要に応じてCSVファイルを削除または移動してください

## セキュリティ

- ✅ このフォルダ内の `.csv` と `.xlsx` ファイルは `.gitignore` で除外されています
- ✅ GitHubにプッシュされることはありません
- ⚠️ ただし、ローカルPCには残るため、不要になったら削除してください

## 簡単なコマンド

### inフォルダ内のすべてのCSVを処理

```powershell
# inフォルダ内のCSVファイル一覧を表示
Get-ChildItem .\in\*.csv

# 特定のCSVを処理
npx ts-node src/index.ts --input .\in\ファイル名.csv --outDir .\out
```

### 処理後のクリーンアップ

```powershell
# 生成されたPDFを確認
Get-ChildItem .\out\*.pdf

# inフォルダのCSVを削除（任意）
Remove-Item .\in\*.csv

# outフォルダのPDFを削除（任意）
Remove-Item .\out\*.pdf
```
