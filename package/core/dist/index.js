const crypto = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;
async function generatePassword(length = 16) {
    return generatePasswordWithOptions({
        length,
        includeUpperCase: true,
        includeLowerCase: true,
        includeDigits: true,
        includeSymbols: true
    });
}
async function generatePasswordWithOptions(options = {
    length: 16
}) {
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
    // 暗号学的に安全な乱数を生成
    const getRandomChar = async (charset)=>{
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return charset[array[0] % charset.length];
    };
    // 必須文字の生成（選択された各文字セットから1文字ずつ）
    const requiredChars = await Promise.all(charsets.map((charset)=>getRandomChar(charset)));
    // 残りの文字を生成
    const remainingChars = await Promise.all(Array(length - requiredChars.length).fill(null).map(()=>getRandomChar(allChars)));
    // シャッフル関数
    const shuffle = async (array)=>{
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