#ifndef MAIN_H
#define MAIN_H


#include <Arduino.h>
#include "json.hpp"



enum GSK_COMMAND {
  GSK_READ = 0,
  GSK_WRITE = 0,
  GSK_CONTROL = 0,
};

enum GSK_IO_TYPE {
  GSK_IO_TYPE_DIGITAL_IN,
  GSK_IO_TYPE_DIGITAL_OUT,
  GSK_IO_TYPE_ANALOG_IN,  //ADC
  GSK_IO_TYPE_ANALOG_OUT, //PWM
  GSK_IO_TYPE_COUNTER,
  GSK_IO_TYPE_ENCODER
};

extern nlohmann::json DATA_OUT;
extern nlohmann::json DATA_IN;

class GSK_IO_PROPERTIES {
  public:
    GSK_IO_TYPE type;
    int *pins;
    char* id;
    GSK_IO_PROPERTIES(char* id, int* pins) {
      this->id = id;
      this->pins = pins;
    }
    virtual void reset();
    virtual void loop();
    virtual void setVal(void**);
};





#include "gsk_digital_in.h"
#include "gsk_digital_out.h"
#include "gsk_analog_in.h"
#include "gsk_pwm.h"
#include "gsk_encoder.h"


#endif