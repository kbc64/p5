import os
import requests

# Kullanıcıdan MAC ID'sini al
mac_id = input("Lütfen MAC ID'sini girin: ")

# URL'yi oluştur
base_url = "http://192.168.1.103:8000/static/json/"
file_name = f"{mac_id}.json"
url = base_url + file_name

# JSON verisini indir
try:
    response = requests.get(url)
    response.raise_for_status()  # HTTP hatalarını kontrol et

    # JSON dosyasını kaydet
    save_path = os.path.join("json", "mac.json")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    with open(save_path, "wb") as file:
        file.write(response.content)

    print(f"JSON verisi başarıyla kaydedildi: {save_path}")

except requests.exceptions.RequestException as e:
    print(f"Hata oluştu: {e}")