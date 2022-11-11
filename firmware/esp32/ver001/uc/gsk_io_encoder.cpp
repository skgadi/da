#include "main.h"


GSK_IO_ENCODER::GSK_IO_ENCODER (char* id, int* pins, int key):GSK_IO_PROPERTIES(id, pins, key) {
  reset();
}

void GSK_IO_ENCODER::reset() {
  encoder = new ESP32Encoder();
  ESP32Encoder::useInternalWeakPullResistors=UP;
  encoder->attachHalfQuad(pins[0], pins[1]);
  encoder->clearCount(); 
}

void GSK_IO_ENCODER::loop() {
  DATA_OUT[this->id] = encoder->getCount();
}

void GSK_IO_ENCODER::setVal(void**a) {
}
