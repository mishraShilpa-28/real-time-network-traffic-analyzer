from scapy.all import sniff, wrpcap
import sys

def capture_all_traffic(interface, all_traffic_file, ip_filter=None):
    packets = []

    def packet_callback(packet):
        print(f"Packet captured: {packet.summary()}")
        packets.append(packet)

        if ip_filter:
            if packet.haslayer('IP'):
                ip_src = packet['IP'].src
                ip_dst = packet['IP'].dst
                if ip_src == ip_filter or ip_dst == ip_filter:
                    filtered_packets.append(packet)

    # Start sniffing
    filtered_packets = []
    sniff(iface=interface, prn=packet_callback)

    # Save all captured packets
    wrpcap(all_traffic_file, packets)

    if ip_filter:
        # Save filtered packets
        wrpcap(f"filtered_{ip_filter}.pcap", filtered_packets)

if __name__ == "__main__":
    interface = input("Enter the network interface (e.g., eth0, wlan0): ")
    all_traffic_file = "all_traffic.pcap"
    ip_filter = input("Enter an IP address to filter (or leave blank for all traffic): ")

    capture_all_traffic(interface, all_traffic_file, ip_filter if ip_filter else None)

# To run the file 
# sudo myenv/bin/python captureTraffic.py