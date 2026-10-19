import asyncio
from bleak import BleakScanner, BleakClient

# The specific Bluetooth service and characteristic UUIDs for Pixels dice.
PIXEL_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
# Corrected Characteristic UUID based on our discovery
PIXEL_NOTIFY_CHAR_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"

def handle_roll(sender: int, data: bytearray):
    """
    This function is called whenever the die sends data (a "notification").
    It decodes the byte data to determine the die's state and face.
    """
    if not data or len(data) < 3:
        print(f"Received invalid data: {data.hex()}")
        return

    message_type = data[0]

    if message_type == 0x03:  # Roll State Message
        state_code = data[1]
        face = data[2]

        if state_code == 0x01:  # State: onFace
            print(f"--- Die landed! Final face is: {face + 1} ---")
        elif state_code == 0x03:  # State: handling
            print("... Handling die ...")
        elif state_code == 0x05:  # State: rolling
            print("... Rolling ...")
        else:
            # This helps see if there are other states we don't know about
            print(f"Received unknown roll state: {data.hex()}")
    # else:
        # This helps see if there are other message types
        # print(f"Received unhandled message type: {data.hex()}")


async def main():
    """
    The main function to scan for, connect to, and read from the die.
    """
    DIE_NAME = "Brian PD6"
    print(f"Scanning for a Pixels die named '{DIE_NAME}'...")

    device = await BleakScanner.find_device_by_name(DIE_NAME)

    if device is None:
        print(f"Could not find a die named '{DIE_NAME}'. Make sure it's on and nearby.")
        return

    print(f"Found die: {device.name} ({device.address})")

    async with BleakClient(device) as client:
        if client.is_connected:
            print("Successfully connected to the die.")
        else:
            print("Failed to connect.")
            return

        print("\nListening for rolls... (Press Ctrl+C to stop)")

        await client.start_notify(PIXEL_NOTIFY_CHAR_UUID, handle_roll)

        # Run indefinitely until the user stops the script
        while True:
            await asyncio.sleep(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nScript stopped by user.")
