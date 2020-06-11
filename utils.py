import re
from datetime import date, datetime
from pprint import pprint

from flask import Response
from nltk.corpus import stopwords
import json
from dateutil.parser import parse
import nltk


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
    #pprint(stopWords)
    union = []

    with open('stopwords2.txt') as json_file:
        data = json.load(json_file)
        for p in data['words']:
            union.append(p)
            union.append(stopWords)

    return([item for item in list if not item.lower() in union])


class DateTimeEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()

        return json.JSONEncoder.default(self, o)


def hasNumbers(string):
    return any(char.isdigit() for char in string)

def isAccount(string):
    if '@' in string:
        return True
    else:
        return False

def hasString(string):
    if string.isalpha():
        return True
    else:
        return False

def is_date(string, fuzzy=False):
    try:
        parse(string, fuzzy=fuzzy)
        return True

    except ValueError:
        return False


def numbers(list):
    new_list = []
    for item in list:
        #array = re.findall(r'[0-9]+', item)
        array = re.search(r'\d', item)
        #array = re.search(r'[0-9]+', item)
        #array = re.match(r"[a-zA-z]+", item)

        if array is None:
            new_list.append(item)

    #pprint(new_list)
    return new_list

    # Driver code

def signos(list):
    new_list = []
    for item in list:
        array = re.sub(r"(?<!\d)[.&%,→;:?'\"¿|!¡–\[\]-](?!\d)", "", item)
        # array = re.match(r"[a-zA-z]+", item)

        new_list.append(array)

    #pprint(new_list)
    return new_list

def https(list):
    new_list = []
    for item in list:
        if not item.startswith('http'):
            new_list.append(item)

    return new_list

def emoji(list):
    new_list = []
    for item in list:
        emoji_pattern = re.compile("["
                                   u"\U0001F600-\U0001F64F"  # emoticons
                                   u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                                   u"\U0001F680-\U0001F6FF"  # transport & map symbols
                                   u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                                   u"\U00002702-\U000027B0"
                                   u"\U000024C2-\U0001F251"
                                   "]+", flags=re.UNICODE)
        array = (emoji_pattern.sub(r'', item))
        new_list.append(array)
    return new_list


