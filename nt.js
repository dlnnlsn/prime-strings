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
        return 0n
    }
    return flip ? -1n : 1n
}

function findDiscriminantForLucasPseudoPrimeTest(num) {
    var D = 5n
    var negative = false
    while (jacobiSymbol(D, num) != -1n) {
        if (negative) {
            D = -D + 2n
        }
        else {
            D = -D - 2n
        }
        negative = !negative
    }
    return D
}

function isStrongLucasPseudoPrime(num, P, Q, D) {
    var index = num + 1n
    var powerOfTwo = 0
    while (index % 2n == 0n) {
        index /= 2n
        powerOfTwo++
    }
    P = P % num
    if (P < 0n) {
        P += num
    }
    Q = Q % num
    if (Q < 0n) {
        Q += num
    }
    D = D % num
    if (D < 0n) {
        D += num
    }
    var U = 1n
    var V = P
    var Qk = Q
    var mask = 1n
    while (mask <= index) {
        mask <<= 1n
    }
    mask >>= 2n
    while (mask > 0n) {
        U = (U * V) % num
        V = (V * V - 2n * Qk) % num
        if (V < 0n) {
            V += num
        }
        Qk = (Qk * Qk) % num
        if (index & mask) {
            var newU = P * U + V
            newU = (newU % 2n == 1n) ? (newU + num) / 2n : newU / 2n
            var newV = D * U + P * V
            newV = (newV % 2n == 1n) ? (newV + num) / 2n : newV / 2n
            U = newU % num
            V = newV % num
            Qk = (Qk * Q) % num
        }
        mask >>= 1n
    }
    if (U == 0n) {
        return true
    }
    for (var i = 0; i < powerOfTwo; i++) {
        if (V == 0n) {
            return true
        }
        U = (U * V) % num
        V = (V * V - 2n * Qk) % num
        if (V < 0n) {
            V += num
        }
        Qk = (Qk * Qk) % num
    }
    return false
}

function isBailliePSWPseudoprime(num) {
    for (const p of smallPrimes) {
        if (num == p) return true
        if (num % p == 0n) {
            return false
        }
    }
    if (num < 10201n) {
        return true
    }
    if (!isMillerRabinPseudoprime(num, 2n)) {
        return false
    }
    const isqrt = integerSqrt(num)
    if (isqrt * isqrt == num) {
        return false
    }
    const D = findDiscriminantForLucasPseudoPrimeTest(num)
    const Q = (1n - D)/4n
    if (!isStrongLucasPseudoPrime(num, 1n, Q, D)) {
        return false
    }
    return true
}

function isPrime(num) {
    if (num > (1n << 64n)) return undefined
    return isBailliePSWPseudoprime(num)
}