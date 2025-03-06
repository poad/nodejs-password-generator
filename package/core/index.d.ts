/**
 * デフォルトのパスワード生成関数
 * すべての文字種（大文字、小文字、数字、記号）を含むパスワードを生成
 *
 * @param length - パスワードの長さ（デフォルト: 16文字）
 * @returns 生成されたパスワード文字列、または生成失敗時はundefined
 */
declare function generatePassword(length?: number): Promise<string | undefined>;
/**
 * パスワード生成のオプション設定用インターフェース
 */
interface PasswordOptions {
    /** パスワードの長さ */
    length: number;
    /** 大文字を含めるかどうか */
    includeUpperCase?: boolean;
    /** 小文字を含めるかどうか */
    includeLowerCase?: boolean;
    /** 数字を含めるかどうか */
    includeDigits?: boolean;
    /** 記号を含めるかどうか */
    includeSymbols?: boolean;
    /** カスタム記号セット（未実装） */
    customSymbols?: string;
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
 */
declare function generatePasswordWithOptions(options?: PasswordOptions): Promise<string | undefined>;
declare const _default: {
    generatePassword: typeof generatePassword;
    generatePasswordWithOptions: typeof generatePasswordWithOptions;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
