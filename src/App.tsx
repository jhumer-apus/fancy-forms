import { useState } from 'react'
import './App.css'
import FromToken from './components/FromToken';
import ToToken from './components/ToToken';
import type { InputtedValue, SelectedToken } from './types/token';
import { ArrowDownIcon } from '@heroicons/react/20/solid';
import { useTokens } from './hooks/useTokens';


function App() {
  
  const { tokens } = useTokens();
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
