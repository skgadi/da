#include "main.h"


GSK_DA_INTERFACE::GSK_DA_INTERFACE() {
  reset();
}

void GSK_DA_INTERFACE::reset() {
  ioConfig = NULL;
}


/*
  *  This function is called by the main loop to process the data
  *  from the JSON object.
  * The JSON object's type determines how data is processed.
  * type = 0:  resets and configures the IO
  * type = 1:  resets the IO
  * type = 2:  read and write data to the IO
  * 
  * The JSON object's config gives instructions to prepare ioConfig. `config` is a JSON object.
  * Which changes with the type of IO.
  * 
  * for GSK_IO_TYPE_DIGITAL_IN:
  *  config = {
  *  "type": 0,
  *   "id": "id",
  *  "pins": [pin],
  * "key": key
  * }
  * 
  * for GSK_IO_TYPE_DIGITAL_OUT:
  * config = {
  * "type": 1,
  *  "id": "id",
  * "pins": [pin],
  * "key": key,
  * "initVal": initVal
  * }
  * 
  * for GSK_IO_TYPE_ANALOG_IN:
  * config = {
  * "type": 2,
  * "id": "id",
  * "pins": [pin],
  * "key": key
  * }
  * 
  * for GSK_IO
  * 
  * 
  * 
  * for GSK_IO_TYPE_ENCODER:
  * config = {
  * "type": 3,
  * "id": "id",
  * "pins": [pinA, pinB],
  * "key": key
  * }
  * 
  * for GSK_IO_TYPE_SERVO:
  * config = {
  * "type": 4,
  * 
  * 
  * 
  * 
  */

void GSK_DA_INTERFACE::loopComm(nlohmann::json json) {
  int type = json["type"];
  switch (type) {
    case 0:
      reset();

      break;
    case 1:
      break;
    case 2:
      break;
  }


}