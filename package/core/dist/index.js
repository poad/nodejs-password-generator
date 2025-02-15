/**
 * クロスプラットフォーム対応のための暗号化API参照
 * ブラウザ環境とNode.js環境の両方で動作するように設定
 */ const crypto = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
/**
 * デフォルトのパスワード生成関数
 * すべての文字種（大文字、小文字、数字、記号）を含むパスワードを生成
 *
 * @param length - パスワードの長さ（デフォルト: 16文字）
 * @returns 生成されたパスワード文字列、または生成失敗時はundefined
 */ async function generatePassword(length = 16) {
    return generatePasswordWithOptions({
        length,
        includeUpperCase: true,
        includeLowerCase: true,
        includeDigits: true,
        includeSymbols: true
    });
}
/**
 * カスタマイズ可能なパスワード生成関数
 *
 * @param options - パスワード生成オプション
 * @returns 生成されたパスワード文字列、または生成失敗時はundefined
 *
 * @remarks
 * - 暗号学的に安全な乱数生成を使用
 * - 選択された各文字種から最低1文字を含むことを保証
 * - 最終的なパスワードはランダムにシャッフル
 *
 * @example
 * ```typescript
 * const password = await generatePasswordWithOptions({
 *   length: 12,
 *   includeUpperCase: true,
 *   includeLowerCase: true,
 *   includeDigits: false,
 *   includeSymbols: true
 * });
 * ```
 */ async function generatePasswordWithOptions(options = {
    length: 16
}) {
    // 使用可能な文字セットの定義
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    // デフォルトオプション
    const { length = 16, includeUpperCase = true, includeLowerCase = true, includeDigits = true, includeSymbols = true } = options;
    // 使用する文字セットを構築
    const charsets = [
        includeUpperCase && upperCase,
        includeLowerCase && lowerCase,
        includeDigits && digits,
        includeSymbols && symbols
    ].filter(Boolean);
    if (charsets.length === 0) {
        return undefined;
    }
    const allChars = charsets.join('');
    /**
     * 指定された文字セットからランダムな1文字を生成
     *
     * @param charset - 文字セット
     * @returns ランダムに選択された1文字
     */ const getRandomChar = async (charset)=>{
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return charset[array[0] % charset.length];
    };
    // 必須文字の生成（選択された各文字セットから1文字ずつ）
    const requiredChars = await Promise.all(charsets.map((charset)=>getRandomChar(charset)));
    // 残りの文字を生成
    const remainingChars = await Promise.all(Array(length - requiredChars.length).fill(null).map(()=>getRandomChar(allChars)));
    /**
     * 配列の要素をランダムにシャッフル
     *
     * @param array - シャッフルする配列
     * @returns シャッフルされた新しい配列
     */ const shuffle = async (array)=>{
        const result = [
            ...array
        ];
        const randomArray = new Uint32Array(result.length);
        crypto.getRandomValues(randomArray);
        return result.map((_, index, arr)=>{
            const randomIndex = index + randomArray[index] % (arr.length - index);
            const randomValue = arr[randomIndex];
            arr[randomIndex] = arr[index];
            return randomValue;
        });
    };
    // すべての文字を結合してシャッフル
    const shuffled = await shuffle([
        ...requiredChars,
        ...remainingChars
    ]);
    return shuffled.join('');
}
export default {
    generatePassword,
    generatePasswordWithOptions
};


//# sourceMappingURL=index.js.map