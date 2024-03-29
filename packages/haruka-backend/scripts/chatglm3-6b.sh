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


# curl --location 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation' \
# --header 'Authorization: Bearer krdfBS4VBe' \
# --header 'Content-Type: application/json' \
# --data '{
#     "model": "chatglm3-6b",
#     "input":{
#         "messages":[      
#             {
#                 "role": "system",
#                 "content": "You are a helpful assistant."
#             },
#             {
#                 "role": "user",
#                 "content": "你好，请介绍一下故宫"
#             }
#         ]
#     },
#     "parameters": {
#         "result_format": "message"
#     }
# }'