set -ex

echo $(pwd)

for path in src/static/levels/level*.png; do
    [ -e "$path" ] || continue

    filename=$(basename -- "$path" .png)

    magick convert "$path" "src/static/levels/$filename.gif"

done