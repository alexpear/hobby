//this is just for trying things out

import java.util.Random;

class Testing {
	public static Random randgen = new Random();
	
	public static int roll() {
		return randgen.nextInt(6) + 1;
	}
	public static int roll(int diesize) {
		return randgen.nextInt(diesize) + 1;
	}

	public static void main(String[] args) {
		for(int i=0; i<5; i++) {
			System.out.println((roll(100)));
//			System.out.println(" " + (roll() + roll()));
		}
	}

}