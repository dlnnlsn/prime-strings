const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n]

function integerSqrt(num) {
    if (num < 0n) {
        throw "Can only find the square-root of a positive integer"
    }
    var result = num
    var newNum = (num + 1n) / 2n;
    while (newNum < result) {
        result = newNum
        newNum = (result + num/result) / 2n
    }
    return result
}

function modPow(base, exp, modulus) {
    var mask = 1n
    while (mask <= exp) {
        mask <<= 1n
    }
    mask >>= 1n
    var result = 1n
    while (mask > 0n) {
        result = (result * result) % modulus
        if (exp & mask) {
            result = (result * base) % modulus
        }
        mask >>= 1n
    }
    return result
}

function isMillerRabinPseudoprime(num, base) {
    const numMinusOne = num - 1n
    var exp = numMinusOne
    var powerOfTwo = 0
    while (exp % 2n == 0n) {
        exp /= 2n
        powerOfTwo++
    }
    var rem = modPow(base, exp, num)
    if (rem == 1n) {
        return true
    }
    for (var i = 0; i < powerOfTwo; i++) {
        if (rem == numMinusOne) {
            return true
        }
        rem = (rem * rem) % num
    }
    return false
}

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
        if (num % p == 0n) {
            return false
        }
    }
    if (num < 10201n) {
        return true
    }
    if (!isMillerRabinPseudoprime(num, 2)) {
        return false
    }
    return undefined
}