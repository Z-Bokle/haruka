import zhtts
import sys
text = sys.argv[1]
target = sys.argv[2]

tts = zhtts.TTS()
tts.text2wav(text, target)
# print(sys.argv)
# print(sys.argv[2])
# print(12345)