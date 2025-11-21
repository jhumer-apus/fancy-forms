import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import type { InputtedValue, SelectedToken, Token } from "../types/token"
import { ChevronDownIcon, SlashIcon } from "@heroicons/react/20/solid"
import { Fragment, type Dispatch, type SetStateAction } from "react"
import clsx from "clsx"
import { useConversion } from "../hooks/useConversion"

interface Props {
  tokens: Token[]
  setSelectedToken: Dispatch<SetStateAction<SelectedToken>>
  setInputtedValue: Dispatch<SetStateAction<InputtedValue>>
  inputtedValue: InputtedValue
  selectedToken: SelectedToken
}

export default function ToToken(
    { 
        tokens, 
        setSelectedToken, 
        selectedToken, 
        inputtedValue, 
        setInputtedValue 
    }: Props) {
        
    const conversion = useConversion();

    const handleSelectChange = (token:Token) => {
        setSelectedToken(prev => 
            (
                { 
                    ...prev, 
                    to: token 
                }
            )
        )

        if(selectedToken.from) {
            const convertedAmount = conversion.convertAmount(Number(inputtedValue.from), selectedToken.from.price, token.price)
            setInputtedValue((prev) => ({
                ...prev,
                to:String(convertedAmount)
            }))
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Remove anything that is not a digit or a dot
        const cleanedValue = raw.replace(/[^0-9.]/g, "");
        
        // If there is a selected token from and to then execute conversion
        let convertedAmount:number|string = inputtedValue.from
        if(selectedToken.from && selectedToken.to) {
            // VICE VERSA CONVERSION
            convertedAmount = conversion.convertAmount(Number(cleanedValue), selectedToken.to.price, selectedToken.from.price)
        }

        setInputtedValue(prev => ({
            ...prev,
            from: String(convertedAmount),
            to: cleanedValue
        }));
    };

    return (
        <div className="flex gap-2">
            {/* Amount input */}
            <input
                step="any"
                placeholder="0"
                value={inputtedValue.to}
                onChange={handleChangeInput}
                className={clsx(
                    "inputStyle",
                    "focustInputStyle",
                    "bg-zinc-700 text-white rounded px-3 py-2 w-32"
                )}
            />

            {/* Token dropdown */}
            <div className="relative w-72">
                <Listbox 
                    onChange={handleSelectChange}
                >
                    <ListboxButton
                        className={clsx(
                            "selectStyle",
                            "focusStyle",
                            "optionStyle",
                            "w-full bg-zinc-700 text-white px-3 py-2 rounded flex justify-between items-center"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {selectedToken.to ? 
                                (
                                    <Fragment>
                                        <img
                                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedToken.to?.currency}.svg`}
                                            alt={selectedToken.to?.currency}
                                            className="w-5 h-5"
                                        />
                                        {selectedToken.to?.currency}
                                    </Fragment>
                                ) :
                                (
                                    <span className="text-gray-200">Select a token</span>
                                )
                            }
                        </div>
                        <ChevronDownIcon className="w-5 h-5" />
                    </ListboxButton>

                    <ListboxOptions 
                        className="absolute mt-1 w-full bg-zinc-800 text-white rounded shadow-lg z-10 max-h-60 overflow-auto"
                    >
                        {tokens.map((token, index) => (
                            <ListboxOption
                                key={index}
                                value={token}
                                className={({ selected }) =>
                                    `hover:bg-zinc-700/30 cursor-pointer px-3 py-2 flex items-center gap-2 ${selected ? "bg-zinc-700" : ""} ${selected ? "font-semibold" : ""}`
                                }
                                            
                            >
                                <img
                                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`}
                                    alt={token.currency}
                                    className="w-5 h-5"
                                />
                                {token.currency}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
            </div>
        </div>
    )
}
