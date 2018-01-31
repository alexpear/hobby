'use strict';



let AnsiColor = module.exports;

AnsiColor.ESCAPE = '\x1b[';
AnsiColor.BALANCE = '\x1b[0m';
AnsiColor.Favorites = {
    // TODO reorder as text;background;brightness
    RED: '\x1b[1;37;41m',
    YELLOW: '\x1b[1;37;43m',
    GREEN: '\x1b[1;30;42m',
    CYAN: '\x1b[1;30;46m',
    BLUE: '\x1b[1;37;44m',
    PURPLE: '\x1b[1;37;45m',
    GREY: '\x1b[1;30;47m',
    BLACK: '\x1b[1;37;40m'
};

AnsiColor.startTag4Bit = function (textCode, backgroundCode, brightnessCode) {
    let tag = AnsiColor.ESCAPE;
    if (textCode) {
        tag += textCode + ';';
    }

    if (backgroundCode) {
        tag += backgroundCode + ';';
    }

    if (brightnessCode) {
        tag += brightnessCode;
    }

    return tag + 'm';
};

AnsiColor.startTag8Bit = function (foregroundCode, backgroundCode) {
    if (foregroundCode === undefined) {
        // foregroundCode = backgroundCode % 32 < 16 ?
        //     15:
        //     0;
        foregroundCode = 15;
    }

    return AnsiColor.ESCAPE + '38;5;' + foregroundCode + 'm' +
        AnsiColor.ESCAPE + '48;5;' + backgroundCode + 'm';
};

AnsiColor.textWithColor = function (text, colorTag, balanceNeeded) {
    let output = colorTag + text;

    return balanceNeeded === false ?
        output :
        output + AnsiColor.BALANCE;
};

AnsiColor.textWith8BitColor = function (text, foregroundCode, backgroundCode) {
    const tag = AnsiColor.startTag8Bit(foregroundCode, backgroundCode);
    return AnsiColor.textWithColor(text, tag, true);
};

// 8 bit
AnsiColor.FOREGROUND_FOR_BACKGROUND = {
    0: 15,
    1: 15,
    2: 15,
    3: 15,
    4: 15,
    5: 15,
    6: 15,
    7: 0,
    8: 15,
    9: 15,
    10: 0,
    11: 0,
    12: 15,
    13: 15,
    14: 0,
    15: 0,
    16: 15,
    17: 15,
    18: 15,
    19: 15,
    20: 15,
    21: 15,
    22: 15,
    23: 15,
    24: 15,
    25: 15,
    26: 15,
    27: 15,
    28: 0,
    29: 0,
    30: 0,
    31: 0,
    32: 0,
    33: 0,
    34: 0,
    35: 0,
    36: 0,
    37: 0,
    38: 0,
    39: 0,
    40: 0,
    41: 0,
    42: 0,
    43: 0,
    44: 0,
    45: 0,
    46: 0,
    47: 0,
    48: 0,
    49: 0,
    50: 0,
    51: 0,
    52: 15,
    53: 15,
    54: 15,
    55: 15,
    56: 15,
    57: 15,
    58: 15,
    59: 15,
    60: 15,
    61: 15,
    62: 15,
    63: 15,
    64: 15,
    65: 15,
    66: 15,
    67: 15,
    68: 15,
    69: 0,
    70: 0,
    71: 0,
    72: 0,
    73: 0,
    74: 0,
    75: 0,
    76: 0,
    77: 0,
    78: 0,
    79: 0,
    80: 0,
    81: 0,
    82: 0,
    83: 0,
    84: 0,
    85: 0,
    86: 0,
    87: 0,
    88: 15,
    89: 15,
    90: 15,
    91: 15,
    92: 15,
    93: 15,
    94: 15,
    95: 15,
    96: 15,
    97: 15,
    98: 15,
    99: 15,
    100: 15,
    101: 15,
    102: 15,
    103: 15,
    104: 15,
    105: 0,
    106: 0,
    107: 0,
    108: 0,
    109: 0,
    110: 0,
    111: 0,
    112: 0,
    113: 0,
    114: 0,
    115: 0,
    116: 0,
    117: 0,
    118: 0,
    119: 0,
    120: 0,
    121: 0,
    122: 0,
    123: 0,
    124: 15,
    125: 15,
    126: 15,
    127: 15,
    128: 15,
    129: 15,
    130: 15,
    131: 15,
    132: 15,
    133: 15,
    134: 15,
    135: 15,
    136: 15,
    137: 15,
    138: 15,
    139: 0,
    140: 0,
    141: 0,
    142: 0,
    143: 0,
    144: 0,
    145: 0,
    146: 0,
    147: 0,
    148: 0,
    149: 0,
    150: 0,
    151: 0,
    152: 0,
    153: 0,
    154: 0,
    155: 0,
    156: 0,
    157: 0,
    158: 0,
    159: 0,
    160: 15,
    161: 15,
    162: 15,
    163: 15,
    164: 15,
    165: 15,
    166: 15,
    167: 15,
    168: 15,
    169: 15,
    170: 0,
    171: 0,
    172: 0,
    173: 0,
    174: 0,
    175: 0,
    176: 0,
    177: 0,
    178: 0,
    179: 0,
    180: 0,
    181: 0,
    182: 0,
    183: 0,
    184: 0,
    185: 0,
    186: 0,
    187: 0,
    188: 0,
    189: 0,
    190: 0,
    191: 0,
    192: 0,
    193: 0,
    194: 0,
    195: 0,
    196: 15,
    197: 15,
    198: 15,
    199: 15,
    200: 15,
    201: 0,
    202: 0,
    203: 0,
    204: 0,
    205: 0,
    206: 0,
    207: 0,
    208: 0,
    209: 0,
    210: 0,
    211: 0,
    212: 0,
    213: 0,
    214: 0,
    215: 0,
    216: 0,
    217: 0,
    218: 0,
    219: 0,
    220: 0,
    221: 0,
    222: 0,
    223: 0,
    224: 0,
    225: 0,
    226: 0,
    227: 0,
    228: 0,
    229: 0,
    230: 0,
    231: 0,
    232: 15,
    233: 15,
    234: 15,
    235: 15,
    236: 15,
    237: 15,
    238: 15,
    239: 15,
    240: 15,
    241: 15,
    242: 15,
    243: 15,
    244: 15,
    245: 0,
    246: 0,
    247: 0,
    248: 0,
    249: 0,
    250: 0,
    251: 0,
    252: 0,
    253: 0,
    254: 0,
    255: 0
};

// console.log(AnsiColor.manyColorTests().join('\n'));
AnsiColor.manyColorTests = function () {
    let tags = [];
    for (let bg = 0; bg < 256; bg++) {
        let blackWord = AnsiColor.textWithColor(bg + ', 0', AnsiColor.startTag8Bit(0, bg));
        let whiteWord = AnsiColor.textWithColor(bg + ',15', AnsiColor.startTag8Bit(15, bg));

        tags.push(blackWord + ' ' + whiteWord);
    }

    return tags;
};

AnsiColor.manyColorDemo = function () {
    let tags = [];
    for (let bg = 0; bg < 256; bg++) {
        let demoWord = AnsiColor.textWithColor(
            bg,
            AnsiColor.startTag8Bit(
                AnsiColor.FOREGROUND_FOR_BACKGROUND[bg],
                bg
            )
        );

        tags.push(demoWord);
    }

    console.log(tags.join('\n'));
};

AnsiColor.blackBackgroundTest = function() {
    let words = [];
    for (let fg = 0; fg < 256; fg++) {
        words.push(AnsiColor.textWith8BitColor(` ${fg} `, fg, 0));
    }

    console.log(words.join('\n'));
};

AnsiColor.blackBackgroundTest();
// AnsiColor.manyColorDemo();
