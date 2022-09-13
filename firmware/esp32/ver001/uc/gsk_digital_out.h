#ifndef GSK_DIGITAL_OUT_H
#define GSK_DIGITAL_OUT_H

#include "main.h"


class GSK_DIGITAL_OUT:GSK_IO_PROPERTIES {
  bool val;
  public:
    GSK_DIGITAL_OUT(char*, int*, bool); // Id, pin, initial value
    void reset();
    void loop();
    void setVal(void** );
};







#endif