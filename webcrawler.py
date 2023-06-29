import requests
from bs4 import BeautifulSoup
# numpy 같이 anaconda에 기본으로 깔려있는 패키지 쓰려면 interpreter를 conda로 설정하면 됨
# 다시 pip install 해서 깔 필요 없음

url = "http://swcon.khu.ac.kr/people/undergraduate/"
res=requests.get(url)
res.raise_for_status()
soup = BeautifulSoup(res.text, "lxml")

#departments=soup.find_all('a',attr={'text':'새 창 열림'})
links=soup.find_all("a",text='O') # list 반환
i=0
for x in links:
    link=x.get('href')
    if 'github' in link:
        print(link)
        i+=1
print('github 수 :',i,'개 out of',len(links))

# https://seungjuitmemo.tistory.com/203
# https://hleecaster.com/python-web-crawling-with-beautifulsoup/
# https://hleecaster.com/narajangteo-crawling/