import asyncio
import websockets

import serial
import time

'''serialPort = serial.Serial(
    port="COM5", baudrate=115200, bytesize=8, timeout=2, stopbits=serial.STOPBITS_ONE
)
serialString = ""  # Used to hold data coming over UART
'''
async def echo(websocket):
    async for message in websocket:
      await websocket.send(message)
      await websocket.send("SKGadi")
      '''while serialPort.in_waiting > 0:

        # Read data out of the buffer until a carraige return / new line is found
        serialString = serialPort.readline()

        # Print the contents of the serial data
        try:
            await websocket.send(serialString.decode("Ascii"))
        except:
            pass'''


async def main():
    async with websockets.serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
