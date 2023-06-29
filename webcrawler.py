import requests
import feedparser
import re
import json

def is_positive(entry_title): 
    title = entry_title
    #요청
    client_id = "ylt9c2olu2"
    client_secret = "nd1e3ynAkWq0HQ61Xgc2WIG1dzbaiBDkrtva72nr"
    url = "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze"

    headers = {
        "X-NCP-APIGW-API-KEY-ID": client_id,
        "X-NCP-APIGW-API-KEY": client_secret,
        "Content-Type": "application/json"
    }
    #응답
    body = {   
        "content": title
    }
    response = requests.post(url, data=json.dumps(body), headers=headers)
    result = json.loads(response.text)
    #출력
    sentiment=result["document"]["sentiment"]
    return (sentiment=='positive')

def post(positive_list): # db에 적재
    pass


def crawl_rss_feed(feed_url,category,positive_list): # 하나의 rss xml에 대해 파싱
    feed = feedparser.parse(feed_url)
    for entry in feed.entries: # title, author, category, summary,link, published_at
        if is_positive(entry.title):
            positive_news={}
            keys=["title","category","summary","published_at","link"]
            values=[entry.title,category,entry.description,entry.published]
            positive_list.append(dict(zip(keys,values)))    
    return positive_list    # 하나의 rss xml로부터 positive news들을 리스트로 리턴함.



# rss_url='http://rss.etnews.com/12.xml'
# positive_list=crawl_rss_feed(rss_url)      
# print(positive_list)
def crawl_everyday(rss_list):
    for rss in rss_list: # dict 수만큼 반복
        positive_list=[]
        for link in rss['link']: # link 수만큼 반복
            crawl_rss_feed(link,rss['category'],positive_list)
        print(rss['category'])
        print(positive_list) # 제대로 되는지 확인하고 post 함수로 대체할거임!!!
        print()

# main code 
rss_list=[{'category':'문화','link':['https://fs.jtbc.co.kr/RSS/culture.xml'] },
{'category':'지구촌','link':['http://rss.etnews.com/12.xml'] },
{'category':'연예','link':[]},
{'category':'','link':[] }
]
crawl_everyday(rss_list)