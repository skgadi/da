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

import asyncio
from websocket_server import WebsocketServer
import serial
import logging



def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


def onMessageRecieved (client, server, message):
  server.send_message(client, message)
  print(message)





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