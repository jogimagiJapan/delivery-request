"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { DeliveryFormSchema } from "@/lib/validations";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

type YubinbangoAddress = {
    region: string;    // 都道府県
    locality: string;  // 市区町村
    street: string;    // 町域
};

async function fetchAddress(zip: string): Promise<YubinbangoAddress | null> {
    try {
        const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();

        if (data.status !== 200 || !data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        return {
            region: result.address1, // 都道府県
            locality: result.address2, // 市区町村
            street: result.address3, // 町域
        };
    } catch {
        return null;
    }
}

export function AddressSection() {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<DeliveryFormSchema>();

    const [isLoading, setIsLoading] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);

    const postalCode = watch("postalCode");

    const handlePostalCodeChange = async (value: string) => {
        // 数字以外を除去
        const digits = value.replace(/\D/g, "");
        setValue("postalCode", digits);
        setLookupError(null);

        if (digits.length === 7) {
            setIsLoading(true);
            const address = await fetchAddress(digits);
            setIsLoading(false);

            if (address && address.region) {
                setValue("prefecture", address.region, { shouldValidate: true });
                const city = [address.locality, address.street].filter(Boolean).join("");
                setValue("cityAddress", city, { shouldValidate: true });
            } else {
                setLookupError("住所が見つかりませんでした。手入力してください。");
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* 郵便番号 */}
            <div>
                <Label
                    htmlFor="postalCode"
                    required
                    sub="7桁（ハイフンなし）を入力すると住所が自動補完されます"
                >
                    郵便番号
                </Label>
                <div className="relative">
                    <Input
                        id="postalCode"
                        type="tel"
                        inputMode="numeric"
                        placeholder="1500001"
                        maxLength={7}
                        error={errors.postalCode?.message}
                        value={postalCode ?? ""}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        suffix={isLoading ? "検索中..." : undefined}
                    />
                </div>
                {lookupError && (
                    <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                        <span>⚠</span>
                        {lookupError}
                    </p>
                )}
            </div>

            {/* 都道府県 */}
            <div>
                <Label htmlFor="prefecture" required>
                    都道府県
                </Label>
                <Input
                    id="prefecture"
                    type="text"
                    placeholder="東京都（自動補完）"
                    error={errors.prefecture?.message}
                    {...register("prefecture")}
                />
            </div>

            {/* 市区町村・番地 */}
            <div>
                <Label htmlFor="cityAddress" required>
                    市区町村・番地
                </Label>
                <Input
                    id="cityAddress"
                    type="text"
                    placeholder="渋谷区神南1-2-3"
                    error={errors.cityAddress?.message}
                    {...register("cityAddress")}
                />
            </div>

            {/* 建物名・部屋番号 */}
            <div>
                <Label htmlFor="building">
                    建物名・部屋番号
                </Label>
                <Input
                    id="building"
                    type="text"
                    placeholder="○○マンション 101号室（任意）"
                    error={errors.building?.message}
                    {...register("building")}
                />
            </div>
        </div>
    );
}
