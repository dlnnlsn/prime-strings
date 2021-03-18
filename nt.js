const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n]

function jacobiSymbol(a, b) {
    if (b < 0n) {
        throw "b must be positive"
    }
    if (b % 2n == 0n) {
        throw "b must be odd"
    }
    a = a % b
    if (a < 0n) {
        a += b
    }
    var flip = false
    while (a > 1n) {
        var rem = b % 8n
        var threeOrFive = (rem == 3n) || (rem == 5n)
        while (a % 2n == 0n) {
            a /= 2n
            flip ^= threeOrFive
        }
        flip ^= ((a % 4n == 3n) && (b % 4n == 3n))
        var tmp = a
        a = b % a
        b = tmp
    }
    if (a == 0n) {
        return 0
    }
    return flip ? -1n : 1n
}

function isPrime(num) {
    for (const p of smallPrimes) {
        if (num == p) return true
        if (num % p == 0) {
            return false
        }
    }
    return undefined
}