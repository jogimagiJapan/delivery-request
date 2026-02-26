/**
 * SEW THE SOUND - 配送受付 Google Apps Script
 *
 * 使用方法:
 * 1. このコードをGASエディタに貼り付ける
 * 2. initializeSheet() を実行してDeliveryシートを初期化
 * 3. Webアプリとしてデプロイ（アクセス: 全員）
 * 4. 発行されたURLを .env.local の NEXT_PUBLIC_GAS_ENDPOINT に設定
 */

var SHEET_NAME = "Delivery";

// スプレッドシートのヘッダー定義
var DATA_HEADERS = [
  "受付日時",       // A
  "ユーザーID",     // B
  "受取人氏名",     // C
  "ふりがな",       // D
  "電話番号",       // E
  "郵便番号",       // F
  "都道府県",       // G
  "市区町村・番地", // H
  "建物名・部屋番号", // I
  "アイテム",       // J
  "サイズ",         // K
  "カラー",         // L
  "備考",           // M
  "（予備）",       // N
];

var MANAGEMENT_HEADERS = [
  "糸の色（作業管理）", // O
  "進捗ステータス",     // P
  "発送追跡番号",       // Q
  "完了確認",           // R
];

/**
 * POST受信 - フォームデータをDeliveryシートに追記する
 */
function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    var row = [
      params.submittedAt   || new Date().toISOString(),
      params.userId        || "",
      params.recipientName || "",
      params.recipientKana || "",
      params.phone         || "",
      params.postalCode    || "",
      params.prefecture    || "",
      params.cityAddress   || "",
      params.building      || "",
      params.itemName      || "",
      params.itemSize      || "",
      params.itemColor     || "",
      params.notes         || "",
      "",  // N列: 予備
      // O〜R列（作業管理列）は空欄で追加
      "", "", "", "",
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET: 疎通確認
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", sheet: SHEET_NAME }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Deliveryシートを取得、存在しない場合は作成してヘッダーを初期化する
 * 手動実行: initializeSheet() → ヘッダーのみ初期化（データは削除しない）
 */
function initializeSheet() {
  var sheet = getOrCreateSheet();
  var allHeaders = DATA_HEADERS.concat(MANAGEMENT_HEADERS);

  // 1行目にヘッダーを設定（既存の場合は上書き）
  var headerRange = sheet.getRange(1, 1, 1, allHeaders.length);
  headerRange.setValues([allHeaders]);

  // ヘッダー行のスタイル設定
  headerRange.setBackground("#2c3e50");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");

  // 作業管理列（O〜R）のみ別色で区別
  var mgmtRange = sheet.getRange(1, DATA_HEADERS.length + 1, 1, MANAGEMENT_HEADERS.length);
  mgmtRange.setBackground("#5d8aa8");

  // 列幅の自動調整
  sheet.autoResizeColumns(1, allHeaders.length);

  // 1行目を固定
  sheet.setFrozenRows(1);

  Logger.log("✅ Deliveryシートを初期化しました（" + allHeaders.length + "列）");
  return sheet;
}

/**
 * Deliveryシートを取得（存在しない場合は新規作成）
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    Logger.log("📄 Deliveryシートを新規作成しました");

    // 新規作成時は自動でヘッダー初期化
    var allHeaders = DATA_HEADERS.concat(MANAGEMENT_HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, allHeaders.length);
    headerRange.setValues([allHeaders]);
    headerRange.setBackground("#2c3e50");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");

    var mgmtRange = sheet.getRange(1, DATA_HEADERS.length + 1, 1, MANAGEMENT_HEADERS.length);
    mgmtRange.setBackground("#5d8aa8");

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, allHeaders.length);
  }

  return sheet;
}
