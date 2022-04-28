# bluetooth-battery-electron

## An electron application to check battery of bluetooth devices connected to linux devices.

- This project provides an electron wrapper on ![bluetooth batttery python package](https://pypi.org/project/bluetooth-battery/) and runs as a system tray application, indicating battery of bluetooth devices connected with Linux machine. 
 
- The code of the library was modified a bit to work with electron version. The changed file is present in ![bbt/bluetooth_battery.py](https://github.com/vasusharma7/bluetooth-battery-electron/blob/master/bbt/bluetooth_battery.py).

- Its pre-requisites include Python3 to be installed in the system and a few bluetooth related linux packages which can be installed by the following command.

``` 

sudo apt install libbluetooth-dev python3-dev

```
## How to start/use

- Unzip the package zip
- Execute run.sh from terminal and it will start BtBat. (Can also run BtBat executable directly from GUI but some versions of file managers have issues launching electon built applications directly)
- The application will launch in system tray.
- This also creates a system startup entry so it starts next time you boot.

![image](https://user-images.githubusercontent.com/40715071/165670867-39b66543-51b5-45b5-a2a7-73683d5e664f.png)


- This is just a personal learning project, not for any commercial usage.

- If any issues with code/release, mail me @ mailsforvasu@gmail.com

