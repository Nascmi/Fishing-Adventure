from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "branding" / "masters"
PLAY = ROOT / "branding" / "play-store"
RES = ROOT / "android" / "app" / "src" / "main" / "res"
GREEN = (18, 57, 48, 255)


def cover(image, size):
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def contain(image, size, padding=0, background=GREEN):
    canvas = Image.new("RGBA", size, background)
    inner = (size[0] - padding * 2, size[1] - padding * 2)
    scale = min(inner[0] / image.width, inner[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2))
    return canvas


def contain_transparent(image, size, padding=0):
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    inner = (size[0] - padding * 2, size[1] - padding * 2)
    scale = min(inner[0] / image.width, inner[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized, ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2))
    return canvas


def emblem_cutout(icon):
    rgb = icon.convert("RGB")
    backdrop = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    difference = ImageChops.difference(rgb, backdrop).convert("L")
    alpha = difference.point(lambda value: 0 if value < 22 else min(255, round((value - 22) * 5.5)))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.5))
    cutout = icon.convert("RGBA")
    cutout.putalpha(alpha)
    return cutout


def save_png(image, path, optimize=True):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=optimize)


def main():
    icon = Image.open(MASTER / "fishing-adventure-icon-master.png").convert("RGBA")
    feature = Image.open(MASTER / "fishing-adventure-feature-master.png").convert("RGB")
    splash = Image.open(MASTER / "fishing-adventure-splash-master.png").convert("RGBA")
    cutout = emblem_cutout(icon)

    save_png(cover(icon, (512, 512)), PLAY / "app-icon-512.png")
    save_png(cover(feature, (1024, 500)).convert("RGB"), PLAY / "feature-graphic-1024x500.png")

    legacy_sizes = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    foreground_sizes = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
    for density, size in legacy_sizes.items():
        square = cover(icon, (size, size))
        save_png(square, RES / f"mipmap-{density}" / "ic_launcher.png")
        mask = Image.new("L", (size, size), 0)
        from PIL import ImageDraw
        ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
        round_icon = square.copy()
        round_icon.putalpha(mask)
        save_png(round_icon, RES / f"mipmap-{density}" / "ic_launcher_round.png")

    for density, size in foreground_sizes.items():
        foreground = contain_transparent(cutout, (size, size), round(size * 0.17))
        save_png(foreground, RES / f"mipmap-{density}" / "ic_launcher_foreground.png")

    portrait_sizes = {"mdpi": (320, 480), "hdpi": (480, 800), "xhdpi": (720, 1280), "xxhdpi": (960, 1600), "xxxhdpi": (1280, 1920)}
    landscape_sizes = {density: (height, width) for density, (width, height) in portrait_sizes.items()}
    for density, size in portrait_sizes.items():
        save_png(contain(splash, size, round(size[0] * 0.04), (23, 46, 37, 255)), RES / f"drawable-port-{density}" / "splash.png")
    for density, size in landscape_sizes.items():
        save_png(cover(feature, size).convert("RGBA"), RES / f"drawable-land-{density}" / "splash.png")
    save_png(cover(feature, (480, 320)).convert("RGBA"), RES / "drawable" / "splash.png")


if __name__ == "__main__":
    main()
