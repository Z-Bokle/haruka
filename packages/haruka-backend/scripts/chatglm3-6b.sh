# prompt=$1
# apiKey=$2
# endpoint=$3
# modelName=$4

curl -s -X POST --location $3 \
--header "Authorization: Bearer $2" \
--header 'Content-Type: application/json' \
--data '{
    "model": "'$4'",
    "input":{
        "messages":[      
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "'$1'"
            }
        ]
    },
    "parameters": {
        "result_format": "message"
    }
}' | jq '.output.choices[0].message.content'
