import requests
import feedparser

def crawl_rss_feed(feed_url):
    # RSS 피드 파싱
    feed = feedparser.parse(feed_url)
    print(feed.feed)
    print("Feed Title:", feed.feed.title)
    print("Feed Description:", feed.feed.description)
    print("Feed Link:", feed.feed.link)    # 피드 아이템 순회
    for entry in feed.entries[0:3]:
        print(entry)
        print("\nEntry Title:", entry.title)
        print("Entry Link:", entry.link)
        print("Entry Description:", entry.description)
        print("Entry Published Date:", entry.published_parsed.tm_mday)
        print("Category: ",entry.category)

# 크롤링할 RSS 피드 URL
rss_url = "https://www.mk.co.kr/rss/30100041/"
# 피드 크롤링 실행
crawl_rss_feed(rss_url)