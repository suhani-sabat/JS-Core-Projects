const form = document.querySelector('form')
const input = document.querySelector('#bin2Dec')
const result = document.querySelector('#result')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const binary = input.value

    if(binary === " "){
        result.innerText = "Please enter a binary number!"
        return
    }

    for(let i = 0; i < binary.length; i++){
        if(binary[i] !== '0' && binary[i] !== '1'){
            result.innerText = "Please enter a valid binary number"
            return
        }
    }


    const decimal = parseInt(binary, 2)
    result.textContent = `Decimal: ${decimal}`
})