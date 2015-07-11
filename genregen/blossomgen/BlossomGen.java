//Blossom
//space opera genregen
//rough
//the blossoming of life among the stars
//Alex Pearson
//file created 2012 nov 28

import java.util.Random;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.FileReader;


class BlossomGen {
	
	public static Random randgen = new Random();
	private static RandomTable lettertable = new RandomTable("letter.txt");
	private static RandomTable letterdigittable = new RandomTable("letterdigit.txt");
	
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
		
	private Faction randopponent(Faction curfaction) {
		Faction opp = null;
		//we don't want opp to be curfaction
		while(opp==null || opp==curfaction) {
			opp = factions[randgen.nextInt(factions.length)];
		}
		//assert(opp != null);
		return opp;
	}
	
	private static void conflict(Faction white, Faction black) {
		System.out.printf("%s & %s have a conflict! \nBefore, \n%s: " + 
						  "scale %d tech %d \n%s: scale %d tech %d\n", 
						  white.getname(), black.getname(), 
						  white.getname(), white.getscale(), white.gettech(), 
						  black.getname(), black.getscale(), black.gettech());
						  
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
	}
	
	private static int[] mkrollarray(Faction f) {
		int[] rollarray;
		//this scale-0 special case is a provisional rule
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
	
	public static int roll() {
		return randgen.nextInt(6) + 1;
	}
	public static int roll(int diesize) {
		return randgen.nextInt(diesize) + 1;
	}
	
	//returns the random name of a faction
	public static String randfactionname() {
		return "Faction " + lettertable.getString() + letterdigittable.getString();
	}
	
	private void merge(Faction absorbed, Faction absorbing) {
		absorbing.changescale(absorbed.getscale());
		if(absorbed.gettech() > absorbing.gettech()) {
			absorbing.settech(absorbed.gettech());
		}
		//union of the two species lists
		Iterator iter = absorbed.getspeciesset().iterator();
		while(iter.hasNext()) {
			Species curspecies = (Species) iter.next();
			absorbing.getspeciesset().add(curspecies);
		}
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
				System.out.println(f.getname() + " advances to Tech level " + f.gettech());
				break;
			case 1: //scale increase
				int scaleinc = roll(3);
				f.changescale(scaleinc);
				System.out.println(f.getname() + " expands to Scale " + f.getscale());
				break;
			case 2: //new faction appears
				Faction newfaction = new Faction(f); 
				addafter(newfaction, f);
			    System.out.println(f.getname() + " has given rise to a new faction: " 
								   + newfaction.getname());
				//print faction f & newf are now x,x,x,whatever
				break;
			case 3: //conflict
				conflict(f, randopponent(f));
				break;
			case 4: //merging
				Faction g = randopponent(f);
				//which-is-dominant rules are in flux atm
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
	
	private void printstatus() {
		System.out.println();
		System.out.println("   status:");
		for(int fi=0; fi<factions.length; fi++) {
			factions[fi].printstatus();
		}
		System.out.println();
	}
	
	//runs the generator
	private void run() {
		add(new Faction());		
		int fi = 0; //faction index
		Faction curfaction = factions[fi];
		System.out.println("In the beginning there was " + factions[0].getname());
		printstatus();
		int turncount = roll(20) + roll(20);
		while (turncount > 0) {
			turn(curfaction);
			printstatus();
			
			//System.out.println("      faction 0's speciesset size is " + factions[0].getspeciesset().size());
			
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
	}
}

class Faction {
	private int scale;
	private int tech;
	private HashSet<Species> speciesset;
	private String name;
	
	//first-life constructor
	Faction() {
		scale = 0;
		tech = 0;
		name = BlossomGen.randfactionname();
		speciesset = new HashSet<Species>();
		speciesset.add(new Species());
	}
	
	//giving-rise constructor
	Faction(Faction orig) {
		this.scale = BlossomGen.randgen.nextInt(orig.getscale() + 1);
		orig.changescale(-1 * this.scale);
		this.tech = orig.gettech();
		//each species goes into one or both
		distributespecies(orig, this);
		this.name = BlossomGen.randfactionname();
	}
	
	public int getscale() { return scale; }
	public int gettech() { return tech; }
	public HashSet getspeciesset() { return speciesset; }
	public String getname() { return name; }
	
	public void setscale(int newscale) { scale = newscale; }
	public void settech(int newlevel) { tech = newlevel; }
	public void changescale(int modification) { scale += modification; }	
	public void changetech(int modification) { tech += modification; }
	
	private void distributespecies(Faction orig, Faction newfac) {
		HashSet<Species> origset = orig.speciesset;
		orig.speciesset = new HashSet<Species>();
		newfac.speciesset = new HashSet<Species>();
		if(BlossomGen.roll(6) >= 4) {//50% chance
			newfac.speciesset.add(new Species());
		}
		Iterator iter = origset.iterator();
		while(iter.hasNext()) {
			Species curspecies = (Species) iter.next();
			int rollval = BlossomGen.roll(3);
			switch(rollval) {
				case 1: orig.speciesset.add(curspecies); break;
				case 2: newfac.speciesset.add(curspecies); break;
				case 3: 
					orig.speciesset.add(curspecies);
					newfac.speciesset.add(curspecies); 
					break;
			}
		}
		//clumsy solution for now: if would be empty, instead take all
		if(orig.speciesset.size()==0) {
			orig.speciesset.addAll(origset);
		}
		if(newfac.speciesset.size()==0) {
			newfac.speciesset.addAll(origset);
		}
		//i think later i want it possible to have new faction be just a subset, 
		//with no new uploads or creations
	}
	
	public void printstatus() {
		System.out.println("   " + name + " is Scale " + scale +
					   " and Tech " + tech + " and has species-types: ");
		Iterator iter = speciesset.iterator();
		while(iter.hasNext()) {
			Species s = (Species) iter.next();
			System.out.println("      " + s.getname() + ": (Body-Type: " + s.getbodytype() +
							   ", Bodies: " + s.getbodies() + ", Minds: " + s.getminds() + ")");
		}
	}
}

//we use the term species loosely
class Species extends Object {
	private static RandomTable bodytypetable = new RandomTable("bodytype.txt");
	private static RandomTable bodiestable = new RandomTable("bodies.txt");
	private static RandomTable mindstable = new RandomTable("minds.txt");
	private static RandomTable letterdigittable = new RandomTable("letterdigit.txt");
	
	private static boolean humansfound = false;

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

	//random constructor
	Species() {
		bodytype = bodytypetable.getString();
		bodies = bodiestable.getString();
		minds = mindstable.getString();
		if(!humansfound && bodytype.equals("biological") && bodies.equals("many") && minds.equals("many")) {
			int rollval = BlossomGen.roll(6);
			switch(rollval) {
				case 1: name = "Human (from Earth)"; break;
				case 2: name = "Human (from AU Earth)"; break;
				case 3: name = "Human (from fictional homeworld)"; break;
				default: name = randspeciesname();
			}
			humansfound = true;
		} else {
			name = randspeciesname();
		}				
	}
	
	public String getname() { return name; }
	public String getbodytype() { return bodytype; }
	public String getbodies() { return bodies; }
	public String getminds() { return minds; }
	
	private static String randspeciesname() {
		return "Species Type " + letterdigittable.getString() + 
			letterdigittable.getString() + letterdigittable.getString();
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
				if(line.length() >= 3) {//rough barometer of validity
					strList.add(line);
				}
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