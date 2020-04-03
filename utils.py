from datetime import date, datetime
from flask import Response
from nltk.corpus import stopwords
import json


class JSONResponse(Response):
    def __init__(self, response = None, status = None, headers = None, mimetype = None, content_type = "application/json", direct_passthrough= False):
        super(JSONResponse, self).__init__(response,status,headers,mimetype,content_type, direct_passthrough)

def obj_to_json(ob, dumps= True):
    if ob and "_id" in ob:
        ob["_id"] = str(ob["_id"])
    return json.dumps(ob) if dumps else ob

def list_to_json(lista):
    respuesta = []
    for l in lista:
        respuesta.append(obj_to_json(l,False))
    return json.dumps(respuesta, cls=DateTimeEncoder)

def remove_stop_words(list):
    stopWords = set(stopwords.words('spanish'))
    return([item for item in list if not item in stopWords])


class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)


