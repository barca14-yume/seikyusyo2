import { CSVRow, InvoiceData, DetailRow, SummaryItem } from './types';
import { toBoolean } from './utils';

/**
 * CSV行を請求書番号でグルーピング
 */
export function groupByInvoiceNumber(rows: CSVRow[]): Map<string, CSVRow[]> {
  const grouped = new Map<string, CSVRow[]>();
  
  for (const row of rows) {
    const invoiceNumber = row.請求書番号;
    if (!grouped.has(invoiceNumber)) {
      grouped.set(invoiceNumber, []);
    }
    grouped.get(invoiceNumber)!.push(row);
  }
  
  return grouped;
}

/**
 * グルーピングされた行から請求書データを構築
 */
export function buildInvoiceData(rows: CSVRow[]): InvoiceData {
  if (rows.length === 0) {
    throw new Error('行データが空です');
  }
  
  // 最初の行からヘッダ情報を取得
  const firstRow = rows[0];
  
  // サマリー項目を構築（ヘッダ2〜17）
  const summaryItems: SummaryItem[] = [];
  for (let i = 2; i <= 17; i++) {
    const titleKey = `ヘッダ${i}_タイトル` as keyof CSVRow;
    const amountKey = `ヘッダ${i}_金額` as keyof CSVRow;
    const title = firstRow[titleKey];
    const amount = firstRow[amountKey];
    
    if (title && title.trim() !== '') {
      summaryItems.push({
        title: title.trim(),
        amount: amount || ''
      });
    }
  }
  
  // お知らせを構築
  const notices: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const noticeKey = `お知らせ${i}` as keyof CSVRow;
    const notice = firstRow[noticeKey];
    if (notice && notice.trim() !== '') {
      notices.push(notice.trim());
    }
  }
  
  // 明細を構築
  const details: DetailRow[] = [];
  let hasReducedTaxRate = false;
  
  for (const row of rows) {
    // 項目行が1の場合のみ明細として追加
    if (row.項目行 === '1') {
      // 空白行チェック
      if (row.空白行 === '1') {
        details.push({
          type: 'blank'
        });
      }
      // 中間見出しチェック
      else if (row.中間見出し区分 === '1') {
        details.push({
          type: 'section',
          sectionTitle: row.中間見出し名称 || ''
        });
      }
      // 通常の明細行
      else {
        details.push({
          type: 'item',
          date: row.日付 || '',
          detailType: row.明細種別 || '',
          productName: row.商品名 || '',
          code: row.コード || '',
          quantity: row.数量 || '',
          unitPrice: row.単価 || '',
          amount: row.金額 || '',
          taxType: row.税区分 || '',
          amountNote: row.金額説明 || '',
          settlementNote: row.精算補足説明 || ''
        });
      }
      
      // 軽減税率フラグチェック
      if (toBoolean(row.軽減税率対象有無フラグ)) {
        hasReducedTaxRate = true;
      }
    }
  }
  
  return {
    invoiceNumber: firstRow.請求書番号 || '',
    issueDate: firstRow.発行年月日 || '',
    monthDisplay: firstRow.月度表示 || '',
    customerNumber: firstRow.お客様番号 || '',
    
    recipientName: firstRow.相手先_名 || '',
    recipientPostalCode: firstRow.相手先_郵便番号 || '',
    recipientAddress1: firstRow.相手先_住所１ || '',
    recipientAddress2: firstRow.相手先_住所２ || '',
    recipientBusinessNumber: firstRow.相手先事業者番号 || '',
    
    senderName: firstRow.請求元_名 || '',
    senderPostalCode: firstRow.請求元_郵便番号 || '',
    senderAddress1: firstRow.請求元_住所１ || '',
    senderAddress2: firstRow.請求元_住所２ || '',
    senderPhone: firstRow.請求元_電話番号 || '',
    
    businessNumber: firstRow.販売会社事業者番号 || '',
    invoiceNote1: firstRow.インボイス注記1 || '',
    invoiceNote2: firstRow.インボイス注記2 || '',
    
    summaryItems,
    notices,
    
    detailHeaderName: firstRow.明細ヘッダ名称 || '明細',
    details,
    
    totalPages: parseInt(firstRow.全ページ数 || '1', 10),
    stamp: firstRow.印影 || '',
    taxSymbol: firstRow.税記号 || '',
    password: firstRow.パスワード || '',
    hasReducedTaxRate
  };
}

/**
 * すべての請求書データを構築
 */
export function buildAllInvoices(rows: CSVRow[]): InvoiceData[] {
  const grouped = groupByInvoiceNumber(rows);
  const invoices: InvoiceData[] = [];
  
  for (const [invoiceNumber, invoiceRows] of grouped) {
    console.log(`  請求書 ${invoiceNumber}: ${invoiceRows.length}行`);
    const invoice = buildInvoiceData(invoiceRows);
    invoices.push(invoice);
  }
  
  console.log(`✓ ${invoices.length}件の請求書を構築`);
  
  return invoices;
}
