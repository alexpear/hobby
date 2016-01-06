//petri dish

//customizable variables:
final int STARTING_POP = 12;
final int GERM_WIDTH = 24;
final int GERM_HEIGHT = 36;
final float GERM_EYE = .45;
final int LEFT_WALL = 0;
final int RIGHT_WALL = 432;
final int TOP_WALL = 0;
final int BOTTOM_WALL = 432;
final int FRAMERATE = 60;
final int STARTING_TOPSPEED = 6; //quite arbitrary
final float FRICTION = .35; //out of 1.0
final float FRISKINESS = 01; //out of 100
final int SCATTER_AREA = 100;
final int SCATTER_FORCE = 1;
final int MITOSISTIME = 111;
final float MUT = .2; //a mutation rate; quite arbitrary
final int WORD_MUT = 4; //word mutation rate

int leftwall;
int rightwall;
int topwall;
int bottomwall;
int sliderscale; //later not in terms of sliderscale? clickable....
int currenttemp;
int currentpop;
boolean holding_slider;
Germ[] germarray;
char[] vowela = {
  'a','a','a','a','a','a','a','a','a','a','a','a','a',
  'a','a','a','a','a','a','a','a','e','e','e','e','e',
  'e','e','e','e','e','e','e','e','e','e','e','e','e',
  'e','e','e','e','e','e','e','e','e','e','e','e','e',
  'e','i','i','i','i','i','i','i','i','i','i','i','i',
  'i','i','i','i','i','i','o','o','o','o','o','o','o',
  'o','o','o','o','o','o','o','o','o','o','o','o','o',
  'u','u','u','u','u','u','u','y','y'  };
char[] consoa = {
  'b','b','c','c','c','c','d','d','d','d','d','d','d',
  'f','f','f','g','g','g','h','h','h','h','h','h','h',
  'h','h','h','j','k','l','l','l','l','l','l','m','m',
  'm','m','n','n','n','n','n','n','n','n','n','n','n',
  'p','p','p','q','r','r','r','r','r','r','r','r','r',
  'r','s','s','s','s','s','s','s','s','s','s','t','t',
  't','t','t','t','t','t','t','t','t','t','t','t','v',
  'w','w','w','w','x','y','y','y','z'  };

void setup() {
  size(576,432);
  smooth();
  leftwall = LEFT_WALL + GERM_WIDTH / 2;
  rightwall = RIGHT_WALL - GERM_WIDTH / 2;
  topwall = TOP_WALL + GERM_HEIGHT / 2;
  bottomwall = BOTTOM_WALL - GERM_HEIGHT / 2;
  sliderscale = (width - RIGHT_WALL) / 3;
  germarray = new Germ[48];
  for(int i=0; i<STARTING_POP; i++) {
    germarray[i] = new Germ(GERM_WIDTH, GERM_HEIGHT, GERM_EYE,
    int(random(LEFT_WALL, RIGHT_WALL)), 
    int(random(TOP_WALL, BOTTOM_WALL)), 
    int(random(0, STARTING_TOPSPEED)), 
    int(random(0, STARTING_TOPSPEED)), 
    int(random(0,256)), wordgen(int(random(7)+2)), 
    int(random(0,256)), i);
  }
  currentpop = STARTING_POP;
  currenttemp = 128;
}

void draw() {
  background(244);
  //println(germarray.length);
  for(int i=0; i<germarray.length; i++){
    if(germarray[i] != null) {
      germarray = germarray[i].update(germarray);
    }
  }
  fill(88);
  rect(RIGHT_WALL, 0, width - RIGHT_WALL, height);
  //provisional buttons:
  fill(222,0,0); //red temp up button
  rect(RIGHT_WALL, 0, width - RIGHT_WALL, height / 6);
  fill(0,0,222); //blue temp down button
  rect(RIGHT_WALL, height * 5/6, width - RIGHT_WALL, height / 6);
  fill(40); //triangles on buttons
  triangle((width+RIGHT_WALL)/2, height/24, 
  (width+3*RIGHT_WALL)/4, height/9,
  (3*width+RIGHT_WALL)/4, height/9);
  triangle((width+RIGHT_WALL)/2, height*23/24, 
  (width+3*RIGHT_WALL)/4, height*8/9,
  (3*width+RIGHT_WALL)/4, height*8/9);
  stroke(6); //line or groove for slider
  line(RIGHT_WALL + sliderscale*1.5, height/2 - 128, 
  RIGHT_WALL + sliderscale*1.5, height/2 + 128);
  stroke(1); //slider
  rect(RIGHT_WALL + sliderscale, height/2 - currenttemp + 118, sliderscale, 20);
  //println(sliderscale + " " + (mouseX - RIGHT_WALL) + " " + mouseY);
  if(holding_slider) {
    println(currenttemp);
    if(mousePressed) {
      currenttemp = height/2-mouseY+128;
      currenttemp = constrain(currenttemp,0,255);
    } 
    else {
      holding_slider = false;
    }
  }
}

char[][] wordgen(int length) {
  char[] chars = new char[length];
  char[] types = new char[length]; //couldn't be a boolean[] because 2d?
  int state = 1; //0 = vowel, 1 = 1st conso, 2 = 2nd conso
  for(int j=0; j<length; j++) {
    if(state == 0) {
      chars[j] = conso();
      types[j] = 'c';
      state = 1;
    }
    else if(state == 1) {
      if(random(2) < 1) {
        chars[j] = vowel();
        types[j] = 'v';
        state = 0;
      }
      else {
        chars[j] = conso();
        types[j] = 'c';
        state = 2;
      }
    }
    else if(state == 2) {
      chars[j] = vowel();
      types[j] = 'v';
      state = 0;
    }
  }
  char[][] word = {
    chars, types    };
  return word;
}

char vowel() {
  int roll = int(random(100));
  return vowela[roll];
}

char conso() {
  int roll = int(random(100));
  return consoa[roll];
}

int dieroll() {
  int total = 0;
  while(true) {
    if(random(12) < 6)
      total++;
    else
      total--;
    if(random(12) < 1)
      return total;
  }
}

void mousePressed() {
  //clean up these conditionals eventually. 
  //temp up button
  if(mouseX >= RIGHT_WALL && mouseY <= height / 6) {
    currenttemp += 12;
    currenttemp = constrain(currenttemp,0,255);
    println(currenttemp + " & pop is " + currentpop);
  } //temp down button
  else if(mouseX >= RIGHT_WALL && mouseY >= height * 5/6) {
    currenttemp -= 12;
    currenttemp = constrain(currenttemp,0,255);
    println(currenttemp + " & pop is " + currentpop);
  } //slider
  else if(mouseX >= RIGHT_WALL+sliderscale && 
    mouseX <= width-sliderscale && 
    mouseY >= height/2-currenttemp+118 &&
    mouseY <= height/2-currenttemp+138) {
    holding_slider = true;
  }
  //or alternately, reset:
  else if(currentpop == 0 && mouseX <= RIGHT_WALL && mouseY <= BOTTOM_WALL) {
    setup();
  }
  //scatter click
  else if(mouseX <=RIGHT_WALL && mouseY <= BOTTOM_WALL) {
    for(int i=0; i<germarray.length; i++) {
      if(germarray[i] == null) continue;
      if(abs(germarray[i].xpos - mouseX) <= SCATTER_AREA && 
        abs(germarray[i].ypos - mouseY) <= SCATTER_AREA) {
        float distfromclick = dist(mouseX, mouseY, 
        germarray[i].xpos, germarray[i].ypos);
        float tempx = (germarray[i].xpos - mouseX) * 
          (SCATTER_AREA * 1.5 - distfromclick) / (distfromclick * 15);
        float tempy = (germarray[i].ypos - mouseY) * 
          (SCATTER_AREA * 1.5 - distfromclick) / (distfromclick * 15);
        println(tempx + " " + tempy);
        germarray[i].xvel += tempx;
        germarray[i].yvel += tempy;
      }
    }
  }
  //34567812345678123456781234567812345678123456781234567812345678    
  //word debug
  else {
    for(int i=0; i<germarray.length; i++) {
      if(germarray[i] == null) continue;
      for(int j=0; j<germarray[i].word[0].length; j++) {
        print(germarray[i].word[0][j]);
      }
      println();
    }
  }
}

class Germ {
  int memb_width;
  int memb_height;
  float eye_factor;
  int pupil_diam;  //3
  int pupil_x_offset;
  int pupil_y_offset;
  int pupil_delay;
  int xpos;
  int ypos;
  int xvel;
  int yvel;
  int temp_pref;
  char[][] word; //why not just a Word (or Name) object?
  int alpha;
  int mitosistimer;
  int arrayindex;
  //vel_pref
  //r_over_k? birth-death rate

  Germ(int memb_widthin, int memb_heightin, float eye_factorin, 
  int xposin, int yposin, int xvelin, int yvelin, //int pupil_delayin
  int temp_prefin, char[][] wordin, int alphain, int indexin) {
    memb_width = int(mutate(memb_widthin));
    memb_height = int(mutate(memb_heightin));
    eye_factor = mutate(eye_factorin);
    xvel = int(mutate(xvelin));
    yvel = int(mutate(yvelin));
    temp_pref = int(mutate(temp_prefin));
    alpha = int(mutate(alphain));
    xpos = xposin + memb_widthin / 2;
    ypos = yposin;
    word = word_mutate(wordin); //mutate in some way
    arrayindex = indexin;
    pupil_diam = 3;
    pupil_delay = (int)random(FRAMERATE*0.2, FRAMERATE*2);
    randomize_pupils();
    mitosistimer = -1;
  }

  Germ[] update(Germ[] germarray) {
    //reproduction
    int m_offset = 0; 
    if(mitosistimer == 0) {
      germarray = mitosis(germarray); //passing it all the way back up - /so clumsy/!
      mitosistimer--;
      currentpop++;
    }
    else if(mitosistimer > 0) {
      m_offset = int((memb_width - 1) * (1 - float(mitosistimer) / MITOSISTIME) / 2);
      mitosistimer--;
    }
    else {
      if(random(433) < 1) //make a variable not magic number++++++++++
        mitosistimer = MITOSISTIME;
    }
    //death
    if(1 + currentpop * 3 + abs(currenttemp - temp_pref) > random(60000)) {// && mitosistimer < 0) {
      germarray = die(germarray);
      currentpop--;
    }

    //todo: avoid movement in cardinal directions. float xvel & yvel? x & y pos? 
    //movement 
    if(xpos - m_offset <= leftwall && xvel < 0) {
      //xpos = leftwall;
      xvel *= -1;
    }
    else if(xpos + m_offset >= rightwall && xvel > 0) {
      //xpos = rightwall;
      xvel *= -1;
    }
    if(ypos <= topwall) {
      ypos = topwall;
      yvel *= -1;
    }
    else if(ypos >= bottomwall) {
      ypos = bottomwall;
      yvel *= -1;
    }
    xpos += xvel;
    ypos += yvel;
    xvel += update_vel();
    yvel += update_vel();
    if(abs(xvel) > 2)
      xvel = int(xvel * (1 - FRICTION));
    if(abs(yvel) > 2)
      yvel = int(yvel * (1 - FRICTION)); 

    if(frameCount % pupil_delay == 0)
      randomize_pupils();

    //drawing:
    fill(temp_pref, 0, 255-temp_pref);
    if(m_offset == 0){
      //body
      noStroke();
      ellipse(xpos,ypos,memb_width,memb_height);
      //eye
      fill(255);
      stroke(0);
      ellipse(xpos, ypos, memb_width*eye_factor, 
      memb_height*eye_factor);
      //pupil
      fill(0);
      ellipse(xpos+pupil_x_offset, ypos+pupil_y_offset,
      pupil_diam, pupil_diam);
    }
    else{
      //body
      noStroke();
      ellipse(xpos-m_offset, ypos, memb_width, memb_height);
      //the budding
      ellipse(xpos+m_offset, ypos, memb_width, memb_height);
      //eyes
      fill(255);
      stroke(0);
      ellipse(xpos - m_offset, ypos, memb_width * eye_factor,
      memb_height * eye_factor);
      ellipse(xpos + m_offset, ypos, memb_width * eye_factor,
      memb_height * eye_factor);
      //pupil
      fill(0);
      ellipse(xpos + pupil_x_offset - m_offset, 
      ypos + pupil_y_offset, pupil_diam, pupil_diam);
      ellipse(xpos - pupil_x_offset + m_offset, 
      ypos - pupil_y_offset, pupil_diam, pupil_diam);
    }

    //debug for mitosis
    //xvel = 0;
    //yvel = 0;

    return germarray;
  }

  int update_vel() {  //remove frisk check & generalize to up_or_down()? 
    if(random(100) < FRISKINESS) {
      if(random(2) < 1) //50% chance
        return 1;
      else
        return -1;
      //println("frisky");
    }
    else 
      return 0;
    //the old way:    
    //xvel += (int)random(-1.1,1.1);
    //yvel += (int)random(-1.1,1.1);
  }

  void randomize_pupils() {
    float halfeyeW = memb_width * eye_factor / 2;
    float halfeyeH = memb_height * eye_factor / 2;
    pupil_x_offset = int(random(-1*halfeyeW+2, halfeyeW-2));
    pupil_y_offset = int(random(-1*halfeyeH+2, halfeyeH-2));
  }

  //creates a new germ i think
  //rather clumsily returns the new germarray
  Germ[] mitosis(Germ[] germarray) {
    //first check if full & array double if so.
    boolean full = true;
    for(int j=0; j<germarray.length; j++) {
      if(germarray[j] == null) {
        full = false;
        break;
      }
    }
    if(full) {
      germarray = arraydouble(germarray);
    }

    int i = germarray.length - 1; //search backwards thru array. 
    while(i >= 0){
      if(germarray[i] == null) {
        germarray[i] = new Germ(memb_width, memb_height, 
        eye_factor, xpos-1, ypos, xvel, yvel, temp_pref, word, alpha, i);
        xpos -= memb_width / 2;
        break;
      }
      i--;
    }
    if(i < 0) {
      println("error: array full");  //check if redundant ++++
    }
    //mitosistimer--;
    return germarray;
  }

  float mutate(float trait) {
    trait *= random(1 - MUT, 1 + MUT);
    return trait;
  }
  
  char[][] name_mutate(char[][] name) {
    char[] t = new char[name[0].length
    float changes = random(1, NAME_MUT);
    for(int j=0; j<changes; j++) {
      int i = int(random(word[0].length));
      float roll = random(3);
      if(roll < 1) { //add a letter
        

      }
      else if(roll < 2) { //remove a letter


      }
      else { //change a letter
        if(i > 0 && i < name[0].length-1) {
          if(name[1][i-1] == name[1][i+1]) {

      }
    }
  }

  Germ[] die(Germ[] germarray) {
    germarray[arrayindex] = null; //this will cause deletion right?++++
    return germarray;
  }

  Germ[] arraydouble(Germ[] oldarray) {
    println("arraydouble top" + oldarray.length);
    Germ[] newarray = new Germ[oldarray.length * 2];
    for(int i=0; i<oldarray.length; i++) {
      newarray[i] = oldarray[i];
    }
    println(newarray.length);
    return newarray;
  }
}


//34567812345678123456781234567812345678123456781234567812345678


/*

 maybe it should be a linked list.
 -- post-CS101 Alex
 
 ^actually, i forget all the details of this debate. it could go
 either way, but one might be better. dunno which. 
 
 todo:
 mouse interactivity -- clicking makes them scatter? 
 name display
 name mutation
 make slider clickable or at least look more like needle of a gauge than a slider
 minimum proportions? width, height, relationship between eye & body size? 
 blinking?
 -> Minor problem: wallbouncing doesn't take into account 
 individual width & height, so some germs bounce off several 
 pixels before hitting the wall. 
 */









































