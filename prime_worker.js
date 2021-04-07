importScripts("./nt.js")

onmessage = function (event) {
    const stringDigits = BigInt(event.data.digitString.length)
    const leadingZero = event.data.digitString[0] == '0'
    const digitString = BigInt(event.data.digitString)
    const numDigits = BigInt(event.data.numDigits)

    var primesFound = new Set()
    for (var startDigits = leadingZero ? 1n : 0n; startDigits <= (numDigits - stringDigits); startDigits++) {
        const endDigits = numDigits - stringDigits - startDigits
        for (var front = (10n ** startDigits) / 10n; front < 10n ** startDigits; front++) {
            for (var back = 0n; back < 10n ** endDigits; back++) {
                const num = 10n ** (stringDigits + endDigits) * front + digitString * 10n**endDigits + back
                if (primesFound.has(num)) continue
                if (isBailliePSWPseudoprime(num)) {
                    if (primesFound.size == 100) {
                        postMessage(-1) //Signals that more than 100 primes were found
                        return
                    }
                    primesFound.add(num)
                    postMessage(num)
                }
            }
        }
    }
}