import { InvoiceData, PaginatedInvoice, InvoicePage, DetailRow } from './types';

/**
 * 1ページあたりの最大明細行数
 */
const MAX_ROWS_PER_PAGE = 32;

/**
 * 明細をページ分割
 */
export function paginateInvoice(invoice: InvoiceData): PaginatedInvoice {
  const pages: InvoicePage[] = [];
  const details = invoice.details;
  
  if (details.length === 0) {
    // 明細がない場合は1ページのみ
    pages.push({
      pageNumber: 1,
      totalPages: 1,
      details: [],
      isBlankPage: false
    });
  } else {
    // 明細を分割
    let currentPage: DetailRow[] = [];
    
    for (const detail of details) {
      currentPage.push(detail);
      
      // ページが満杯になったら次のページへ
      if (currentPage.length >= MAX_ROWS_PER_PAGE) {
        pages.push({
          pageNumber: pages.length + 1,
          totalPages: 0, // 後で設定
          details: currentPage,
          isBlankPage: false
        });
        currentPage = [];
      }
    }
    
    // 残りの明細を追加
    if (currentPage.length > 0) {
      pages.push({
        pageNumber: pages.length + 1,
        totalPages: 0,
        details: currentPage,
        isBlankPage: false
      });
    }
  }
  
  // 総ページ数を設定
  const totalPages = pages.length;
  pages.forEach(page => {
    page.totalPages = totalPages;
  });
  
  return {
    ...invoice,
    pages
  };
}

/**
 * すべての請求書をページ分割
 */
export function paginateAllInvoices(invoices: InvoiceData[]): PaginatedInvoice[] {
  return invoices.map(invoice => paginateInvoice(invoice));
}
