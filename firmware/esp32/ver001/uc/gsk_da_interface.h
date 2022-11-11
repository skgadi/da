#ifndef GSK_DA_INTERFACE_H
#define GSK_DA_INTERFACE_H

#include "main.h"

class GSK_DA_INTERFACE {
  void** ioConfig;
  void setVal(int , void** );
  void reset();
  public:
    GSK_DA_INTERFACE();
    void loopComm(nlohmann::json);
    void loopProcess();
};



#endif