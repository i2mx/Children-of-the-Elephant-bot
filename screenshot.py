import pyautogui
import random, string
from time import sleep
import ctypes

def randomword(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

amongus = randomword(10)

ctypes.windll.user32.MessageBoxW(0, "Hope ur not doing anything bad ;)", "Screenshot Time!", 1)

sleep(0.3)
screenshot = pyautogui.screenshot()
screenshot.save(f"screenshots/{amongus}.png")
print(amongus)