#!/usr/bin/env node

import * as path from 'path';
import { parseCSV } from './parse';
import { buildAllInvoices } from './group';
import { formatAllInvoices } from './compute';
import { paginateAllInvoices } from './paginate';
import { generateAllInvoicePDFs } from './render';
import { CLIOptions } from './types';

/**
 * コマンドライン引数をパース
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    input: '',
    outDir: './out',
    encrypt: false,
    debugLayout: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--input':
        options.input = args[++i];
        break;
      case '--outDir':
        options.outDir = args[++i];
        break;
      case '--encrypt':
        options.encrypt = true;
        break;
      case '--debugLayout':
        options.debugLayout = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }
  
  return options;
}

/**
 * ヘルプを表示
 */
function printHelp(): void {
  console.log(`
請求書PDF生成ツール

使い方:
  npx ts-node src/index.ts --input <CSVファイル> [オプション]

オプション:
  --input <path>      入力CSVファイルのパス（必須）
  --outDir <path>     出力ディレクトリ（デフォルト: ./out）
  --encrypt           パスワード列が設定されている場合に暗号化
  --debugLayout       デバッグモード（ボックス線を表示）
  --help, -h          このヘルプを表示

例:
  npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out
  npx ts-node src/index.ts --input ./samples/sample.csv --outDir ./out --encrypt --debugLayout
`);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  console.log('=== 請求書PDF生成ツール ===\n');
  
  // 引数をパース
  const options = parseArgs();
  
  // 入力ファイルチェック
  if (!options.input) {
    console.error('エラー: --input オプションでCSVファイルを指定してください');
    printHelp();
    process.exit(1);
  }
  
  try {
    // 絶対パスに変換
    const inputPath = path.resolve(options.input);
    const outDir = path.resolve(options.outDir);
    
    console.log(`入力: ${inputPath}`);
    console.log(`出力: ${outDir}`);
    console.log(`暗号化: ${options.encrypt ? '有効' : '無効'}`);
    console.log(`デバッグ: ${options.debugLayout ? '有効' : '無効'}\n`);
    
    // 1. CSVを読み込み
    console.log('[1/5] CSV読み込み中...');
    const rows = await parseCSV(inputPath);
    
    // 2. 請求書データを構築
    console.log('\n[2/5] 請求書データ構築中...');
    const invoices = buildAllInvoices(rows);
    
    // 3. データを整形
    console.log('\n[3/5] データ整形中...');
    const formattedInvoices = formatAllInvoices(invoices);
    console.log(`✓ ${formattedInvoices.length}件の請求書を整形`);
    
    // 4. ページ分割
    console.log('\n[4/5] ページ分割中...');
    const paginatedInvoices = paginateAllInvoices(formattedInvoices);
    console.log(`✓ ${paginatedInvoices.length}件の請求書をページ分割`);
    
    // 5. PDF生成
    console.log('\n[5/5] PDF生成中...');
    const outputPaths = await generateAllInvoicePDFs(
      paginatedInvoices.map((inv, idx) => ({
        ...formattedInvoices[idx],
        ...inv
      })),
      outDir,
      {
        encrypt: options.encrypt,
        debugLayout: options.debugLayout
      }
    );
    
    console.log('\n=== 完了 ===');
    console.log(`出力先: ${outDir}`);
    outputPaths.forEach(p => console.log(`  - ${path.basename(p)}`));
    
  } catch (error) {
    console.error('\nエラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  main().catch(error => {
    console.error('予期しないエラー:', error);
    process.exit(1);
  });
}

export { main };
