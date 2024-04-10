eval "$(conda shell.bash hook)"
conda activate video_retalking

# baseVideoFilePath=$1
# audioFilePath=$2
# targetFilePath=$3

python3 ~/workspace/video-retalking/inference.py \
  --face "$1" \
  --audio "$2" \
  --outfile "$3"