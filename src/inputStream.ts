import {InputStream as BaseInputStream} from '@slicky/tokenizer';


export class InputStream extends BaseInputStream
{


	public isNameStart(ch: string): boolean
	{
		return /[a-z]/.test(ch);
	}


	public isName(ch: string): boolean
	{
		return this.isNameStart(ch) || ch === '-';
	}


	public isPunctuation(ch: string): boolean
	{
		return '.,:#[]'.indexOf(ch) >= 0;
	}


	public isOperator(ch: string): boolean
	{
		return '=~|^$*+>'.indexOf(ch) >= 0;
	}

}