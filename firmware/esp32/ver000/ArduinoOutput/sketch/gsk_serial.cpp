#line 1 "c:\\Suresh\\git\\da\\firmware\\esp32\\ver000\\uc\\gsk_serial.cpp"

#include "gsk_serial.h"

GSK_SERIAL::GSK_SERIAL() {
  setup();
}

void GSK_SERIAL::setup() {
  Serial.begin(115200);
}

void GSK_SERIAL::loop() {
  if (Serial.available()) {
    
    Serial.println("Hello World!");
  }
  delay(1000);
}