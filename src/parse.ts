import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { CSVRow } from './types';
import { removeBOM } from './utils';

/**
 * CSVファイルを読み込んでパース
 */
export async function parseCSV(filePath: string): Promise<CSVRow[]> {
  try {
    // ファイル読み込み
    let content = fs.readFileSync(filePath, 'utf-8');
    
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
    
    return records;
  } catch (error) {
    console.error('CSV読み込みエラー:', error);
    throw error;
  }
}
