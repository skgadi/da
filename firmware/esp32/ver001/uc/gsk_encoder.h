#ifndef GSK_ENCODER_H
#define GSK_ENCODER_H

#include "main.h"
#include <ESP32Encoder.h>

class GSK_ENCODER:GSK_IO_PROPERTIES {
  public:
    ESP32Encoder* encoder;
    GSK_ENCODER(char*, int*);
    void reset();
    void loop();
    void setVal(void** );
};


#endif