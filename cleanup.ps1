# セキュアクリーンアップスクリプト
# 処理後に実行して、個人情報を含むファイルを削除

Write-Host "=== セキュアクリーンアップ ===" -ForegroundColor Cyan

# inフォルダのCSVファイル数を確認
$csvFiles = Get-ChildItem .\in\*.csv -ErrorAction SilentlyContinue
$csvCount = ($csvFiles | Measure-Object).Count

# outフォルダのPDFファイル数を確認
$pdfFiles = Get-ChildItem .\out\*.pdf -ErrorAction SilentlyContinue
$pdfCount = ($pdfFiles | Measure-Object).Count

Write-Host "`n削除対象:" -ForegroundColor Yellow
Write-Host "  CSVファイル: $csvCount 件" -ForegroundColor White
Write-Host "  PDFファイル: $pdfCount 件" -ForegroundColor White

if ($csvCount -eq 0 -and $pdfCount -eq 0) {
    Write-Host "`n削除するファイルはありません。" -ForegroundColor Green
    exit 0
}

# 確認
Write-Host "`n本当に削除しますか？ (Y/N): " -ForegroundColor Red -NoNewline
$confirmation = Read-Host

if ($confirmation -eq 'Y' -or $confirmation -eq 'y') {
    # CSVファイルを削除
    if ($csvCount -gt 0) {
        Remove-Item .\in\*.csv -Force
        Write-Host "✓ CSVファイルを削除しました" -ForegroundColor Green
    }
    
    # PDFファイルを削除
    if ($pdfCount -gt 0) {
        Remove-Item .\out\*.pdf -Force
        Write-Host "✓ PDFファイルを削除しました" -ForegroundColor Green
    }
    
    Write-Host "`nクリーンアップ完了" -ForegroundColor Cyan
} else {
    Write-Host "`nキャンセルしました" -ForegroundColor Yellow
}
