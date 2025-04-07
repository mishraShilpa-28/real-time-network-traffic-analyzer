"use client";
import { useEffect, useState } from "react";

const PacketSnifferDashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      setData((prevData) => [...prevData, packet]);
    };

    return () => {
      socket.close();
    };
  }, []);

  // Function to filter data by source IP
  const filteredData = data.filter((packet) =>
    packet.src.toLowerCase().includes(filter.toLowerCase())
  );

  const downloadExcel = (data) => {
    // Convert JSON to CSV
    const headers = [
      "Timestamp",
      "Source",
      "Destination",
      "Protocol",
      "Summary",
      "Direction",
    ];
    const rows = data.map((packet) => [
      new Date(packet.timestamp * 1000).toLocaleString(),
      packet.src,
      packet.dst,
      packet.protocol,
      packet.summary,
      packet.direction,
    ]);

    // Prepare CSV string
    let csv = headers.join("\t") + "\n";
    rows.forEach((row) => {
      csv += row.join("\t") + "\n";
    });

    // Create Blob and trigger download
    const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `packets_data_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Network Packet Sniffer
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md p-2" style={{gap:"8px"}}>
              <div className="flex items-center  ">
                {" "}
                Incoming call{" "}
                <div
                  className={`h-3 w-3 rounded-sm ml-2 bg-green-500`}
                ></div>
              </div>
              <div className="flex items-center ">
                {" "}
                Outgoing Packet{" "}
                <div
                  className={`h-3 w-3 rounded-sm bg-red-500 ml-2`}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm ">
              <span
                className={`h-3 w-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span> &nbsp; Socket &nbsp;
                {isConnected ? "Connected" : "Disconnected"}                                

            </div>
            <button
              onClick={() => downloadExcel(filteredData)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
            >
              Download Excel
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4 flex space-x-4 items-center">
            <div className="flex-grow">
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Source IP
              </label>
              <input
                type="text"
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Type source IP to filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="self-end">
              <span className="text-gray-600 text-sm">
                Total Packets: {data.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source IP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination IP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.reverse().map((packet, index) => (
                    <tr
                      key={index}
                      className={`
                        ${
                          packet.direction === "incoming"
                            ? "hover:bg-green-50"
                            : "hover:bg-red-50"
                        } transition-colors duration-200
                      `}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}.
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          packet.direction === "incoming"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {packet.src}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          packet.direction === "incoming"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {packet.dst}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {packet.protocol}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {packet.summary}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {packet.timestamp}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-3 text-center text-gray-500"
                    >
                      No packets captured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacketSnifferDashboard;
