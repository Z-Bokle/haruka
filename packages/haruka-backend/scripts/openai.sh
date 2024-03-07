# prompt=$1
# apiKey=$2
# endpoint=$3
# modelName=$4

# result=$(curl -s $endpoint \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $apiKey" \
#   -d '{
#     "model": "'$modelName'",
#     "response_format": { "type": "json_object" },
#     "messages": [
#       {
#         "role": "system",
#         "content": "You are a helpful assistant."
#       },
#       {
#         "role": "user",
#         "content": "'$prompt'"
#       }
#     ]
#   }')

# echo $result

echo "Good Job!"