#line 1 "c:\\Suresh\\git\\da\\firmware\\esp32\\ver000\\uc\\gsk_pin_assignments.h"
#ifndef GSK_PIN_ASSIGNMENTS_H
#define GSK_PIN_ASSIGNMENTS_H


#include "gsk_global.h"
#include "AiEsp32RotaryEncoder.h"




enum GSK_PIN_ASSIGNMENTS_PIN_MODE {
  GSK_PIN_TYPE_INPUT_PULLUP = 0,
  GSK_PIN_TYPE_INPUT_PULLDOWN = 1,
  GSK_PIN_TYPE_INPUT = 2,
  GSK_PIN_TYPE_OUTPUT = 3,
  GSK_PIN_TYPE_COUNTER_PULLUP = 4,
  GSK_PIN_TYPE_COUNTER_PULLDOWN = 5,
  GSK_PIN_TYPE_COUNTER = 6,
  GSK_PIN_TYPE_PWM = 7,
  GSK_PIN_TYPE_ENCODER = 8,
};


class GSK_PIN_ASSIGNMENTS {
  void *counters;
  void *encoders;
  void *pwm;
  int *availForDigitalIn, *availForAnalogIn, *availForEncoder, *availForDigitalOut, * availForAnalogOut;
  public:
  GSK_PIN_ASSIGNMENTS();
  ~GSK_PIN_ASSIGNMENTS();
  void setup();
  void loop();
  void setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode);
  void setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode, int slot);
  void setPinMode(int pin, GSK_PIN_ASSIGNMENTS_PIN_MODE mode, int frequency, int resolution);
  void setPinMode(int pinA, int pinB, GSK_PIN_ASSIGNMENTS_PIN_MODE mode);
  void isr();
};



#endif // GSK_PIN_ASSIGNMENTS_H
