#ifndef MAIN_H
#define MAIN_H






enum GSK_COMMAND {
  GSK_READ = 0,
  GSK_WRITE = 0,
  GSK_CONTROL = 0,
};

enum GSK_IO_TYPE {
  GSK_DIGITAL_IN,
  GSK_DIGITAL_OUT,
  GSK_ANALOG_IN,  //ADC
  GSK_ANALOG_OUT, //PWM
  GSK_COUNTER,
  GSK_ENCODER
};

class GSK_IO_PROPERTIES {
  GSK_IO_TYPE type;
  int *pins;
  void *value;
  public:
    virtual void setup();
    virtual void reset();
    virtual void loop();
};





#include "gsk_digital_in.h"


#endif