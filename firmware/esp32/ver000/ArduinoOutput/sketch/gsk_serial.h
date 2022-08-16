#line 1 "c:\\Suresh\\git\\da\\firmware\\esp32\\ver000\\uc\\gsk_serial.h"
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