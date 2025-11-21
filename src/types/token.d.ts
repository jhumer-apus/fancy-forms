export interface Token {
    currency: string;
    date: string | Date;
    price: number;
}

export interface SelectedToken {
    from: Token | null
    to: Token | null
}

export interface InputtedValue {
    from: string;
    to: string
}