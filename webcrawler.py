import requests
import feedparser
import re

def is_positive(title): 
    # result=clova 함수 결과 반환.
    # return result
    return True

def post(positive_list): # db에 적재
    pass


def crawl_rss_feed(feed_url):
    positive_list=[]
    feed = feedparser.parse(feed_url) # RSS 피드 파싱
    # feed.feed.title
    # print(feed)  
    for entry in feed.entries: # title, author, category, summary,link, published_at
        if is_positive(entry.title):
            positive_news={}
            keys=["title","category","summary","published_at","link"]
            values=[entry.title,entry.category,entry.description,entry.published]
            positive_list.append(dict(zip(keys,values)))
            

    return positive_list



rss_url='https://www.mk.co.kr/rss/40200003/'
positive_list=crawl_rss_feed(rss_url)      

def crawl_everyday(rss_list):
    for rss in rss_list:
        crawl_rss_feed(rss)

# main code 
#rss_list=[]
#crawl_everyday(rss_list)