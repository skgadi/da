#include "main.h"


GSK_ANALOG_IN::GSK_ANALOG_IN (char* id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  reset();
}

void GSK_ANALOG_IN::reset () {
  pinMode(this->pins[0], INPUT);
}


void GSK_ANALOG_IN::loop() {
  DATA_OUT[this->id] = analogRead(this->pins[0]);
}


void GSK_ANALOG_IN::setVal(void** a) {
}