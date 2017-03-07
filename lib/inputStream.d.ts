import { InputStream as BaseInputStream } from '@slicky/tokenizer';
export declare class InputStream extends BaseInputStream {
    isNameStart(ch: string): boolean;
    isName(ch: string): boolean;
    isPunctuation(ch: string): boolean;
    isOperator(ch: string): boolean;
}
