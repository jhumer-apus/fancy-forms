import { useEffect, useState } from 'react'
import './App.css'
import FromToken from './components/FromToken';
import ToToken from './components/ToToken';
import type { InputtedValue, SelectedToken, Token } from './types/token';
import { ArrowDownIcon } from '@heroicons/react/20/solid';


function App() {
  
  const [tokens, setTokens] = useState<Token[]>([])
  const [inputtedValue, setInputtedValue] = useState<InputtedValue>({
    from: "",
    to: ""
  })
  const [selectedToken, setSelectedToken] = useState<SelectedToken>(
    {
      from: null,
      to: null
    }
  )

  const loadData = async () => {
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
    loadData()
  }, [])

  return (
    <div>
      <h1>Token Conversion</h1>
      <div className='flex flex-col gap-3 items-center mt-20'>
        <FromToken 
          tokens={tokens}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken} 
          setInputtedValue={setInputtedValue} 
          inputtedValue={inputtedValue}        
        />
        <div className='flex gap-2 items-center text-2xl'>
          Convert To <ArrowDownIcon className="size-8 text-white" />
        </div>
        <ToToken 
          tokens={tokens}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken} 
          setInputtedValue={setInputtedValue} 
          inputtedValue={inputtedValue}        
        />
      </div>
    </div>
  )
}

export default App
