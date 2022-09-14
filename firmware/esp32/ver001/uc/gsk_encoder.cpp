#include "main.h"


GSK_ENCODER::GSK_ENCODER (char* id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  reset();
}

void GSK_ENCODER::reset() {
  encoder = new ESP32Encoder();
  ESP32Encoder::useInternalWeakPullResistors=UP;
  encoder->attachHalfQuad(pins[0], pins[1]);
  encoder->clearCount(); 
}

void GSK_ENCODER::loop() {
  DATA_OUT[this->id] = encoder->getCount();
}

void GSK_ENCODER::setVal(void**a) {
}
