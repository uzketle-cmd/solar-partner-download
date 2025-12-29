# generate_qr.py
import qrcode
import os

# Create assets directory if it doesn't exist
os.makedirs('assets', exist_ok=True)

# Generate QR code
url = "https://github.com/uzketle-cmd/Solar-Partner-apk/releases/download/Solar_Partner/app-release.apk"
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create QR code image
img = qr.make_image(fill_color="black", back_color="white")
img.save("assets/qr-code.png")
print("QR code generated: assets/qr-code.png")
