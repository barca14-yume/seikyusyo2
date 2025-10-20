/**
 * ユーティリティ関数
 */

/**
 * BOM（Byte Order Mark）を除去
 */
export function removeBOM(text: string): string {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
}

/**
 * 全角数字を半角に変換
 */
export function normalizeNumber(value: string): string {
  if (!value) return value;
  return value.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

/**
 * 文字列を数値に変換（安全版）
 */
export function toNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  const normalized = normalizeNumber(value.replace(/,/g, ''));
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

/**
 * 通貨フォーマット（千位区切り、¥記号なし）
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? toNumber(value) : value;
  if (num === 0) return '0';
  return num.toLocaleString('ja-JP');
}

/**
 * 数値フォーマット（小数1桁まで、千位区切り）
 */
export function formatNumber(value: string | number, decimals: number = 1): string {
  const num = typeof value === 'string' ? toNumber(value) : value;
  if (num === 0) return '0';
  
  // 整数の場合は小数点なし
  if (Number.isInteger(num)) {
    return num.toLocaleString('ja-JP');
  }
  
  return num.toLocaleString('ja-JP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

/**
 * 日付フォーマット（YYYY/MM/DD形式）
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // すでにYYYY/MM/DD形式の場合はそのまま返す
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    return dateStr;
  }
  return dateStr;
}

/**
 * 郵便番号フォーマット（〒XXX-XXXX）
 */
export function formatPostalCode(postalCode: string): string {
  if (!postalCode) return '';
  const cleaned = postalCode.replace(/[^0-9]/g, '');
  if (cleaned.length === 7) {
    return `〒${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return postalCode ? `〒${postalCode}` : '';
}

/**
 * 改行を<br>タグに変換
 */
export function nl2br(text: string): string {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

/**
 * HTMLエスケープ
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 文字列が空かどうか
 */
export function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim() === '';
}

/**
 * 文字列を真偽値に変換（"1" -> true, それ以外 -> false）
 */
export function toBoolean(value: string): boolean {
  return value === '1' || value === 'true' || value === 'TRUE';
}

/**
 * 安全なファイル名を生成
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
}
