import json

with open("censo.csv", encoding="utf-8") as f:
    data = {}
    f.readline()
    for comuna in f:
        comuna = comuna.split(",")
        data[comuna[0]] = {"INDICE_DEP": comuna[-3], "IND_DEP_JU": comuna[-2], "IND_DEP_VE": comuna[-1]}

with open('density.json', 'w') as outfile:
    json.dump(data, outfile)
