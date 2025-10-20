import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as iconv from 'iconv-lite';
import { CSVRow } from './types';
import { removeBOM } from './utils';

/**
 * CSVファイルを読み込んでパース
 */
export async function parseCSV(filePath: string): Promise<CSVRow[]> {
  try {
    // ファイルをバイナリで読み込み
    const buffer = fs.readFileSync(filePath);
    
    // エンコーディングを自動判定して文字列に変換
    let content: string;
    
    // BOMチェック（UTF-8）
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      content = buffer.toString('utf-8');
      console.log('  エンコーディング: UTF-8 (BOM付き)');
    }
    // UTF-8として試す
    else if (isValidUTF8(buffer)) {
      content = buffer.toString('utf-8');
      console.log('  エンコーディング: UTF-8');
    }
    // Shift-JISとして読み込む
    else {
      content = iconv.decode(buffer, 'shift_jis');
      console.log('  エンコーディング: Shift-JIS');
    }
    
    // BOM除去
    content = removeBOM(content);
    
    // CSVパース
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      relaxColumnCount: true,
    }) as CSVRow[];
    
    console.log(`✓ CSV読み込み完了: ${records.length}行`);
    
    // デバッグ: 最初の行の列名を表示
    if (records.length > 0) {
      const columns = Object.keys(records[0]);
      console.log(`  列数: ${columns.length}`);
      console.log(`  主要な列: ${columns.slice(0, 5).join(', ')}...`);
    }
    
    return records;
  } catch (error) {
    console.error('CSV読み込みエラー:', error);
    throw error;
  }
}

/**
 * バッファがUTF-8として有効かチェック
 */
function isValidUTF8(buffer: Buffer): boolean {
  try {
    const str = buffer.toString('utf-8');
    // UTF-8として読んだ文字列に置換文字（�）が含まれていないかチェック
    return !str.includes('\uFFFD');
  } catch {
    return false;
  }
}
