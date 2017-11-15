/*
 * What is the best base?
 * You want to be able to divide it by a lot of factors.
 * Base 12 is better than Base 7.
 * But Base 7 is better than Base 49,
 * because you dont want to memorize a huge alphabet.
 */

class NumberProfile {
  public readonly value: number;
  public readonly factors: number[];

  public efficiency () : number {
    return this.factors.length / this.value;
  }

  constructor (valIn: number = 2) {
    this.value = valIn;
    this.factors = allFactors(this.value);
  }

  // Returns the proportion of integers in the range [1, threshold] that are multiples of this.value
  public coverageUpTo (threshold: number) : number {
    let coverage = 0;
    for(let small = 2; small <= threshold && small <= this.value / 2; small++) {
      if (this.value / small % 1 === 0) {
        coverage++;
      }
    }

    return coverage / threshold;
  }

  public successor () : NumberProfile {
    return new NumberProfile(this.value + 1);
  }
}

function allFactors (n: number) : number[] {
  // Can revist sqrt if this is too unperformant.
  let factors = [];
  const root = Math.sqrt(n);
  for (let i = 2; i <= root; i++) {
    const quotient = n / i;
    if (quotient % 1 === 0) {
      factors.push(i);
      if (i != root) {
        factors.push(quotient);
      }
    }
  }

  return factors.sort();
}

class GreatSeries {
  // Keep this sorted.
  public members: NumberProfile[];

  public greatestSoFar () : NumberProfile {
    return this.members[this.members.length - 1];
  }

  public greatestValueSoFar () : number {
    return this.greatestSoFar().value;
  }

  constructor (firstProfile: NumberProfile) {
    this.members = [firstProfile];
  }

  public addNextMostUseful () : void {
    this.addNext(
      (oldN:NumberProfile, newN:NumberProfile) =>
        oldN.factors.length < newN.factors.length
    );
  }

  // This takes a criterion function to support queries like 'most efficient odd-numbered bases', etc.
  public addNext (criterion: (n:NumberProfile, m:NumberProfile) => boolean) : void {
    let candidate = this.greatestSoFar();
    do {
      candidate = candidate.successor();
    }
    while (!criterion(this.greatestSoFar(), candidate));

    this.members.push(candidate);
  }
}

function testSeries (max: number = 30030) : void {
    let series = new GreatSeries(new NumberProfile(2));
    // while (series.greatestValueSoFar() <= max) {

    // }
}
