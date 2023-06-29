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
    #sentiment=result["document"]["sentiment"]
    positivity=result["document"]["confidence"]['positive']
    print(positivity)
    return (positivity>90)
# rss_url='http://rss.etnews.com/12.xml'
# positive_list=crawl_rss_feed(rss_url)      
# print(positive_list)
def crawl_rss_feed(feed_url,category,positive_list): # 하나의 rss xml에 대해 파싱
    feed = feedparser.parse(feed_url)
    print(len(feed.entries),'개')
    for entry in feed.entries: # title, author, category, summary,link, published_at
        if is_positive(entry.title):
            positive_news={}
            keys=["title","category","summary","published_at","link"]
            values=[entry.title,category,entry.description,entry.published,entry.link]
            positive_list.append(dict(zip(keys,values)))    
    return positive_list    # 하나의 rss xml로부터 positive news들을 리스트로 리턴함.


#'https://www.mk.co.kr/rss/30300018/','https://fs.jtbc.co.kr/RSS/international.xml','http://rss.etnews.com/12.xml'
rss_url='https://rss.donga.com/international.xml'
ps=[]
crawl_rss_feed(rss_url,'세계',ps)      
for x in ps:
    print(x['title'])