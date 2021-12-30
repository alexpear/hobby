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

  public factorString () : string {
    return `${this.value} ~ ${this.factors.join(' ')}`;
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

  return factors.sort(numberComparator);
}

function numberComparator (a, b) {
  return a - b;
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
      (oldN: NumberProfile, newN: NumberProfile) =>
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
  while (series.greatestValueSoFar() <= max) {
    series.addNextMostUseful();
  }

  console.log(
    series.members.map(
      np => np.factorString()
    )
    .join('\n\n')
  );
}

// tsc math/allFactors.ts && node math/allFactors.js
testSeries();








/*
2 ~ 

4 ~ 2

6 ~ 2 3

12 ~ 2 3 4 6

24 ~ 2 3 4 6 8 12

36 ~ 2 3 4 6 9 12 18

48 ~ 2 3 4 6 8 12 16 24

60 ~ 2 3 4 5 6 10 12 15 20 30

120 ~ 2 3 4 5 6 8 10 12 15 20 24 30 40 60

180 ~ 2 3 4 5 6 9 10 12 15 18 20 30 36 45 60 90

240 ~ 2 3 4 5 6 8 10 12 15 16 20 24 30 40 48 60 80 120

360 ~ 2 3 4 5 6 8 9 10 12 15 18 20 24 30 36 40 45 60 72 90 120 180

720 ~ 2 3 4 5 6 8 9 10 12 15 16 18 20 24 30 36 40 45 48 60 72 80 90 120 144 180 240 360

840 ~ 2 3 4 5 6 7 8 10 12 14 15 20 21 24 28 30 35 40 42 56 60 70 84 105 120 140 168 210 280 420

1260 ~ 2 3 4 5 6 7 9 10 12 14 15 18 20 21 28 30 35 36 42 45 60 63 70 84 90 105 126 140 180 210 252 315 420 630

1680 ~ 2 3 4 5 6 7 8 10 12 14 15 16 20 21 24 28 30 35 40 42 48 56 60 70 80 84 105 112 120 140 168 210 240 280 336 420 560 840

2520 ~ 2 3 4 5 6 7 8 9 10 12 14 15 18 20 21 24 28 30 35 36 40 42 45 56 60 63 70 72 84 90 105 120 126 140 168 180 210 252 280 315 360 420 504 630 840 1260

5040 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 28 30 35 36 40 42 45 48 56 60 63 70 72 80 84 90 105 112 120 126 140 144 168 180 210 240 252 280 315 336 360 420 504 560 630 720 840 1008 1260 1680 2520

7560 ~ 2 3 4 5 6 7 8 9 10 12 14 15 18 20 21 24 27 28 30 35 36 40 42 45 54 56 60 63 70 72 84 90 105 108 120 126 135 140 168 180 189 210 216 252 270 280 315 360 378 420 504 540 630 756 840 945 1080 1260 1512 1890 2520 3780

10080 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 28 30 32 35 36 40 42 45 48 56 60 63 70 72 80 84 90 96 105 112 120 126 140 144 160 168 180 210 224 240 252 280 288 315 336 360 420 480 504 560 630 672 720 840 1008 1120 1260 1440 1680 2016 2520 3360 5040

15120 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 27 28 30 35 36 40 42 45 48 54 56 60 63 70 72 80 84 90 105 108 112 120 126 135 140 144 168 180 189 210 216 240 252 270 280 315 336 360 378 420 432 504 540 560 630 720 756 840 945 1008 1080 1260 1512 1680 1890 2160 2520 3024 3780 5040 7560

20160 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 28 30 32 35 36 40 42 45 48 56 60 63 64 70 72 80 84 90 96 105 112 120 126 140 144 160 168 180 192 210 224 240 252 280 288 315 320 336 360 420 448 480 504 560 576 630 672 720 840 960 1008 1120 1260 1344 1440 1680 2016 2240 2520 2880 3360 4032 5040 6720 10080

25200 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 25 28 30 35 36 40 42 45 48 50 56 60 63 70 72 75 80 84 90 100 105 112 120 126 140 144 150 168 175 180 200 210 225 240 252 280 300 315 336 350 360 400 420 450 504 525 560 600 630 700 720 840 900 1008 1050 1200 1260 1400 1575 1680 1800 2100 2520 2800 3150 3600 4200 5040 6300 8400 12600

27720 ~ 2 3 4 5 6 7 8 9 10 11 12 14 15 18 20 21 22 24 28 30 33 35 36 40 42 44 45 55 56 60 63 66 70 72 77 84 88 90 99 105 110 120 126 132 140 154 165 168 180 198 210 220 231 252 264 280 308 315 330 360 385 396 420 440 462 495 504 616 630 660 693 770 792 840 924 990 1155 1260 1320 1386 1540 1848 1980 2310 2520 2772 3080 3465 3960 4620 5544 6930 9240 13860

45360 ~ 2 3 4 5 6 7 8 9 10 12 14 15 16 18 20 21 24 27 28 30 35 36 40 42 45 48 54 56 60 63 70 72 80 81 84 90 105 108 112 120 126 135 140 144 162 168 180 189 210 216 240 252 270 280 315 324 336 360 378 405 420 432 504 540 560 567 630 648 720 756 810 840 945 1008 1080 1134 1260 1296 1512 1620 1680 1890 2160 2268 2520 2835 3024 3240 3780 4536 5040 5670 6480 7560 9072 11340 15120 22680
*/
