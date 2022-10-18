#ifndef GSK_IO_DIGITAL_IN_H
#define GSK_IO_DIGITAL_IN_H

#include "main.h"

class GSK_IO_DIGITAL_IN:GSK_IO_PROPERTIES {
  public:
    GSK_IO_DIGITAL_IN(char*, int*, int);
    void reset();
    void loop();
    void setVal(void** );
};


#endif