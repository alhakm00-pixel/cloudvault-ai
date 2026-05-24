# PWA Icons

Generate icons from icon.svg using any of these methods:

## Method 1: Online tool
Visit https://maskable.app/editor and upload icon.svg

## Method 2: CLI with sharp
```bash
npm install -g sharp-cli
for size in 72 96 128 144 152 192 384 512; do
  sharp -i icon.svg -o icon-${size}.png resize ${size} ${size}
done
```

## Method 3: ImageMagick
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert -background none icon.svg -resize ${size}x${size} icon-${size}.png
done
```

For now, the SVG icon works as a fallback for all sizes.
