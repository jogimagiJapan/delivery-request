import { z } from "zod";
import { ITEM_MAP, ITEM_NAMES } from "@/data/items";

export const deliveryFormSchema = z
    .object({
        // ユーザーID: 日付8桁_時刻6桁_英数ユーザー名
        userId: z
            .string()
            .min(1, "ユーザーIDを入力してください")
            .regex(
                /^\d{8}_\d{6}_[a-zA-Z0-9]+$/,
                "形式: YYYYMMDD_HHMMSS_username（英数のみ）例: 20260226_145235_tanaka"
            ),

        // 受取人（バリデーションはフォーマット不問・任意）
        recipientName: z.string().min(1, "受取人氏名を入力してください"),

        recipientKana: z.string().optional(),

        // 連絡先
        phone: z
            .string()
            .min(1, "電話番号を入力してください")
            .regex(/^[0-9]{10,11}$/, "ハイフンなし10〜11桁で入力してください"),

        // 住所
        postalCode: z
            .string()
            .min(1, "郵便番号を入力してください")
            .regex(/^\d{7}$/, "ハイフンなし7桁で入力してください"),

        prefecture: z.string().min(1, "都道府県を入力（郵便番号で自動補完）"),

        cityAddress: z
            .string()
            .min(1, "市区町村・番地を入力してください")
            .max(100, "100文字以内で入力してください"),

        building: z.string().max(100, "100文字以内で入力してください").optional(),

        // アイテム
        itemName: z
            .string()
            .refine((val) => ITEM_NAMES.includes(val), {
                message: "アイテムを選択してください",
            }),

        itemSize: z.string().min(1, "サイズを選択してください"),

        itemColor: z.string().optional(),

        // 備考
        notes: z.string().max(300, "300文字以内で入力してください").optional(),
    })
    .superRefine((data, ctx) => {
        const item = ITEM_MAP[data.itemName];
        if (!item) return;

        // サイズ検証
        if (!item.sizes.includes(data.itemSize)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${data.itemName}のサイズは ${item.sizes.join(" / ")} から選択してください`,
                path: ["itemSize"],
            });
        }

        // カラー検証（hasColorがtrueのアイテムのみ）
        if (item.hasColor && (!data.itemColor || !item.colors.includes(data.itemColor))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${data.itemName}のカラーを選択してください`,
                path: ["itemColor"],
            });
        }
    });

export type DeliveryFormSchema = z.infer<typeof deliveryFormSchema>;
