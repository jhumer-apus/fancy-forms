import { useEffect, useState } from "react";
import type { Token } from "../types/token";

export const useTokens = () => {
    const [tokens, setTokens] = useState<Token[]>([])
    const loadTokens = async () => {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data = await res.json();
        const filteredTokens = filterTokens(data);
        const sortedTokens = filteredTokens.sort((a, b) => {
            const currencyA = a.currency.toLowerCase()
            const currencyB = b.currency.toLowerCase()
            if(currencyA < currencyB) return -1
            else if (currencyA > currencyB) return 1
            else return 0
        })
        setTokens(() => sortedTokens);
    };

    const filterTokens = (data:Token[]) => {

        // Map to store latest token entry
        const latestToken: Record<string, Token> = {};

        data.forEach(token => {
            // Skip if price is invalid or null
            if (token.price == null || isNaN(token.price) || token.price == undefined) return;

            const currency = token.currency;

            // If we haven't seen this token yet, store it
            if (!latestToken[currency]) {
                latestToken[currency] = token;
                return;
            }

            // Compare timestamps and keep the newest
            const existing = new Date(latestToken[currency].date).getTime();
            const incoming = new Date(token.date).getTime();

            if (incoming > existing) {
                latestToken[currency] = token;
            }
        });

        // Return as array
        return Object.values(latestToken);
    }

    useEffect(() => { 
        loadTokens()
    }, [])

    return {
        tokens
    }
}