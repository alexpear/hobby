//Blossom
//space opera genregen
//rough
//the blossoming of life among the stars
//Alex Pearson
//file created 2012 nov 28

import java.util.Random;
import java.util.ArrayList;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.FileReader;


class BlossomGen {
	
	public static Random randgen = new Random();
	private static RandomTable lettertable = new RandomTable("letter.txt");
	private static RandomTable letterdigittable = new RandomTable("letterdigit.txt");
	
	//private Set<Faction> factions;
	//private Faction firstfaction; //head of a (circular?) linked list of factions
	private Faction[] factions;
	
	//static? member?
	//computationally inefficient, creates whole new array (one larger) each time
	private void add(Faction f) {
		if(factions == null) {
			factions = new Faction[1];
			factions[0] = f;
		} else {
			Faction[] newarray = new Faction[factions.length+1];
			for(int i=0; i<factions.length; i++) {
				newarray[i] = factions[i];
			}
			newarray[newarray.length-1] = f;
			factions = newarray;
		}
	}
	
	private void addafter(Faction fnew, Faction fold) {
		assert(factions != null);
		Faction[] newarray = new Faction[factions.length+1];
		int ni = 0; //newarray index
		for(int fi=0; fi<factions.length; fi++) {
			newarray[ni] = factions[fi];
			if(factions[fi]==fold) {
				//we insert fnew after fold
				ni++;
				newarray[ni] = fnew;
			}
			ni++;
		}
		factions = newarray;
	}
	
	private void remove(Faction f) {
		assert(factions != null);
		Faction[] newarray = new Faction[factions.length-1];
		int ni = 0; //newarray index
		for(int fi=0; fi<factions.length; fi++) {
			if(factions[fi] == f) { 
				continue; 
			}
			newarray[ni] = factions[fi];
			ni++; //(note this step is skipped when f is found)
		}
		factions = newarray;
	}
	
	//deprecated? does not work if faction f has earlier been removed.
	private Faction getnext(Faction f) {
		for(int i=0; i<factions.length; i++) {
			if(factions[i]==f) {
				i++;
				i %= factions.length;
				System.out.println("getnext is returning " + i + " out of " + factions.length);
				return factions[i];
			}
		}
		return null;
	}
	
	private Faction randopponent(Faction curfaction) {
		Faction opp = null;
		//we don't want opp to be curfaction
		while(opp==null || opp==curfaction) {
			opp = factions[randgen.nextInt(factions.length)];
		}
		//assert(opp != null);
		return opp;
	}
	
	private static int[] conflict(Faction white, Faction black) {
		System.out.printf("%s & %s have a conflict! \nBefore, \n%s: " + 
						  "scale %d tech %d \n%s: scale %d tech %d\n", 
						  white.getname(), black.getname(), 
						  white.getname(), white.getscale(), white.gettech(), 
						  black.getname(), black.getscale(), black.gettech());
		
		//there's an array index out of bounds error in here somewhere
						  
		int[] wrolls = mkrollarray(white);
		int[] brolls = mkrollarray(black);
		
		//we check for scale 0 (gives penalty of -2 tech)
		int wtech = white.gettech();
		int btech = black.gettech();
		if(white.getscale()==0) {//should probably methodize but whatever
			wtech -= 2;
			if(wtech < 0) {
				wtech = 0;
			}
		}
		if(black.getscale()==0) {
			btech -= 2;
			if(btech < 0) {
				btech = 0;
			}
		}
		
		int techdiff = wtech - btech;
		if(techdiff > 0) {
			techbonus(wrolls, techdiff);
		} else if(techdiff < 0) {
			techbonus(brolls, techdiff * -1);
		}
		
		int smallerscale;
		if(wrolls.length <= brolls.length) { 
			smallerscale = wrolls.length; 
		} else { 
			smallerscale = brolls.length; 
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
		
		//conflict with scale-0 factions needs revision
		//eg, shouldn't be able to capture from them
		black.changescale(wcaptured - bcaptured - bcasualties);
		white.changescale(bcaptured - wcaptured - wcasualties);
		assert(white.getscale() >= 0 && black.getscale() >= 0);
		if(white.getscale() < 0) {
			white.setscale(0);
		}
		if(black.getscale() < 0) {
			black.setscale(0);
		}
			
		
		System.out.printf("After, \n%s: scale %d tech %d \n%s: scale %d tech %d\n", 
						  white.getname(), white.getscale(), white.gettech(),
						  black.getname(), black.getscale(), black.gettech());
		
		//debugish:
		int[] outcomes = new int[4];
		outcomes[0] = wcasualties;
		outcomes[1] = wcaptured;
		outcomes[2] = bcasualties;
		outcomes[3] = bcaptured;
		return outcomes;
	}
	
	private static int[] mkrollarray(Faction f) {
		int[] rollarray;
		//this scale-0 special case is untested
		if(f.getscale()==0) {
			rollarray = new int[1];
		} else {
			rollarray = new int[f.getscale()];
		}
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
	
	/*
	//wait no i changed my mind about this. i'll check for 0scale elsewhere
	//first we need to check for scale 0 case (gives tech penalty of 2)
	private static void techbonus(int[] rolls, int techdiff, Faction f) {
		assert(techdiff > 0);
		if(f.getscale()==0) {
			techdiff -= 2; //this penalty is untested
			if(techdiff > 0) {
				givetechbonus(rolls, techdiff);
			}
		} else {
			givetechbonus(rolls, techdiff); //normal case
		}
	 */
		
	private static void techbonus(int[] rolls, int techdiff) {
		assert(techdiff > 0);
		int rollindex = 0;
		for(int tcount=0; tcount<techdiff; tcount++) {
			rolls[rollindex]++;
			rollindex++;
			rollindex %= rolls.length;
		}
	}
	
	private static void printarray(int[] array) {
		for(int i=0; i<array.length; i++) {
			System.out.printf("%3d ", array[i]);
		}
		System.out.println();
	}
	private static double avgarray(int[] array) {
		double total = 0;
		for(int i=0; i<array.length; i++) {
			total += array[i];
		}
		return total / (double) array.length;
	}
	
	private static int roll() {
		return randgen.nextInt(6) + 1;
	}
	private static int roll(int diesize) {
		return randgen.nextInt(diesize) + 1;
	}
	
	//returns the random name of a faction
	public static String randname() {
		return "Faction " + lettertable.getString() + letterdigittable.getString();
	}
	
	private void merge(Faction absorbed, Faction absorbing) {
		absorbing.changescale(absorbed.getscale());
		if(absorbed.gettech() > absorbing.gettech()) {
			absorbing.settech(absorbed.gettech());
		}
		//union of the two species lists
		remove(absorbed);
	}
	
	//a debug function
	private void printfactions() {
		for(int i=0; i<factions.length; i++) {
			System.out.println("factions[" + i + "] is " + factions[i].getname());
		}
		System.out.println("--end of printfactions");
	}
	
	private void turn(Faction f) {
		assert(f != null);
		//debug
		/*if(f==null) {
			System.out.println("--top of turn, f is null");
			printfactions();
		}*/
		
		int action;
		if(factions.length==1) {
			action = randgen.nextInt(3);
		} else {
			action = randgen.nextInt(5);
		}
		switch(action) {
			case 0: //tech increase
				int techinc = roll(2);
				f.changetech(techinc);
				System.out.println(f.getname() + " has advanced to Tech " + f.gettech());
				break;
			case 1: //scale increase
				int scaleinc = roll(3);
				f.changescale(scaleinc);
				System.out.println(f.getname() + " has expanded to Scale " + f.getscale());
				break;
			case 2: //new faction appears
				//the scale points are split randomly between the two factions
				//int newscale = randgen.nextInt(f.getscale() + 1);
				String newname = randname();
				//make sure name is unique: ...
				/*boolean provenunique = false;
				while(!provenunique) {
					boolean duplicatefound = false;
					Iterator iter = factions.iterator();
					while(iter.hasNext() && !duplicatefound) {
						if(iter.next().getname().equals(newname)) { 
							duplicatefound = true;
							break;
						}
					provenunique = true;
				    //...
				}*/				
				/*while(factions.contains(newname)) {
					newname = randname();
				}*/
				//i can finalize how to methodize everything later
				Faction newfaction = new Faction(newname, f); 
				addafter(newfaction, f);
			    System.out.println(f.getname() + 
								   " has given rise to a new faction: " + newfaction.getname());
				//print faction f & newf are now x,x,x,whatever
				break;
			case 3: //conflict
				conflict(f, randopponent(f));
				break;
			case 4: //merging
				Faction g = randopponent(f);
				//which is dominant rules are in flux atm
				if(f.getscale() > g.getscale()) {
					merge(g,f);
					System.out.println(f.getname() + " absorbs " + g.getname());
				} else {
					merge(f,g);
					System.out.println(f.getname() + " merges into " + g.getname());
				}
				//print new status of combo
				break;
		}
	}
	
	//runs the generator
	private void run() {
		add(new Faction());		
		int fi = 0; //faction index
		Faction curfaction = factions[fi];
		System.out.println("In the beginning there was " + factions[0].getname());
		int turncount = roll(20) + roll(20);
		while (turncount > 0) {
			turn(curfaction);
			//it's possible curfaction has just been removed from factions:
			//a check in case was removed from last position in array:
			if(fi >= factions.length) {
				fi %= factions.length;
			}
			//if curfaction was indeed removed:
			if(factions[fi] != curfaction) {
				curfaction = factions[fi];
			} else {
				fi++; 
				fi %= factions.length;
				curfaction = factions[fi];
			}
			turncount--;
		}
		//then report the setting in detail at time of freeze. 		
	}		
	
	
	public static void main(String[] args) {
		BlossomGen firsttest = new BlossomGen();
		firsttest.run();
		
				
		//debug loop
		/*int repeats = 400000;
		int[] wcasarray = new int[repeats];
		int[] wcaparray = new int[repeats];
		int[] bcasarray = new int[repeats];
		int[] bcaparray = new int[repeats];
		for(int i=0; i<repeats; i++) {*/
		
		//factions = new Faction[1];		  
					  
		//int[] outcomes = conflict(humans, aliens);
				
		/*	wcasarray[i] = outcomes[0];
			wcaparray[i] = outcomes[1];
			bcasarray[i] = outcomes[2];
			bcaparray[i] = outcomes[3];
		//printf("humans' scale is now %d and aliens' scale is now %d\n", 
		//	   humans.getscale(), aliens.getscale());
		}
		System.out.println("         human casualties: ");
		//printarray(wcasarray);
		System.out.println("    avg: " + avgarray(wcasarray));
		
		System.out.println("human battalions captured: ");
		//printarray(wcaparray);
		System.out.println("    avg: " + avgarray(wcaparray));
		
		System.out.println("         alien casualties: ");
		//printarray(bcasarray);
		System.out.println("    avg: " + avgarray(bcasarray));
		
		System.out.println("alien battalions captured: ");
		//printarray(bcaparray);		
		System.out.println("    avg: " + avgarray(bcaparray));
		
		System.out.println("  human total delta-scale: ");
		int[] hdelta = new int[repeats];
		for(int j=0; j<repeats; j++) {
			hdelta[j] = bcaparray[j] - wcaparray[j] - wcasarray[j];
		}
		//printarray(hdelta);
		System.out.println("    avg: " + avgarray(hdelta));

		System.out.println("  alien total delta-scale: ");
		int[] adelta = new int[repeats];
		for(int j=0; j<repeats; j++) {
			adelta[j] = wcaparray[j] - bcaparray[j] - bcasarray[j];
		}
		//printarray(adelta);
		System.out.println("    avg: " + avgarray(adelta));*/
	}
}





class Faction {
	private int scale;
	private int tech;
	//private Species specieslist;
	private String name;
	private Faction next; //next in turn order
	//factions that don't take turns (none under current rules) will be skipped
	
	//first-life constructor
	Faction() {
		scale = 0;
		tech = 0;
		name = BlossomGen.randname();
		//1 random species
	}
	
	//debug constructor
	Faction(String namein) {
		scale = 3;
		tech = 2;
		name = namein;		
	}
	
	//giving-rise constructor
	Faction(String namein, Faction orig) {
		this.scale = BlossomGen.randgen.nextInt(orig.getscale() + 1);
		orig.changescale(-1 * this.scale);
		this.tech = orig.gettech();
		//each species goes into one or both
		this.name = namein; //deep copy problems?
	}
	
	public int getscale() { return scale; }
	public int gettech() { return tech; }
	//public Species getspecieslist() { }
	public String getname() { return name; }
	
	public void setscale(int newscale) { scale = newscale; }
	public void settech(int newlevel) { tech = newlevel; }
	public void changescale(int modification) { scale += modification; }	
	public void changetech(int modification) { tech += modification; }
}

//we use the term species loosely
class Species {
	private String name;
	
	private static RandomTable bodytypetable = new RandomTable("bodytype.txt");
	private static RandomTable bodiestable = new RandomTable("bodies.txt");
	private static RandomTable mindstable = new RandomTable("minds.txt");
	
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

	//random constructor
	Species() {
		bodytype = bodytypetable.getString();
		bodies = bodiestable.getString();
		minds = mindstable.getString();
	}
	//custom constructor
	Species(String bodytypein, String bodiesin, String mindsin) {
		bodytype = bodytypein;
		bodies = bodiesin;
		minds = mindsin;
	}
	
}

class RandomTable {
	private static Random rand = new Random();
	
	private String[] strings;
	private double[] weights;
	private double[] summedWeights;
	
	public RandomTable(String filepath) {
		String[] stringsWithWeights = readFile(filepath);
		strings = new String[stringsWithWeights.length];
		weights = new double[stringsWithWeights.length];
		summedWeights = new double[stringsWithWeights.length];
		for(int i=0; i<stringsWithWeights.length; i++) {
			String[] words = stringsWithWeights[i].split(" ");
			weights[i] = Double.parseDouble(words[0]); //we collect the weight value
			if(i==0) { summedWeights[0] = weights[0]; }
			else     { summedWeights[i] = summedWeights[i-1] + weights[i]; }
			
			String stringNotWeight = words[1];
			for(int j=2; j<words.length; j++) {
				stringNotWeight = stringNotWeight + " " + words[j];
			}
			strings[i] = stringNotWeight; //we collect the string
		}
	}
	
	public String getString() {
		double roll = rand.nextDouble() * summedWeights[summedWeights.length-1];
		for(int strIndex=0; strIndex<strings.length; strIndex++) {
			if(roll <= summedWeights[strIndex]) {
				return strings[strIndex];
			}			
		}
		return "<getString() didn't return any normal string>";
	}
	
	private String[] readFile(String filename) {//throws IOException {
		try {
			BufferedReader reader = new BufferedReader(new FileReader(filename));
			String line = null;
			ArrayList<String> strList = new ArrayList<String>();
			while( (line = reader.readLine()) != null) {
				strList.add(line);
			}
			reader.close();
			return strList.toArray(new String[strList.size()]);
		} catch(IOException e) {
			System.err.println("IOException!");
			String[] mysteriousOutput = {"zalgooo","he comesssss"};
			return mysteriousOutput;
		}
	}
}

/*
 how to do random tables? like rolling for species bodytype, 
 say odds are 1 to 2 to 2. store these odds in a centralized 
 location? a file, or part of this file? like the random table 
 class for fantasy snippet? 
 can decide later. 
 
 
 */