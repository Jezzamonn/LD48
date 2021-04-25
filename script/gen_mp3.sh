set -ex

echo $(pwd)

for path in sfx/*.wav; do
    [ -e "$path" ] || continue

    filename=$(basename -- "$path" .wav)

    ffmpeg -i "$path" -vn -ar 44100 -ac 2 -b:a 192k "src/static/sfx/$filename.mp3" -y

done