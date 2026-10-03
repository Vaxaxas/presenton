import json
import os
import copy
import shutil
from pathlib import Path
from PIL import Image, ImageDraw

ROOT_DIR = Path("c:/Users/fi/source/presenton")
TEMPLATES_DIR = ROOT_DIR / "templates"

# Load base structures
swift_json = json.loads((TEMPLATES_DIR / "swift" / "template.json").read_text(encoding="utf-8"))
modern_json = json.loads((TEMPLATES_DIR / "modern" / "template.json").read_text(encoding="utf-8"))

TEMPLATES_20 = [
    {
        "id": "bauhaus-bold",
        "name": "Bauhaus Bold",
        "description": "Avant-garde modernist layouts inspired by Bauhaus geometric minimalism, striking primary color blocking, and clean asymmetrical card structures.",
        "font_name": "Outfit",
        "font_url": "https://fonts.googleapis.com/css2?family=Outfit:wght@300..900&display=swap",
        "colors": {
            "primary": "#E63946",
            "background": "#F8F6F0",
            "card": "#FFFFFF",
            "stroke": "#1D1E2C",
            "primary_text": "#E63946",
            "background_text": "#1D1E2C",
            "graph_0": "#E63946",
            "graph_1": "#1D3557",
            "graph_2": "#457B9D",
            "graph_3": "#F4A261",
            "graph_4": "#E76F51",
            "graph_5": "#2A9D8F",
            "graph_6": "#264653",
            "graph_7": "#D62828",
            "graph_8": "#003049",
            "graph_9": "#FDF0D5"
        },
        "bg_hex": "#F8F6F0",
        "card_hex": "#FFFFFF",
        "accent_hex": "#E63946",
        "text_hex": "#1D1E2C",
        "base": "modern"
    },
    {
        "id": "midnight-neon",
        "name": "Midnight Neon",
        "description": "High-voltage dark OLED layouts with electric purple radiance, neon lime accents, and deep obsidian cards for next-gen developer and Web3 product reveals.",
        "font_name": "Space Grotesk",
        "font_url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        "colors": {
            "primary": "#A855F7",
            "background": "#05050A",
            "card": "#0F0F1A",
            "stroke": "#27273A",
            "primary_text": "#C084FC",
            "background_text": "#F3F4F6",
            "graph_0": "#A855F7",
            "graph_1": "#84CC16",
            "graph_2": "#06B6D4",
            "graph_3": "#F43F5E",
            "graph_4": "#EAB308",
            "graph_5": "#3B82F6",
            "graph_6": "#10B981",
            "graph_7": "#EC4899",
            "graph_8": "#6366F1",
            "graph_9": "#14B8A6"
        },
        "bg_hex": "#05050A",
        "card_hex": "#0F0F1A",
        "accent_hex": "#A855F7",
        "text_hex": "#F3F4F6",
        "base": "modern"
    },
    {
        "id": "zenith-minimal",
        "name": "Zenith Minimal",
        "description": "Refined Japanese-inspired minimalism with generous whitespace, subtle stone-gray tones, crisp typography, and disciplined visual calm.",
        "font_name": "Plus Jakarta Sans",
        "font_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
        "colors": {
            "primary": "#18181B",
            "background": "#FAFAFA",
            "card": "#FFFFFF",
            "stroke": "#E4E4E7",
            "primary_text": "#18181B",
            "background_text": "#27272A",
            "graph_0": "#18181B",
            "graph_1": "#71717A",
            "graph_2": "#A1A1AA",
            "graph_3": "#DC2626",
            "graph_4": "#52525B",
            "graph_5": "#3F3F46",
            "graph_6": "#27272A",
            "graph_7": "#D4D4D8",
            "graph_8": "#E4E4E7",
            "graph_9": "#09090B"
        },
        "bg_hex": "#FAFAFA",
        "card_hex": "#FFFFFF",
        "accent_hex": "#18181B",
        "text_hex": "#27272A",
        "base": "swift"
    },
    {
        "id": "fintech-carbon",
        "name": "Carbon Fintech",
        "description": "High-conviction financial technology layouts with carbon black surfaces, crisp emerald metrics, and clean data grids engineered for investor presentations.",
        "font_name": "Inter",
        "font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        "colors": {
            "primary": "#10B981",
            "background": "#0D1117",
            "card": "#161B22",
            "stroke": "#30363D",
            "primary_text": "#34D399",
            "background_text": "#E6EDF3",
            "graph_0": "#10B981",
            "graph_1": "#3B82F6",
            "graph_2": "#F59E0B",
            "graph_3": "#8B5CF6",
            "graph_4": "#06B6D4",
            "graph_5": "#EC4899",
            "graph_6": "#64748B",
            "graph_7": "#14B8A6",
            "graph_8": "#F43F5E",
            "graph_9": "#84CC16"
        },
        "bg_hex": "#0D1117",
        "card_hex": "#161B22",
        "accent_hex": "#10B981",
        "text_hex": "#E6EDF3",
        "base": "swift"
    },
    {
        "id": "terracotta-warmth",
        "name": "Terracotta Warmth",
        "description": "Earthy Mediterranean clay tones, sun-drenched sand, and warm burnt sienna accents crafted for organic brands, culinary culture, and lifestyle narratives.",
        "font_name": "Plus Jakarta Sans",
        "font_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
        "colors": {
            "primary": "#C2593F",
            "background": "#FBF7F2",
            "card": "#FFFFFF",
            "stroke": "#E8DDD3",
            "primary_text": "#C2593F",
            "background_text": "#3D2E2B",
            "graph_0": "#C2593F",
            "graph_1": "#6B7F61",
            "graph_2": "#DDA15E",
            "graph_3": "#BC6C25",
            "graph_4": "#283618",
            "graph_5": "#8A5A44",
            "graph_6": "#A68A78",
            "graph_7": "#B08968",
            "graph_8": "#7F5539",
            "graph_9": "#9C6644"
        },
        "bg_hex": "#FBF7F2",
        "card_hex": "#FFFFFF",
        "accent_hex": "#C2593F",
        "text_hex": "#3D2E2B",
        "base": "swift"
    },
    {
        "id": "quantum-tech",
        "name": "Quantum Tech",
        "description": "Deep-space navy backdrop infused with electric indigo, cyan lasers, and sleek glass containers designed for frontier science and deep-tech innovation.",
        "font_name": "Space Grotesk",
        "font_url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        "colors": {
            "primary": "#6366F1",
            "background": "#080B16",
            "card": "#11162B",
            "stroke": "#1E294B",
            "primary_text": "#818CF8",
            "background_text": "#F1F5F9",
            "graph_0": "#6366F1",
            "graph_1": "#06B6D4",
            "graph_2": "#3B82F6",
            "graph_3": "#8B5CF6",
            "graph_4": "#10B981",
            "graph_5": "#F43F5E",
            "graph_6": "#EC4899",
            "graph_7": "#0EA5E9",
            "graph_8": "#A855F7",
            "graph_9": "#4F46E5"
        },
        "bg_hex": "#080B16",
        "card_hex": "#11162B",
        "accent_hex": "#6366F1",
        "text_hex": "#F1F5F9",
        "base": "modern"
    },
    {
        "id": "vintage-botanical",
        "name": "Vintage Botanical",
        "description": "Antique parchment ivory paired with deep moss forest green and gilded bronze accents, evoking classical natural history and artisanal heritage.",
        "font_name": "Plus Jakarta Sans",
        "font_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
        "colors": {
            "primary": "#2D5A43",
            "background": "#F7F5EF",
            "card": "#FFFFFF",
            "stroke": "#DDD8C9",
            "primary_text": "#2D5A43",
            "background_text": "#223326",
            "graph_0": "#2D5A43",
            "graph_1": "#B8860B",
            "graph_2": "#556B2F",
            "graph_3": "#8FBC8F",
            "graph_4": "#4A5D4E",
            "graph_5": "#D4AF37",
            "graph_6": "#3B533E",
            "graph_7": "#A2B59F",
            "graph_8": "#697A67",
            "graph_9": "#C2A649"
        },
        "bg_hex": "#F7F5EF",
        "card_hex": "#FFFFFF",
        "accent_hex": "#2D5A43",
        "text_hex": "#223326",
        "base": "swift"
    },
    {
        "id": "retro-synthwave",
        "name": "Retro Synthwave",
        "description": "Electrifying 1980s retro-futuristic twilight aesthetic with hot magenta, neon sunrise orange, and dusk purple containers for energetic entertainment pitches.",
        "font_name": "Montserrat",
        "font_url": "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap",
        "colors": {
            "primary": "#FF007F",
            "background": "#0F051D",
            "card": "#1C0D36",
            "stroke": "#381E68",
            "primary_text": "#FF4DA6",
            "background_text": "#F8F4FF",
            "graph_0": "#FF007F",
            "graph_1": "#7928CA",
            "graph_2": "#FF8000",
            "graph_3": "#00F0FF",
            "graph_4": "#79FFE1",
            "graph_5": "#F81CE5",
            "graph_6": "#EB367F",
            "graph_7": "#592B88",
            "graph_8": "#FF4F81",
            "graph_9": "#FFBD59"
        },
        "bg_hex": "#0F051D",
        "card_hex": "#1C0D36",
        "accent_hex": "#FF007F",
        "text_hex": "#F8F4FF",
        "base": "modern"
    },
    {
        "id": "luxury-noir",
        "name": "Luxury Noir",
        "description": "Pure onyx black elegance accented with shimmering champagne gold and platinum borders, tailored for high-jewelry, private equity, and luxury portfolios.",
        "font_name": "Montserrat",
        "font_url": "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap",
        "colors": {
            "primary": "#D4AF37",
            "background": "#0A0A0A",
            "card": "#141414",
            "stroke": "#2D281E",
            "primary_text": "#F3E5AB",
            "background_text": "#F5F5F5",
            "graph_0": "#D4AF37",
            "graph_1": "#AA7C11",
            "graph_2": "#C5A059",
            "graph_3": "#E5C158",
            "graph_4": "#8C7335",
            "graph_5": "#6B571B",
            "graph_6": "#DFBA52",
            "graph_7": "#FAF0BE",
            "graph_8": "#99803A",
            "graph_9": "#FDF5E6"
        },
        "bg_hex": "#0A0A0A",
        "card_hex": "#141414",
        "accent_hex": "#D4AF37",
        "text_hex": "#F5F5F5",
        "base": "modern"
    },
    {
        "id": "solar-clean",
        "name": "Solar Clean",
        "description": "Bright solar amber accents set against pure luminous white surfaces and sky azure tones for clean energy, climate sustainability, and ESG reports.",
        "font_name": "Inter",
        "font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        "colors": {
            "primary": "#F59E0B",
            "background": "#FAFAF8",
            "card": "#FFFFFF",
            "stroke": "#E9E9E0",
            "primary_text": "#D97706",
            "background_text": "#1C1917",
            "graph_0": "#F59E0B",
            "graph_1": "#0284C7",
            "graph_2": "#10B981",
            "graph_3": "#EA580C",
            "graph_4": "#6366F1",
            "graph_5": "#14B8A6",
            "graph_6": "#EAB308",
            "graph_7": "#38BDF8",
            "graph_8": "#84CC16",
            "graph_9": "#8B5CF6"
        },
        "bg_hex": "#FAFAF8",
        "card_hex": "#FFFFFF",
        "accent_hex": "#F59E0B",
        "text_hex": "#1C1917",
        "base": "swift"
    },
    {
        "id": "blueprint-cad",
        "name": "Blueprint CAD",
        "description": "Technical blueprint cobalt layouts featuring precision draft lines, cyan schematics, and structured grids engineered for architectural and engineering reviews.",
        "font_name": "Space Grotesk",
        "font_url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        "colors": {
            "primary": "#0091FF",
            "background": "#0D234A",
            "card": "#132F63",
            "stroke": "#244B94",
            "primary_text": "#70BFFF",
            "background_text": "#FFFFFF",
            "graph_0": "#0091FF",
            "graph_1": "#00E5FF",
            "graph_2": "#5E81AC",
            "graph_3": "#88C0D0",
            "graph_4": "#81A1C1",
            "graph_5": "#4C566A",
            "graph_6": "#8FBCBB",
            "graph_7": "#B48EAD",
            "graph_8": "#A3BE8C",
            "graph_9": "#D08770"
        },
        "bg_hex": "#0D234A",
        "card_hex": "#132F63",
        "accent_hex": "#0091FF",
        "text_hex": "#FFFFFF",
        "base": "modern"
    },
    {
        "id": "pastel-sorbet",
        "name": "Pastel Sorbet",
        "description": "Playful, inviting layouts with delicate lilac, peach sorbet, and soft mint tones for consumer mobile apps, creative agencies, and lifestyle startups.",
        "font_name": "Plus Jakarta Sans",
        "font_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
        "colors": {
            "primary": "#8B5CF6",
            "background": "#FDF8F5",
            "card": "#FFFFFF",
            "stroke": "#F0E3DB",
            "primary_text": "#7C3AED",
            "background_text": "#2E2836",
            "graph_0": "#8B5CF6",
            "graph_1": "#EC4899",
            "graph_2": "#F97316",
            "graph_3": "#06B6D4",
            "graph_4": "#10B981",
            "graph_5": "#F43F5E",
            "graph_6": "#A855F7",
            "graph_7": "#FBBF24",
            "graph_8": "#3B82F6",
            "graph_9": "#34D399"
        },
        "bg_hex": "#FDF8F5",
        "card_hex": "#FFFFFF",
        "accent_hex": "#8B5CF6",
        "text_hex": "#2E2836",
        "base": "swift"
    },
    {
        "id": "ocean-abyss",
        "name": "Ocean Abyss",
        "description": "Deep abyssal sea-trench palette enriched with glowing bioluminescent aquamarine and crisp frosted teal cards for ocean conservation and naval technology.",
        "font_name": "Inter",
        "font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        "colors": {
            "primary": "#06B6D4",
            "background": "#04111E",
            "card": "#0A1F36",
            "stroke": "#163A63",
            "primary_text": "#67E8F9",
            "background_text": "#F0FDF4",
            "graph_0": "#06B6D4",
            "graph_1": "#0284C7",
            "graph_2": "#0D9488",
            "graph_3": "#38BDF8",
            "graph_4": "#14B8A6",
            "graph_5": "#60A5FA",
            "graph_6": "#2DD4BF",
            "graph_7": "#0369A1",
            "graph_8": "#0F766E",
            "graph_9": "#7DD3FC"
        },
        "bg_hex": "#04111E",
        "card_hex": "#0A1F36",
        "accent_hex": "#06B6D4",
        "text_hex": "#F0FDF4",
        "base": "modern"
    },
    {
        "id": "brutalist-mono",
        "name": "Brutalist Mono",
        "description": "Stark, unapologetic neo-brutalist layouts featuring high-contrast black and white framing, sharp borders, and bold hazard-yellow highlight ribbons.",
        "font_name": "Space Grotesk",
        "font_url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        "colors": {
            "primary": "#FACC15",
            "background": "#F5F5F5",
            "card": "#FFFFFF",
            "stroke": "#000000",
            "primary_text": "#000000",
            "background_text": "#000000",
            "graph_0": "#FACC15",
            "graph_1": "#000000",
            "graph_2": "#EF4444",
            "graph_3": "#3B82F6",
            "graph_4": "#10B981",
            "graph_5": "#6B7280",
            "graph_6": "#9CA3AF",
            "graph_7": "#D1D5DB",
            "graph_8": "#F59E0B",
            "graph_9": "#8B5CF6"
        },
        "bg_hex": "#F5F5F5",
        "card_hex": "#FFFFFF",
        "accent_hex": "#FACC15",
        "text_hex": "#000000",
        "base": "swift"
    },
    {
        "id": "crimson-impact",
        "name": "Crimson Impact",
        "description": "High-drama keynote presentations with midnight graphite surfaces, racing crimson accents, and sharp typography built for unforgettable stage reveals.",
        "font_name": "Montserrat",
        "font_url": "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap",
        "colors": {
            "primary": "#EF4444",
            "background": "#0F0F12",
            "card": "#1A1A22",
            "stroke": "#2E2E3A",
            "primary_text": "#F87171",
            "background_text": "#FFFFFF",
            "graph_0": "#EF4444",
            "graph_1": "#DC2626",
            "graph_2": "#F97316",
            "graph_3": "#F59E0B",
            "graph_4": "#E11D48",
            "graph_5": "#64748B",
            "graph_6": "#94A3B8",
            "graph_7": "#38BDF8",
            "graph_8": "#A855F7",
            "graph_9": "#475569"
        },
        "bg_hex": "#0F0F12",
        "card_hex": "#1A1A22",
        "accent_hex": "#EF4444",
        "text_hex": "#FFFFFF",
        "base": "modern"
    },
    {
        "id": "nordic-frost",
        "name": "Nordic Frost",
        "description": "Crisp Scandinavian winter aesthetic blending glacial ice blue, alpine slate, and crystal-clear cards for travel, wellness, and environmental studies.",
        "font_name": "Inter",
        "font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        "colors": {
            "primary": "#0284C7",
            "background": "#F0F7FB",
            "card": "#FFFFFF",
            "stroke": "#D0E3F0",
            "primary_text": "#0284C7",
            "background_text": "#0C243C",
            "graph_0": "#0284C7",
            "graph_1": "#38BDF8",
            "graph_2": "#0D9488",
            "graph_3": "#6366F1",
            "graph_4": "#64748B",
            "graph_5": "#0EA5E9",
            "graph_6": "#7DD3FC",
            "graph_7": "#94A3B8",
            "graph_8": "#475569",
            "graph_9": "#1E293B"
        },
        "bg_hex": "#F0F7FB",
        "card_hex": "#FFFFFF",
        "accent_hex": "#0284C7",
        "text_hex": "#0C243C",
        "base": "swift"
    },
    {
        "id": "artisan-craft",
        "name": "Artisan Craft",
        "description": "Warm roasted espresso, toasted caramel, and unbleached parchment cards celebrating handcrafted goods, maker stories, and culinary craftsmanship.",
        "font_name": "Plus Jakarta Sans",
        "font_url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
        "colors": {
            "primary": "#8B5A2B",
            "background": "#F8F4EE",
            "card": "#FFFFFF",
            "stroke": "#E5DACB",
            "primary_text": "#6F4518",
            "background_text": "#2D2115",
            "graph_0": "#8B5A2B",
            "graph_1": "#C68B59",
            "graph_2": "#A06535",
            "graph_3": "#6F4518",
            "graph_4": "#4A3525",
            "graph_5": "#D4A373",
            "graph_6": "#CCD5AE",
            "graph_7": "#E9EDC9",
            "graph_8": "#FAEDCD",
            "graph_9": "#DDA15E"
        },
        "bg_hex": "#F8F4EE",
        "card_hex": "#FFFFFF",
        "accent_hex": "#8B5A2B",
        "text_hex": "#2D2115",
        "base": "swift"
    },
    {
        "id": "biotech-helix",
        "name": "Biotech Helix",
        "description": "Clinical laboratory purity with deep medical navy typography, crisp card containers, and vibrant cyan-teal DNA helical accents for pharmaceutical summits.",
        "font_name": "Inter",
        "font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        "colors": {
            "primary": "#0D9488",
            "background": "#F4FBF9",
            "card": "#FFFFFF",
            "stroke": "#CCEDE6",
            "primary_text": "#0D9488",
            "background_text": "#0F2F2B",
            "graph_0": "#0D9488",
            "graph_1": "#0284C7",
            "graph_2": "#10B981",
            "graph_3": "#6366F1",
            "graph_4": "#3B82F6",
            "graph_5": "#14B8A6",
            "graph_6": "#06B6D4",
            "graph_7": "#2DD4BF",
            "graph_8": "#38BDF8",
            "graph_9": "#84CC16"
        },
        "bg_hex": "#F4FBF9",
        "card_hex": "#FFFFFF",
        "accent_hex": "#0D9488",
        "text_hex": "#0F2F2B",
        "base": "swift"
    },
    {
        "id": "cosmic-astral",
        "name": "Cosmic Astral",
        "description": "Interstellar voyage aesthetic featuring deep starfield indigo, ultraviolet nebulas, and bright pulsar magenta glows for aerospace and science presentations.",
        "font_name": "Space Grotesk",
        "font_url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        "colors": {
            "primary": "#C026D3",
            "background": "#070614",
            "card": "#12102A",
            "stroke": "#272252",
            "primary_text": "#E879F9",
            "background_text": "#FAF5FF",
            "graph_0": "#C026D3",
            "graph_1": "#8B5CF6",
            "graph_2": "#06B6D4",
            "graph_3": "#F43F5E",
            "graph_4": "#3B82F6",
            "graph_5": "#A855F7",
            "graph_6": "#EC4899",
            "graph_7": "#10B981",
            "graph_8": "#6366F1",
            "graph_9": "#38BDF8"
        },
        "bg_hex": "#070614",
        "card_hex": "#12102A",
        "accent_hex": "#C026D3",
        "text_hex": "#FAF5FF",
        "base": "modern"
    },
    {
        "id": "industrial-steel",
        "name": "Industrial Steel",
        "description": "Heavy tungsten charcoal surfaces, brushed steel containers, and high-visibility safety orange highlights engineered for industrial equipment and robotics.",
        "font_name": "Montserrat",
        "font_url": "https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap",
        "colors": {
            "primary": "#F97316",
            "background": "#14171C",
            "card": "#1E232B",
            "stroke": "#323B47",
            "primary_text": "#FB923C",
            "background_text": "#F1F5F9",
            "graph_0": "#F97316",
            "graph_1": "#EAB308",
            "graph_2": "#3B82F6",
            "graph_3": "#10B981",
            "graph_4": "#64748B",
            "graph_5": "#EF4444",
            "graph_6": "#06B6D4",
            "graph_7": "#8B5CF6",
            "graph_8": "#94A3B8",
            "graph_9": "#F59E0B"
        },
        "bg_hex": "#14171C",
        "card_hex": "#1E232B",
        "accent_hex": "#F97316",
        "text_hex": "#F1F5F9",
        "base": "modern"
    }
]

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def create_thumbnail(cfg, output_path: Path):
    width, height = 1280, 720
    bg_rgb = hex_to_rgb(cfg["bg_hex"])
    card_rgb = hex_to_rgb(cfg["card_hex"])
    accent_rgb = hex_to_rgb(cfg["accent_hex"])
    text_rgb = hex_to_rgb(cfg["text_hex"])
    stroke_rgb = hex_to_rgb(cfg["colors"].get("stroke", cfg["accent_hex"]))
    
    img = Image.new("RGB", (width, height), bg_rgb)
    draw = ImageDraw.Draw(img)
    
    # 1. Top subtle accent banner
    draw.rectangle([0, 0, width, 10], fill=accent_rgb)
    
    # 2. Left Hero Card
    draw.rounded_rectangle([70, 70, 560, 650], radius=16, fill=card_rgb, outline=stroke_rgb, width=2)
    # Accent badge on hero
    draw.rounded_rectangle([110, 110, 260, 150], radius=8, fill=accent_rgb)
    # Title lines
    draw.rounded_rectangle([110, 190, 480, 230], radius=6, fill=text_rgb)
    draw.rounded_rectangle([110, 250, 390, 280], radius=6, fill=text_rgb)
    # Narrative lines
    for y in [330, 365, 400, 435]:
        draw.rounded_rectangle([110, y, 510, y + 16], radius=4, fill=accent_rgb if y == 435 else text_rgb)
    # Bottom Stat Pill
    draw.rounded_rectangle([110, 520, 320, 600], radius=12, fill=bg_rgb, outline=accent_rgb, width=2)
    draw.rounded_rectangle([130, 545, 230, 575], radius=4, fill=accent_rgb)

    # 3. Right Top Wide Card
    draw.rounded_rectangle([590, 70, 1210, 340], radius=16, fill=card_rgb, outline=stroke_rgb, width=1)
    draw.rounded_rectangle([630, 110, 710, 190], radius=12, fill=accent_rgb)
    draw.rounded_rectangle([740, 120, 1130, 150], radius=6, fill=text_rgb)
    draw.rounded_rectangle([740, 170, 1050, 190], radius=4, fill=text_rgb)
    draw.rounded_rectangle([630, 230, 1160, 290], radius=8, fill=bg_rgb, outline=stroke_rgb, width=1)
    
    # 4. Right Bottom Split Cards
    # Card 1
    draw.rounded_rectangle([590, 370, 880, 650], radius=16, fill=card_rgb, outline=stroke_rgb, width=1)
    draw.rounded_rectangle([620, 400, 690, 460], radius=10, fill=accent_rgb)
    draw.rounded_rectangle([620, 490, 840, 515], radius=6, fill=text_rgb)
    draw.rounded_rectangle([620, 535, 800, 555], radius=4, fill=text_rgb)
    draw.rounded_rectangle([620, 580, 750, 600], radius=4, fill=accent_rgb)

    # Card 2
    draw.rounded_rectangle([920, 370, 1210, 650], radius=16, fill=card_rgb, outline=stroke_rgb, width=1)
    draw.rounded_rectangle([950, 400, 1020, 460], radius=10, fill=accent_rgb)
    draw.rounded_rectangle([950, 490, 1170, 515], radius=6, fill=text_rgb)
    draw.rounded_rectangle([950, 535, 1130, 555], radius=4, fill=text_rgb)
    draw.rounded_rectangle([950, 580, 1080, 600], radius=4, fill=accent_rgb)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, "PNG")

def adapt_colors(obj, old_bg, old_card, old_accent, cfg):
    """Recursively adapt color fields in layout/element dictionaries."""
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if k == "color" and isinstance(v, str) and v.startswith("#"):
                up = v.upper()
                if up in [old_bg.upper(), "#FFFFFF", "#BFF4FF", "#171717", "#F5F8FE", "#FAFAF8", "#F9F6F0", "#F1F5F9"]:
                    new_obj[k] = cfg["colors"]["background"]
                elif up in [old_card.upper(), "#111827", "#000000", "#F3F4F6"]:
                    new_obj[k] = cfg["colors"]["card"]
                elif up in [old_accent.upper(), "#C24D12", "#BDEFF8", "#2563EB", "#00F0FF", "#F59E0B", "#10B981"]:
                    new_obj[k] = cfg["colors"]["primary"]
                else:
                    new_obj[k] = v
            else:
                new_obj[k] = adapt_colors(v, old_bg, old_card, old_accent, cfg)
        return new_obj
    elif isinstance(obj, list):
        return [adapt_colors(item, old_bg, old_card, old_accent, cfg) for item in obj]
    else:
        return obj

def main():
    print(f"Generating 20 new presentation templates under {TEMPLATES_DIR}...")
    for cfg in TEMPLATES_20:
        template_id = cfg["id"]
        t_dir = TEMPLATES_DIR / template_id
        static_dir = t_dir / "static"
        static_dir.mkdir(parents=True, exist_ok=True)
        
        # 1. Generate thumbnail
        thumb_path = static_dir / "thumbnail.png"
        create_thumbnail(cfg, thumb_path)
        
        # 2. Base payload and copy base static assets if any
        base_name = cfg["base"]
        base_json = modern_json if base_name == "modern" else swift_json
        base_static_dir = TEMPLATES_DIR / base_name / "static"
        if base_static_dir.is_dir():
            for asset in base_static_dir.glob("*"):
                if asset.name != "thumbnail.png":
                    target_asset = static_dir / asset.name
                    if not target_asset.exists():
                        shutil.copy2(asset, target_asset)
        
        old_bg = base_json.get("theme", {}).get("colors", {}).get("background", "#FFFFFF")
        old_card = base_json.get("theme", {}).get("colors", {}).get("card", "#FFFFFF")
        old_accent = base_json.get("theme", {}).get("colors", {}).get("primary", "#000000")
        
        new_payload = copy.deepcopy(base_json)
        new_payload["id"] = template_id
        new_payload["name"] = cfg["name"]
        new_payload["description"] = cfg["description"]
        new_payload["thumbnail"] = "static/thumbnail.png"
        new_payload["icon_type"] = "bold" if "neon" in template_id or "tech" in template_id or "bold" in template_id or "impact" in template_id else "regular"
        new_payload["theme"] = {
            "colors": cfg["colors"],
            "fonts": {
                "textFont": {
                    "name": cfg["font_name"],
                    "url": cfg["font_url"]
                }
            }
        }
        new_payload["fonts"] = {
            cfg["font_name"]: cfg["font_url"]
        }
        
        # Transform layout element colors
        new_payload["layouts"] = adapt_colors(new_payload.get("layouts", []), old_bg, old_card, old_accent, cfg)
        if "merged_components" in new_payload:
            new_payload["merged_components"] = adapt_colors(new_payload.get("merged_components", []), old_bg, old_card, old_accent, cfg)
            
        # Write template.json
        (t_dir / "template.json").write_text(json.dumps(new_payload, indent=2), encoding="utf-8")
        print(f"[OK] Generated: {template_id} -> '{cfg['name']}'")

    print("\nAll 20 templates successfully generated!")

if __name__ == "__main__":
    main()
