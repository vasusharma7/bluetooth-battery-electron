from colorama import deinit
import dbus
from bluetooth_battery import main
# B8:F6:53:53:D5:C1

def proxyobj(bus, path, interface):
    """ commodity to apply an interface to a proxy object """
    obj = bus.get_object('org.bluez', path)
    return dbus.Interface(obj, interface)


def filter_by_interface(objects, interface_name):
    """ filters the objects based on their support
        for the specified interface """
    result = []
    for path in objects.keys():
        interfaces = objects[path]
        for interface in interfaces.keys():
            if interface == interface_name:
                result.append(path)
    return result


bus = dbus.SystemBus()
def get_devices():
    bt_devices = []
    # we need a dbus object manager
    manager = proxyobj(bus, "/", "org.freedesktop.DBus.ObjectManager")
    objects = manager.GetManagedObjects()

    # once we get the objects we have to pick the bluetooth devices.
    # They support the org.bluez.Device1 interface
    devices = filter_by_interface(objects, "org.bluez.Device1")

    # now we are ready to get the informations we need
    
    for device in devices:
        obj = proxyobj(bus, device, 'org.freedesktop.DBus.Properties')
        bt_devices.append({
            "name": str(obj.Get("org.bluez.Device1", "Name")),
            "addr": str(obj.Get("org.bluez.Device1", "Address"))
        })  
    return bt_devices

old_devices = []
if __name__ == '__main__':

    try:
        devices = get_devices()
        old_devices = devices
    except:
        devices = old_devices

    result = main(devices)
    print(result)
            
    
    
