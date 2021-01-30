def pad(p, n):
    return '0'*(p - len(n)) + n 

def calcTable(n):
    if n == 0: return 0
    arr = []
    m = len(bin(n)[2:])    
    for i in range(0, m+1):
        for k in range(0, 2**i):
            arr += [pad(i, bin(k)[2:])]
    arr.pop(0)
    return arr[14]

print(calcTable(14))


