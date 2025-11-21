export const useConversion = () => {
    const convertAmount = (quantity:number, multiplierPrice:number, divisorPrice:number) => {
        return (quantity * multiplierPrice)/divisorPrice
    }

    return {
        convertAmount
    }
}