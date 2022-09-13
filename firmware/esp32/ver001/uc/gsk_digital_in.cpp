#include "main.h"


GSK_DIGITAL_IN::GSK_DIGITAL_IN (char* id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  reset();
}

void GSK_DIGITAL_IN::reset() {
  this->type = GSK_IO_TYPE_DIGITAL_IN;
  pinMode(this->pins[0], INPUT_PULLUP);
  this->loop();
}

void GSK_DIGITAL_IN::loop() {
  DATA_OUT[this->id] = 0x01 && digitalRead(this->pins[0]);
}


void GSK_DIGITAL_IN::setVal(void** a) {
}