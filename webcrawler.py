import requests
import feedparser
import re
import json
from bs4 import BeautifulSoup

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
    positivity=result["document"]["confidence"]['positive']
    return (positivity>90)

def upload(positive_list,category): # db에 적재
    for news in positive_list:
        print(news)
        data = { 
        
        'title': news['title'],
        'category': category,
        'summary': news['summary'],
        'link': news['link'],
        'published_at': news['published_at'],
        'image_url':news['image_url']
        }

        post_api = "http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/news/new"
        response = requests.post(post_api, data=data)
        print(response)


def crawl_rss_feed(feed_url,category,positive_list): # 하나의 rss xml에 대해 파싱
    feed = feedparser.parse(feed_url)
    for entry in feed.entries: # title, author, category, summary,link, published_at
        if is_positive(entry.title):
            try:
                positive_news={}
                keys=["title","category","summary","published_at","link","image_url"]
                values=[entry.title,category,entry.description,entry.published,entry.link,extract_img_url(entry.link)]
                positive_list.append(dict(zip(keys,values))) 
            except:
                continue   
    return positive_list    # 하나의 rss xml로부터 positive news들을 리스트로 리턴함.

def extract_img_url(entry_link):
    url=entry_link
    res = requests.get(url)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    div_thumb = soup.find_all('div', {'class': 'thumb'})
    img_tag = soup.find_all("img")
    for img in img_tag:
        src = img.get("src")
        if ('NEWS/IMAGE' in src) or ('news/article' in src) or ('photo.jtbc' in src):
            img_url=src
            break
        
    return img_url




def crawl_everyday(rss_list):
    for rss in rss_list: # dict 수만큼 반복
        positive_list=[]
        for link in rss['link']: # link 수만큼 반복
            crawl_rss_feed(link,rss['category'],positive_list)

        upload(positive_list,rss['category']) # chunk별 db 적재

# main code 

rss_list=[ # 동아일보, jtbc, 전자신문
{'category':'문화/연예','link':['https://fs.jtbc.co.kr/RSS/culture.xml','https://fs.jtbc.co.kr/RSS/entertainment.xml']},
{'category':'산업/과학','link':['https://rss.etnews.com/20.xml','https://rss.etnews.com/17.xml'] },
{'category':'스포츠','link':['https://fs.jtbc.co.kr/RSS/sports.xml','https://rss.donga.com/sportsdonga/sports.xml' ]},
{'category':'경제','link':['https://fs.jtbc.co.kr/RSS/economy.xml','https://rss.donga.com/economy.xml','https://rss.donga.com/international.xml'] }
]
crawl_everyday(rss_list)