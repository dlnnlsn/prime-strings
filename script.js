const resultsList = document.querySelectorAll(".result-item")
const numDigitsInput = document.getElementById("numDigits")
const digitStringInput = document.getElementById("digitString")
const truncationDisclaimer = document.getElementById("list-truncated")

var foundPrimes = []
var currentPage = 0
var digitString = ""

var worker = null

function findPrimes() {
    const numDigits = Number.parseInt(numDigitsInput.value)
    digitString = digitStringInput.value
    foundPrimes = []
    currentPage = 0
    truncationDisclaimer.hidden = true
    updateResults()

    if (worker !== null) {
        worker.terminate()
    }
    worker = new Worker("./prime_worker.js")
    worker.onmessage = function(event) {
        if (event.data === -1) {
            truncationDisclaimer.hidden = false
            return
        }
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
            const primeString = prime.toString()
            const pseudoPrime = prime > (1n << 64n)
            const indexOfDigitString = primeString.indexOf(digitString)
            const element = primeString.substring(0, indexOfDigitString) + '<span class="digit-string">' + digitString + '</span>' + primeString.substring(indexOfDigitString + digitString.length)
            resultsList[i].innerHTML = element
            resultsList[i].hidden = false
            resultsList[i].classList.remove('prime')
            resultsList[i].classList.remove('pseudo-prime')
            resultsList[i].classList.add(pseudoPrime ? 'pseudo-prime' : 'prime')
        }
        else {
            resultsList[i].hidden = true
        }
    }
}

function onNextClick() {
    if (currentPage < (Math.ceil(foundPrimes.length / 10) - 1)) {
        currentPage++
        updateResults()
    }
}

function onPreviousClick() {
    if (currentPage > 0) {
        currentPage--
        updateResults()
    }
}