
import http.server
import socketserver
import os
import socket


PORT = 8000
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
os.chdir('E:\RAM TIREX\Develop\Github Projects')
handler_object = MyHttpRequestHandler
with socketserver.TCPServer(("", PORT), handler_object) as httpd:
    print(f"Serving at port {PORT}")
    print("Server is running. Press Ctrl+C to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("Server stopped.")
    httpd.server_close()
    print("Server closed.")

hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

ip_white_list = [
    "00.00.00.000"
    ]

hostname_white_list = [
    "NTL12012012"
]

# if ip_address in white_list and hostname in hostname_white_list:
    # httpd.server_close()

# cmd > python http_server.py