import asyncio
import websockets
from scapy.all import sniff
import json
from datetime import datetime
import socket
# Function to get the local IP address
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # Connect to an external server (e.g., Google's DNS)
        s.connect(('10.254.254.254', 1))
        local_ip = s.getsockname()[0]
    except Exception:
        # Fallback in case of failure (use loopback address)
        local_ip = '127.0.0.1'
    finally:
        s.close()
    return local_ip

# Automatically detect the local IP
LOCAL_IP = get_local_ip()
# WebSocket clients
clients = set()

# Function to handle WebSocket connections
async def handle_client(websocket):
    global clients
    clients.add(websocket)  # Add the client to the connected clients set
    try:
        await websocket.wait_closed()  # Wait for the client to disconnect
    finally:
        clients.remove(websocket)  # Remove the client when disconnected

# Function to process packets and broadcast them to WebSocket clients
def packet_sniffer(packet):
    if packet.haslayer("IP"):
        # Determine if the packet is incoming or outgoing based on the source/destination IP
        direction = "outgoing" if packet["IP"].src == LOCAL_IP else "incoming"
        # Extract packet details including timestamp
        packet_data = {
            "src": packet["IP"].src,
            "dst": packet["IP"].dst,
            "protocol": packet["IP"].proto,
            "summary": packet.summary(),
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S') , # Add timestamp
            "direction": direction  # Add direction to indicate incoming or outgoing
     
        }
        print(f"Packet sniffed: {packet_data}")  # Debugging statement to see the sniffed data
        
        # Broadcast the packet to all connected clients
        asyncio.run(broadcast_packet(packet_data))

# Function to broadcast packet data to all connected WebSocket clients
async def broadcast_packet(packet_data):
    global clients
    if clients:  # Only attempt to send if there are active clients
        message = json.dumps(packet_data)
        print(f"Broadcasting packet: {message}")  # Debugging statement for broadcasting
        
        # Filter out closed clients and broadcast to active ones
        disconnected_clients = []
        for client in clients:
            try:
                await client.send(message)
            except websockets.exceptions.ConnectionClosedError:
                print("Client connection closed; removing client.")
                disconnected_clients.append(client)
        
        # Remove disconnected clients
        for client in disconnected_clients:
            clients.remove(client)

# Main function to start the WebSocket server and packet sniffer
async def main():
    # Start the WebSocket server
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server started at ws://localhost:8765")

    # Run the packet sniffer in a separate thread to avoid blocking the WebSocket server
    loop = asyncio.get_running_loop()
    loop.run_in_executor(None, lambda: sniff(prn=packet_sniffer, store=False))

    # Keep the WebSocket server running
    await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
