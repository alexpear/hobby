'use strict';

// Etha is a nickname for Bethany.
// These are the secrets we hope to discover.

function nicknames(fullName) {
    if (! fullName.length) {
        return [];
    }

    let nicknames = [];
    for (let left = 0; left < fullName.length; left++) {
        for (let rightExlusive = fullName.length; rightExlusive > left + 1; rightExlusive--) {
            nicknames.push(
                fullName[left].toUpperCase() + 
                    fullName.slice(left + 1, rightExlusive).toLowerCase()
            );
        }
    }

    return nicknames;
}

function prettyNicknames(fullName) {
    return nicknames(fullName).join('\n');
}

function printNicknames(fullName) {
    console.log(prettyNicknames(fullName));
}

// Run it.
printNicknames('Mephistopheles');
