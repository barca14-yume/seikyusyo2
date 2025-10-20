# セキュアな実行スクリプト
# CSVを処理してPDFを生成し、オプションでクリーンアップ

param(
    [string]$InputCsv = "",
    [switch]$AutoCleanup = $false
)

Write-Host "=== 請求書PDF生成（セキュアモード） ===" -ForegroundColor Cyan

# 入力CSVの確認
if ($InputCsv -eq "") {
    # inフォルダ内のCSVを検索
    $csvFiles = Get-ChildItem .\in\*.csv -ErrorAction SilentlyContinue
    
    if (($csvFiles | Measure-Object).Count -eq 0) {
        Write-Host "`nエラー: inフォルダにCSVファイルがありません" -ForegroundColor Red
        Write-Host "使い方: .\run-secure.ps1 -InputCsv .\in\ファイル名.csv" -ForegroundColor Yellow
        exit 1
    }
    
    if (($csvFiles | Measure-Object).Count -eq 1) {
        $InputCsv = $csvFiles[0].FullName
        Write-Host "`n自動検出: $($csvFiles[0].Name)" -ForegroundColor Green
    } else {
        Write-Host "`n複数のCSVファイルが見つかりました:" -ForegroundColor Yellow
        $csvFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
        Write-Host "`n使い方: .\run-secure.ps1 -InputCsv .\in\ファイル名.csv" -ForegroundColor Yellow
        exit 1
    }
}

# ファイルの存在確認
if (-not (Test-Path $InputCsv)) {
    Write-Host "`nエラー: ファイルが見つかりません: $InputCsv" -ForegroundColor Red
    exit 1
}

Write-Host "`n処理を開始します..." -ForegroundColor Cyan
Write-Host "入力: $InputCsv" -ForegroundColor White
Write-Host "出力: .\out\" -ForegroundColor White

# PDF生成
npx ts-node src/index.ts --input $InputCsv --outDir .\out

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ PDF生成が完了しました" -ForegroundColor Green
    
    # 生成されたPDFを表示
    $pdfFiles = Get-ChildItem .\out\*.pdf
    Write-Host "`n生成されたPDF:" -ForegroundColor Cyan
    $pdfFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
    
    # 自動クリーンアップ
    if ($AutoCleanup) {
        Write-Host "`n自動クリーンアップを実行します..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        .\cleanup.ps1
    } else {
        Write-Host "`nヒント: 処理後にクリーンアップする場合は以下を実行:" -ForegroundColor Yellow
        Write-Host "  .\cleanup.ps1" -ForegroundColor White
    }
} else {
    Write-Host "`nエラー: PDF生成に失敗しました" -ForegroundColor Red
    exit 1
}
