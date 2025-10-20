import { InvoiceData, SummaryItem, DetailRow } from './types';
import { formatCurrency, formatNumber, formatDate, formatPostalCode } from './utils';

/**
 * 請求書データを表示用に整形
 */
export interface FormattedInvoiceData extends InvoiceData {
  formatted: {
    issueDate: string;
    recipientPostalCode: string;
    senderPostalCode: string;
    summaryItems: Array<{
      title: string;
      amount: string;
    }>;
    details: Array<FormattedDetailRow>;
  };
}

export interface FormattedDetailRow extends DetailRow {
  formatted?: {
    date: string;
    quantity: string;
    unitPrice: string;
    amount: string;
  };
}

/**
 * 請求書データを整形
 */
export function formatInvoiceData(invoice: InvoiceData): FormattedInvoiceData {
  // サマリー項目を整形
  const formattedSummaryItems = invoice.summaryItems.map(item => ({
    title: item.title,
    amount: item.amount ? formatCurrency(item.amount) : ''
  }));
  
  // 明細を整形
  const formattedDetails: FormattedDetailRow[] = invoice.details.map(detail => {
    if (detail.type === 'item') {
      return {
        ...detail,
        formatted: {
          date: detail.date ? formatDate(detail.date) : '',
          quantity: detail.quantity ? formatNumber(detail.quantity, 1) : '',
          unitPrice: detail.unitPrice ? formatCurrency(detail.unitPrice) : '',
          amount: detail.amount ? formatCurrency(detail.amount) : ''
        }
      };
    }
    return detail;
  });
  
  return {
    ...invoice,
    formatted: {
      issueDate: formatDate(invoice.issueDate),
      recipientPostalCode: formatPostalCode(invoice.recipientPostalCode),
      senderPostalCode: formatPostalCode(invoice.senderPostalCode),
      summaryItems: formattedSummaryItems,
      details: formattedDetails
    }
  };
}

/**
 * すべての請求書データを整形
 */
export function formatAllInvoices(invoices: InvoiceData[]): FormattedInvoiceData[] {
  return invoices.map(invoice => formatInvoiceData(invoice));
}
