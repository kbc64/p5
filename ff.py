video_id = input("Video ID'sini girin: ")

# 1. WebM’den MP4’e dönüştürme (sessiz ses ekleyerek)
cmd_convert = (
    f'ffmpeg -i {video_id}.webm '
    '-f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 '
    f'-shortest -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k {video_id}.mp4'
)

# 2. MP4’ten üst 520px’lik görseli kırpıp PNG olarak kaydetme
cmd_crop = (
    f'ffmpeg -i {video_id}.mp4 '
    '-filter:v "crop=in_w:520:0:0" -vframes 1 -update 1 '
    f'top_520px_{video_id}.png'
)

# 3. Kırpılan görseli videonun üzerine bindirme
cmd_overlay = (
    f'ffmpeg -i {video_id}.mp4 '
    f'-i top_520px_{video_id}.png '
    '-filter_complex "[0:v][1:v]overlay=0:0" -c:a copy '
    f'overlay_{video_id}.mp4'
)

# 4. Son videoya arka plan müziğini ekleme
cmd_audio = (
    f'ffmpeg -i overlay_{video_id}.mp4 '
    '-i bg.wav '
    '-map 0:v:0 -map 1:a:0 -shortest '
    '-c:v copy -c:a aac -b:a 192k '
    f'output_{video_id}.mp4'
)

# 5. Final videoyu süreye göre kırpma
minute = input("Kaç dakika alalım? ")
second = input("Kaç saniye alalım? ")

# Süre formatı: 00:MM:SS
duration = f'00:{minute.zfill(2)}:{second.zfill(2)}'

cmd_cut = (
    f'ffmpeg -i output_{video_id}.mp4 -t {duration} -c copy '
    f'final_{video_id}.mp4'
)

print("\n1) Dönüştürme komutu:")
print(cmd_convert)

print("\n2) Kırpma komutu (520px):")
print(cmd_crop)

print("\n3) Overlay komutu:")
print(cmd_overlay)

print("\n4) Ses ekleme komutu:")
print(cmd_audio)

print("\n5) Süre kısaltma (final):")
print(cmd_cut)
