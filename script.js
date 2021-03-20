const resultsList = document.querySelectorAll(".result-item")
const numDigitsInput = document.getElementById("numDigits")
const digitStringInput = document.getElementById("digitString")

var foundPrimes = []
var currentPage = 0
var digitString = ""

var worker = null

function findPrimes() {
    const numDigits = Number.parseInt(numDigitsInput.value)
    digitString = digitStringInput.value
    foundPrimes = []
    currentPage = 0
    updateResults()

    if (worker !== null) {
        worker.terminate()
    }
    worker = new Worker("./prime_worker.js")
    worker.onmessage = function(event) {
        foundPrimes.push(event.data)
        updateResults()
    }
    worker.postMessage({digitString, numDigits})
}

function updateResults() {
    for (var i = 0; i < 10; ++i) {
        var index = 10 * currentPage + i
        if (index < foundPrimes.length) {
            const prime = foundPrimes[index]
            const indexOfDigitString = prime.indexOf(digitString)
            const element = prime.substring(0, indexOfDigitString) + '<span class="digit-string">' + digitString + '</span>' + prime.substring(indexOfDigitString + digitString.length)
            resultsList[index].innerHTML = element
            resultsList[index].hidden = false
        }
        else {
            resultsList[index].hidden = true
        }
    }
}