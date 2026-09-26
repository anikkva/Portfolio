#!/usr/bin/env bash
# Downloads the OFL base fonts used to derive Anikkva Ink.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p sources
BASE=https://github.com/google/fonts/raw/main/ofl
fetch() { curl -fsSL -o "sources/$2" "$BASE/$1"; }
fetch "jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf" "JetBrainsMono[wght].ttf"
fetch "jetbrainsmono/OFL.txt" "OFL-jetbrains.txt"
fetch "martianmono/MartianMono%5Bwdth,wght%5D.ttf" "MartianMono[wdth,wght].ttf"
fetch "martianmono/OFL.txt" "OFL-martian.txt"
fetch "ibmplexmono/IBMPlexMono-Regular.ttf" "IBMPlexMono-Regular.ttf"
fetch "ibmplexmono/IBMPlexMono-Bold.ttf" "IBMPlexMono-Bold.ttf"
fetch "ibmplexmono/OFL.txt" "OFL-plex.txt"
ls -1 sources
