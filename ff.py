
video_id = input("Video ID'sini girin: ")

# İlk komut
cmd1 = f"ffmpeg -i {video_id}.webm -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -shortest -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k {video_id}.mp4"

# İkinci komut
cmd2 = f"ffmpeg -i {video_id}.mp4 -i bg.wav -map 0:v:0 -map 1:a:0 -shortest -c:v copy -c:a aac -b:a 192k output_{video_id}.mp4"

print("\nVideo komutu:")
print(cmd1)

print("\nSes komutu:")
print(cmd2)