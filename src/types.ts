/**
 * CSV行の型定義（全カラム）
 */
export interface CSVRow {
  帳票区分: string;
  帳票名: string;
  月度表示: string;
  相手先_郵便番号: string;
  相手先_住所１: string;
  相手先_住所２: string;
  相手先_名: string;
  相手先事業者番号: string;
  請求先識別コード: string;
  請求元_名: string;
  請求元_郵便番号: string;
  請求元_住所１: string;
  請求元_住所２: string;
  請求元_電話番号: string;
  発行年月日: string;
  請求書番号: string;
  お客様番号: string;
  販売会社事業者番号: string;
  インボイス注記1: string;
  インボイス注記2: string;
  ヘッダ2_タイトル: string;
  ヘッダ2_金額: string;
  ヘッダ3_タイトル: string;
  ヘッダ3_金額: string;
  ヘッダ4_タイトル: string;
  ヘッダ4_金額: string;
  ヘッダ5_タイトル: string;
  ヘッダ5_金額: string;
  ヘッダ6_タイトル: string;
  ヘッダ6_金額: string;
  ヘッダ7_タイトル: string;
  ヘッダ7_金額: string;
  ヘッダ8_タイトル: string;
  ヘッダ8_金額: string;
  ヘッダ9_タイトル: string;
  ヘッダ9_金額: string;
  ヘッダ10_タイトル: string;
  ヘッダ10_金額: string;
  ヘッダ11_タイトル: string;
  ヘッダ11_金額: string;
  ヘッダ12_タイトル: string;
  ヘッダ12_金額: string;
  ヘッダ13_タイトル: string;
  ヘッダ13_金額: string;
  ヘッダ14_タイトル: string;
  ヘッダ14_金額: string;
  ヘッダ15_タイトル: string;
  ヘッダ15_金額: string;
  ヘッダ16_タイトル: string;
  ヘッダ16_金額: string;
  ヘッダ17_タイトル: string;
  ヘッダ17_金額: string;
  お知らせ1: string;
  お知らせ2: string;
  お知らせ3: string;
  お知らせ4: string;
  お知らせ5: string;
  明細ヘッダ名称: string;
  項目行: string;
  空白行: string;
  中間見出し区分: string;
  中間見出し名称: string;
  参考表示明細: string;
  日付: string;
  明細種別: string;
  商品名: string;
  コード: string;
  数量: string;
  単価: string;
  金額: string;
  税区分: string;
  金額説明: string;
  精算補足説明: string;
  現在ページ: string;
  全ページ数: string;
  空白ページフラグ: string;
  印影: string;
  税記号: string;
  パスワード: string;
  軽減税率対象有無フラグ: string;
}

/**
 * サマリー項目（ヘッダ2〜17）
 */
export interface SummaryItem {
  title: string;
  amount: string;
}

/**
 * 明細行
 */
export interface DetailRow {
  type: 'item' | 'blank' | 'section';
  date?: string;
  detailType?: string;
  productName?: string;
  code?: string;
  quantity?: string;
  unitPrice?: string;
  amount?: string;
  taxType?: string;
  amountNote?: string;
  settlementNote?: string;
  sectionTitle?: string;
}

/**
 * 請求書データ（グルーピング後）
 */
export interface InvoiceData {
  // ヘッダ情報
  invoiceNumber: string;
  issueDate: string;
  monthDisplay: string;
  customerNumber: string;
  
  // 相手先情報
  recipientName: string;
  recipientPostalCode: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientBusinessNumber: string;
  
  // 請求元情報
  senderName: string;
  senderPostalCode: string;
  senderAddress1: string;
  senderAddress2: string;
  senderPhone: string;
  
  // インボイス情報
  businessNumber: string;
  invoiceNote1: string;
  invoiceNote2: string;
  
  // サマリー
  summaryItems: SummaryItem[];
  
  // お知らせ
  notices: string[];
  
  // 明細
  detailHeaderName: string;
  details: DetailRow[];
  
  // フッター情報
  totalPages: number;
  stamp: string;
  taxSymbol: string;
  password: string;
  hasReducedTaxRate: boolean;
}

/**
 * ページ分割後の請求書データ
 */
export interface PaginatedInvoice extends Omit<InvoiceData, 'details'> {
  pages: InvoicePage[];
}

/**
 * 1ページ分のデータ
 */
export interface InvoicePage {
  pageNumber: number;
  totalPages: number;
  details: DetailRow[];
  isBlankPage: boolean;
}

/**
 * CLIオプション
 */
export interface CLIOptions {
  input: string;
  outDir: string;
  encrypt?: boolean;
  debugLayout?: boolean;
}
