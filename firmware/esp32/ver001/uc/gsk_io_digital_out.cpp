#include "main.h"



GSK_IO_DIGITAL_OUT::GSK_IO_DIGITAL_OUT (char* id, int* pins, int key, bool initVal):GSK_IO_PROPERTIES(id, pins, key) {
  this->val = initVal;
  reset();
}

void GSK_IO_DIGITAL_OUT::reset() {
  pinMode(this->pins[0], OUTPUT_OPEN_DRAIN);
  this->loop();
}


void GSK_IO_DIGITAL_OUT::loop() {
  digitalWrite(this->pins[0], this->val);
}

void GSK_IO_DIGITAL_OUT::setVal(void** val) {
  this->val = ((bool*) val)[0];
}
