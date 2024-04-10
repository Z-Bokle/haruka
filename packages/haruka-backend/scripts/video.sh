eval "$(conda shell.bash hook)"
conda active video_retalking

# baseVideoFilePath=$1
# audioFilePath=$2
# targetFilePath=$3

python3 ~/workspace/video_retalking/inference.py \
  --face "$1" \
  --audio "$2" \
  --outfile "$3"