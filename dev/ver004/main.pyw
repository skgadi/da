# Python program to illustrate the concept
# of threading
import threading
import os
import time
import pystray
from PIL import Image
from pystray import Icon as icon, Menu as menu, MenuItem as item
import sys
import webbrowser

from websocket_server import WebsocketServer
import serial
import serial.tools.list_ports
import logging

import json

import pprint

ports = serial.tools.list_ports.comports()

#for port, desc, hwid in sorted(ports):
#        print(port);

pp = pprint.PrettyPrinter(width=41, compact=True)
pp.pprint(ports)


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
  "command": "list", // list, write, read, query, close
  "port": "COM1", // com port or visa address
  "data": "data" // data to write or query
  "baud": 115200 // baud rate
}

Output
{
  "isError": false, // true if error
  "command": "list", // command received
  "data": "data" // data received
  "resnponse": "data" // data to send
}

'''



def onMessageRecieved (client, server, message):
  try:
    command = json.loads(message)

    try:
      command["isError"] = False
      if command['type'] == 'serial':
        if command['command'] == 'list':
          print("Serail list");
        elif command['command'] == 'write':
          print("Serail write");
        elif command['command'] == 'read':
          print("Serail read");
        elif command['command'] == 'query':
          print("Serail query");
        elif command['command'] == 'close':
          print("Serail close");
      elif command['type'] == 'visa':
        if command['command'] == 'list':
          print("Visa list");
        elif command['command'] == 'write':
          print("Visa write");
        elif command['command'] == 'read':
          print("Visa read");
        elif command['command'] == 'query':
          print("Visa query");
        elif command['command'] == 'close':
          print("Visa close");
    except Exception as e:
      print(e)
      print("Invalid command")
      command["isError"] = True
    server.send_message(client, json.dumps(command))
  except Exception as e:
    print(e)
    print("Invalid JSON")
    server.send_message(client, "{\"isError\": true}""")
  





global exitTheApp
exitTheApp = False;

global futureElement
global wsServer

def setExitTheApp():
  global wsServer
  wsServer.shutdown_gracefully()
  global exitTheApp 
  exitTheApp = True


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



  icon = pystray.Icon(
    'desktop_agent',
    Image.open(resource_path('logo.png')), menu=menu(
    item('Home page', lambda icon, item: openURL('https://skgadi.com/')),
    item(
    'Apps',
    menu(
    item(
    'Uyamak',
    lambda icon, item: openURL('https://umk.skgadi.com/')),
    item(
    'temp-control',
    lambda icon, item: openURL('https://umk.skgadi.com/')))),
    item('Exit', lambda icon, item: setExitTheApp())),
    title='SKGadi\'s Desktop Agent')
  # starting threads
  t1.start()
  t2.start()
  while True:
    time.sleep(1)
    if exitTheApp:
      print("Exiting the app")
      sys.exit()
  # wait until all threads finish
  t1.join()
  t2.join() 