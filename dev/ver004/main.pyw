# Python program to illustrate the concept
# of threading
from socket import timeout
import threading
import os
import time
#pip install pystray
import pystray
from PIL import Image
from pystray import Icon as icon, Menu as menu, MenuItem as item
import sys
import webbrowser

#pip install websocket-server
from websocket_server import WebsocketServer
#pip install pyserial
import serial
import serial.tools.list_ports
import logging

import json

#pip install PyVISA
import pyvisa as visa

#pip install win10toast
from win10toast import ToastNotifier


#pip install cbor2
from cbor2 import dumps, loads

global channelsOpenend
global multipleSerialError
multipleSerialError = 0
channelsOpenend = {"serial": {}, "visa": {}}


'''
onMessageSerialTasks
'''

def onMessageSerialTaskList(command):
  response = []
  ports = serial.tools.list_ports.comports()
  for port, desc, hwid in sorted(ports):
    item = {}
    item["port"] = port
    item["description"] = desc
    item["hwid"] = hwid
    response.append(item)
  command['response'] =  response

def onMessageSerialTaskOpen(command):
  global channelsOpenend
  tOut = 0.05;
  if "tOut" in command:
    if command['tOut']>0:
      tOut=command['tOut'];
  onMessageSerialTaskCloseIfOpen(command)
  channelsOpenend["serial"][command['port']] = serial.Serial(command['port'], command['baud'], bytesize=8, timeout=tOut, stopbits=serial.STOPBITS_ONE)
  command['response'] = "OK"
  global multipleSerialError
  multipleSerialError = 0

def onMessageSerialTaskCloseIfOpen(command):
  global channelsOpenend
  if command["port"] in channelsOpenend["serial"]:
    portToRemove = channelsOpenend["serial"].pop(command["port"])
    print(channelsOpenend["serial"])
    portToRemove.close()
  command['response'] = "OK"
  global multipleSerialError
  multipleSerialError = 0


def onMessageSerialTaskWrite(command):
  global channelsOpenend
  if not (command["port"] in channelsOpenend["serial"]):
    onMessageSerialTaskOpen(command)
  command['data'] = str(command['data']).replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t").replace("\\b", "\b").replace("\\f", "\f").replace("\\v", "\v").replace("\\'", "\'")
  channelsOpenend["serial"][command["port"]].write(command["data"].encode("Ascii"))
  command['response'] = "OK"
  global multipleSerialError
  multipleSerialError = 0

def onMessageSerialTaskRead(command):
  global channelsOpenend
  if not (command["port"] in channelsOpenend["serial"]):
    onMessageSerialTaskOpen(command)
  command['response'] = channelsOpenend["serial"][command["port"]].read(channelsOpenend["serial"][command["port"]].inWaiting()).decode("Ascii")
  global multipleSerialError
  multipleSerialError = 0

def onMessageSerialTaskSRCbor(command):
  global channelsOpenend
  if not (command["port"] in channelsOpenend["serial"]):
    onMessageSerialTaskOpen(command)
  channelsOpenend["serial"][command["port"]].reset_input_buffer()
  channelsOpenend["serial"][command["port"]].write(dumps(command["data"]))
  recInfo = channelsOpenend["serial"][command["port"]].readline()
  #print(recInfo);
  command['response'] = loads(recInfo)
  global multipleSerialError
  multipleSerialError = 0

def onMessageSerialTaskSR(command):
  global channelsOpenend
  if not (command["port"] in channelsOpenend["serial"]):
    onMessageSerialTaskOpen(command)
  channelsOpenend["serial"][command["port"]].reset_input_buffer()
  #Send data
  command['data'] = str(command['data']).replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t").replace("\\b", "\b").replace("\\f", "\f").replace("\\v", "\v").replace("\\'", "\'")
  channelsOpenend["serial"][command["port"]].write(command["data"].encode("Ascii"))
  #Receive data
  recInfo = channelsOpenend["serial"][command["port"]].readline().decode("Ascii")
  print(recInfo)
  command['response'] = recInfo
  global multipleSerialError
  multipleSerialError = 0





'''
onMessageVisaTasks
'''
def onMessageVisaTaskList(command):
  response = []
  try:
    rm = visa.ResourceManager()
    resources = rm.list_resources()
    for resource in resources:
      item = {}
      item["resource"] = resource
      response.append(item)
  except Exception as e:
    print(e)
  command['response'] =  response

def onMessageVisaTaskOpen(command):
  global channelsOpenend
  onMessageVisaTaskCloseIfOpen(command)
  rm = visa.ResourceManager()
  channelsOpenend["visa"][command['resource']] = rm.open_resource(command['resource'])
  command['response'] = "OK"

def onMessageVisaTaskCloseIfOpen(command):
  global channelsOpenend
  if command["resource"] in channelsOpenend["visa"]:
    channelsOpenend["visa"][command["resource"]].close()
    channelsOpenend["visa"].pop(command["resource"])
  command['response'] = "OK"

def onMessageVisaTaskWrite(command):
  global channelsOpenend
  if not (command["resource"] in channelsOpenend["visa"]):
    onMessageVisaTaskOpen(command)

  command['data'] = str(command['data']).replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t").replace("\\b", "\b").replace("\\f", "\f").replace("\\v", "\v").replace("\\'", "\'")
  channelsOpenend["visa"][command["resource"]].write(command["data"])
  command['response'] = "OK"

def onMessageVisaTaskRead(command):
  global channelsOpenend
  if not (command["resource"] in channelsOpenend["visa"]):
    onMessageVisaTaskOpen(command)
  command['response'] = channelsOpenend["visa"][command["resource"]].read_raw().decode("Ascii")

def onMessageVisaTaskQuery(command):
  global channelsOpenend
  if not (command["resource"] in channelsOpenend["visa"]):
    onMessageVisaTaskOpen(command)
  channelsOpenend["visa"][command["resource"]].query(command["data"])
  command['response'] = "OK"



# This solves the problem to include image files in the executable
def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


'''

Command
{
  "type": "serial", // serial, visa
  "command": "list", // list, open, write, read, query, close,sRCbor
  "port": "COM1", // com port for serial
  "data": "data" // data to write or query
  "baud": 115200 // baud rate
  "resource": "GPIB0::1::INSTR" // resource for visa
}

Output
{
  "isError": false, // true if error
  "command": "list", // command received
  "data": "data" // data received
  "response": "data" // data to send
}

'''


def onMessageRecieved (client, server, message):
  try:
    command = json.loads(message)
    try:
      command["isError"] = False
      if command['type'] == 'serial':
        if command['command'] == 'list':
          onMessageSerialTaskList(command)
        elif command['command'] == 'open':
          onMessageSerialTaskOpen(command)
        elif command['command'] == 'write':
          onMessageSerialTaskWrite(command)
        elif command['command'] == 'read':
          onMessageSerialTaskRead(command)
        elif command['command'] == 'close':
          onMessageSerialTaskCloseIfOpen(command)
        elif command['command'] == 'sRCbor':
          onMessageSerialTaskSRCbor(command)
        elif command['command'] == 'sR':
          onMessageSerialTaskSR(command)
      elif command['type'] == 'visa':
        if command['command'] == 'list':
          onMessageVisaTaskList(command)
        elif command['command'] == 'write':
          onMessageVisaTaskWrite(command)
        elif command['command'] == 'read':
          onMessageVisaTaskRead(command)
        elif command['command'] == 'query':
          onMessageVisaTaskQuery(command)
        elif command['command'] == 'close':
          onMessageVisaTaskCloseIfOpen(command)
    except Exception as e:
      #print(e)
      command["isError"] = True
      command['response'] = "Error: " + str(e)
      if command["type"] == "serial":
        global multipleSerialError
        multipleSerialError = multipleSerialError + 1
        if multipleSerialError > 3:
          try:
            onMessageSerialTaskCloseIfOpen(command)
            command['response'] = "Error: " + str(e)
          except:
            command["isError"] = True
            command['response'] = "Error: " + str(e)
    server.send_message(client, json.dumps(command))
  except Exception as e:
    #print(e)
    server.send_message(client, "{\"isError\": true}""")
  





global exitTheApp
exitTheApp = False;

global futureElement
global wsServer

def setExitTheApp():
  global wsServer
  wsServer.shutdown_gracefully()
  closeAllConnection()
  global exitTheApp 
  exitTheApp = True

def closeAllConnection():
  global channelsOpenend
  for port in channelsOpenend["serial"]:
    try:
      channelsOpenend["serial"][port].close()
      channelsOpenend["serial"].pop(port)
    except:
      pass
  for port in channelsOpenend["visa"]:
    try:
      channelsOpenend["visa"][port].close()
      channelsOpenend["visa"].pop(port)
    except:
      pass




def openURL(url):
  webbrowser.open(url)

def task1():
  icon.run()


def task2():
  global wsServer
  wsServer = WebsocketServer(host='localhost', port=8765, loglevel=logging.INFO)
  wsServer.set_fn_message_received(onMessageRecieved)
  wsServer.run_forever()



if __name__ == "__main__":
  t1 = threading.Thread(target=task1, name='t1')
  t2 = threading.Thread(target=task2, name='t2')
  t1.daemon = True
  t1.daemon = True

  toast = ToastNotifier()
  toast.show_toast(
    "SKGadi\'s Desktop Agent is running ...",
    "This app runs in the tray. You can close this notification.",
    duration = 20,
    icon_path = resource_path('logo.ico'),
    threaded = True,
  )


  icon = pystray.Icon(
    'desktop_agent',
    Image.open(resource_path('logo.png')), menu=menu(
    item('Home page', lambda icon, item: openURL('https://da.skgadi.com/')),
    item(
    'Apps',
    menu(
    item(
    'Uyamak',
    lambda icon, item: openURL('https://umk.skgadi.com/')),
    item(
    'temp-control',
    lambda icon, item: openURL('https://umk.skgadi.com/')))),
    item('Author\'s page', lambda icon, item: openURL('https://skgadi.com/')),
    item('Exit', lambda icon, item: setExitTheApp())),
    title='SKGadi\'s Desktop Agent')
  # starting threads
  t1.start()
  t2.start()
  while True:
    time.sleep(1)
    if exitTheApp:
      #print("Exiting the app")
      sys.exit()
  # wait until all threads finish
  t1.join()
  t2.join() 