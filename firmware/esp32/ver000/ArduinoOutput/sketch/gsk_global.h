#line 1 "c:\\Suresh\\git\\da\\firmware\\esp32\\ver000\\uc\\gsk_global.h"
#ifndef GSK_GLOBAL_H
#define GSK_GLOBAL_H


#include <Arduino.h>
using namespace std;


#define MAX_ALLOWED_COUNTERS 3
#define MAX_ALLOWED_ENCODERS 3
#define MAX_ALLOWED_PWM 3


void ARDUINO_ISR_ATTR ISR_FOR_COUNTER(void*);

#endif