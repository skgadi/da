#include "main.h"


GSK_IO_DIGITAL_IN::GSK_IO_DIGITAL_IN (char* id, int* pins, int key):GSK_IO_PROPERTIES(id, pins, key) {
  reset();
}

void GSK_IO_DIGITAL_IN::reset() {
  pinMode(this->pins[0], INPUT_PULLUP);
  this->loop();
}

void GSK_IO_DIGITAL_IN::loop() {
  DATA_OUT[this->id] = 0x01 && digitalRead(this->pins[0]);
}


void GSK_IO_DIGITAL_IN::setVal(void** a) {
}