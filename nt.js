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