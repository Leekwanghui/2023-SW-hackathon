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

def upload(positive_list,category): # db에 적재
    for news in positive_list:
        print(news)
        data = { 
        
        'title': news['title'],
        'category': category,
        'summary': news['summary'],
        'link': news['link'],
        'published_at': news['published_at']

        }

        post_api = "http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/news/new"
        response = requests.post(post_api, data=data)
        print(response)


def crawl_rss_feed(feed_url,category,positive_list): # 하나의 rss xml에 대해 파싱
    feed = feedparser.parse(feed_url)
    for entry in feed.entries: # title, author, category, summary,link, published_at
        if is_positive(entry.title):
            positive_news={}
            keys=["title","category","summary","published_at","link"]
            values=[entry.title,category,entry.description,entry.published,entry.link]
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

        upload(positive_list,rss['category']) # chunk별 db 적재

# main code 
rss_list=[ # 매일경제, jtbc, 전자신문
{'category':'지구촌','link':['https://www.mk.co.kr/rss/30300018/','https://fs.jtbc.co.kr/RSS/international.xml','http://rss.etnews.com/12.xml'] },
{'category':'문화/연예','link':['https://fs.jtbc.co.kr/RSS/culture.xml','https://fs.jtbc.co.kr/RSS/entertainment.xml','https://www.mk.co.kr/rss/30000023/','']},
{'category':'산업/과학','link':['https://rss.etnews.com/20.xml','https://rss.etnews.com/16.xml','https://rss.etnews.com/17.xml'] },
{'category':'스포츠','link':['https://fs.jtbc.co.kr/RSS/sports.xml','https://www.mk.co.kr/rss/71000001/'] },
{'category':'경제','link':['https://fs.jtbc.co.kr/RSS/economy.xml','https://www.mk.co.kr/rss/30100041/',] }
]
crawl_everyday(rss_list)