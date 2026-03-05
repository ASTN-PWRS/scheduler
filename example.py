import sys
import json

# 引数を受け取る
if len(sys.argv) > 1:
    args = json.loads(sys.argv[1])  # JSON文字列をデコード
    print(f"Received args: {args}")

# 任意の処理
if 'test' in args:
    print(f"Test argument value: {args['test']}")
