declare function generatePassword(length?: number): Promise<string | undefined>;
interface PasswordOptions {
    length: number;
    includeUpperCase?: boolean;
    includeLowerCase?: boolean;
    includeDigits?: boolean;
    includeSymbols?: boolean;
    customSymbols?: string;
}
declare function generatePasswordWithOptions(options?: PasswordOptions): Promise<string | undefined>;
declare const _default: {
    generatePassword: typeof generatePassword;
    generatePasswordWithOptions: typeof generatePasswordWithOptions;
};
export default _default;
//# sourceMappingURL=index.d.ts.map