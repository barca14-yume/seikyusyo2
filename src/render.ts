import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { PaginatedInvoice } from './types';
import { FormattedInvoiceData } from './compute';
import { sanitizeFileName } from './utils';

/**
 * HTMLをレンダリング
 */
async function renderHTML(
  invoice: FormattedInvoiceData & PaginatedInvoice,
  debugLayout: boolean
): Promise<string> {
  const templatePath = path.join(__dirname, '../templates/invoice.ejs');
  const cssPath = path.join(__dirname, '../templates/styles.css');
  
  // CSSを読み込み
  const css = fs.readFileSync(cssPath, 'utf-8');
  
  // EJSテンプレートをレンダリング
  const html = await ejs.renderFile(templatePath, {
    invoice,
    css,
    debugLayout
  });
  
  return html;
}

/**
 * HTMLをPDFに変換
 */
async function convertHTMLToPDF(html: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm'
      }
    });
    
    console.log(`  ✓ PDF生成: ${path.basename(outputPath)}`);
  } finally {
    await browser.close();
  }
}

/**
 * PDFを暗号化
 * 注: pdf-lib v1.17.1ではパスワード保護が直接サポートされていないため、
 * この機能は将来的な実装として残しています。
 * 実際の暗号化にはqpdfやpdftk等の外部ツールを使用することを推奨します。
 */
async function encryptPDF(pdfPath: string, password: string): Promise<void> {
  // pdf-libではパスワード保護が標準サポートされていないため、
  // ここでは警告のみ表示
  console.log(`  ⚠ PDF暗号化: pdf-libではパスワード保護が未サポートです`);
  console.log(`    パスワード: ${password}`);
  console.log(`    外部ツール（qpdf等）での暗号化を推奨します`);
  
  // 将来的な実装のためのプレースホルダー
  // 実装例: qpdfを使用する場合
  // const { execSync } = require('child_process');
  // execSync(`qpdf --encrypt ${password} ${password} 128 -- "${pdfPath}" "${pdfPath}.encrypted"`);
  // fs.renameSync(`${pdfPath}.encrypted`, pdfPath);
}

/**
 * 請求書PDFを生成
 */
export async function generateInvoicePDF(
  invoice: FormattedInvoiceData & PaginatedInvoice,
  outDir: string,
  options: { encrypt?: boolean; debugLayout?: boolean } = {}
): Promise<string> {
  // 出力ディレクトリを作成
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // ファイル名を生成
  const fileName = sanitizeFileName(
    `${invoice.invoiceNumber}_${invoice.recipientName}_${invoice.monthDisplay}.pdf`
  );
  const outputPath = path.join(outDir, fileName);
  
  // HTMLをレンダリング
  const html = await renderHTML(invoice, options.debugLayout || false);
  
  // PDFに変換
  await convertHTMLToPDF(html, outputPath);
  
  // パスワードが設定されている場合は暗号化
  if (options.encrypt && invoice.password && invoice.password.trim() !== '') {
    await encryptPDF(outputPath, invoice.password);
  }
  
  return outputPath;
}

/**
 * すべての請求書PDFを生成
 */
export async function generateAllInvoicePDFs(
  invoices: Array<FormattedInvoiceData & PaginatedInvoice>,
  outDir: string,
  options: { encrypt?: boolean; debugLayout?: boolean } = {}
): Promise<string[]> {
  const outputPaths: string[] = [];
  
  for (const invoice of invoices) {
    const outputPath = await generateInvoicePDF(invoice, outDir, options);
    outputPaths.push(outputPath);
  }
  
  console.log(`\n✓ ${outputPaths.length}件のPDFを生成しました`);
  
  return outputPaths;
}
