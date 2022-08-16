#include "gsk_counter.h"


GSK_COUNTER::GSK_COUNTER() {
  pin = -1;
}

void GSK_COUNTER::setup(int newPin) {
  if (pin >= 0) {
    detachInterrupt(pin);
  }
  pin = newPin;
  pinMode(pin, INPUT_PULLUP);
  attachInterruptArg(pin, ISR_FOR_COUNTER, this, FALLING);
  this->resetCount();
}

GSK_COUNTER::~GSK_COUNTER() {
  detachInterrupt(pin);
}


int GSK_COUNTER::getCount() {
  return count;
}

void GSK_COUNTER::resetCount() {
  count = 0;
}

void ARDUINO_ISR_ATTR GSK_COUNTER::isr() {
  this->count++;
}

void GSK_COUNTER::incrementCount() {
  count++;
}

void ARDUINO_ISR_ATTR ISR_FOR_COUNTER(void* arg) {
  GSK_COUNTER* counter = (GSK_COUNTER*)arg;
  counter->incrementCount();
}
  