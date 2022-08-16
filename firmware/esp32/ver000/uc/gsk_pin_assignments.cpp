#include "gsk_pin_assignments.h"
#include "gsk_counter.h"


GSK_PIN_ASSIGNMENTS::GSK_PIN_ASSIGNMENTS() {
  setup();
}

GSK_PIN_ASSIGNMENTS::~GSK_PIN_ASSIGNMENTS() {
  // Nothing to do here.
}

void GSK_PIN_ASSIGNMENTS::setup() {

  counters = new GSK_COUNTER[MAX_ALLOWED_COUNTERS];

  int aPins[] = {2, 4, 5, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33};
  availForAnalogIn = new int[sizeof(aPins) / sizeof(int)];
  availForAnalogOut = new int[sizeof(aPins) / sizeof(int)];
  availForDigitalIn = new int[sizeof(aPins) / sizeof(int)];
  availForDigitalOut = new int[sizeof(aPins) / sizeof(int)];
  availForEncoder = new int[sizeof(aPins) / sizeof(int)];
  for (int i = 0; i < sizeof(aPins) / sizeof(aPins[0]); i++) {
    pinMode(aPins[i], INPUT_PULLUP);
    availForAnalogIn[i] = aPins[i];
    availForAnalogOut[i] = aPins[i];
    availForDigitalIn[i] = aPins[i];
    availForDigitalOut[i] = aPins[i];
    availForEncoder[i] = aPins[i];
  }
}

void GSK_PIN_ASSIGNMENTS::loop() {
  // Nothing to do here.
}

void GSK_PIN_ASSIGNMENTS::setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode) {
  switch (mode) {
    case GSK_PIN_TYPE_INPUT_PULLUP:
      pinMode(pin, INPUT_PULLUP);
      break;
    case GSK_PIN_TYPE_INPUT_PULLDOWN:
      pinMode(pin, INPUT_PULLDOWN);
      break;
    case GSK_PIN_TYPE_INPUT:
      pinMode(pin, INPUT);
      break;
    case GSK_PIN_TYPE_OUTPUT:
      pinMode(pin, OUTPUT);
      break;
    case GSK_PIN_TYPE_COUNTER_PULLUP:
      pinMode(pin, INPUT_PULLUP);
      break;
    case GSK_PIN_TYPE_COUNTER_PULLDOWN:
      pinMode(pin, INPUT_PULLDOWN);
      break;
  }
}

void GSK_PIN_ASSIGNMENTS::setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode, int slot) {
  switch (mode) {
    case GSK_PIN_TYPE_COUNTER:
      ((GSK_COUNTER*)counters)[slot].setup(pin);
      break;
  }
}

void GSK_PIN_ASSIGNMENTS::setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode, int frequency, int resolution) {
  switch (mode) {
    case GSK_PIN_TYPE_PWM:
      pinMode(pin, OUTPUT);
      //analogWriteFreq(frequency);
      //analogWriteResolution(resolution);
      break;
  }
}

void GSK_PIN_ASSIGNMENTS::setPinMode(int pinA, int pinB, GSK_PIN_ASSIGNMENTS_PIN_MODE mode) {
  switch (mode) {
    case GSK_PIN_TYPE_ENCODER:
      pinMode(pinA, INPUT);
      pinMode(pinB, INPUT);
      break;
  }
}

void GSK_PIN_ASSIGNMENTS::isr() {
  // Nothing to do here.
}


