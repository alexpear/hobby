//  Inspiration.java
//  
//
//  Created by Alexander Pearson on 22/01/2013.
//

import java.util.Random;
import java.util.ArrayList;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.FileReader;

import java.util.Scanner;

public class Inspiration {
	private static Scanner scan = new Scanner(System.in);
	
	private static RandomTable tasktable = new RandomTable("tasks.txt");
	private static RandomTable techtable = new RandomTable("techniques.txt");
	public static void main(String[] args) {
		System.out.print("Looking back, i suppose the biggest breakthru was when we approached " + 
						   tasktable.getString() + " with an emphasis on ... " + techtable.getString()
						   + ".\n(Enter any string to continue) ");
		while(scan.next() != null) {
			System.out.print("Looking back, i suppose the biggest breakthru was when we approached " + 
							 tasktable.getString() + " with an emphasis on ... " + techtable.getString()
							 + ".\n(Enter any string to continue) ");
		}
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



