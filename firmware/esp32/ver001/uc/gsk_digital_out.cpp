#include "main.h"



GSK_DIGITAL_OUT::GSK_DIGITAL_OUT (char* id, int* pins, bool initVal):GSK_IO_PROPERTIES(id, pins) {
  this->val = initVal;
  reset();
}

void GSK_DIGITAL_OUT::reset() {
  this->type = GSK_IO_TYPE_DIGITAL_OUT;
  pinMode(this->pins[0], OUTPUT_OPEN_DRAIN);
  this->loop();
}


void GSK_DIGITAL_OUT::loop() {
  digitalWrite(this->pins[0], this->val);
}

void GSK_DIGITAL_OUT::setVal(void** val) {
  this->val = ((bool*) val)[0];
}
