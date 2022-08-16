#line 1 "c:\\Suresh\\git\\da\\firmware\\esp32\\ver000\\uc\\gsk_counter.h"
#ifndef GSK_COUNTER_H
#define GSK_COUNTER_H

#include "gsk_global.h"


class GSK_COUNTER {
  public:
  GSK_COUNTER();
  void setup(int pin);
  ~GSK_COUNTER();
  void loop();
  int getCount();
  void resetCount();
  void incrementCount();
  private:
  int pin;
  int count;
  void ARDUINO_ISR_ATTR isr();
};



#endif