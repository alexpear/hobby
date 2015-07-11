//Blossom
//space opera genregen
//rough
//the blossoming of life among the stars
//Alex Pearson
//file created 2012 nov 28

import java.util.Random;

class BlossomGen {
	
	private static Random randgen = new Random();
	
	private static void conflict(Faction white, Faction black) {
		System.out.printf("%s & %s have a conflict! \nBefore, \n%s: 
						  scale %d tech %d \n%s: scale %d tech %d\n", 
						  white.getname(), black.getname(), 
						  white.getname(), white.getscale(), white.gettech(), 
						  black.getname(), black.getscale(), black.gettech());
						  
		int[] wrolls = mkrollarray(white);
		int[] brolls = mkrollarray(black);
		
		int techdiff = white.gettechs() - black.gettechs();
		if(techdiff > 0) {
			techbonus(wrolls, techdiff);
		} else if(techdiff < 0) {
			techbonus(brolls, techdiff * -1);
		}
		
//3456781234567812345678123456781234567812345678123456781234567812345678
		int smallerscale;
		if(wrolls.length() <= brolls.length()) { 
			smallerscale = wrolls.length(); 
		}
		else { 
			smallerscale = brolls.length(); 
		}
		int wcasualties = 0;
		int wcaptured = 0;
		int bcasualties = 0;
		int bcaptured = 0;
		for(int i=0; i<smallerscale; i++) {
			//0-1 is tie, 2 is casualties, 3+ is captured
			int rolldiff = wrolls[i] - brolls[i];
			if(rolldiff >= 3) {
				bcaptured++;
			} else if(rolldiff==2) {
				bcasualties++;
			} else if(rolldiff==-2) {
				wcasualties++;
			} else if(rolldiff <= -3) {
				wcaptured++;
			}
		}
		
		black.changescale(wcaptured - bcaptured - bcasualties);
		white.changescale(bcaptured - wcaptured - wcasualties);
		assert(white.getscale() >= 0 && black.getscale() >= 0);
		
		System.out.printf("After, \n%s: scale %d tech %d \n%s: scale %d tech %d\n", 
						  white.getname(), white.getscale(), white.gettech(), 
						  black.getname(), black.getscale(), black.gettech());					  
	}
	
	private static int[] mkrollarray(Faction f) {
		int[] rollarray = new int[f.getscale()];
		for(int i=0; i<rollarray.length; i++) {
			rollarray[i] = roll();
		}
		return sort(rollarray);
	}
	
	//doesn't deep copy
	private static int[] sort(int[] array) {
		assert(array != null);
		if(array.length==1) { return array; }
		//bubblesort because im lazy and not in a hurry
		boolean done = false;
		while(!done) {
			done = true;
			for(int i=1; i<array.length; i++) {
				if(array[i-1] < array[i]) {
					int temp = array[i-1];
					array[i-1] = array[i];
					array[i] = temp;
					done = false;
				}
			}
		}
		return array;
	}
	
	private static void techbonus(int[] rolls, int techdiff) {
		int rollindex = 0;
		for(int tcount=0; tcount<techdiff; tcount++) {
			rolls[rollindex]++;
			rollindex++;
		}
	}
	
	private static void printarray(int[] array) {
		for(int i=0; i<array.length; i++) {
			System.out.printf("%d ", array[i]);
		}
		System.out.println();
	}
	
	private static int roll() {
		return randgen.nextInt(6) + 1;
	}
	private static int roll(int diesize) {
		return randgen.nextInt(diesize) + 1;
	}
	
	public static void main(String[] args) {
		Faction humans = new Faction();
		Faction aliens = new Faction();
		conflict(humans, aliens);
		printf("humans' scale is now %d and aliens' scale is now %d\n", 
			   humans.getscale(), aliens.getscale());

	}
}





class Faction {
	private int scale;
	private int tech;
	//private Species specieslist;
	
	Faction() {
		scale = 3;
		tech = 2;
		
	}
	
	public int getscale() { return scale; }
	public int gettech() { return tech; }
	//public Species getspecieslist() { }
	
	public void changescale(int modification) {
		scale += modification;
	}
	
}

//we use the term species loosely
class Species {
	private String name;
	
	private String bodytype;
    //"biological" 2
    //"machine"    2
    //"other"      1
	private String bodies;
    //"one"        1
    //"several"    1
    //"many"       2
	private String minds;
    //"one"        1
    //"several"    1
    //"many"       2
	
	Species() {
		//random constructor
	}
	Species(String bodytypein, String bodiesin, String mindsin) {
		bodytype = bodytypein;
		bodies = bodiesin;
		minds = mindsin;
	}
	
}









/*
 how to do random tables? like rolling for species bodytype, 
 say odds are 1 to 2 to 2. store these odds in a centralized 
 location? a file, or part of this file? like the random table 
 class for fantasy snippet? 
 can decide later. 
 
 
 */