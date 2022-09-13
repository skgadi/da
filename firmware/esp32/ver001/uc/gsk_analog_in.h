#ifndef GSK_ANALOG_IN_H
#define GSK_ANALOG_IN_H

#include "main.h"

class GSK_ANALOG_IN:GSK_IO_PROPERTIES {
  public:
    GSK_ANALOG_IN(char*, int*);
    void reset();
    void loop();
    void setVal(void** );
};

#endif