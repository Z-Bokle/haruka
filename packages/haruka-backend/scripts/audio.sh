# write text to file
echo $1 > "/tmp/haruka/$2.txt"

# run tts program
~/workspace/SummerTTS/build/tts_test "/tmp/haruka/$2.txt" ~/workspace/SummerTTS/models/single_speaker_fast.bin "../statics/audio/$2.wav"