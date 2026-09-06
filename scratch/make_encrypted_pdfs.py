import pikepdf
from pypdf import PdfWriter, PdfReader
import io

def create_pdfs():
    # 1. Unprotected PDF
    pdf = pikepdf.new()
    pdf.add_blank_page(page_size=(400, 400))
    pdf.save("scratch/test_unprotected.pdf")
    print("[CREATED] scratch/test_unprotected.pdf")

    # 2. AES-128 Encrypted PDF
    pdf_aes128 = pikepdf.new()
    pdf_aes128.add_blank_page(page_size=(400, 400))
    encryption_aes128 = pikepdf.Encryption(
        user="secret123",
        owner="admin123",
        R=4, # AES-128
        aes=True
    )
    pdf_aes128.save("scratch/test_aes128.pdf", encryption=encryption_aes128)
    print("[CREATED] scratch/test_aes128.pdf (AES-128, password='secret123')")

    # 3. AES-256 Encrypted PDF (Revision 6 - Acrobat X / standard modern PDF encryption)
    pdf_aes256 = pikepdf.new()
    pdf_aes256.add_blank_page(page_size=(400, 400))
    encryption_aes256 = pikepdf.Encryption(
        user="secret123",
        owner="admin123",
        R=6, # AES-256 R=6
        aes=True
    )
    pdf_aes256.save("scratch/test_aes256.pdf", encryption=encryption_aes256)
    print("[CREATED] scratch/test_aes256.pdf (AES-256, password='secret123')")

    # 4. RC4 128-bit Encrypted PDF using pypdf
    writer = PdfWriter()
    writer.add_blank_page(width=400, height=400)
    writer.encrypt(user_password="secret123", owner_password="admin123", use_128bit=True)
    with open("scratch/test_rc4.pdf", "wb") as f:
        writer.write(f)
    print("[CREATED] scratch/test_rc4.pdf (RC4 128-bit, password='secret123')")

    # 5. Corrupted File
    with open("scratch/test_corrupted.pdf", "wb") as f:
        f.write(b"NOT A VALID PDF FILE AT ALL - CORRUPTED")
    print("[CREATED] scratch/test_corrupted.pdf")

if __name__ == "__main__":
    create_pdfs()
