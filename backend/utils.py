import re
from nltk.corpus import stopwords

def remove_stop_words(list):
    stopWords = set(stopwords.words('spanish'))
    union = []
    file = open('stop-words.txt', 'r', encoding='latin-1')
    data = []
    for p in file.readlines():
        data.append(p.rstrip())
    data.append(stopWords)

    file.close()

    return([item for item in list if not item.lower() in data])

def numbers(list):
    new_list = []
    for item in list:
        array = re.search(r'\d', item)

        if array is None:
            new_list.append(item)

    return new_list


def signos(list):
    new_list = []
    for item in list:
        array = re.sub(r"(?<!\d)[.&%,→;:?'\"¿|!¡“”’‘()…–\[\]-](?!\d)", "", item)
        new_list.append(array)

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


