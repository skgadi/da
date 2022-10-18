#ifndef MAIN_H
#define MAIN_H


#include <Arduino.h>
#include "json.hpp"



enum GSK_COMMAND {
  GSK_READ = 0,
  GSK_WRITE = 0,
  GSK_CONTROL = 0,
};

extern nlohmann::json DATA_OUT;
extern nlohmann::json DATA_IN;

class GSK_IO_PROPERTIES {
  public:
    int *pins;
    char* id;
    int key;
    GSK_IO_PROPERTIES(char* id, int* pins, int key) {
      this->id = id;
      this->pins = pins;
      this->key = key;
    }
    virtual void reset();
    virtual void loop();
    virtual void setVal(void**);
};





#include "gsk_io_digital_in.h"
#include "gsk_io_digital_out.h"
#include "gsk_io_analog_in.h"
#include "gsk_io_pwm.h"
#include "gsk_io_encoder.h"
#include "gsk_da_interface.h"


#endif