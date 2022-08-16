#include <Arduino.h>
#include "json.hpp"




void setup() {

  Serial.begin(115200);



char str[] = R"(
    {
      "name": "Jake",
      "age": 23,
      "address": {
        "street": "St. Street",
        "code": "1234-127"
      }
    }
  )";
  
  nlohmann::json obj = nlohmann::json::parse(str);
  std::vector<std::uint8_t> cborArray = nlohmann::json::to_cbor(obj);
  
  for(uint8_t i : cborArray){ 
    Serial.printf("%02X ", i);
  }
  
  Serial.println("\n--------");
  for(uint8_t i : cborArray){ 
    Serial.printf("%d ", i);
  }






std::vector<std::uint8_t> cborArray2 = {
    163, 103, 97, 100, 100, 114, 101, 115, 115, 162, 100, 99, 
    111, 100, 101, 104, 49, 50, 51, 52, 45, 49, 50, 55, 102, 
    115, 116, 114, 101, 101, 116, 106, 83, 116, 46, 32, 83, 116, 
    114, 101, 101, 116, 99, 97, 103, 101, 23, 100, 110, 97, 109, 
    101, 100, 74, 97, 107, 101
  };
  
  nlohmann::json obj1 = nlohmann::json::from_cbor(cborArray2);
  
  std::string serializedObject1 = obj1.dump(3);
  Serial.println(serializedObject1.c_str());


}

void loop() {
  if (Serial.available()) {
    Serial.println("Hello World!");
  }
  delay(1000);
}