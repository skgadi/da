#ifndef GSK_DIGITAL_IN_H
#define GSK_DIGITAL_IN_H

#include "main.h"

class GSK_DIGITAL_IN:GSK_IO_PROPERTIES {
  public:
    GSK_DIGITAL_IN(char*, int*);
    void reset();
    void loop();
    void setVal(void** );
};


#endif