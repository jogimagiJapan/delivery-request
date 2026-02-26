export type FormValues = {
    userId: string;
    recipientName: string;
    recipientKana?: string;       // ふりがな（任意）
    phone: string;            // 電話番号（ハイフンなし10〜11桁）
    postalCode: string;       // 郵便番号（7桁ハイフンなし）
    prefecture: string;       // 都道府県（自動補完）
    cityAddress: string;      // 市区町村・番地（自動補完＋手入力）
    building?: string;        // 建物名・部屋番号
    itemName: string;         // アイテム名
    itemSize: string;         // サイズ
    itemColor?: string;       // カラー（カラー選択不可アイテムは空文字）
    notes?: string;           // 備考
};

export type SubmitPayload = FormValues & {
    submittedAt: string;      // ISO8601 送信日時
};
