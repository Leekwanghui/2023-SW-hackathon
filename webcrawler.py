import requests
import feedparser

def crawl_rss_feed(feed_url):
    # RSS 피드 파싱
    feed = feedparser.parse(feed_url)
    # 피드 정보 출력
    print("Feed Title:", feed.feed.title)
    print("Feed Description:", feed.feed.description)
    print("Feed Link:", feed.feed.link)
    # 피드 아이템 순회
    for entry in feed.entries:
        print("\nEntry Title:", entry.title)
        print("Entry Link:", entry.link)
        print("Entry Description:", entry.description)
        print("Entry Published Date:", entry.published)
# 크롤링할 RSS 피드 URL
rss_url = "https://www.mk.co.kr/rss/30100041/"
# 피드 크롤링 실행
crawl_rss_feed(rss_url)

# https://seungjuitmemo.tistory.com/203
# https://hleecaster.com/python-web-crawling-with-beautifulsoup/
# https://hleecaster.com/narajangteo-crawling/