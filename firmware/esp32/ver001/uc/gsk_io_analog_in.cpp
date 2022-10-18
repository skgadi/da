#include "main.h"


GSK_IO_ANALOG_IN::GSK_IO_ANALOG_IN (char* id, int* pins, int key):GSK_IO_PROPERTIES(id, pins, key) {
  reset();
}

void GSK_IO_ANALOG_IN::reset () {
  pinMode(this->pins[0], INPUT);
}


void GSK_IO_ANALOG_IN::loop() {
  DATA_OUT[this->id] = analogRead(this->pins[0]);
}


void GSK_IO_ANALOG_IN::setVal(void** a) {
}