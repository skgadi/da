#include "main.h"



GSK_PWM::GSK_PWM (char* id, int* pins, float initVal, int channel, int freq, int res):GSK_IO_PROPERTIES(id, pins) {
  this->val = initVal;
  this->channel = channel;
  this->freq = freq;
  this->res = res;
  this->maxDutyCycle = (int)(pow(2, res) - 1);
  Serial.print("maxDutyCycle");
  Serial.println(maxDutyCycle);
  reset();
}


void GSK_PWM::reset() {
  pinMode(this->pins[0], OUTPUT);
  ledcSetup(channel, freq, res);
  ledcAttachPin(pins[0], channel);
  this->loop();
}


void GSK_PWM::loop() {
  ledcWrite(channel, (uint32_t)((maxDutyCycle/100.0)*val));
}

void GSK_PWM::setVal(void** val) {
  this->val = ((float*) val)[0];
}
