#include "main.h"



nlohmann::json DATA_OUT;
nlohmann::json DATA_IN;

int temp1 = 0;

int temp_pin0[] = {36};
int temp_pin1[] = {39};
int temp_pin2[] = {2};
int temp_pin3[] = {25};
int temp_pin4[] = {26};
int temp_pin5[] = {12, 14};
int temp_pin6[] = {27, 33};
GSK_IO_DIGITAL_IN FUN_B((char*)"sur", temp_pin0, 0);
GSK_IO_DIGITAL_IN FUN_D((char*)"a", temp_pin1, 1);
GSK_IO_DIGITAL_OUT FUN_E((char*)"d", temp_pin2, 2, false);
GSK_IO_ANALOG_IN FUN_F((char*)"e", temp_pin3, 3);
GSK_IO_PWM FUN_G((char*)"f", temp_pin4, 4, 1, 1, 1000, 8);
GSK_IO_ENCODER FUN_H((char*)"g", temp_pin5, 5);
GSK_IO_ENCODER FUN_I((char*)"h", temp_pin6, 6);

void** C;

void setup() {
  Serial.begin(115200);





  C = new void*[7];
  C[0] = &FUN_B;
  C[1] = &FUN_D;
  C[2] = &FUN_E;
  C[3] = &FUN_F;
  C[4] = &FUN_G;
  C[5] = &FUN_H;
  C[6] = &FUN_I;
}

void loop () {
  bool a[] = {temp1%2};
  float b[] = {temp1};
  ((GSK_IO_PROPERTIES*) C[0])->loop();
  ((GSK_IO_PROPERTIES*) C[1])->loop();
  ((GSK_IO_PROPERTIES*) C[2])->setVal((void**)&a);
  ((GSK_IO_PROPERTIES*) C[2])->loop();
  ((GSK_IO_PROPERTIES*) C[3])->loop();
  ((GSK_IO_PROPERTIES*) C[4])->setVal((void**)&b);
  ((GSK_IO_PROPERTIES*) C[4])->loop();
  ((GSK_IO_PROPERTIES*) C[5])->loop();
  ((GSK_IO_PROPERTIES*) C[6])->loop();
  Serial.println(DATA_OUT.dump(2).c_str());
  temp1 += 25;
  if (temp1>100) {
    temp1 = 0;
  }
  delay(1000);
}