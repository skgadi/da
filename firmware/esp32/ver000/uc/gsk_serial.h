#ifndef GSK_SERIAL_H
#define GSK_SERIAL_H

#include "gsk_global.h"

#include "json.hpp"

class GSK_SERIAL {
  public:
  GSK_SERIAL();
  void setup();
  void loop();
  private:
  String command;
};

#endif // GSK_SERIAL_H