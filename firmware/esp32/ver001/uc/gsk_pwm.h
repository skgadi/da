#ifndef GSK_PWM_H
#define GSK_PWM_H

#include "main.h"


class GSK_PWM:GSK_IO_PROPERTIES {
  float val;
  int channel, freq, res;
  uint32_t maxDutyCycle;
  public:
    GSK_PWM(char*, int*, float, int, int, int); // Id, pin, initial value, channel, frequency, resolution
    void reset();
    void loop();
    void setVal(void** );
};







#endif